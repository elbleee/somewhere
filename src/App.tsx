import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Search, Plus, Paintbrush2, Undo2, Redo2,
  Folder, Lightbulb, Image as ImageIcon, CheckSquare, FileText,
  Link as LinkIcon, Clock3, X, ChevronRight, Home, Layers3
} from "lucide-react";
import type { DeskObjectKind, SceneObject, ThemeId } from "./types";

const STORAGE_KEY = "somewhere.workspace.v1";

const starterObjects: SceneObject[] = [
  { id: "ideas", kind: "collection", title: "Ideas", subtitle: "A place for what's next", position: 0, size: "large", theme: "surreal-atmospheric", children: [
    { id: "ideas-sparks", kind: "collection", title: "Sparks", subtitle: "Small ideas with potential", position: 0, size: "medium", children: [
      { id: "spark-note", kind: "note", title: "A thought worth keeping", subtitle: "Good ideas rarely arrive on schedule.", content: "", position: 0, size: "medium" }
    ] },
    { id: "ideas-reading", kind: "collection", title: "Things to read", subtitle: "Links, books & references", position: 1, size: "medium", children: [] }
  ] },
  { id: "yard", kind: "collection", title: "Yard", subtitle: "Home & outside", position: 1, size: "medium", theme: "minimal-natural", children: [
    { id: "yard-projects", kind: "collection", title: "Projects", subtitle: "Plans for the yard", position: 0, size: "medium", children: [] }
  ] },
  { id: "work", kind: "collection", title: "Work", subtitle: "Projects & plans", position: 2, size: "medium", theme: "clean-textured", children: [
    { id: "work-notes", kind: "note", title: "Web store notes", subtitle: "Keep the next improvements in one place.", content: "", position: 0, size: "medium" }
  ] },
  { id: "weekend", kind: "checklist", title: "Weekend list", subtitle: "4 things to get done", content: "", position: 3, size: "medium" },
  { id: "thought", kind: "note", title: "A thought worth keeping", subtitle: "Good ideas rarely arrive on schedule.", content: "", position: 4, size: "medium" },
  { id: "inspiration", kind: "photo", title: "Inspiration", subtitle: "Visual references", position: 5, size: "small" }
];

const addChoices: { kind: DeskObjectKind; label: string; icon: typeof FileText }[] = [
  { kind: "note", label: "Note", icon: FileText },
  { kind: "checklist", label: "Checklist", icon: CheckSquare },
  { kind: "photo", label: "Photo", icon: ImageIcon },
  { kind: "link", label: "Link", icon: LinkIcon },
  { kind: "document", label: "Document", icon: Layers3 },
  { kind: "reminder", label: "Reminder", icon: Clock3 },
  { kind: "collection", label: "Collection", icon: Folder }
];

type StoredWorkspace = { objects: SceneObject[] };

function readWorkspace(): StoredWorkspace {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredWorkspace;
      if (Array.isArray(parsed.objects)) return parsed;
    }
  } catch { /* Use starter content if saved data is unavailable. */ }
  return { objects: starterObjects };
}

function findObject(objects: SceneObject[], id: string): SceneObject | undefined {
  for (const item of objects) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findObject(item.children, id);
      if (found) return found;
    }
  }
}

function updateTree(objects: SceneObject[], id: string, update: (item: SceneObject) => SceneObject): SceneObject[] {
  return objects.map(item => {
    if (item.id === id) return update(item);
    if (item.children) return { ...item, children: updateTree(item.children, id, update) };
    return item;
  });
}

function iconFor(kind: DeskObjectKind) {
  switch (kind) {
    case "collection": return <Folder />;
    case "checklist": return <CheckSquare />;
    case "photo": return <ImageIcon />;
    case "link": return <LinkIcon />;
    case "document": return <Layers3 />;
    case "reminder": return <Clock3 />;
    default: return <FileText />;
  }
}

function App() {
  const [objects, setObjects] = useState<SceneObject[]>(() => readWorkspace().objects);
  const [path, setPath] = useState<string[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [fan, setFan] = useState<"add" | "customize" | null>(null);
  const [draft, setDraft] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ objects }));
  }, [objects]);

  const activeCollection = path.length ? findObject(objects, path[path.length - 1]) : undefined;
  const currentObjects = activeCollection?.children ?? objects;
  const activeNote = activeNoteId ? findObject(objects, activeNoteId) : undefined;
  const breadcrumbs = path.map(id => findObject(objects, id)).filter((item): item is SceneObject => Boolean(item));
  const currentTheme = activeCollection?.theme ?? "clean-textured";

  const visibleObjects = useMemo(() => currentObjects.filter(item =>
    !searchOpen || item.title.toLowerCase().includes(draft.toLowerCase())
  ), [currentObjects, searchOpen, draft]);

  const navigateInto = (item: SceneObject) => {
    if (item.kind !== "collection") return;
    setPath(current => [...current, item.id]);
    setFan(null);
    setSearchOpen(false);
    setDraft("");
  };

  const navigateTo = (depth: number) => {
    setPath(current => current.slice(0, depth));
    setFan(null);
  };

  const addObject = (kind: DeskObjectKind) => {
    const labels: Record<DeskObjectKind, string> = {
      collection: "New collection", note: "New note", checklist: "New checklist",
      photo: "New photo", link: "New link", document: "New document", reminder: "New reminder"
    };
    const item: SceneObject = {
      id: crypto.randomUUID(),
      kind,
      title: labels[kind],
      subtitle: kind === "collection" ? "A space of your own" : "Tap to open",
      content: "",
      position: currentObjects.length,
      size: kind === "collection" ? "large" : "medium",
      ...(kind === "collection" ? { children: [], theme: currentTheme } : {})
    };
    if (activeCollection) {
      setObjects(tree => updateTree(tree, activeCollection.id, parent => ({
        ...parent, children: [...(parent.children ?? []), item]
      })));
    } else {
      setObjects(tree => [...tree, item]);
    }
    setFan(null);
    if (kind !== "collection") setActiveNoteId(item.id);
  };

  const updateActiveNote = (patch: Partial<SceneObject>) => {
    if (!activeNoteId) return;
    setObjects(tree => updateTree(tree, activeNoteId, item => ({ ...item, ...patch })));
  };

  const changeCollectionTheme = (theme: ThemeId) => {
    if (!activeCollection) return;
    setObjects(tree => updateTree(tree, activeCollection.id, item => ({ ...item, theme })));
    setThemePickerOpen(false);
    setFan(null);
  };

  const themeNames: { id: ThemeId; label: string }[] = [
    { id: "clean-textured", label: "Clean & Textured" },
    { id: "photoreal-desk", label: "Photoreal Desk" },
    { id: "cinematic-realism", label: "Cinematic Realism" },
    { id: "illustrated-sketchbook", label: "Illustrated Sketchbook" },
    { id: "surreal-atmospheric", label: "Surreal & Atmospheric" },
    { id: "minimal-natural", label: "Minimal Natural" },
    { id: "vintage-ephemera", label: "Vintage / Ephemera" },
    { id: "graphic-textured", label: "Graphic & Textured" },
    { id: "painterly-artistic", label: "Painterly / Artistic" }
  ];

  return (
    <main className="app-shell">
      <div className="desk-surface" aria-hidden="true" />
      <header className="topbar">
        <div className="breadcrumb">
          {path.length > 0 && <button className="icon-button" onClick={() => navigateTo(path.length - 1)} aria-label="Back"><ArrowLeft /></button>}
          <button className="brand-home" onClick={() => navigateTo(0)} aria-label="Main desk"><span className="brand-mark">s.</span></button>
          <span className="crumb-divider">/</span>
          <button className={path.length === 0 ? "crumb-current" : "crumb-link"} onClick={() => navigateTo(0)}>My desk</button>
          {breadcrumbs.map((crumb, index) => (
            <span className="crumb-segment" key={crumb.id}>
              <ChevronRight size={13} />
              <button className={index === breadcrumbs.length - 1 ? "crumb-current" : "crumb-link"} onClick={() => navigateTo(index + 1)}>{crumb.title}</button>
            </span>
          ))}
        </div>
        <div className="top-actions">
          {searchOpen ? (
            <div className="search-field">
              <Search size={16} />
              <input autoFocus placeholder="Search this space…" value={draft} onChange={e => setDraft(e.target.value)} />
              <button className="icon-button" onClick={() => { setSearchOpen(false); setDraft(""); }} aria-label="Close search"><X size={16} /></button>
            </div>
          ) : (
            <button className="icon-button" onClick={() => setSearchOpen(true)} aria-label="Search"><Search /></button>
          )}
        </div>
      </header>

      <section className="workspace">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">{activeCollection ? "YOUR SPACE" : "SOMEWHERE TO PUT IT ALL"}</p>
            <h1>{activeCollection?.title ?? "My desk"}</h1>
            <p className="subheading">{activeCollection?.subtitle ?? "A place for everything on your mind."}</p>
          </div>
          <span className="date-stamp">{activeCollection ? themeNames.find(t => t.id === currentTheme)?.label : "EST. TODAY"}</span>
        </div>

        <div className="object-grid">
          {visibleObjects.map(item => (
            <button
              key={item.id}
              className={`desk-object object-${item.kind} size-${item.size}`}
              onClick={() => item.kind === "collection" ? navigateInto(item) : setActiveNoteId(item.id)}
            >
              <span className="object-icon">{iconFor(item.kind)}</span>
              <span className="object-title">{item.title}</span>
              <span className="object-subtitle">{item.subtitle}</span>
              {item.kind === "collection" && <span className="collection-enter">{item.children?.length ?? 0} ITEMS · OPEN SPACE ↗</span>}
            </button>
          ))}
          {visibleObjects.length === 0 && <div className="empty-space">Nothing here yet. Use + to put something down.</div>}
        </div>
      </section>

      <aside className="perimeter">
        <div className="perimeter-item"><span className="coffee-mark">◒</span><span>take a breath</span></div>
        <div className="perimeter-item"><Lightbulb size={17} /><span>make room</span></div>
      </aside>

      {fan && <button className="scrim" onClick={() => setFan(null)} aria-label="Close options" />}
      {fan === "add" && (
        <div className="fan-panel add-panel">
          {addChoices.map(choice => {
            const Icon = choice.icon;
            return <button key={choice.kind} className="fan-choice" onClick={() => addObject(choice.kind)}><span><Icon size={18} /></span><small>{choice.label}</small></button>;
          })}
        </div>
      )}
      {fan === "customize" && (
        <div className="fan-panel customize-panel">
          <button className="fan-choice" onClick={() => { setThemePickerOpen(true); setFan(null); }}><span><Paintbrush2 size={18} /></span><small>Theme style</small></button>
          {["Paper", "Accessories", "Layout", "Lighting", "Typography", "Environment"].map(label => (
            <button key={label} className="fan-choice" onClick={() => setFan(null)}><span><Paintbrush2 size={18} /></span><small>{label}</small></button>
          ))}
        </div>
      )}

      <nav className="tool-dock" aria-label="Desk tools">
        <button className="icon-button" aria-label="Undo" title="Undo (coming next milestone)"><Undo2 /></button>
        <button className="icon-button" aria-label="Redo" title="Redo (coming next milestone)"><Redo2 /></button>
        <span className="dock-spacer" />
        <button className={`icon-button ${fan === "customize" ? "selected" : ""}`} onClick={() => setFan(fan === "customize" ? null : "customize")} aria-label="Customize"><Paintbrush2 /></button>
        <button className={`add-button ${fan === "add" ? "selected" : ""}`} onClick={() => setFan(fan === "add" ? null : "add")} aria-label="Add"><Plus /></button>
      </nav>

      {themePickerOpen && (
        <div className="note-overlay" onClick={() => setThemePickerOpen(false)}>
          <section className="theme-sheet" onClick={e => e.stopPropagation()}>
            <button className="note-close icon-button" onClick={() => setThemePickerOpen(false)} aria-label="Close themes"><X /></button>
            <p className="eyebrow">CUSTOMIZE THIS SPACE</p>
            <h2>Theme style</h2>
            <p className="theme-explainer">This changes this collection only. Your other spaces keep their own look.</p>
            <div className="theme-options">
              {themeNames.map(theme => <button key={theme.id} className={`theme-option ${currentTheme === theme.id ? "active" : ""}`} onClick={() => changeCollectionTheme(theme.id)}>{theme.label}{currentTheme === theme.id && <span>Selected</span>}</button>)}
            </div>
          </section>
        </div>
      )}

      {activeNote && (
        <div className="note-overlay" onClick={() => setActiveNoteId(null)}>
          <section className="note-sheet" onClick={e => e.stopPropagation()}>
            <button className="note-close icon-button" onClick={() => setActiveNoteId(null)} aria-label="Close note"><X /></button>
            <p className="eyebrow">IN {activeCollection?.title.toUpperCase() ?? "YOUR WORKSPACE"}</p>
            <input className="note-title-input" value={activeNote.title} onChange={e => updateActiveNote({ title: e.target.value })} aria-label="Item title" />
            <textarea value={activeNote.content ?? activeNote.subtitle ?? ""} onChange={e => updateActiveNote({ content: e.target.value, subtitle: e.target.value.slice(0, 72) })} placeholder="Start wherever you are…" />
            <p className="note-hint">Changes save automatically on this device.</p>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
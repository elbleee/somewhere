import { useState } from "react";
import {
  ArrowLeft, Search, Plus, Paintbrush2, Undo2, Redo2,
  Folder, Lightbulb, Leaf, BriefcaseBusiness, BookOpen,
  Image as ImageIcon, CheckSquare, FileText, Link as LinkIcon,
  Clock3, X
} from "lucide-react";
import type { DeskObjectKind, SceneObject } from "./types";

const starterObjects: SceneObject[] = [
  { id: "ideas", kind: "collection", title: "Ideas", subtitle: "A place for what's next", position: 0, size: "large" },
  { id: "yard", kind: "collection", title: "Yard", subtitle: "Home & outside", position: 1, size: "medium" },
  { id: "work", kind: "collection", title: "Work", subtitle: "Projects & plans", position: 2, size: "medium" },
  { id: "weekend", kind: "checklist", title: "Weekend list", subtitle: "4 things to get done", position: 3, size: "medium" },
  { id: "thought", kind: "note", title: "A thought worth keeping", subtitle: "Good ideas rarely arrive on schedule.", position: 4, size: "medium" },
  { id: "inspiration", kind: "photo", title: "Inspiration", subtitle: "Visual references", position: 5, size: "small" }
];

const addChoices: { kind: DeskObjectKind; label: string; icon: typeof FileText }[] = [
  { kind: "note", label: "Note", icon: FileText },
  { kind: "checklist", label: "Checklist", icon: CheckSquare },
  { kind: "photo", label: "Photo", icon: ImageIcon },
  { kind: "link", label: "Link", icon: LinkIcon },
  { kind: "document", label: "Document", icon: BookOpen },
  { kind: "reminder", label: "Reminder", icon: Clock3 },
  { kind: "collection", label: "Collection", icon: Folder }
];

function App() {
  const [objects, setObjects] = useState(starterObjects);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<SceneObject | null>(null);
  const [fan, setFan] = useState<"add" | "customize" | null>(null);
  const [draft, setDraft] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const addObject = (kind: DeskObjectKind) => {
    const title = kind === "collection" ? "New collection" : kind === "checklist" ? "New checklist" : kind === "reminder" ? "New reminder" : kind === "document" ? "New document" : kind === "photo" ? "New photo" : kind === "link" ? "New link" : "New note";
    const item: SceneObject = {
      id: crypto.randomUUID(),
      kind,
      title,
      subtitle: kind === "note" ? "Tap to add your thought…" : "Tap to open",
      position: objects.length,
      size: "medium"
    };
    setObjects(current => [...current, item]);
    setFan(null);
    if (kind === "note") setActiveNote(item);
  };

  const collectionObjects = activeCollection
    ? [
        { id: "inside-note", kind: "note" as const, title: "A little room to think", subtitle: "This is your space. Put things here.", position: 0, size: "medium" as const },
        { id: "inside-list", kind: "checklist" as const, title: "Things to explore", subtitle: "A list that lives inside this collection.", position: 1, size: "medium" as const }
      ]
    : objects;

  const visibleObjects = collectionObjects.filter(item =>
    !searchOpen || item.title.toLowerCase().includes(draft.toLowerCase())
  );

  return (
    <main className="app-shell">
      <div className="desk-surface" aria-hidden="true" />
      <header className="topbar">
        <div className="breadcrumb">
          {activeCollection && <button className="icon-button" onClick={() => setActiveCollection(null)} aria-label="Back"><ArrowLeft /></button>}
          <span className="brand-mark">s.</span>
          <span className="crumb-divider">/</span>
          <span className="crumb-current">{activeCollection ?? "My desk"}</span>
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
            <h1>{activeCollection ?? "My desk"}</h1>
            <p className="subheading">{activeCollection ? "A little world of your own." : "A place for everything on your mind."}</p>
          </div>
          <span className="date-stamp">EST. TODAY</span>
        </div>

        <div className="object-grid">
          {visibleObjects.map(item => (
            <button
              key={item.id}
              className={`desk-object object-${item.kind} size-${item.size}`}
              onClick={() => item.kind === "collection" ? setActiveCollection(item.title) : setActiveNote(item)}
            >
              <span className="object-icon">
                {item.kind === "collection" ? <Folder /> : item.kind === "checklist" ? <CheckSquare /> : item.kind === "photo" ? <ImageIcon /> : item.kind === "link" ? <LinkIcon /> : item.kind === "document" ? <BookOpen /> : item.kind === "reminder" ? <Clock3 /> : <FileText />}
              </span>
              <span className="object-title">{item.title}</span>
              <span className="object-subtitle">{item.subtitle}</span>
              {item.kind === "collection" && <span className="collection-enter">OPEN SPACE ↗</span>}
            </button>
          ))}
        </div>
      </section>

      <aside className="perimeter">
        <div className="perimeter-item"><span className="coffee-mark">◒</span><span>take a breath</span></div>
        <div className="perimeter-item"><Lightbulb size={17} /><span>make room</span></div>
      </aside>

      {fan && <button className="scrim" onClick={() => setFan(null)} aria-label="Close options" />}
      {fan === "add" && (
        <div className="fan-panel add-panel">
          {addChoices.map((choice, index) => {
            const Icon = choice.icon;
            return <button key={choice.kind} className="fan-choice" style={{ "--i": index } as React.CSSProperties} onClick={() => addObject(choice.kind)}><span><Icon size={18} /></span><small>{choice.label}</small></button>;
          })}
        </div>
      )}
      {fan === "customize" && (
        <div className="fan-panel customize-panel">
          {["Theme style", "Paper", "Accessories", "Layout", "Lighting", "Typography", "Environment"].map((label, index) => (
            <button key={label} className="fan-choice" style={{ "--i": index } as React.CSSProperties} onClick={() => setFan(null)}><span><Paintbrush2 size={18} /></span><small>{label}</small></button>
          ))}
        </div>
      )}

      <nav className="tool-dock" aria-label="Desk tools">
        <button className="icon-button" aria-label="Undo"><Undo2 /></button>
        <button className="icon-button" aria-label="Redo"><Redo2 /></button>
        <span className="dock-spacer" />
        <button className={`icon-button ${fan === "customize" ? "selected" : ""}`} onClick={() => setFan(fan === "customize" ? null : "customize")} aria-label="Customize"><Paintbrush2 /></button>
        <button className={`add-button ${fan === "add" ? "selected" : ""}`} onClick={() => setFan(fan === "add" ? null : "add")} aria-label="Add"><Plus /></button>
      </nav>

      {activeNote && (
        <div className="note-overlay" onClick={() => setActiveNote(null)}>
          <section className="note-sheet" onClick={e => e.stopPropagation()}>
            <button className="note-close icon-button" onClick={() => setActiveNote(null)} aria-label="Close note"><X /></button>
            <p className="eyebrow">ON YOUR DESK</p>
            <h2>{activeNote.title}</h2>
            <textarea defaultValue={activeNote.subtitle ?? ""} placeholder="Start wherever you are…" />
            <p className="note-hint">A thought can start anywhere.</p>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
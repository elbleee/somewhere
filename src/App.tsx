import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, Search, Plus, Paintbrush2, Undo2, Redo2,
  Folder, Lightbulb, Image as ImageIcon, CheckSquare, FileText,
  Link as LinkIcon, Clock3, X, ChevronRight, Home, Layers3, Copy, Trash2, Pencil, Move, GripVertical
} from "lucide-react";
import type { DeskObjectKind, SceneObject, ThemeId, ObjectSize } from "./types";

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

type Snapshot = { objects: SceneObject[]; path: string[] };
function cloneData<T,>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function removeTree(objects: SceneObject[], id: string): SceneObject[] { return objects.filter(item => item.id !== id).map(item => item.children ? { ...item, children: removeTree(item.children, id) } : item); }
function containsObject(item: SceneObject, id: string): boolean { return item.id === id || Boolean(item.children?.some(child => containsObject(child, id))); }
function App() {
  const [objects, setObjects] = useState<SceneObject[]>(() => readWorkspace().objects);
  const [path, setPath] = useState<string[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [fan, setFan] = useState<"add" | "customize" | null>(null);
  const [draft, setDraft] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [movePickerOpen, setMovePickerOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<Snapshot[]>([]);
  const [redoStack, setRedoStack] = useState<Snapshot[]>([]);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);
  const dragStart = useRef<{x:number;y:number}|null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ objects }));
  }, [objects]);

  const activeCollection = path.length ? findObject(objects, path[path.length - 1]) : undefined;
  const currentObjects = activeCollection?.children ?? objects;
  const activeNote = activeNoteId ? findObject(objects, activeNoteId) : undefined;
  const selectedObject = selectedId ? findObject(objects, selectedId) : undefined;
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

  const commit = (next: SceneObject[]) => { setUndoStack(stack => [...stack.slice(-39), { objects: cloneData(objects), path: [...path] }]); setRedoStack([]); setObjects(next); };
  const updateItem = (id: string, patch: Partial<SceneObject>) => commit(updateTree(objects, id, item => ({ ...item, ...patch })));
  const undo = () => { const previous = undoStack[undoStack.length-1]; if (!previous) return; setRedoStack(stack => [...stack,{objects:cloneData(objects),path:[...path]}]); setObjects(previous.objects); setPath(previous.path); setUndoStack(stack=>stack.slice(0,-1)); };
  const redo = () => { const next = redoStack[redoStack.length-1]; if (!next) return; setUndoStack(stack=>[...stack,{objects:cloneData(objects),path:[...path]}]); setObjects(next.objects); setPath(next.path); setRedoStack(stack=>stack.slice(0,-1)); };
  const renameSelected = () => { if (!selectedObject) return; const value = window.prompt("Rename item",selectedObject.title); if (value?.trim()) updateItem(selectedObject.id,{title:value.trim()}); setSelectedId(null); };
  const duplicateSelected = () => { if (!selectedObject) return; const copy=cloneData(selectedObject); copy.id=crypto.randomUUID(); copy.title += " copy"; copy.position=currentObjects.length; const next=activeCollection?updateTree(objects,activeCollection.id,parent=>({...parent,children:[...(parent.children??[]),copy]})):[...objects,copy]; commit(next); setSelectedId(null); };
  const deleteSelected = () => { if (!selectedObject || !window.confirm("Delete selected item?")) return; commit(removeTree(objects,selectedObject.id)); setSelectedId(null); };
  const moveSelectedTo = (targetId: string | null) => { if (!selectedObject || targetId===selectedObject.id || (targetId && containsObject(selectedObject,targetId))) return; const moving=cloneData(selectedObject); let next=removeTree(objects,selectedObject.id); const target=targetId?findObject(next,targetId):undefined; if (targetId && (!target || target.kind!=="collection")) return; moving.position=target?(target.children?.length??0):next.length; next=target?updateTree(next,target.id,parent=>({...parent,children:[...(parent.children??[]),moving]})):[...next,moving]; commit(next); setMovePickerOpen(false); setSelectedId(null); };
  const startPress = (event: React.PointerEvent<HTMLButtonElement>, id: string) => { longPressed.current=false; event.currentTarget.setPointerCapture(event.pointerId); dragStart.current={x:event.clientX,y:event.clientY}; if(pressTimer.current)clearTimeout(pressTimer.current); pressTimer.current=setTimeout(()=>{longPressed.current=true;setDraggingId(id);if(navigator.vibrate)navigator.vibrate(12);},520); };
  const movePress = (event: React.PointerEvent<HTMLButtonElement>) => { if(!dragStart.current || draggingId)return; if(Math.hypot(event.clientX-dragStart.current.x,event.clientY-dragStart.current.y)>12 && pressTimer.current)clearTimeout(pressTimer.current); };
  const endPress = (event: React.PointerEvent<HTMLButtonElement>) => { if(pressTimer.current)clearTimeout(pressTimer.current); if(draggingId){const target=document.elementFromPoint(event.clientX,event.clientY)?.closest("[data-object-id]") as HTMLElement|null;const targetId=target?.dataset.objectId;const ordered=[...currentObjects].sort((a,b)=>a.position-b.position);const from=ordered.findIndex(item=>item.id===draggingId),to=ordered.findIndex(item=>item.id===targetId);if(from>=0&&to>=0&&from!==to){const [picked]=ordered.splice(from,1);ordered.splice(to,0,picked);const positions=new Map(ordered.map((item,index)=>[item.id,index] as const));const arranged=currentObjects.map(item=>positions.has(item.id)?{...item,position:positions.get(item.id)!}:item);commit(activeCollection?updateTree(objects,activeCollection.id,parent=>({...parent,children:arranged})):arranged);} else if(draggingId){setSelectedId(draggingId);} } setDraggingId(null);dragStart.current=null; };
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
      commit(updateTree(objects, activeCollection.id, parent => ({
        ...parent, children: [...(parent.children ?? []), item]
      })));
    } else {
      commit([...objects, item]);
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
              className={`desk-object object-${item.kind} size-${item.size} ${draggingId===item.id?"is-dragging":""}`} data-object-id={item.id} onPointerDown={event=>startPress(event,item.id)} onPointerMove={movePress} onPointerUp={endPress} onPointerCancel={endPress} onContextMenu={event=>{event.preventDefault();setSelectedId(item.id);}}
              onClick={() => { if(longPressed.current){longPressed.current=false;return;} item.kind === "collection" ? navigateInto(item) : setActiveNoteId(item.id); }}
            >
              <span className="object-grip"><GripVertical size={13}/></span><span className="object-icon">{iconFor(item.kind)}</span>
              <span className="object-title">{item.title}</span>
              <span className="object-subtitle">{item.subtitle}</span>
              {item.kind === "collection" && <span className="collection-enter">{item.children?.length ?? 0} ITEMS · OPEN SPACE ↗</span>}
            </button>
          ))}
          {visibleObjects.length === 0 && <div className="empty-space">Nothing here yet. Use + to put something down.</div>}
        </div>
      </section>

      <p className="arrange-hint"><GripVertical size={12}/> Press and hold an object to arrange it</p><aside className="perimeter">
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
        <button className="icon-button" aria-label="Undo" onClick={undo} disabled={!undoStack.length}><Undo2 /></button>
        <button className="icon-button" aria-label="Redo" onClick={redo} disabled={!redoStack.length}><Redo2 /></button>
        <span className="dock-spacer" />
        <button className={`icon-button ${fan === "customize" ? "selected" : ""}`} onClick={() => setFan(fan === "customize" ? null : "customize")} aria-label="Customize"><Paintbrush2 /></button>
        <button className={`add-button ${fan === "add" ? "selected" : ""}`} onClick={() => setFan(fan === "add" ? null : "add")} aria-label="Add"><Plus /></button>
      </nav>

      {selectedObject && <div className="note-overlay" onClick={()=>setSelectedId(null)}><section className="object-actions-sheet" onClick={e=>e.stopPropagation()}>
        <button className="note-close icon-button" onClick={()=>setSelectedId(null)} aria-label="Close options"><X/></button>
        <p className="eyebrow">OBJECT OPTIONS</p><h2>{selectedObject.title}</h2>
        <div className="action-row"><button onClick={renameSelected}><Pencil/>Rename</button><button onClick={duplicateSelected}><Copy/>Duplicate</button><button onClick={()=>setMovePickerOpen(true)}><Move/>Move to</button></div>
        <p className="action-label">SIZE</p><div className="size-options">{(["small","medium","large","wide"] as ObjectSize[]).map(size=><button key={size} className={selectedObject.size===size?"active":""} onClick={()=>{updateItem(selectedObject.id,{size});setSelectedId(null);}}>{size}</button>)}</div>
        <button className="delete-action" onClick={deleteSelected}><Trash2/>Delete</button>
      </section></div>}
      {movePickerOpen && selectedObject && <div className="note-overlay" onClick={()=>setMovePickerOpen(false)}><section className="theme-sheet" onClick={e=>e.stopPropagation()}><button className="note-close icon-button" onClick={()=>setMovePickerOpen(false)} aria-label="Close"><X/></button><p className="eyebrow">MOVE OBJECT</p><h2>Choose a destination</h2><div className="theme-options"><button className="theme-option" onClick={()=>moveSelectedTo(null)}>My desk</button>{(function list(items:SceneObject[],depth=0):React.ReactNode[]{return items.flatMap(item=>item.kind==="collection"?[<button key={item.id} className="theme-option" style={{paddingLeft:14+depth*14}} disabled={containsObject(selectedObject,item.id)} onClick={()=>moveSelectedTo(item.id)}>{item.title}</button>,...(item.children?list(item.children,depth+1):[])]:[]);})(objects)}</div></section></div>}
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
export type ThemeId =
  | "clean-textured"
  | "photoreal-desk"
  | "cinematic-realism"
  | "illustrated-sketchbook"
  | "surreal-atmospheric"
  | "minimal-natural"
  | "vintage-ephemera"
  | "graphic-textured"
  | "painterly-artistic";

export type DeskObjectKind =
  | "collection"
  | "note"
  | "checklist"
  | "photo"
  | "link"
  | "document"
  | "reminder";

export type ObjectSize = "small" | "medium" | "large" | "wide";

export interface SceneObject {
  id: string;
  kind: DeskObjectKind;
  title: string;
  subtitle?: string;
  content?: string;
  position: number;
  size: ObjectSize;
  theme?: ThemeId;
  environment?: "meadow" | "outer-space" | "studio" | "library" | "cabin" | "night-sky" | null;
  lightingMode?: "auto" | "morning" | "afternoon" | "evening" | "night";
  children?: SceneObject[];
  createdAt?: string;
  updatedAt?: string;
  appearance?: { finishId?: string; paperId?: string; rotation?: number };
}

export interface Scene {
  id: string;
  title: string;
  theme: ThemeId;
  surface: string;
  objects: SceneObject[];
}

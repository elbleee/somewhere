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
  children?: SceneObject[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Scene {
  id: string;
  title: string;
  theme: ThemeId;
  surface: string;
  objects: SceneObject[];
}

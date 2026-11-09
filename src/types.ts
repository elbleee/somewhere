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

export interface SceneObject {
  id: string;
  kind: DeskObjectKind;
  title: string;
  subtitle?: string;
  position: number;
  size: "small" | "medium" | "large" | "wide";
  theme?: ThemeId;
  children?: SceneObject[];
}

export interface Scene {
  id: string;
  title: string;
  theme: ThemeId;
  surface: string;
  objects: SceneObject[];
}
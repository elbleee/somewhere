import type { ThemeId } from "../../types";

export type ThemeTokens = {
  label: string;
  environment: string | null;
  palette: { paper: string; paperEdge: string; ink: string; mutedInk: string; accent: string; folder: string; shadow: string };
  material: "paper" | "linen" | "kraft" | "smooth" | "illustrated" | "grain";
  lighting: "warm-upper-left" | "soft-daylight" | "cinematic" | "flat-graphic" | "moonlight";
  textureStrength: number;
  shadowStrength: number;
};

export const themeTokens: Record<ThemeId, ThemeTokens> = {
  "clean-textured": {
    label: "Clean & Textured", environment: null,
    palette: { paper:"#f5f0e7", paperEdge:"#d7cbbb", ink:"#3d352c", mutedInk:"#82766a", accent:"#9b9279", folder:"#dfe2d2", shadow:"rgba(35,25,16,.18)" },
    material:"paper", lighting:"warm-upper-left", textureStrength:.24, shadowStrength:.22
  },
  "photoreal-desk": {
    label:"Photoreal Desk", environment:null,
    palette:{paper:"#f4f0e8",paperEdge:"#cfc5b5",ink:"#302920",mutedInk:"#776b5e",accent:"#b18a60",folder:"#d9d2c3",shadow:"rgba(20,13,8,.25)"},
    material:"grain",lighting:"soft-daylight",textureStrength:.18,shadowStrength:.3
  },
  "cinematic-realism": {
    label:"Cinematic Realism",environment:"cabin",
    palette:{paper:"#e9e1d4",paperEdge:"#bcae9b",ink:"#30251e",mutedInk:"#746457",accent:"#b27a4f",folder:"#c8b59b",shadow:"rgba(12,8,6,.38)"},
    material:"linen",lighting:"cinematic",textureStrength:.3,shadowStrength:.38
  },
  "illustrated-sketchbook": {
    label:"Illustrated Sketchbook",environment:"studio",
    palette:{paper:"#fff9e9",paperEdge:"#d6c9ad",ink:"#403a32",mutedInk:"#827766",accent:"#789078",folder:"#d9e1cf",shadow:"rgba(55,47,37,.16)"},
    material:"illustrated",lighting:"flat-graphic",textureStrength:.42,shadowStrength:.16
  },
  "surreal-atmospheric": {
    label:"Surreal & Atmospheric",environment:"outer-space",
    palette:{paper:"#eee9e5",paperEdge:"#c9c0c4",ink:"#332c3b",mutedInk:"#797181",accent:"#9b8ab5",folder:"#d9d1e7",shadow:"rgba(19,15,31,.3)"},
    material:"smooth",lighting:"moonlight",textureStrength:.16,shadowStrength:.3
  },
  "minimal-natural": {
    label:"Minimal Natural",environment:"meadow",
    palette:{paper:"#f3f0e6",paperEdge:"#d0cbb8",ink:"#394036",mutedInk:"#788071",accent:"#879777",folder:"#dce2d0",shadow:"rgba(35,43,29,.16)"},
    material:"linen",lighting:"soft-daylight",textureStrength:.22,shadowStrength:.18
  },
  "vintage-ephemera": {
    label:"Vintage / Ephemera",environment:"library",
    palette:{paper:"#efe3cd",paperEdge:"#c9b697",ink:"#49382a",mutedInk:"#88745e",accent:"#a56d4d",folder:"#d8c3a1",shadow:"rgba(39,25,15,.28)"},
    material:"kraft",lighting:"warm-upper-left",textureStrength:.48,shadowStrength:.28
  },
  "graphic-textured": {
    label:"Graphic & Textured",environment:null,
    palette:{paper:"#f2eee4",paperEdge:"#c9c2b4",ink:"#282b2b",mutedInk:"#747979",accent:"#8e9e9b",folder:"#d4dfdc",shadow:"rgba(22,27,27,.2)"},
    material:"illustrated",lighting:"flat-graphic",textureStrength:.34,shadowStrength:.2
  },
  "painterly-artistic": {
    label:"Painterly / Artistic",environment:"meadow",
    palette:{paper:"#f1e9df",paperEdge:"#d3bfae",ink:"#43372f",mutedInk:"#89776b",accent:"#b18a83",folder:"#e5d5ca",shadow:"rgba(48,31,25,.23)"},
    material:"grain",lighting:"soft-daylight",textureStrength:.38,shadowStrength:.24
  }
};

export const defaultTheme: ThemeId = "clean-textured";

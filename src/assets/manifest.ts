/**
 * Somewhere visual asset catalog.
 *
 * Components should select assets by stable ID rather than hard-coding paths.
 * Keep text/content out of artwork; names and labels remain live UI data.
 */
import walnutSurface from "./desk-surfaces/walnut-grain.svg";

import folderSage from "./folders/folder-sage.svg";
import folderSand from "./folders/folder-sand.svg";
import folderRose from "./folders/folder-rose.svg";
import folderCream from "./folders/folder-cream.svg";
import folderBlue from "./folders/folder-blue.svg";
import folderOlive from "./folders/folder-olive.svg";

import stickyButter from "./papers/sticky-butter.svg";
import stickySage from "./papers/sticky-sage.svg";
import stickyBlue from "./papers/sticky-blue.svg";
import stickyRose from "./papers/sticky-rose.svg";
import paperLined from "./papers/paper-lined.svg";
import paperBlank from "./papers/paper-blank.svg";
import paperGrid from "./papers/paper-grid.svg";
import paperKraft from "./papers/paper-kraft.svg";
import paperReminder from "./papers/paper-reminder.svg";
import polaroidFrame from "./papers/polaroid-frame.svg";

import coffeeCup from "./accessories/coffee-cup.svg";
import pottedPlant from "./accessories/potted-plant.svg";
import brassPen from "./accessories/brass-pen.svg";
import brassPaperclip from "./accessories/brass-paperclip.svg";
import brassBinderClip from "./accessories/brass-binder-clip.svg";
import brassPushpin from "./accessories/brass-pushpin.svg";
import washiTape from "./accessories/washi-tape.svg";
import fernFrond from "./accessories/fern-frond.svg";

import clockFace from "./clocks/clock-face.svg";
import hourHand from "./clocks/hour-hand.svg";
import minuteHand from "./clocks/minute-hand.svg";
import secondHand from "./clocks/second-hand.svg";

import meadow from "./environments/meadow.svg";
import outerSpace from "./environments/outer-space.svg";
import studio from "./environments/studio.svg";
import library from "./environments/library.svg";
import cabin from "./environments/cabin.svg";
import nightSky from "./environments/night-sky.svg";

export const deskSurfaces = {
  "walnut-grain": walnutSurface
} as const;

export const collectionFinishes = [
  { id: "sage", label: "Sage", src: folderSage, family: "natural" },
  { id: "sand", label: "Sand", src: folderSand, family: "neutral" },
  { id: "rose", label: "Rose", src: folderRose, family: "warm" },
  { id: "cream", label: "Cream", src: folderCream, family: "neutral" },
  { id: "blue", label: "Blue", src: folderBlue, family: "cool" },
  { id: "olive", label: "Olive", src: folderOlive, family: "natural" }
] as const;

export const paperFinishes = [
  { id: "sticky-butter", label: "Butter sticky", src: stickyButter, format: "sticky" },
  { id: "sticky-sage", label: "Sage sticky", src: stickySage, format: "sticky" },
  { id: "sticky-blue", label: "Blue sticky", src: stickyBlue, format: "sticky" },
  { id: "sticky-rose", label: "Rose sticky", src: stickyRose, format: "sticky" },
  { id: "lined", label: "Lined", src: paperLined, format: "sheet" },
  { id: "blank", label: "Blank", src: paperBlank, format: "sheet" },
  { id: "grid", label: "Grid", src: paperGrid, format: "sheet" },
  { id: "kraft", label: "Kraft", src: paperKraft, format: "sheet" },
  { id: "reminder", label: "Reminder", src: paperReminder, format: "sheet" },
  { id: "polaroid", label: "Polaroid frame", src: polaroidFrame, format: "photo" }
] as const;

export const deskAccessories = [
  { id: "coffee-cup", label: "Coffee cup", src: coffeeCup, group: "ritual" },
  { id: "potted-plant", label: "Potted plant", src: pottedPlant, group: "organic" },
  { id: "brass-pen", label: "Brass pen", src: brassPen, group: "stationery" },
  { id: "paperclip", label: "Brass paperclip", src: brassPaperclip, group: "stationery" },
  { id: "binder-clip", label: "Brass binder clip", src: brassBinderClip, group: "stationery" },
  { id: "pushpin", label: "Brass pushpin", src: brassPushpin, group: "stationery" },
  { id: "washi-tape", label: "Washi tape", src: washiTape, group: "stationery" },
  { id: "fern-frond", label: "Fern frond", src: fernFrond, group: "organic" }
] as const;

export const deskClock = {
  face: clockFace,
  hands: { hour: hourHand, minute: minuteHand, second: secondHand }
} as const;

export const collectionEnvironments = [
  { id: "meadow", label: "Meadow", src: meadow, mood: "open-air" },
  { id: "outer-space", label: "Outer space", src: outerSpace, mood: "expansive" },
  { id: "studio", label: "Studio", src: studio, mood: "focused" },
  { id: "library", label: "Library", src: library, mood: "quiet" },
  { id: "cabin", label: "Cabin", src: cabin, mood: "cozy" },
  { id: "night-sky", label: "Night sky", src: nightSky, mood: "dreamlike" }
] as const;

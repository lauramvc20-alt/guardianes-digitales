import { Easing, interpolate } from "remotion";
import timings from "./timings.json";

export const T = timings;
export const FPS = timings.fps;
export const W = 1920;
export const H = 1080;

/* Paleta tomada de assets/css/base.css de la plataforma PVA */
export const C = {
  night: "#070b18",
  night2: "#0b1226",
  panel: "#101a33",
  panel2: "#121d3a",
  violet: "#8b6cf6",
  violetSoft: "#a78bfa",
  lav: "#c9b8ff",
  turq: "#4fe0c1",
  turqDeep: "#1fb79a",
  coral: "#ff7a6b",
  yellow: "#ffd166",
  ink: "#eef3ff",
  inkSoft: "#d5def7",
  muted: "#9aa9c9",
  line: "rgba(148,168,214,0.24)",
};

export const FONT =
  '"Segoe UI Variable Display","Segoe UI",Inter,"Helvetica Neue",Arial,"Liberation Sans","DejaVu Sans",sans-serif';

export const E = Easing.bezier(0.22, 0.68, 0.24, 1);
export const EIO = Easing.bezier(0.65, 0, 0.35, 1);
export const BACK = Easing.out(Easing.back(1.7));

export const prog = (t: number, a: number, b: number, e: (x: number) => number = E) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e,
  });

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const line = (id: string) => {
  const l = T.lineas.find((x) => x.id === id);
  if (!l) throw new Error("Línea no encontrada: " + id);
  return l;
};
export const scene = (n: number) => T.escenas[n - 1];
export const ev = (name: string) => {
  const e = T.eventos.find((x) => x.evento === name);
  if (!e) throw new Error("Evento no encontrado: " + name);
  return e.t;
};

export const typed = (text: string, t: number, start: number, cps: number) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((t - start) * cps)));
  return text.slice(0, n);
};

import React from "react";
import { interpolate } from "remotion";
import { BACK, C, E, EIO, FONT, H, T, W, ev, line, lerp, prog, scene } from "./theme";
import { SHIELD_CHECK, SHIELD_PATH } from "./icons";

/* ---------- Fondo continuo: degradados de la plataforma + partículas ---------- */
export const Background: React.FC<{ t: number }> = ({ t }) => {
  const dots = Array.from({ length: 46 }, (_, i) => {
    const sx = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const sy = (Math.sin(i * 78.233) * 12345.6789) % 1;
    const x = Math.abs(sx) * W;
    const y0 = Math.abs(sy) * H;
    const speed = 6 + (i % 7) * 3;
    const y = (y0 - t * speed + H * 4) % H;
    const r = 1.5 + (i % 4) * 0.9;
    const a = 0.08 + (i % 5) * 0.045;
    return { x: x + Math.sin(t * 0.4 + i) * 14, y, r, a, c: i % 3 === 0 ? C.turq : i % 3 === 1 ? C.violetSoft : C.lav };
  });
  const gx = Math.sin(t * 0.25) * 90;
  const gy = Math.cos(t * 0.2) * 60;
  return (
    <div style={{ position: "absolute", inset: 0, background: C.night, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -200,
          background: `radial-gradient(1100px 700px at ${300 + gx}px ${80 + gy}px, rgba(139,108,246,0.30), transparent 62%),
                       radial-gradient(900px 640px at ${1700 - gx}px ${160 - gy}px, rgba(79,224,193,0.20), transparent 58%),
                       radial-gradient(900px 600px at 960px ${1180 + gy}px, rgba(255,122,107,0.14), transparent 60%)`,
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <defs>
          <pattern id="grid" width="96" height="96" patternUnits="userSpaceOnUse" patternTransform={`translate(${-t * 6} ${t * 4})`}>
            <path d="M96 0H0V96" fill="none" stroke="rgba(148,168,214,0.07)" strokeWidth="1" />
          </pattern>
          <radialGradient id="vig" cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor="rgba(7,11,24,0)" />
            <stop offset="100%" stopColor="rgba(7,11,24,0.85)" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={d.a} />
        ))}
        <rect width={W} height={H} fill="url(#vig)" />
      </svg>
    </div>
  );
};

/* ---------- Marca superior ---------- */
export const BrandChip: React.FC<{ t: number }> = ({ t }) => {
  const k = prog(t, 0.2, 0.9);
  const out = 1 - prog(t, T.total - 2.4, T.total - 1.9);
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 62,
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: k * out,
        transform: `translateY(${(1 - k) * -16}px)`,
        fontFamily: FONT,
      }}
    >
      <svg width="46" height="46" viewBox="0 0 32 32">
        <path d={SHIELD_PATH} fill="rgba(139,108,246,0.18)" stroke={C.turq} strokeWidth="1.6" />
        <path d={SHIELD_CHECK} fill="none" stroke={C.turq} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontWeight: 800, fontSize: 28, color: C.ink, letterSpacing: 1 }}>PVA</div>
        <div style={{ fontSize: 19, color: C.muted, letterSpacing: 0.4 }}>Guardián digital</div>
      </div>
    </div>
  );
};

/* ---------- Palabras que entran una a una ---------- */
export const Words: React.FC<{
  text: string;
  t: number;
  start: number;
  size: number;
  color?: string;
  weight?: number;
  stagger?: number;
  gradient?: boolean;
  outAt?: number;
  style?: React.CSSProperties;
}> = ({ text, t, start, size, color = C.ink, weight = 800, stagger = 0.09, gradient, outAt, style }) => {
  const words = text.split(" ");
  const out = outAt === undefined ? 0 : prog(t, outAt, outAt + 0.45, EIO);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.28, fontFamily: FONT, fontSize: size, fontWeight: weight, lineHeight: 1.08, letterSpacing: -size * 0.01, ...style }}>
      {words.map((w, i) => {
        const k = prog(t, start + i * stagger, start + i * stagger + 0.55, E);
        const o = out;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: k * (1 - o),
              transform: `translateY(${(1 - k) * 46 - o * 30}px)`,
              filter: `blur(${(1 - k) * 8 + o * 6}px)`,
              ...(gradient
                ? { background: `linear-gradient(90deg, ${C.turq}, ${C.violetSoft})`, WebkitBackgroundClip: "text", color: "transparent" }
                : { color }),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Kicker: React.FC<{ text: string; t: number; start: number; color?: string; outAt?: number }> = ({ text, t, start, color = C.turq, outAt }) => {
  const k = prog(t, start, start + 0.5);
  const o = outAt === undefined ? 0 : prog(t, outAt, outAt + 0.4);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 26,
        fontWeight: 800,
        letterSpacing: 4,
        color,
        opacity: k * (1 - o),
        transform: `translateX(${(1 - k) * -30}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span style={{ width: 44 * k, height: 4, borderRadius: 4, background: color, display: "inline-block" }} />
      {text}
    </div>
  );
};

/* ---------- Capa de escena con entrada/salida ---------- */
export const Layer: React.FC<{ t: number; from: number; to: number; dx?: number; children: React.ReactNode }> = ({ t, from, to, dx = 80, children }) => {
  const inn = prog(t, from, from + 0.55, E);
  const out = prog(t, to - 0.1, to + 0.45, EIO);
  if (t < from - 0.05 || t > to + 0.5) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: inn * (1 - out),
        transform: `translateX(${(1 - inn) * dx - out * dx}px)`,
        filter: `blur(${(1 - inn) * 10 + out * 10}px)`,
      }}
    >
      {children}
    </div>
  );
};

/* ---------- Cursor animado ---------- */
export const Cursor: React.FC<{ t: number; keys: [number, number, number][]; clicks: number[] }> = ({ t, keys, clicks }) => {
  const ts = keys.map((k) => k[0]);
  const x = interpolate(t, ts, keys.map((k) => k[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EIO });
  const y = interpolate(t, ts, keys.map((k) => k[2]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EIO });
  const vis = prog(t, ts[0], ts[0] + 0.3) * (1 - prog(t, ts[ts.length - 1] + 0.2, ts[ts.length - 1] + 0.6));
  let press = 0;
  let ripple = -1;
  clicks.forEach((c) => {
    if (t >= c - 0.08 && t <= c + 0.12) press = 1;
    if (t >= c && t <= c + 0.6) ripple = (t - c) / 0.6;
  });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: vis, pointerEvents: "none" }}>
      {ripple >= 0 && (
        <div
          style={{
            position: "absolute",
            left: x - 44 * ripple - 6,
            top: y - 44 * ripple - 6,
            width: 88 * ripple + 12,
            height: 88 * ripple + 12,
            borderRadius: "50%",
            border: `3px solid ${C.turq}`,
            opacity: 1 - ripple,
          }}
        />
      )}
      <svg width="46" height="52" viewBox="0 0 23 26" style={{ position: "absolute", left: x - 3, top: y - 3, transform: `scale(${1 - press * 0.12})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
        <path d="M3 2v18l5-4.6 3.4 7 3-1.5-3.3-6.8H18L3 2Z" fill="#fff" stroke="#0b1226" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/* ---------- Subtítulos grabados en la imagen (variante opcional) ---------- */
export const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const cur = T.lineas.find((l) => t >= l.inicio - 0.05 && t <= l.fin + 0.25);
  if (!cur) return null;
  const k = prog(t, cur.inicio - 0.05, cur.inicio + 0.18) * (1 - prog(t, cur.fin + 0.1, cur.fin + 0.25));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 58, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * 12}px)` }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 600,
          color: "#fff",
          background: "rgba(5,7,15,0.78)",
          border: `1px solid ${C.line}`,
          borderRadius: 18,
          padding: "14px 32px",
          maxWidth: 1500,
          textAlign: "center",
          lineHeight: 1.25,
          boxShadow: "0 20px 50px -20px rgba(0,0,0,0.8)",
        }}
      >
        {cur.texto}
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${(t / T.total) * 100}%`, background: `linear-gradient(90deg, ${C.violet}, ${C.turq})`, opacity: 0.9 }} />
);


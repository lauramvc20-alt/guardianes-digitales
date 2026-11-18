import React from "react";

/* RO-BIT: misma construcción SVG que PVA/assets/js/components/robot.js (6 poses). */
const TURQ = "#4fe0c1";
const LAV = "#c9b8ff";
const CORAL = "#ff8f82";
const YELLOW = "#ffd166";

type Cfg = { arms: [string, string]; eyes: string; mouth: string; tilt: number; accent: string; sparkles: boolean };
export type Pose = "welcome" | "explain" | "warning" | "reflection" | "feedback" | "celebration";

const POSES: Record<Pose, Cfg> = {
  welcome: { arms: ["down", "up"], eyes: "happy", mouth: "smile", tilt: -4, accent: TURQ, sparkles: true },
  explain: { arms: ["down", "out"], eyes: "normal", mouth: "smile", tilt: 0, accent: TURQ, sparkles: false },
  warning: { arms: ["up", "up"], eyes: "narrow", mouth: "flat", tilt: 0, accent: CORAL, sparkles: false },
  reflection: { arms: ["down", "chin"], eyes: "up", mouth: "tiny", tilt: 5, accent: LAV, sparkles: false },
  feedback: { arms: ["down", "out"], eyes: "normal", mouth: "bigSmile", tilt: -2, accent: TURQ, sparkles: false },
  celebration: { arms: ["up", "up"], eyes: "happy", mouth: "bigSmile", tilt: 0, accent: YELLOW, sparkles: true },
};

type Arm = { left: string; right: string; hands: [[number, number], [number, number]] };
const ARMS: Record<string, Arm> = {
  down: { left: "M60 148 C48 160 44 176 46 192", right: "M140 148 C152 160 156 176 154 192", hands: [[46, 192], [154, 192]] },
  out: { left: "M60 148 C44 146 34 140 24 130", right: "M140 148 C156 146 166 140 176 130", hands: [[24, 130], [176, 130]] },
  up: { left: "M60 146 C44 138 36 118 32 100", right: "M140 146 C156 138 164 118 168 100", hands: [[32, 100], [168, 100]] },
  chin: { left: "M60 150 C50 150 50 136 58 126", right: "M140 148 C152 150 150 134 134 131", hands: [[58, 126], [134, 131]] },
};

const glow = (cx: number, cy: number, r: number, c: string, o = 0.16) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity="${o}"/>`;

function eyes(kind: string, c: string, blink: number) {
  const sy = 1 - 0.9 * blink; // parpadeo
  if (kind === "happy")
    return `<g>${glow(82, 84, 11, c, 0.14)}<path d="M75 85 Q82 76 89 85" fill="none" stroke="${c}" stroke-width="4.2" stroke-linecap="round"/></g><g>${glow(118, 84, 11, c, 0.14)}<path d="M111 85 Q118 76 125 85" fill="none" stroke="${c}" stroke-width="4.2" stroke-linecap="round"/></g>`;
  if (kind === "narrow")
    return `<g>${glow(82, 83, 11, c, 0.14)}<rect x="75" y="80.5" width="14" height="5" rx="2.5" fill="${c}"/></g><g>${glow(118, 83, 11, c, 0.14)}<rect x="111" y="80.5" width="14" height="5" rx="2.5" fill="${c}"/></g>`;
  const cy = kind === "up" ? 78.5 : 83;
  const ry = kind === "up" ? 6.2 : 6.2;
  const hi = kind === "up" ? 76.4 : 81;
  return `<g transform="translate(0 ${cy}) scale(1 ${sy}) translate(0 ${-cy})">${glow(82, cy + 1, 11, c, 0.14)}<ellipse cx="82" cy="${cy}" rx="4.6" ry="${ry}" fill="${c}"/><circle cx="80.5" cy="${hi}" r="1.4" fill="#fff" opacity=".7"/></g><g transform="translate(0 ${cy}) scale(1 ${sy}) translate(0 ${-cy})">${glow(118, cy + 1, 11, c, 0.14)}<ellipse cx="118" cy="${cy}" rx="4.6" ry="${ry}" fill="${c}"/><circle cx="116.5" cy="${hi}" r="1.4" fill="#fff" opacity=".7"/></g>`;
}

function mouth(kind: string, c: string) {
  if (kind === "bigSmile") return `<path d="M89 98 Q100 112 111 98" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
  if (kind === "flat") return `<path d="M93 102 H107" fill="none" stroke="#a9b8d6" stroke-width="3.6" stroke-linecap="round"/>`;
  if (kind === "tiny") return `<path d="M96 101 Q100 104 104 101" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/>`;
  return `<path d="M92 99 Q100 106 108 99" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/>`;
}

function sparkle(x: number, y: number, s: number, c: string) {
  const a = s * 0.28;
  return `<path d="M${x} ${y - s} L${x + a} ${y - a} L${x + s} ${y} L${x + a} ${y + a} L${x} ${y + s} L${x - a} ${y + a} L${x - s} ${y} L${x - a} ${y - a} Z" fill="${c}" opacity=".85"/>`;
}

function build(pose: Pose, blink: number, pulse: number) {
  const cfg = POSES[pose];
  const accent = cfg.accent;
  const la = ARMS[cfg.arms[0]];
  const ra = ARMS[cfg.arms[1]];
  const p: string[] = [];
  p.push(`<ellipse cx="100" cy="207" rx="47" ry="7.5" fill="${accent}" opacity=".1"/>`);
  p.push(`<line x1="100" y1="28" x2="100" y2="48" stroke="#c6d2e8" stroke-width="3.2" stroke-linecap="round"/><circle cx="100" cy="23" r="${13 + 3 * pulse}" fill="${accent}" opacity=".16"/><circle cx="100" cy="23" r="6.4" fill="${accent}"/><circle cx="98" cy="21" r="1.8" fill="#fff" opacity=".75"/>`);
  p.push(`<rect x="90" y="120" width="20" height="16" rx="7" fill="#c5d0e5"/><rect x="58" y="132" width="84" height="62" rx="26" fill="#e9effb" stroke="#bcc8e0" stroke-width="2"/><rect x="78" y="150" width="44" height="26" rx="13" fill="#080d1a" stroke="${accent}" stroke-opacity=".38" stroke-width="1.4"/><circle cx="100" cy="163" r="10" fill="${accent}" opacity=".14"/><circle cx="100" cy="163" r="4.8" fill="${accent}"/><circle cx="66" cy="143" r="2.4" fill="#c2cde3"/><circle cx="134" cy="143" r="2.4" fill="#c2cde3"/>`);
  p.push(`<path d="${la.left}" fill="none" stroke="#d8e0f1" stroke-width="11" stroke-linecap="round"/><path d="${ra.right}" fill="none" stroke="#d8e0f1" stroke-width="11" stroke-linecap="round"/><circle cx="${la.hands[0][0]}" cy="${la.hands[0][1]}" r="7" fill="#c9d5ea" stroke="#b3c0da" stroke-width="1.2"/><circle cx="${ra.hands[1][0]}" cy="${ra.hands[1][1]}" r="7" fill="#c9d5ea" stroke="#b3c0da" stroke-width="1.2"/>`);
  p.push(`<g transform="rotate(${cfg.tilt} 100 86)"><rect x="46" y="38" width="108" height="88" rx="30" fill="#f1f5fe" stroke="#c3cee4" stroke-width="2"/><rect x="40" y="66" width="7" height="24" rx="3.5" fill="#c9d4e8"/><rect x="153" y="66" width="7" height="24" rx="3.5" fill="#c9d4e8"/><rect x="57" y="52" width="86" height="62" rx="20" fill="#070b18" stroke="${accent}" stroke-opacity=".4" stroke-width="1.5"/><path d="M67 62 Q79 55 95 58" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="45.5" r="2" fill="${accent}" opacity=".8"/><circle cx="70" cy="104" r="3" fill="${accent}" opacity=".16"/><circle cx="130" cy="104" r="3" fill="${accent}" opacity=".16"/>${eyes(cfg.eyes, TURQ, blink)}${mouth(cfg.mouth, TURQ)}</g>`);
  if (cfg.sparkles) p.push(sparkle(164, 58, 7, accent) + sparkle(35, 88, 5, accent) + (pose === "celebration" ? sparkle(150, 32, 5.5, accent) + sparkle(46, 52, 4, accent) : ""));
  return `<svg viewBox="0 0 200 220" width="100%" height="100%">${p.join("")}</svg>`;
}

export const Robot: React.FC<{ pose: Pose; t: number; size: number; bob?: boolean }> = ({ pose, t, size, bob = true }) => {
  const phase = (t * 0.55) % 1; // parpadeo cada ~1.8 s
  const blink = phase > 0.93 ? Math.sin(((phase - 0.93) / 0.07) * Math.PI) : 0;
  const pulse = 0.5 + 0.5 * Math.sin(t * 5);
  return (
    <div
      style={{ width: size, height: size * 1.1, transform: `translateY(${bob ? Math.sin(t * 2.2) * 8 : 0}px)`, filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.45))" }}
      dangerouslySetInnerHTML={{ __html: build(pose, blink, pulse) }}
    />
  );
};

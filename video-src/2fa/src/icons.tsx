import React from "react";

type P = { size?: number; color?: string; stroke?: number; style?: React.CSSProperties };
const base = (p: P) => ({
  width: p.size ?? 48,
  height: p.size ?? 48,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: p.color ?? "currentColor",
  strokeWidth: p.stroke ?? 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  style: p.style,
});

export const Lock = (p: P) => (
  <svg {...base(p)}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.4" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    <circle cx="12" cy="15.5" r="1.2" fill={p.color ?? "currentColor"} />
  </svg>
);
export const Phone = (p: P) => (
  <svg {...base(p)}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
    <path d="M10.5 18.5h3" />
  </svg>
);
export const User = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.2" r="3.7" />
    <path d="M4.8 20c.9-3.6 3.8-5.4 7.2-5.4s6.3 1.8 7.2 5.4" />
  </svg>
);
export const Check = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12.6l4.4 4.4L19 7.4" />
  </svg>
);
export const Gear = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
  </svg>
);
export const Search = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15 15l5 5" />
  </svg>
);
export const Bell = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 1.6H4.4L6 16.5Z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </svg>
);
export const Eye = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);
export const Key = (p: P) => (
  <svg {...base(p)}>
    <rect x="8" y="2.8" width="8" height="9" rx="1.6" />
    <path d="M10.4 6h.01M13.6 6h.01" />
    <path d="M12 11.8v3.2" />
    <circle cx="12" cy="18.4" r="3" />
  </svg>
);
export const Alert = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.4 21.2 19.4H2.8L12 3.4Z" />
    <path d="M12 9.8v4.4M12 17h.01" />
  </svg>
);
export const Mail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.6" />
    <path d="M3.6 7.5 12 13.2l8.4-5.7" />
  </svg>
);
export const Sparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
  </svg>
);

export const SHIELD_PATH = "M16 2.8 27 7v8.4c0 6.2-4.4 11.4-11 13.8-6.6-2.4-11-7.6-11-13.8V7L16 2.8Z";
export const SHIELD_CHECK = "M10.6 15.9l3.6 3.7 7.2-7.6";

import React from "react";
import { BACK, C, E, EIO, FONT, ev, line, prog, scene, typed } from "./theme";
import { Alert, Bell, Check, Eye, Gear, Key, Lock, Mail, Phone, Search, Sparkle, User } from "./icons";
import { Cursor, Kicker, Layer, Words } from "./ui";

const card: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(18,29,58,0.96), rgba(12,20,42,0.96))",
  border: `1px solid ${C.line}`,
  borderRadius: 30,
  boxShadow: "0 40px 80px -30px rgba(3,6,16,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
  fontFamily: FONT,
  color: C.ink,
};
const bar = (w: number, h = 16, o = 0.14): React.CSSProperties => ({ width: w, height: h, borderRadius: h, background: `rgba(201,184,255,${o})` });

/* ================= ESCENA 1 · Introducción ================= */
export const Scene1: React.FC<{ t: number }> = ({ t }) => {
  const s = scene(1);
  const l = line("L1");
  const k = prog(t, 0.45, 1.25, BACK);
  const out = prog(t, s.fin - 0.35, s.fin + 0.2, EIO);
  const badge = prog(t, 2.55, 3.0, BACK);
  return (
    <Layer t={t} from={0} to={s.fin} dx={-60}>
      <div style={{ position: "absolute", left: 140, top: 330, width: 900 }}>
        <Kicker text="VERIFICACIÓN EN DOS PASOS" t={t} start={0.3} />
        <div style={{ height: 34 }} />
        <Words text="Protege tus" t={t} start={l.inicio} size={96} />
        <Words text="cuentas" t={t} start={l.inicio + 0.2} size={96} gradient />
        <div style={{ height: 18 }} />
        <Words text="con la verificación en dos pasos" t={t} start={l.inicio + 0.75} size={44} weight={500} color={C.inkSoft} stagger={0.12} />
      </div>
      {/* Tarjeta de cuenta dentro del escudo */}
      <div
        style={{
          ...card,
          position: "absolute",
          left: 1330 - 175,
          top: 505 - 130,
          width: 350,
          height: 260,
          padding: 30,
          opacity: k * (1 - out),
          transform: `scale(${(0.6 + 0.4 * k) * (1 - out * 0.1)}) translateY(${(1 - k) * 40}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: `linear-gradient(135deg, ${C.violet}, ${C.turqDeep})`, display: "grid", placeItems: "center" }}>
            <User size={46} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>Mi cuenta</div>
            <div style={{ fontSize: 20, color: C.muted, marginTop: 4 }}>usuario@correo.com</div>
          </div>
        </div>
        <div style={{ marginTop: 28, height: 58, borderRadius: 16, background: "rgba(7,11,24,0.7)", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 14, padding: "0 20px" }}>
          <Lock size={26} color={C.lav} />
          <div style={{ letterSpacing: 5, fontSize: 28, color: C.inkSoft }}>••••••••</div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          <div style={bar(120, 14)} />
          <div style={bar(70, 14, 0.09)} />
        </div>
        {/* insignia de verificado */}
        <div
          style={{
            position: "absolute",
            right: -22,
            bottom: -22,
            width: 74,
            height: 74,
            borderRadius: "50%",
            background: C.turq,
            display: "grid",
            placeItems: "center",
            transform: `scale(${badge})`,
            boxShadow: `0 0 40px rgba(79,224,193,0.6)`,
          }}
        >
          <Check size={44} color="#06131a" stroke={3} />
        </div>
      </div>
    </Layer>
  );
};

/* ================= ESCENA 2 · ¿Qué es? ================= */
export const Scene2: React.FC<{ t: number }> = ({ t }) => {
  const s = scene(2);
  const L = line("L2");
  const card1 = prog(t, s.inicio + 0.25, s.inicio + 0.95, BACK);
  const code = "482916";
  const nDots = Math.max(0, Math.min(8, Math.floor((t - (L.inicio + 0.85)) / 0.11) + 1));
  const phoneK = prog(t, ev("pop-telefono") - 0.1, ev("pop-telefono") + 0.6, BACK);
  const plus = prog(t, ev("pop-telefono") - 0.35, ev("pop-telefono") + 0.15, BACK);
  const nCode = Math.max(0, Math.min(6, Math.floor((t - (L.inicio + 2.55)) / 0.14) + 1));
  const ok = prog(t, ev("ok-identidad") - 0.05, ev("ok-identidad") + 0.5, BACK);
  const tick1 = prog(t, L.inicio + 1.75, L.inicio + 2.05, BACK);
  const ring = prog(t, L.inicio + 2.4, L.inicio + 3.6, EIO);
  return (
    <Layer t={t} from={s.inicio} to={s.fin}>
      <div style={{ position: "absolute", left: 140, top: 240 }}>
        <Kicker text="¿QUÉ ES?" t={t} start={s.inicio + 0.15} />
        <div style={{ height: 28 }} />
        <Words text="Una segunda" t={t} start={s.inicio + 0.3} size={80} />
        <Words text="comprobación" t={t} start={s.inicio + 0.5} size={80} gradient />
        <div style={{ height: 36 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { n: "1", txt: "Tu contraseña", c: C.violetSoft, at: s.inicio + 0.9 },
            { n: "2", txt: "Un código de verificación", c: C.turq, at: ev("pop-telefono") },
          ].map((r) => {
            const kk = prog(t, r.at, r.at + 0.5);
            return (
              <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 20, opacity: kk, transform: `translateX(${(1 - kk) * -40}px)`, fontFamily: FONT }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", border: `3px solid ${r.c}`, color: r.c, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 28 }}>{r.n}</div>
                <div style={{ fontSize: 36, fontWeight: 600, color: C.inkSoft }}>{r.txt}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de contraseña */}
      <div style={{ ...card, position: "absolute", left: 790, top: 300, width: 420, height: 450, padding: 36, opacity: card1, transform: `scale(${0.7 + 0.3 * card1})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(139,108,246,0.2)", display: "grid", placeItems: "center" }}>
            <Lock size={38} color={C.violetSoft} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>Contraseña</div>
        </div>
        <div style={{ marginTop: 34, height: 78, borderRadius: 20, background: "rgba(7,11,24,0.75)", border: `2px solid ${nDots > 0 ? C.violetSoft : C.line}`, display: "flex", alignItems: "center", gap: 14, padding: "0 26px" }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: i < nDots ? C.ink : "rgba(148,168,214,0.16)", transform: `scale(${i < nDots ? 1 : 0.7})` }} />
          ))}
        </div>
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14, opacity: tick1 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(79,224,193,0.2)", display: "grid", placeItems: "center", transform: `scale(${tick1})` }}>
            <Check size={30} color={C.turq} stroke={3} />
          </div>
          <div style={{ fontSize: 28, color: C.turq, fontWeight: 700 }}>Paso 1 listo</div>
        </div>
        <div style={{ marginTop: 28, ...bar(240, 14, 0.1) }} />
        <div style={{ marginTop: 14, ...bar(170, 14, 0.07) }} />
      </div>

      {/* "+" */}
      <div style={{ position: "absolute", left: 1226, top: 490, width: 70, height: 70, borderRadius: "50%", background: `linear-gradient(135deg, ${C.violet}, ${C.turqDeep})`, display: "grid", placeItems: "center", transform: `scale(${plus}) rotate(${(1 - plus) * 90}deg)`, boxShadow: "0 0 40px rgba(139,108,246,0.55)", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: "#fff", lineHeight: 1 }}>
        +
      </div>

      {/* Teléfono con código */}
      <div style={{ position: "absolute", left: 1312, top: 250, width: 300, height: 560, opacity: phoneK, transform: `translateY(${(1 - phoneK) * 60}px) scale(${0.8 + 0.2 * phoneK})` }}>
        <div style={{ ...card, width: 300, height: 560, borderRadius: 46, padding: 24, border: `3px solid ${C.lav}55`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 90, height: 10, borderRadius: 10, background: "rgba(148,168,214,0.25)", marginBottom: 34 }} />
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(79,224,193,0.18)", display: "grid", placeItems: "center", position: "relative" }}>
            <Phone size={46} color={C.turq} />
            <svg width="100" height="100" style={{ position: "absolute", left: -8, top: -8 }}>
              <circle cx="50" cy="50" r="46" fill="none" stroke={C.turq} strokeWidth="3" strokeDasharray={289} strokeDashoffset={289 * (1 - ring)} strokeLinecap="round" transform="rotate(-90 50 50)" />
            </svg>
          </div>
          <div style={{ marginTop: 26, fontSize: 26, fontWeight: 800 }}>Código</div>
          <div style={{ fontSize: 18, color: C.muted, marginTop: 4 }}>de verificación</div>
          <div style={{ display: "flex", gap: 8, marginTop: 34 }}>
            {code.split("").map((d, i) => {
              const kk = prog(t, L.inicio + 2.55 + i * 0.14, L.inicio + 2.55 + i * 0.14 + 0.2, BACK);
              return (
                <div key={i} style={{ width: 38, height: 58, borderRadius: 12, background: "rgba(7,11,24,0.8)", border: `2px solid ${i < nCode ? C.turq : C.line}`, display: "grid", placeItems: "center", fontSize: 32, fontWeight: 800, color: C.ink, transform: `scale(${i < nCode ? 0.7 + 0.3 * kk : 1})` }}>
                  {i < nCode ? d : ""}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 36, ...bar(180, 12, 0.1) }} />
          <div style={{ marginTop: 12, ...bar(120, 12, 0.07) }} />
        </div>
      </div>

      {/* Identidad confirmada */}
      <div style={{ position: "absolute", left: 790, top: 800, width: 822, display: "flex", justifyContent: "center", opacity: ok, transform: `translateY(${(1 - ok) * 24}px) scale(${0.85 + 0.15 * ok})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 34px", borderRadius: 999, background: "rgba(79,224,193,0.14)", border: `2px solid ${C.turq}`, fontFamily: FONT, fontSize: 32, fontWeight: 800, color: C.turq }}>
          <Check size={36} color={C.turq} stroke={3} /> Identidad confirmada
        </div>
      </div>
    </Layer>
  );
};

/* ================= ESCENA 3 · ¿Cómo activarla? ================= */
const WX = 660, WY = 180, WW = 1120, WH = 640, CHROME = 60;
const CX = WX, CY = WY + CHROME; // origen del contenido de la ventana

export const Scene3: React.FC<{ t: number }> = ({ t }) => {
  const s = scene(3);
  const steps = [
    { n: 1, label: "Configuración de seguridad", at: line("L3a").inicio },
    { n: 2, label: "Verificación en dos pasos", at: line("L3b").inicio },
    { n: 3, label: "Actívala", at: line("L3c").inicio },
    { n: 4, label: "Método de verificación", at: line("L3d").inicio },
  ];
  const active = steps.reduce((a, st, i) => (t >= st.at - 0.05 ? i : a), -1);
  const winK = prog(t, s.inicio + 0.15, s.inicio + 0.85, E);

  const cSeg = ev("click-seguridad");
  const cFila = ev("click-fila");
  const cOn = ev("toggle-on");
  const cMet = ev("click-metodo");
  const cGoo = ev("click-google");
  const cKey = ev("click-llave");

  /* qué pantalla se ve dentro de la ventana */
  const page = t < cSeg + 0.12 ? 0 : t < line("L3b").inicio + 2.2 ? 1 : t < line("L3d").inicio - 0.05 ? 2 : 3;
  const pageFade = (from: number) => prog(t, from, from + 0.35);

  const nav = [
    { name: "Perfil", I: User },
    { name: "Seguridad", I: Gear },
    { name: "Privacidad", I: Eye },
    { name: "Avisos", I: Bell },
  ];
  const selNav = t >= cSeg;
  const search = typed("verificación en dos pasos", t, line("L3b").inicio + 0.15, 17);
  const rowHi = prog(t, line("L3b").inicio + 1.4, line("L3b").inicio + 1.8);
  const toggle = prog(t, cOn - 0.05, cOn + 0.28, EIO);
  const pickMs = prog(t, cMet, cMet + 0.35, BACK) * (1 - prog(t, cGoo, cGoo + 0.25));
  const pickGo = prog(t, cGoo, cGoo + 0.35, BACK);
  const pickKey = prog(t, cKey, cKey + 0.35, BACK);
  const appSel = Math.max(pickMs, pickGo);

  return (
    <Layer t={t} from={s.inicio} to={s.fin}>
      {/* Columna de pasos */}
      <div style={{ position: "absolute", left: 140, top: 230, width: 470 }}>
        <Kicker text="¿CÓMO ACTIVARLA?" t={t} start={s.inicio + 0.1} />
        <div style={{ height: 22 }} />
        <Words text="Solo 4 pasos" t={t} start={s.inicio + 0.25} size={64} />
        <div style={{ height: 34 }} />
        {steps.map((st, i) => {
          const kk = prog(t, s.inicio + 0.5 + i * 0.12, s.inicio + 1.0 + i * 0.12);
          const isAct = i === active;
          const done = i < active;
          return (
            <div
              key={st.n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                height: 92,
                padding: "0 20px",
                marginBottom: 12,
                borderRadius: 24,
                fontFamily: FONT,
                opacity: kk * (isAct ? 1 : done ? 0.75 : 0.5),
                transform: `translateX(${(1 - kk) * -50 + (isAct ? 12 : 0)}px)`,
                background: isAct ? "linear-gradient(90deg, rgba(139,108,246,0.30), rgba(79,224,193,0.10))" : "transparent",
                border: `2px solid ${isAct ? C.violetSoft : "transparent"}`,
                transition: "none",
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 28, background: done ? C.turq : isAct ? C.violet : "rgba(148,168,214,0.16)", color: done ? "#06131a" : "#fff" }}>
                {done ? <Check size={34} color="#06131a" stroke={3.2} /> : st.n}
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: isAct ? C.ink : C.inkSoft, lineHeight: 1.15 }}>{st.label}</div>
            </div>
          );
        })}
      </div>

      {/* Ventana de interfaz */}
      <div style={{ position: "absolute", left: WX, top: WY, width: WW, height: WH, opacity: winK, transform: `translateY(${(1 - winK) * 50}px) scale(${0.92 + 0.08 * winK})`, ...card, borderRadius: 28, overflow: "hidden" }}>
        <div style={{ height: CHROME, display: "flex", alignItems: "center", gap: 10, padding: "0 24px", background: "rgba(7,11,24,0.6)", borderBottom: `1px solid ${C.line}` }}>
          {["#ff7a6b", "#ffd166", "#4fe0c1"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
          ))}
          <div style={{ marginLeft: 22, flex: 1, height: 34, borderRadius: 17, background: "rgba(148,168,214,0.12)", display: "flex", alignItems: "center", padding: "0 18px", gap: 10, fontSize: 18, color: C.muted }}>
            <Lock size={18} color={C.muted} /> cuenta.ejemplo.com/{page === 0 ? "perfil" : "seguridad"}
          </div>
        </div>
        <div style={{ position: "relative", width: WW, height: WH - CHROME }}>
          {/* navegación lateral */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: "rgba(7,11,24,0.35)", borderRight: `1px solid ${C.line}`, padding: "40px 20px" }}>
            {nav.map((n, i) => {
              const sel = i === 1 && selNav;
              return (
                <div key={n.name} style={{ display: "flex", alignItems: "center", gap: 16, height: 68, marginBottom: 16, padding: "0 18px", borderRadius: 18, background: sel ? "rgba(139,108,246,0.30)" : "transparent", border: `2px solid ${sel ? C.violetSoft : "transparent"}`, fontSize: 26, fontWeight: 600, color: sel ? "#fff" : C.muted }}>
                  <n.I size={32} color={sel ? C.turq : C.muted} />
                  {n.name}
                </div>
              );
            })}
          </div>

          {/* PANTALLA 0 · perfil genérico */}
          {page === 0 && (
            <div style={{ position: "absolute", left: 320, top: 50, right: 40, opacity: 1 - prog(t, cSeg + 0.02, cSeg + 0.12) }}>
              <div style={bar(280, 30, 0.18)} />
              <div style={{ marginTop: 40, display: "flex", gap: 24, alignItems: "center" }}>
                <div style={{ width: 110, height: 110, borderRadius: "50%", background: "rgba(139,108,246,0.25)" }} />
                <div>
                  <div style={bar(260, 20)} />
                  <div style={{ marginTop: 16, ...bar(190, 16, 0.09) }} />
                </div>
              </div>
              <div style={{ marginTop: 50, ...bar(640, 18, 0.1) }} />
              <div style={{ marginTop: 18, ...bar(560, 18, 0.08) }} />
              <div style={{ marginTop: 18, ...bar(600, 18, 0.06) }} />
            </div>
          )}

          {/* PANTALLA 1 · Seguridad + búsqueda */}
          {page === 1 && (
            <div style={{ position: "absolute", left: 320, top: 36, right: 40, opacity: pageFade(cSeg + 0.1) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, height: 66, borderRadius: 20, background: "rgba(7,11,24,0.7)", border: `2px solid ${search ? C.violetSoft : C.line}`, padding: "0 24px", opacity: prog(t, line("L3b").inicio - 0.1, line("L3b").inicio + 0.25) }}>
                <Search size={30} color={C.muted} />
                <div style={{ fontSize: 26, color: search ? C.ink : C.muted }}>{search || "Buscar en seguridad"}{search && search.length < 25 ? "▏" : ""}</div>
              </div>
              {["Contraseña", "Dispositivos conectados", "Verificación en dos pasos", "Actividad reciente"].map((r, i) => {
                const hi = i === 2;
                const dim = 1 - 0.55 * prog(t, line("L3b").inicio + 0.9, line("L3b").inicio + 1.3) * (hi ? 0 : 1);
                return (
                  <div
                    key={r}
                    style={{
                      marginTop: i === 0 ? 22 : 14,
                      height: 84,
                      borderRadius: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 28px",
                      fontSize: 28,
                      fontWeight: 700,
                      background: hi ? `rgba(79,224,193,${0.06 + 0.12 * rowHi})` : "rgba(148,168,214,0.07)",
                      border: `2px solid ${hi && rowHi > 0.1 ? C.turq : "transparent"}`,
                      opacity: i === 0 ? 1 : dim,
                      transform: `scale(${hi ? 1 + 0.02 * rowHi : 1})`,
                      color: hi ? C.ink : C.inkSoft,
                    }}
                  >
                    <span>{r}</span>
                    <span style={{ ...bar(i === 2 ? 110 : 60, 14, 0.1), opacity: hi ? 0 : 1 }} />
                    {hi && <Lock size={32} color={C.turq} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* PANTALLA 2 · interruptor */}
          {page === 2 && (
            <div style={{ position: "absolute", left: 320, top: 36, right: 40, opacity: pageFade(line("L3b").inicio + 2.15) }}>
              <div style={{ ...card, background: "rgba(79,224,193,0.06)", border: `2px solid ${C.turq}`, borderRadius: 28, height: 470, padding: 38 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 70, height: 70, borderRadius: 22, background: "rgba(79,224,193,0.2)", display: "grid", placeItems: "center" }}>
                    <Lock size={42} color={C.turq} />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 800 }}>Verificación en dos pasos</div>
                </div>
                <div style={{ marginTop: 28, ...bar(560, 16, 0.12) }} />
                <div style={{ marginTop: 14, ...bar(430, 16, 0.08) }} />
                <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 34 }}>
                  <div style={{ width: 170, height: 86, borderRadius: 43, position: "relative", background: `rgba(${Math.round(148 + (79 - 148) * toggle)},${Math.round(168 + (224 - 168) * toggle)},${Math.round(214 + (193 - 214) * toggle)},${0.25 + 0.75 * toggle})`, boxShadow: `0 0 ${50 * toggle}px rgba(79,224,193,${0.7 * toggle})` }}>
                    <div style={{ position: "absolute", top: 8, left: 8 + 84 * toggle, width: 70, height: 70, borderRadius: "50%", background: "#fff", boxShadow: "0 6px 14px rgba(0,0,0,0.4)" }} />
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: toggle > 0.5 ? C.turq : C.muted }}>{toggle > 0.5 ? "Activada" : "Desactivada"}</div>
                </div>
                <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 14, opacity: prog(t, cOn + 0.2, cOn + 0.6), fontSize: 26, color: C.turq, fontWeight: 700 }}>
                  <Check size={32} color={C.turq} stroke={3} /> Tu cuenta ahora pide un segundo paso
                </div>
              </div>
            </div>
          )}

          {/* PANTALLA 3 · método (con apps de ejemplo) */}
          {page === 3 && (
            <div style={{ position: "absolute", left: 320, top: 36, right: 40, opacity: pageFade(line("L3d").inicio - 0.05) }}>
              <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 26 }}>Elige un método de verificación</div>
              <div style={{ display: "flex", gap: 24 }}>
                {/* Tarjeta: app autenticadora + ejemplos */}
                <div style={{ width: 470, height: 360, boxSizing: "border-box", padding: 28, borderRadius: 28, background: `rgba(79,224,193,${0.05 + 0.07 * appSel})`, border: `3px solid ${appSel > 0.05 ? C.turq : C.line}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(79,224,193,0.2)", display: "grid", placeItems: "center" }}>
                      <Phone size={40} color={C.turq} />
                    </div>
                    <div style={{ fontSize: 29, fontWeight: 800, lineHeight: 1.1 }}>App autenticadora</div>
                  </div>
                  <div style={{ marginTop: 14, fontSize: 19, color: C.muted, letterSpacing: 2 }}>EJEMPLOS</div>
                  {[
                    { name: "Microsoft Authenticator", sel: pickMs, c: C.violetSoft },
                    { name: "Google Authenticator", sel: pickGo, c: C.turq },
                  ].map((app) => (
                    <div
                      key={app.name}
                      style={{
                        marginTop: 12,
                        height: 80,
                        borderRadius: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "0 18px",
                        boxSizing: "border-box",
                        background: `rgba(${app.c === C.turq ? "79,224,193" : "167,139,250"},${0.07 + 0.16 * app.sel})`,
                        border: `2px solid ${app.sel > 0.05 ? app.c : C.line}`,
                        transform: `scale(${1 + 0.025 * app.sel})`,
                      }}
                    >
                      {/* ícono genérico de autenticador: anillo de código (no es el logo de la marca) */}
                      <svg width="54" height="54" viewBox="0 0 54 54" style={{ flex: "none" }}>
                        <circle cx="27" cy="27" r="22" fill="rgba(7,11,24,0.7)" stroke={app.c} strokeWidth="3" strokeDasharray="100 38" strokeLinecap="round" transform={`rotate(${-90 + t * 40} 27 27)`} />
                        <circle cx="27" cy="27" r="4" fill={app.c} />
                      </svg>
                      <div style={{ flex: 1, fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{app.name}</div>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: app.c, display: "grid", placeItems: "center", transform: `scale(${app.sel})`, flex: "none" }}>
                        <Check size={22} color="#06131a" stroke={3.4} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Tarjeta: llave de seguridad */}
                <div style={{ width: 260, height: 360, boxSizing: "border-box", padding: 28, borderRadius: 28, position: "relative", background: `rgba(167,139,250,${0.07 + 0.12 * pickKey})`, border: `3px solid ${pickKey > 0.05 ? C.violetSoft : C.line}`, transform: `scale(${1 + 0.03 * pickKey})` }}>
                  <div style={{ width: 90, height: 90, borderRadius: 28, background: "rgba(139,108,246,0.22)", display: "grid", placeItems: "center" }}>
                    <Key size={56} color={C.violetSoft} />
                  </div>
                  <div style={{ marginTop: 24, fontSize: 28, fontWeight: 800, lineHeight: 1.15 }}>Llave de seguridad</div>
                  <div style={{ marginTop: 10, fontSize: 20, color: C.muted, lineHeight: 1.3 }}>Dispositivo físico USB o NFC</div>
                  <div style={{ position: "absolute", top: 18, right: 18, width: 46, height: 46, borderRadius: "50%", background: C.violetSoft, display: "grid", placeItems: "center", transform: `scale(${pickKey})` }}>
                    <Check size={28} color="#10092b" stroke={3.4} />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 24, fontSize: 22, color: C.muted, textAlign: "center", opacity: prog(t, cKey + 0.5, cKey + 1.0) }}>
                Según las opciones disponibles en cada servicio
              </div>
            </div>
          )}
        </div>
      </div>

      <Cursor
        t={t}
        clicks={[cSeg, cFila, cOn, cMet]}
        keys={[
          [line("L3a").inicio + 0.2, 1500, 760],
          [cSeg - 0.05, CX + 140, CY + 230],
          [cSeg + 0.2, CX + 140, CY + 230],
          [cFila - 0.65, CX + 700, CY + 420],
          [cFila, CX + 700, CY + 420],
          [cFila + 0.25, CX + 700, CY + 420],
          [cOn - 0.05, CX + 330 + 85 + 40, CY + 36 + 440 / 2 + 20],
          [cOn + 0.1, CX + 330 + 85 + 40, CY + 36 + 440 / 2 + 20],
          [line("L3d").inicio + 1.0, CX + 330 + 250, CY + 36 + 250],
          [cMet - 0.35, CX + 330 + 250, CY + 36 + 250],
          [cMet + 0.15, CX + 330 + 250, CY + 36 + 250],
          [cGoo - 0.3, CX + 330 + 250, CY + 36 + 340],
          [cGoo + 0.15, CX + 330 + 250, CY + 36 + 340],
          [cKey - 0.35, CX + 330 + 625, CY + 36 + 250],
          [cKey + 0.25, CX + 330 + 625, CY + 36 + 250],
        ]}
      />
    </Layer>
  );
};

/* ================= ESCENA 4 · Recomendación final + cierre ================= */
export const Scene4: React.FC<{ t: number }> = ({ t }) => {
  const s = scene(4);
  const a = line("L4a");
  const b = line("L4b");
  const logoAt = b.fin + 0.2;
  const textOut = logoAt - 0.1;
  const logoK = prog(t, logoAt + 0.4, logoAt + 1.2, E);
  const glowTxt = prog(t, b.inicio, b.inicio + 0.6);
  return (
    <Layer t={t} from={s.inicio} to={s.fin + 1}>
      <div style={{ position: "absolute", left: 140, top: 270, width: 900 }}>
        <Kicker text="RECUERDA" t={t} start={a.inicio - 0.1} outAt={textOut} color={C.coral} />
        <div style={{ height: 30 }} />
        <Words text="Una contraseña no siempre es suficiente" t={t} start={a.inicio} size={72} stagger={0.1} outAt={textOut} />
        <div style={{ height: 48 }} />
        <div style={{ opacity: glowTxt }}>
          <Words text="Añade una segunda capa de protección" t={t} start={b.inicio} size={58} stagger={0.1} weight={800} gradient outAt={textOut} />
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 40, opacity: prog(t, b.inicio + 1.3, b.inicio + 1.8) * (1 - prog(t, textOut, textOut + 0.4)) }}>
          {[
            { I: Lock, t: "Contraseña", c: C.violetSoft },
            { I: Phone, t: "Código", c: C.turq },
          ].map((x, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 26px", borderRadius: 999, border: `2px solid ${x.c}`, fontFamily: FONT, fontSize: 28, fontWeight: 700, color: x.c, background: "rgba(16,26,51,0.7)" }}>
              <x.I size={32} color={x.c} /> {x.t}
            </div>
          ))}
        </div>
      </div>

      {/* Alerta sobre la contraseña sola */}
      <CenterIcons t={t} />
      <AlertBadge t={t} />

      {/* Cierre con la identidad visual */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", fontFamily: FONT, opacity: logoK, transform: `translateY(${(1 - logoK) * 30}px)` }}>
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: 2, color: C.ink }}>
          PAUSA · VERIFICA · <span style={{ background: `linear-gradient(90deg, ${C.turq}, ${C.violetSoft})`, WebkitBackgroundClip: "text", color: "transparent" }}>ACTÚA</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 40, fontWeight: 500, color: C.inkSoft, letterSpacing: 1 }}>Sé un guardián digital</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 28, padding: "10px 26px", borderRadius: 999, background: "rgba(79,224,193,0.12)", border: `1px solid ${C.turq}`, fontSize: 26, fontWeight: 700, color: C.turq }}>
          <Sparkle size={28} color={C.turq} /> Guardián Digital
        </div>
      </div>
    </Layer>
  );
};

const AlertBadge: React.FC<{ t: number }> = ({ t }) => {
  const a = line("L4a");
  const b = line("L4b");
  const k = prog(t, a.inicio + 0.7, a.inicio + 1.1, BACK) * (1 - prog(t, b.inicio + 0.7, b.inicio + 1.0));
  if (k <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1330 - 42 + 150, top: 505 - 250, width: 84, height: 84, borderRadius: "50%", background: C.coral, display: "grid", placeItems: "center", transform: `scale(${k})`, boxShadow: "0 0 50px rgba(255,122,107,0.65)" }}>
      <Alert size={50} color="#2a0c08" stroke={2.4} />
    </div>
  );
};

const CenterIcons: React.FC<{ t: number }> = ({ t }) => {
  const a = line("L4a");
  const segunda = ev("segunda-capa");
  const logoAt = line("L4b").fin + 0.2;
  const lockK = prog(t, a.inicio + 0.3, a.inicio + 0.8, BACK) * (1 - prog(t, segunda - 0.1, segunda + 0.35)) ;
  const shake = Math.sin(t * 38) * 6 * prog(t, a.inicio + 0.6, a.inicio + 1.0) * (1 - prog(t, segunda - 0.2, segunda + 0.3));
  const node = prog(t, segunda + 0.15, segunda + 0.75, BACK) * (1 - prog(t, logoAt - 0.1, logoAt + 0.4));
  return (
    <>
      <div style={{ position: "absolute", left: 1330 - 70 + shake, top: 505 - 60, opacity: lockK, transform: `scale(${lockK})` }}>
        <Lock size={140} color={C.lav} stroke={1.6} />
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: node }}>
        <line x1={1330} y1={505} x2={1640} y2={330} stroke={C.turq} strokeWidth="3" strokeDasharray="8 10" />
        <line x1={1330} y1={505} x2={1020} y2={690} stroke={C.violetSoft} strokeWidth="3" strokeDasharray="8 10" />
      </svg>
      <div style={{ position: "absolute", left: 1640 - 56, top: 330 - 56, width: 112, height: 112, borderRadius: "50%", background: "rgba(79,224,193,0.18)", border: `3px solid ${C.turq}`, display: "grid", placeItems: "center", opacity: node, transform: `scale(${node})` }}>
        <Phone size={60} color={C.turq} />
      </div>
      <div style={{ position: "absolute", left: 1020 - 56, top: 690 - 56, width: 112, height: 112, borderRadius: "50%", background: "rgba(139,108,246,0.2)", border: `3px solid ${C.violetSoft}`, display: "grid", placeItems: "center", opacity: node, transform: `scale(${node})` }}>
        <Lock size={60} color={C.violetSoft} />
      </div>
    </>
  );
};

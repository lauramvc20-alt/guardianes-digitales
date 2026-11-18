import React from "react";
import { BACK, C, E, EIO, FONT, ev, line, prog, scene } from "./theme";
import { Alert, Box, Check, ImageIcon, Form, KeyWord, Lock, Pause, PhoneCall, PhoneDown, Search, Sparkle, User } from "./icons";
import { Kicker, Layer, Words } from "./ui";
import { Pose, Robot } from "./Robot";

const card: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(18,29,58,0.96), rgba(12,20,42,0.96))",
  border: `1px solid ${C.line}`,
  borderRadius: 30,
  boxShadow: "0 40px 80px -30px rgba(3,6,16,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
  fontFamily: FONT,
  color: C.ink,
};
const bar = (w: number, h = 14, o = 0.14): React.CSSProperties => ({ width: w, height: h, borderRadius: h, background: `rgba(201,184,255,${o})` });
const pop = (t: number, at: number, d = 0.5) => prog(t, at, at + d, BACK);

/* Efecto "falsificado": jitter + aberración cromática que se apaga */
const glitch = (t: number, a: number, d = 1.2) => {
  const k = t >= a && t <= a + d ? 1 - (t - a) / d : 0;
  return {
    k,
    x: Math.sin(t * 70) * 14 * k,
    filter: k > 0 ? `drop-shadow(${8 * k}px 0 0 rgba(255,122,107,0.85)) drop-shadow(${-8 * k}px 0 0 rgba(79,224,193,0.85))` : "none",
  };
};

const Phone: React.FC<{ x: number; y: number; w: number; h: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, y, w, h, style, children }) => (
  <div style={{ ...card, position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 54, border: `3px solid ${C.lav}55`, overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", left: "50%", top: 14, width: 110, height: 12, marginLeft: -55, borderRadius: 12, background: "rgba(148,168,214,0.25)" }} />
    <div style={{ position: "absolute", inset: 0, paddingTop: 52 }}>{children}</div>
  </div>
);

/* Columna izquierda de cada escena */
const Left: React.FC<{ t: number; s: number; kicker: string; l1: string; l2: string; sub: string; color?: string }> = ({ t, s, kicker, l1, l2, sub, color }) => {
  const a = scene(s).inicio;
  return (
    <div style={{ position: "absolute", left: 140, top: 190, width: 700 }}>
      <Kicker text={kicker} t={t} start={a + 0.15} color={color} />
      <div style={{ height: 26 }} />
      <Words text={l1} t={t} start={a + 0.3} size={74} />
      <Words text={l2} t={t} start={a + 0.5} size={74} gradient />
      <div style={{ height: 20 }} />
      <Words text={sub} t={t} start={a + 0.9} size={36} weight={500} color={C.inkSoft} stagger={0.07} />
    </div>
  );
};

/* ================= ESCENA 1 · Gancho ================= */
export const Scene1: React.FC<{ t: number }> = ({ t }) => {
  const s = scene(1);
  const gl = ev("glitch");
  const g = glitch(t, gl, 1.4);
  const flag = pop(t, gl + 0.5);
  const cards = [
    { at: ev("pop-captura"), x: 900, y: 330, rot: -7, label: "Una captura", I: ImageIcon },
    { at: ev("pop-form"), x: 1180, y: 290, rot: 0, label: "Un formulario", I: Form },
    { at: ev("pop-voz"), x: 1460, y: 330, rot: 7, label: "Una voz", I: PhoneCall },
  ];
  return (
    <Layer t={t} from={0} to={s.fin} dx={-60}>
      <div style={{ position: "absolute", left: 140, top: 190, width: 700 }}>
        <Kicker text="TU DÍA DIGITAL" t={t} start={0.3} />
        <div style={{ height: 26 }} />
        <Words text="Todo se puede" t={t} start={0.5} size={74} />
        <Words text="falsificar" t={t} start={0.75} size={74} gradient />
        <div style={{ height: 20 }} />
        <Words text="Tres momentos, tres hábitos" t={t} start={line("L1c").inicio - 0.2} size={36} weight={500} color={C.inkSoft} stagger={0.1} />
      </div>
      {cards.map((c, i) => {
        const k = pop(t, c.at - 0.1, 0.6);
        return (
          <div key={i} style={{ position: "absolute", left: c.x, top: c.y, width: 250, height: 340, opacity: k, transform: `translate(${g.x * (i % 2 ? -1 : 1)}px, ${(1 - k) * 60}px) rotate(${c.rot}deg) scale(${0.7 + 0.3 * k})`, filter: g.filter }}>
            <div style={{ ...card, width: 250, height: 340, padding: 24, boxSizing: "border-box" }}>
              <div style={{ width: 62, height: 62, borderRadius: 20, background: "rgba(139,108,246,0.22)", display: "grid", placeItems: "center" }}>
                <c.I size={38} color={C.violetSoft} />
              </div>
              {i === 0 && (
                <>
                  <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(79,224,193,0.25)", display: "grid", placeItems: "center" }}><Check size={26} color={C.turq} stroke={3} /></div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>Pago exitoso</div>
                  </div>
                  <div style={{ marginTop: 22, fontSize: 38, fontWeight: 800 }}>$120.000</div>
                  <div style={{ marginTop: 18, ...bar(150, 12, 0.1) }} />
                </>
              )}
              {i === 1 && (
                <>
                  <div style={{ marginTop: 26, ...bar(170, 16, 0.2) }} />
                  {[0, 1, 2].map((r) => <div key={r} style={{ marginTop: 16, height: 46, borderRadius: 12, background: "rgba(7,11,24,0.7)", border: `1px solid ${C.line}` }} />)}
                </>
              )}
              {i === 2 && (
                <div style={{ marginTop: 46, display: "flex", alignItems: "center", gap: 6, height: 90 }}>
                  {Array.from({ length: 11 }, (_, b) => <div key={b} style={{ width: 11, borderRadius: 6, background: C.turq, height: 18 + Math.abs(Math.sin(t * 7 + b * 0.8)) * 66 }} />)}
                </div>
              )}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: -26, textAlign: "center" }}>
                <span style={{ display: "inline-block", padding: "8px 22px", borderRadius: 999, background: "rgba(16,26,51,0.95)", border: `1px solid ${C.line}`, fontSize: 22, fontWeight: 700, fontFamily: FONT, color: C.ink }}>{c.label}</span>
              </div>
              <div style={{ position: "absolute", top: -22, right: -18, padding: "8px 18px", borderRadius: 999, background: C.coral, color: "#2a0c08", fontWeight: 800, fontSize: 24, fontFamily: FONT, transform: `scale(${flag}) rotate(8deg)` }}>¿REAL?</div>
            </div>
          </div>
        );
      })}
    </Layer>
  );
};

/* ================= ESCENA 2 · Vendes algo ================= */
export const Scene2: React.FC<{ t: number }> = ({ t }) => {
  const s = scene(2);
  const tComp = ev("comprobante");
  const tImg = ev("imagen");
  const tApp = ev("app");
  const tLle = ev("llego");
  const ph1 = pop(t, s.inicio + 0.2, 0.7);
  const dim = prog(t, tApp, tApp + 0.5);
  const ph2 = prog(t, tApp - 0.2, tApp + 0.6, E);
  const g = glitch(t, tImg, 1.0);
  const stamp = pop(t, tImg + 0.1);
  const row = prog(t, tLle, tLle + 0.5, E);
  const chip = pop(t, tLle + 0.9);
  const scan = t >= tApp && t < tLle;
  return (
    <Layer t={t} from={s.inicio} to={s.fin}>
      <Left t={t} s={2} kicker="1 · VENDES ALGO" l1="Confirma" l2="el pago" sub="en tu propia app" />
      {/* Chat */}
      <Phone x={920} y={140} w={380} h={720} style={{ opacity: ph1 * (1 - 0.55 * dim), transform: `scale(${(0.9 + 0.1 * ph1) * (1 - 0.05 * dim)}) translateX(${-dim * 20}px)` }}>
        <div style={{ padding: "0 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${C.violet}, ${C.turqDeep})`, display: "grid", placeItems: "center" }}><User size={28} color="#fff" /></div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>Comprador</div>
          </div>
          <div style={{ marginTop: 22, opacity: pop(t, s.inicio + 0.7), transform: `translateY(${(1 - pop(t, s.inicio + 0.7)) * 20}px)` }}>
            <div style={{ display: "inline-block", maxWidth: 270, padding: "14px 20px", borderRadius: "22px 22px 22px 6px", background: "rgba(148,168,214,0.16)", fontSize: 22 }}>Hola, ¿sigue disponible?</div>
          </div>
          <div style={{ marginTop: 14, textAlign: "right", opacity: pop(t, tComp - 0.8), transform: `translateY(${(1 - pop(t, tComp - 0.8)) * 20}px)` }}>
            <div style={{ display: "inline-block", maxWidth: 270, padding: "14px 20px", borderRadius: "22px 22px 6px 22px", background: "rgba(139,108,246,0.35)", fontSize: 22 }}>Listo, ya te pagué</div>
          </div>
          <div style={{ marginTop: 18, opacity: pop(t, tComp), transform: `translate(${g.x}px, ${(1 - pop(t, tComp)) * 40}px) scale(${0.85 + 0.15 * pop(t, tComp)})`, filter: g.filter, position: "relative" }}>
            <div style={{ ...card, borderRadius: 24, padding: 22, background: "rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(79,224,193,0.25)", display: "grid", placeItems: "center" }}><Check size={30} color={C.turq} stroke={3} /></div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>Transferencia exitosa</div>
              </div>
              <div style={{ marginTop: 18, fontSize: 44, fontWeight: 800 }}>$120.000</div>
              <div style={{ marginTop: 12, ...bar(190, 12, 0.1) }} />
              <div style={{ marginTop: 10, ...bar(130, 12, 0.07) }} />
            </div>
            <div style={{ position: "absolute", left: 60, top: 70, padding: "10px 30px", borderRadius: 16, border: `5px solid ${C.coral}`, color: C.coral, fontFamily: FONT, fontWeight: 900, fontSize: 52, background: "rgba(7,11,24,0.55)", transform: `rotate(-12deg) scale(${stamp})`, opacity: stamp }}>¿REAL?</div>
          </div>
        </div>
      </Phone>
      {/* Tu app */}
      <Phone x={1380} y={140} w={380} h={720} style={{ opacity: ph2, transform: `translateX(${(1 - ph2) * 140}px)`, border: `3px solid ${C.turq}88` }}>
        <div style={{ padding: "0 22px" }}>
          <div style={{ fontSize: 26, fontWeight: 800, paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>Tus movimientos</div>
          <div style={{ marginTop: 22, height: 74, display: "flex", alignItems: "center", gap: 16, opacity: scan ? 1 : 0, transition: "none" }}>
            <div style={{ transform: `rotate(${Math.sin(t * 5) * 18}deg)` }}><Search size={44} color={C.turq} /></div>
            <div style={{ fontSize: 24, color: C.muted }}>Revisando…</div>
          </div>
          <div style={{ marginTop: scan ? 0 : -74, position: "relative" }}>
            <div style={{ height: 88, borderRadius: 22, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", background: "rgba(79,224,193,0.16)", border: `2px solid ${C.turq}`, opacity: row, transform: `translateY(${(1 - row) * -30}px)` }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.turq, display: "grid", placeItems: "center" }}><Check size={28} color="#06131a" stroke={3.4} /></div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>+ $120.000</div>
                <div style={{ fontSize: 18, color: C.turq }}>Pago recibido</div>
              </div>
            </div>
          </div>
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ marginTop: 16, height: 74, borderRadius: 20, background: "rgba(148,168,214,0.07)", display: "flex", alignItems: "center", padding: "0 18px", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(148,168,214,0.14)" }} />
              <div><div style={bar(120, 12, 0.14)} /><div style={{ marginTop: 8, ...bar(80, 10, 0.08) }} /></div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 34, opacity: chip, transform: `translateY(${(1 - chip) * 30}px) scale(${0.8 + 0.2 * chip})`, display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 26px", borderRadius: 999, background: "rgba(79,224,193,0.15)", border: `2px solid ${C.turq}`, fontSize: 24, fontWeight: 800, color: C.turq }}>
              <Box size={32} color={C.turq} /> Entrega el producto
            </div>
          </div>
        </div>
      </Phone>
    </Layer>
  );
};

/* ================= ESCENA 3 · Una encuesta ================= */
export const Scene3: React.FC<{ t: number }> = ({ t }) => {
  const s = scene(3);
  const tEnc = ev("encuesta");
  const tPara = ev("para-que");
  const L3b = line("L3b");
  const k = pop(t, tEnc - 0.1, 0.7);
  const tEng = ev("engano");
  const g = glitch(t, tEng, 1.0);
  const stamp = pop(t, tEng + 0.05);
  const idx = t < tPara ? -1 : Math.min(1, Math.floor(((t - tPara) / Math.max(0.5, L3b.fin - tPara)) * 2));
  const ok = [{ n: "Nombre completo" }, { n: "Correo electrónico" }];
  const bad = [
    { n: "Contraseña", at: ev("contrasenas"), v: "••••••••" },
    { n: "Código del SMS", at: ev("codigos"), v: "4 8 2 9 1 6" },
    { n: "Número de tarjeta", at: ev("bancarios"), v: "•••• •••• ••••" },
  ];
  return (
    <Layer t={t} from={s.inicio} to={s.fin}>
      <Left t={t} s={3} kicker="2 · UNA ENCUESTA" l1="¿Para qué" l2="lo necesitan?" sub="Cada dato debe tener un motivo" />
      <div style={{ position: "absolute", left: 1010, top: 130, width: 640, opacity: k, transform: `translate(${g.x}px, 0) scale(${0.88 + 0.12 * k})`, filter: g.filter }}>
        <div style={{ ...card, padding: 34 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(139,108,246,0.22)", display: "grid", placeItems: "center" }}><Form size={38} color={C.violetSoft} /></div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>Encuesta rápida</div>
          </div>
          {ok.map((f, i) => {
            const a = pop(t, tEnc + 0.3 + i * 0.25, 0.4);
            const hi = idx === i;
            return (
              <div key={f.n} style={{ marginTop: 20, height: 74, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", background: "rgba(7,11,24,0.7)", border: `2px solid ${hi ? C.violetSoft : C.line}`, opacity: a, transform: `translateX(${(1 - a) * 40}px) scale(${hi ? 1.03 : 1})` }}>
                <div style={{ fontSize: 26, color: C.inkSoft }}>{f.n}</div>
                <div style={{ padding: "6px 18px", borderRadius: 999, background: C.violetSoft, color: "#10092b", fontWeight: 800, fontSize: 22, transform: `scale(${hi ? 1 : 0})`, opacity: hi ? 1 : 0 }}>¿para qué?</div>
              </div>
            );
          })}
          {bad.map((f) => {
            const a = pop(t, f.at, 0.4);
            const shake = t > f.at && t < f.at + 0.4 ? Math.sin(t * 60) * 8 : 0;
            return (
              <div key={f.n} style={{ marginTop: 20, height: 74, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", background: "rgba(255,122,107,0.12)", border: `2px solid ${C.coral}`, opacity: a, transform: `translateX(${(1 - a) * 60 + shake}px)` }}>
                <div style={{ fontSize: 26, color: C.ink }}>{f.n}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 24, letterSpacing: 3, color: C.coral }}>{f.v}</div>
                  <Alert size={34} color={C.coral} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 24, height: 70, borderRadius: 18, background: "rgba(139,108,246,0.35)", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 800 }}>Enviar</div>
        </div>
        <div style={{ position: "absolute", left: 120, top: 330, padding: "12px 38px", borderRadius: 18, border: `6px solid ${C.coral}`, color: C.coral, fontFamily: FONT, fontWeight: 900, fontSize: 72, background: "rgba(7,11,24,0.7)", transform: `rotate(-10deg) scale(${stamp})`, opacity: stamp }}>ENGAÑO</div>
      </div>
    </Layer>
  );
};

/* ================= ESCENA 4 · Un familiar ================= */
export const Scene4: React.FC<{ t: number }> = ({ t }) => {
  const s = scene(4);
  const tCl = ev("clonar");
  const tCu = ev("cuelga");
  const tLl = ev("llamalo");
  const tPa = ev("palabra");
  const ph = pop(t, s.inicio + 0.2, 0.7);
  const incoming = t < tCu + 0.15;
  const fade = prog(t, tCu + 0.05, tCu + 0.4);
  const cloned = prog(t, tCl, tCl + 0.4);
  const g = glitch(t, tCl, 1.0);
  const speech = pop(t, line("L4a").inicio + 0.9) * (1 - prog(t, tCu - 0.2, tCu + 0.2));
  const chip = pop(t, tCl + 0.15) * (1 - prog(t, tCu - 0.2, tCu + 0.2));
  const key = pop(t, tPa - 0.05, 0.6);
  const calling = prog(t, tLl, tLl + 0.4);
  const ring = ((t - tLl) % 1) / 1;
  return (
    <Layer t={t} from={s.inicio} to={s.fin}>
      <Left t={t} s={4} kicker="3 · UN FAMILIAR" l1="Cuelga y" l2="llama tú" sub="a su número de siempre" />
      <Phone x={1110} y={130} w={400} h={720} style={{ opacity: ph, transform: `scale(${0.9 + 0.1 * ph}) translateX(${g.x * 0.5}px)`, filter: g.filter }}>
        {/* Llamada entrante */}
        <div style={{ position: "absolute", inset: 0, paddingTop: 52, opacity: 1 - fade, display: incoming || fade < 1 ? "block" : "none" }}>
          <div style={{ textAlign: "center", marginTop: 40, fontSize: 24, color: C.muted }}>Llamada entrante…</div>
          <div style={{ width: 130, height: 130, borderRadius: "50%", margin: "24px auto 0", background: `linear-gradient(135deg, ${C.violet}, ${C.turqDeep})`, display: "grid", placeItems: "center", boxShadow: `0 0 ${30 + Math.sin(t * 6) * 12}px rgba(139,108,246,0.6)` }}><User size={76} color="#fff" /></div>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 40, fontWeight: 800 }}>Mamá</div>
          <div style={{ marginTop: 34, display: "flex", justifyContent: "center", alignItems: "center", gap: 7, height: 100 }}>
            {Array.from({ length: 17 }, (_, b) => {
              const amp = 14 + Math.abs(Math.sin(t * 8 + b * 0.7)) * 68;
              const jag = cloned * (b % 2 ? 1.5 : 0.5);
              return <div key={b} style={{ width: 10, height: amp * (1 + (jag - 0.5 * cloned) * 0.3), borderRadius: 5, background: cloned > 0.2 ? C.coral : C.turq }} />;
            })}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, display: "flex", justifyContent: "center", gap: 90 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: C.coral, display: "grid", placeItems: "center", transform: `scale(${t > tCu - 0.1 && t < tCu + 0.2 ? 0.88 : 1})`, boxShadow: t > tCu - 0.6 ? `0 0 ${24 + Math.sin(t * 9) * 10}px rgba(255,122,107,0.8)` : "none" }}><PhoneDown size={56} color="#2a0c08" /></div>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: C.turqDeep, display: "grid", placeItems: "center", opacity: 0.6 }}><PhoneCall size={52} color="#06131a" /></div>
          </div>
        </div>
        {/* Contactos */}
        <div style={{ position: "absolute", inset: 0, paddingTop: 52, opacity: fade, padding: "52px 26px 0" }}>
          <div style={{ marginTop: 20, fontSize: 28, fontWeight: 800, paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>Mis contactos</div>
          <div style={{ marginTop: 30, ...card, borderRadius: 26, padding: 26, border: `2px solid ${C.turq}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${C.violet}, ${C.turqDeep})`, display: "grid", placeItems: "center" }}><User size={48} color="#fff" /></div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800 }}>Mamá</div>
                <div style={{ marginTop: 6, padding: "4px 14px", borderRadius: 999, background: "rgba(79,224,193,0.18)", color: C.turq, fontWeight: 700, fontSize: 19, display: "inline-block" }}>Número guardado</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", position: "relative" }}>
            {[0, 1].map((r) => {
              const p = (ring + r * 0.5) % 1;
              return calling > 0.1 ? <div key={r} style={{ position: "absolute", top: 0, width: 96 + p * 130, height: 96 + p * 130, marginTop: -p * 65, borderRadius: "50%", border: `3px solid ${C.turq}`, opacity: (1 - p) * 0.8 }} /> : null;
            })}
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: C.turq, display: "grid", placeItems: "center", transform: `scale(${t > tLl - 0.1 && t < tLl + 0.25 ? 0.88 : 1})`, position: "relative" }}><PhoneCall size={54} color="#06131a" /></div>
          </div>
          <div style={{ textAlign: "center", marginTop: 34, fontSize: 24, color: C.turq, opacity: calling, fontWeight: 700 }}>Llamando a tu número de siempre…</div>
        </div>
      </Phone>
      {/* Mensaje urgente */}
      <div style={{ position: "absolute", left: 1540, top: 260, opacity: speech, transform: `scale(${0.6 + 0.4 * speech}) rotate(4deg)`, transformOrigin: "0% 100%" }}>
        <div style={{ padding: "16px 26px", borderRadius: "26px 26px 26px 6px", background: "rgba(255,122,107,0.2)", border: `2px solid ${C.coral}`, fontFamily: FONT, fontSize: 28, fontWeight: 800, color: C.ink, width: 250, lineHeight: 1.2 }}>¡Necesito dinero, urgente!</div>
      </div>
      <div style={{ position: "absolute", left: 1540, top: 520, opacity: chip, transform: `scale(${0.6 + 0.4 * chip})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 999, background: "rgba(7,11,24,0.9)", border: `2px solid ${C.coral}`, fontFamily: FONT, fontSize: 26, fontWeight: 800, color: C.coral }}>
          <Sparkle size={30} color={C.coral} /> Voz clonada con IA
        </div>
      </div>
      {/* Palabra clave */}
      <div style={{ position: "absolute", left: 1560, top: 380, width: 310, opacity: key, transform: `translateY(${(1 - key) * 40}px) scale(${0.8 + 0.2 * key})` }}>
        <div style={{ ...card, padding: 22, textAlign: "center", border: `2px solid ${C.violetSoft}` }}>
          <div style={{ width: 70, height: 70, borderRadius: 22, margin: "0 auto", background: "rgba(139,108,246,0.25)", display: "grid", placeItems: "center" }}><KeyWord size={46} color={C.violetSoft} /></div>
          <div style={{ marginTop: 14, fontSize: 28, fontWeight: 800, lineHeight: 1.15 }}>Palabra clave familiar</div>
          <div style={{ marginTop: 10, fontSize: 30, letterSpacing: 6, color: C.violetSoft }}>• • • • • •</div>
        </div>
      </div>
    </Layer>
  );
};

/* ================= ESCENA 5 · Cierre ================= */
export const Scene5: React.FC<{ t: number }> = ({ t }) => {
  const s = scene(5);
  const pills = [
    { txt: "PAUSA", I: Pause, c: C.violetSoft, at: ev("pausa") },
    { txt: "VERIFICA", I: Search, c: C.turq, at: ev("verifica") },
    { txt: "ACTÚA", I: Check, c: C.yellow, at: ev("actua") },
  ];
  const end = line("L5b");
  const sg = prog(t, end.inicio - 0.1, end.inicio + 0.6, E);
  return (
    <Layer t={t} from={s.inicio} to={s.fin + 2} dx={60}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 34 }}>
        {pills.map((p) => {
          const k = pop(t, p.at - 0.1, 0.6);
          return (
            <div key={p.txt} style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 40px", borderRadius: 999, background: "rgba(16,26,51,0.92)", border: `3px solid ${p.c}`, fontFamily: FONT, fontSize: 52, fontWeight: 900, letterSpacing: 2, color: C.ink, opacity: k, transform: `translateY(${(1 - k) * 50}px) scale(${0.7 + 0.3 * k})`, boxShadow: `0 0 ${40 * k}px ${p.c}55` }}>
              <p.I size={56} color={p.c} stroke={2.4} />
              {p.txt}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 900, top: 540, opacity: sg, transform: `translateX(${(1 - sg) * 50}px)`, fontFamily: FONT, color: C.ink }}>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05, letterSpacing: -1 }}>
          Sé un{" "}
          <span style={{ background: `linear-gradient(90deg, ${C.turq}, ${C.violetSoft})`, WebkitBackgroundClip: "text", color: "transparent" }}>guardián digital</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 28, padding: "10px 26px", borderRadius: 999, background: "rgba(79,224,193,0.12)", border: `1px solid ${C.turq}`, fontSize: 26, fontWeight: 700, color: C.turq }}>
          <Sparkle size={28} color={C.turq} /> Guardián Digital · PVA
        </div>
      </div>
    </Layer>
  );
};

/* ---------- RO-BIT: guía que acompaña la historia ---------- */
export const poseAt = (t: number): Pose => {
  const [s1, s2, s3, s4, s5] = [1, 2, 3, 4, 5].map(scene);
  if (t >= s5.inicio) return "celebration";
  if (t >= s4.inicio) return t >= ev("palabra") ? "feedback" : t >= ev("cuelga") ? "explain" : "warning";
  if (t >= s3.inicio) return t >= ev("contrasenas") - 0.2 ? "warning" : t >= ev("para-que") ? "reflection" : "explain";
  if (t >= s2.inicio) return t >= ev("llego") ? "feedback" : t >= ev("imagen") ? "warning" : "explain";
  return t >= ev("glitch") ? "warning" : "welcome";
};

export const Guide: React.FC<{ t: number }> = ({ t }) => {
  const s5 = scene(5).inicio;
  const move = prog(t, s5 - 0.1, s5 + 0.9, EIO);
  const x = 150 + (560 - 150) * move;
  const y = 610 + (500 - 610) * move;
  const size = 250 + 60 * move;
  const inn = prog(t, 0.4, 1.1, BACK);
  const out = 1 - prog(t, scene(5).fin + 1.2, scene(5).fin + 1.8);
  const pose = poseAt(t);
  // pequeño "salto" al cambiar de pose
  const changed = [scene(2).inicio, ev("imagen"), ev("llego"), scene(3).inicio, ev("para-que"), ev("contrasenas") - 0.2, scene(4).inicio, ev("cuelga"), ev("palabra"), s5, ev("glitch")]
    .map((c) => (t >= c && t < c + 0.35 ? Math.sin(((t - c) / 0.35) * Math.PI) : 0))
    .reduce((a, b) => Math.max(a, b), 0);
  return (
    <div style={{ position: "absolute", left: x, top: y - changed * 22, opacity: inn * out, transform: `scale(${inn * (1 + changed * 0.06)})`, transformOrigin: "50% 100%" }}>
      <Robot pose={pose} t={t} size={size} />
    </div>
  );
};

export const StepDots: React.FC<{ t: number }> = ({ t }) => {
  const k = prog(t, scene(2).inicio, scene(2).inicio + 0.6) * (1 - prog(t, scene(5).inicio - 0.1, scene(5).inicio + 0.3));
  const cur = t >= scene(4).inicio ? 3 : t >= scene(3).inicio ? 2 : 1;
  return (
    <div style={{ position: "absolute", right: 140, top: 66, display: "flex", gap: 14, opacity: k, fontFamily: FONT }}>
      {[1, 2, 3].map((n) => (
        <div key={n} style={{ width: 52, height: 52, borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 26, background: n < cur ? C.turq : n === cur ? C.violet : "rgba(148,168,214,0.16)", color: n < cur ? "#06131a" : "#fff", transform: `scale(${n === cur ? 1.12 : 1})` }}>
          {n < cur ? <Check size={30} color="#06131a" stroke={3.2} /> : n}
        </div>
      ))}
    </div>
  );
};

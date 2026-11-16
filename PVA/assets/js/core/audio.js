/* ==========================================================================
   PVA · Sonidos opcionales (sintetizados, sin archivos externos)
   Nunca se reproduce audio automáticamente: requiere acción del usuario.
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var ctx = null;
  var enabled = false;

  function ensureContext() {
    if (ctx) return ctx;
    var Ctor = global.AudioContext || global.webkitAudioContext;
    if (!Ctor) return null;
    try { ctx = new Ctor(); } catch (e) { ctx = null; }
    return ctx;
  }

  function tone(freq, start, duration, type, gainValue) {
    var audio = ensureContext();
    if (!audio) return;
    var osc = audio.createOscillator();
    var gain = audio.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, audio.currentTime + start);
    gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(gainValue || 0.06, audio.currentTime + start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(audio.currentTime + start);
    osc.stop(audio.currentTime + start + duration + 0.02);
  }

  var scores = {
    tap: [[520, 0, 0.07, "sine", 0.035]],
    ok: [[523.25, 0, 0.11, "sine", 0.05], [783.99, 0.09, 0.14, "sine", 0.045]],
    no: [[311.13, 0, 0.12, "triangle", 0.05], [233.08, 0.1, 0.16, "triangle", 0.04]],
    unlock: [[587.33, 0, 0.1, "sine", 0.05], [739.99, 0.08, 0.12, "sine", 0.05], [987.77, 0.17, 0.18, "sine", 0.045]],
    win: [[523.25, 0, 0.13, "sine", 0.05], [659.25, 0.12, 0.13, "sine", 0.05], [783.99, 0.24, 0.15, "sine", 0.05], [1046.5, 0.38, 0.3, "sine", 0.045]]
  };

  function play(name) {
    if (!enabled) return;
    if (!scores[name]) return;
    if (!ensureContext()) return;
    if (ctx.state === "suspended" && ctx.resume) { ctx.resume(); }
    scores[name].forEach(function (t) { tone(t[0], t[1], t[2], t[3], t[4]); });
  }

  function setEnabled(value) {
    enabled = !!value;
  }

  function isEnabled() { return enabled; }

  PVA.audio = { play: play, setEnabled: setEnabled, isEnabled: isEnabled };
})(window);

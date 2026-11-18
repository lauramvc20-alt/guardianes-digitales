/* ==========================================================================
   PVA · Actividades interactivas de los módulos
   Cada actividad valida la interacción real del participante y persiste su
   avance parcial en localStorage.
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;

  function esc(value) { return U.esc(value); }

  function activityState(moduleId) {
    return PVA.store.activity(moduleId);
  }

  function saveActivity(moduleId, patch) {
    PVA.store.setActivity(moduleId, patch);
  }

  function countKeys(obj) {
    return Object.keys(obj || {}).filter(function (key) { return !!obj[key]; }).length;
  }

  function announce(handlers, done, total, extra) {
    if (handlers && handlers.progress) handlers.progress(done, total, extra);
  }

  function completeIfReady(handlers, ready) {
    if (ready && handlers && handlers.complete) handlers.complete();
  }

  function icon(name) { return U.icon(name); }

  /* -------------------------------------------------------- Comprobaciones */
  var quickcheck = {
    html: function (cfg, moduleId) {
      var saved = activityState(moduleId).quickcheck || {};
      var total = cfg.questions.length;

      var questions = cfg.questions.map(function (item, qi) {
        var isSolved = !!saved[qi];
        var options = item.options.map(function (label, oi) {
          var cls = "option";
          if (isSolved && oi === item.answer) cls += " is-correct";
          return (
            '<button class="' + cls + '" type="button" data-q="' + qi + '" data-opt="' + oi + '"' +
              (isSolved ? " disabled" : "") + ">" +
              '<span class="option__mark" aria-hidden="true">' + U.icon("check", "ico", 12) + '</span>' +
              "<span>" + esc(label) + "</span>" +
            "</button>"
          );
        }).join("");

        return (
          '<div class="worksheet__q" data-qwrap="' + qi + '">' +
            "<p><strong>" + (qi + 1) + ".</strong> " + esc(item.q) + "</p>" +
            '<div class="option-list">' + options + "</div>" +
            '<div class="feedback" data-fb="' + qi + '" role="status"' + (isSolved ? "" : " hidden") + ">" +
              (isSolved
                ? "<strong>Correcto.</strong> " + esc(item.explain)
                : "") +
            "</div>" +
          "</div>"
        );
      }).join("");

      return (
        '<section class="worksheet" id="actividad" aria-labelledby="actTitle">' +
          '<span class="kicker kicker--violet">Actividad práctica</span>' +
          '<h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="muted tiny">' + esc(cfg.intro) + "</p>" +
          '<ol class="segments qc-dots" aria-label="Preguntas">' +
            cfg.questions.map(function (_, i) { return '<li class="segment" data-qdot="' + i + '"></li>'; }).join("") +
          "</ol>" +
          questions +
          '<div class="flow-controls__row qc-nav">' +
            '<button class="btn btn--ghost" type="button" data-qprev>' + icon("chevron") + " Anterior</button>" +
            '<p class="tiny muted" data-qcount>' + countKeys(saved) + " de " + total + " comprobaciones correctas</p>" +
            '<button class="btn" type="button" data-qnext>Siguiente ' + icon("arrowRight") + "</button>" +
          "</div>" +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var saved = activityState(moduleId).quickcheck || {};
      var total = cfg.questions.length;
      var qi0 = 0;
      while (qi0 < total - 1 && saved[qi0]) qi0++;
      var cur = qi0;

      /* Una pregunta por pantalla: solo se avanza al resolver la actual. */
      function paintQ() {
        U.qsa("[data-qwrap]", root).forEach(function (w) {
          w.hidden = Number(w.getAttribute("data-qwrap")) !== cur;
        });
        U.qsa("[data-qdot]", root).forEach(function (d, i) {
          d.classList.toggle("is-done", !!saved[i]);
          d.classList.toggle("is-current", i === cur);
        });
        var prev = root.querySelector("[data-qprev]");
        var next = root.querySelector("[data-qnext]");
        if (prev) prev.disabled = cur === 0;
        if (next) {
          next.hidden = cur === total - 1;
          next.disabled = !saved[cur];
        }
      }
      paintQ();

      root.addEventListener("click", function (event) {
        var go = event.target.closest("[data-qprev],[data-qnext]");
        if (go && root.contains(go) && !go.disabled) {
          cur = U.clamp(cur + (go.hasAttribute("data-qnext") ? 1 : -1), 0, total - 1);
          paintQ();
          return;
        }
        var btn = event.target.closest("[data-q][data-opt]");
        if (!btn || btn.disabled) return;

        var qi = Number(btn.getAttribute("data-q"));
        var oi = Number(btn.getAttribute("data-opt"));
        var item = cfg.questions[qi];
        if (!item || saved[qi]) return;

        var wrap = root.querySelector('[data-qwrap="' + qi + '"]');
        var feedback = wrap ? wrap.querySelector('[data-fb="' + qi + '"]') : null;

        if (oi === item.answer) {
          saved[qi] = true;
          saveActivity(moduleId, { quickcheck: saved });

          U.qsa(".option", wrap).forEach(function (node) {
            node.classList.remove("is-wrong");
            if (Number(node.getAttribute("data-opt")) === item.answer) {
              node.classList.add("is-correct");
            }
            node.disabled = true;
          });

          if (feedback) {
            feedback.hidden = false;
            feedback.classList.remove("feedback--bad");
            feedback.innerHTML = "<strong>Correcto.</strong> " + esc(item.explain);
          }

          PVA.audio.play("ok");
          var done = countKeys(saved);
          var counter = root.querySelector("[data-qcount]");
          if (counter) counter.textContent = done + " de " + total + " comprobaciones correctas";
          paintQ();
          announce(handlers, done, total);
          completeIfReady(handlers, done === total);
        } else {
          U.qsa(".option", wrap).forEach(function (node) {
            if (node !== btn) node.classList.remove("is-wrong");
          });
          btn.classList.add("is-wrong");
          if (feedback) {
            feedback.hidden = false;
            feedback.classList.add("feedback--bad");
            feedback.innerHTML =
              "<strong>Esa opción no aplica.</strong> Vuelve a leer los pasos del " +
              "protocolo y prueba otra respuesta.";
          }
          PVA.audio.play("no");
        }
      });
    }
  };

  /* ------------------------------------------------------------ SMS falso */
  var flagHunt = {
    html: function (cfg, moduleId) {
      var found = activityState(moduleId).flags || {};
      var total = cfg.signals.length;

      function flagButton(key, text) {
        var isFound = !!found[key];
        return (
          '<span class="flag' + (isFound ? " is-found" : "") + '" role="button" tabindex="0" ' +
            'aria-pressed="' + (isFound ? "true" : "false") + '" data-flag="' + key + '">' + esc(text) + "</span>"
        );
      }

      var body = cfg.body.replace(
        /<span class="flag" role="button" tabindex="0" data-flag="([^"]+)">([^<]+)<\/span>/g,
        function (match, key, text) { return flagButton(key, text); }
      );

      var from = cfg.headerFlag ? flagButton(cfg.headerFlag, cfg.fromValue) : esc(cfg.fromValue);
      var foundCount = cfg.signals.filter(function (s) { return found[s.key]; }).length;

      return (
        '<section class="worksheet act flaghunt" id="actividad" aria-labelledby="actTitle">' +
          '<h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="act__intro">' + esc(cfg.intro) + "</p>" +
          '<div class="flaghunt__grid">' +
            '<div class="flaghunt__msg">' +
              '<div class="case-file__head">' +
                '<span class="chip chip--coral">SMS</span>' +
                '<span class="case-file__from">' + esc(cfg.fromLabel) + " " + from + "</span>" +
              "</div>" +
              '<p class="case-file__body">' + body + "</p>" +
            "</div>" +
            '<div class="flaghunt__panel" aria-live="polite">' +
              '<div class="flaghunt__meter"><span data-flag-count></span>' +
                '<div class="bar" role="progressbar" aria-label="Señales encontradas" aria-valuemin="0" aria-valuemax="' + total + '"><div class="bar__fill" data-flag-bar></div></div></div>' +
              '<div class="sig-chips" data-flag-chips></div>' +
              '<div class="sig-explain sig-explain--panel" data-flag-explain></div>' +
            "</div>" +
          "</div>" +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var found = activityState(moduleId).flags || {};
      var total = cfg.signals.length;
      var byKey = {};
      cfg.signals.forEach(function (s) { byKey[s.key] = s; });
      var selected = null;

      function count() { return cfg.signals.filter(function (s) { return found[s.key]; }).length; }

      function paint(animate) {
        var n = count();
        root.querySelector("[data-flag-count]").textContent = n + " de " + total + " señales encontradas";
        root.querySelector("[data-flag-bar]").style.width = Math.round((n / total) * 100) + "%";
        root.querySelector(".flaghunt__meter .bar").setAttribute("aria-valuenow", String(n));

        root.querySelector("[data-flag-chips]").innerHTML = cfg.signals.filter(function (s) { return found[s.key]; }).map(function (s) {
          return '<button type="button" class="sig-chip sig-chip--hit' + (selected === s.key ? " is-selected" : "") + '" data-flag-chip="' + s.key + '" aria-pressed="' + (selected === s.key ? "true" : "false") + '">' + icon("check") + esc(s.label) + "</button>";
        }).join("");

        var box = root.querySelector("[data-flag-explain]");
        if (selected) {
          box.innerHTML = "<b>" + esc(byKey[selected].label) + ".</b> " + esc(byKey[selected].explain);
        } else if (n === total) {
          box.innerHTML = "<b>Encontraste todas las señales.</b> Toca una de ellas arriba para repasar por qué importa.";
        } else {
          box.innerHTML = '<span class="muted">Toca las partes del mensaje que te parezcan sospechosas. Aquí verás por qué cada señal importa.</span>';
        }
        if (animate) { box.classList.remove("is-enter"); void box.offsetWidth; box.classList.add("is-enter"); }
        announce(handlers, n, total);
        completeIfReady(handlers, n === total);
      }

      function pick(node) {
        var key = node.getAttribute("data-flag");
        if (!byKey[key]) return;
        if (!found[key]) {
          found[key] = true;
          saveActivity(moduleId, { flags: found });
          node.classList.add("is-found");
          node.setAttribute("aria-pressed", "true");
          PVA.audio.play("tap");
        }
        selected = key;
        paint(true);
      }

      root.addEventListener("click", function (event) {
        var node = event.target.closest("[data-flag]");
        if (node && root.contains(node)) { pick(node); return; }
        var chip = event.target.closest("[data-flag-chip]");
        if (chip && root.contains(chip)) { selected = chip.getAttribute("data-flag-chip"); paint(true); }
      });

      root.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        var node = event.target.closest("[data-flag]");
        if (node && root.contains(node)) { event.preventDefault(); pick(node); }
      });

      paint(false);
    }
  };

  /* ----------------------------------------------- Arma tu defensa (clasificación) */
  var privacy = {
    html: function (cfg, moduleId) {
      var st = activityState(moduleId).privacy || {};
      var vals = st.vals || {};
      var rows = cfg.items.map(function (it) {
        var on = vals[it.key] == null ? it.start : vals[it.key];
        return (
          '<li class="priv__row" data-row="' + it.key + '">' +
            '<span class="priv__ico" aria-hidden="true">' + icon(it.icon) + "</span>" +
            '<span class="priv__txt"><b id="pl-' + it.key + '">' + esc(it.label) + "</b><small>" + esc(it.hint) + "</small></span>" +
            '<button class="switch" type="button" role="switch" aria-labelledby="pl-' + it.key + '" aria-checked="' + (on ? "true" : "false") + '" data-switch="' + it.key + '"><span></span></button>' +
          "</li>"
        );
      }).join("");
      return (
        '<section class="worksheet act privacy" id="actividad" aria-labelledby="actTitle">' +
          '<h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="act__intro">' + esc(cfg.goal) + "</p>" +
          '<div class="priv">' +
            '<div class="priv__screen">' +
              '<div class="priv__me"><span class="priv__avatar" aria-hidden="true">' + PVA.logo.svg() + "</span>" +
                '<div><b>Tu cuenta</b><small data-pwho></small></div></div>' +
              '<ul class="priv__list">' + rows + "</ul>" +
            "</div>" +
            '<aside class="priv__panel" aria-label="Estado de tu protección">' +
              '<div class="priv__meter"><div class="priv__meter-top"><span>Exposición</span><b data-plevel></b></div>' +
                '<div class="priv__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><span data-pbar></span></div>' +
                '<small class="muted" data-pcount></small></div>' +
              '<div class="priv__feedback" data-pfeedback role="status" aria-live="polite">' + esc(cfg.idle) + "</div>" +
              '<div class="priv__end" data-pend hidden></div>' +
            "</aside>" +
          "</div>" +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var items = cfg.items;
      var total = items.length;
      var state = activityState(moduleId).privacy || {};
      var vals = state.vals || {};
      items.forEach(function (it) { if (vals[it.key] == null) vals[it.key] = it.start; });
      var moves = state.moves || 0;

      function byKey(k) { return items.filter(function (it) { return it.key === k; })[0]; }
      function persist() { saveActivity(moduleId, { privacy: { vals: vals, moves: moves } }); }
      function safeCount() { return items.filter(function (it) { return vals[it.key] === it.safe; }).length; }

      function paint() {
        var n = safeCount();
        var pct = Math.round((n / total) * 100);
        var level = n >= total ? "Baja" : n >= Math.ceil(total / 2) ? "Media" : "Alta";
        var lv = root.querySelector("[data-plevel]");
        lv.textContent = level;
        lv.className = "is-" + (n >= total ? "low" : level === "Media" ? "mid" : "high");
        var bar = root.querySelector("[data-pbar]");
        bar.style.width = pct + "%";
        bar.parentNode.setAttribute("aria-valuenow", String(pct));
        root.querySelector("[data-pcount]").textContent = n + " de " + total + " ajustes protegidos";
        root.querySelector("[data-pwho]").textContent =
          vals.perfil === false ? "Solo tus contactos ven tu perfil" : "Cualquier persona puede ver tu perfil";
        items.forEach(function (it) {
          var btn = root.querySelector('[data-switch="' + it.key + '"]');
          if (btn) btn.setAttribute("aria-checked", vals[it.key] ? "true" : "false");
          var row = root.querySelector('[data-row="' + it.key + '"]');
          if (row) row.classList.toggle("is-safe", vals[it.key] === it.safe);
        });
        announce(handlers, n, total);
        var end = root.querySelector("[data-pend]");
        if (n >= total) {
          end.hidden = false;
          end.innerHTML =
            "<p><b>" + esc(cfg.done.title) + "</b> " + esc(cfg.done.text) + "</p>" +
            '<button class="btn btn--ghost" type="button" data-preset>' + icon("rotateCcw") + " Volver a empezar</button>";
          completeIfReady(handlers, true);
        } else {
          end.hidden = true;
        }
      }

      function say(kind, html) {
        var f = root.querySelector("[data-pfeedback]");
        f.className = "priv__feedback is-" + kind;
        f.innerHTML = html;
      }

      root.addEventListener("click", function (event) {
        if (event.target.closest("[data-preset]")) {
          saveActivity(moduleId, { privacy: { vals: {}, moves: 0 } });
          PVA.router.refresh();
          return;
        }
        var sw = event.target.closest("[data-switch]");
        if (!sw || !root.contains(sw)) return;
        var it = byKey(sw.getAttribute("data-switch"));
        vals[it.key] = !vals[it.key];
        moves += 1;
        if (vals[it.key] === it.safe) say("ok", "<b>" + esc(it.label) + ".</b> " + esc(it.ok));
        else say("no", "<b>" + esc(it.label) + ".</b> " + esc(it.bad));
        PVA.audio.play("tap");
        persist();
        paint();
      });

      paint();
    }
  };

  /* ---------------------------------------------------------- Simulaciones */
  var VERDICT_LABEL = {
    best: "Decisión de mayor protección",
    risky: "Decisión de riesgo medio",
    danger: "Decisión de alto riesgo"
  };
  var POINTS = { best: 2, risky: 1, danger: 0 };
  var VERDICT_ICON = { best: "check", risky: "warning", danger: "warning" };

  function caseNumber(index) { return "Caso " + (index + 1); }
  function sum(list) { return list.reduce(function (a, b) { return a + b; }, 0); }

  /* Veredicto final de un camino de decisiones. */
  function pathVerdict(points, count) {
    var ratio = count ? sum(points) / (2 * count) : 0;
    return ratio >= 0.8 ? "best" : ratio >= 0.45 ? "risky" : "danger";
  }
  function pathPoints(points, count) {
    return count ? Math.round((sum(points) / (2 * count)) * 3 * 10) / 10 : 0;
  }

  /* ---- Mecánica «comprobar»: herramientas de verificación y luego una decisión. ---- */
  function inspectLink(sim, chosen, checked) {
    var n = Object.keys(checked).filter(function (k) { return checked[k]; }).length;
    if (chosen.verdict === "best") {
      return n === sim.tools.length
        ? "Tu decisión se apoyó en una revisión completa."
        : "Decidiste bien. Revisar más pistas antes de actuar te da todavía más seguridad.";
    }
    var key = sim.tools.filter(function (t) { return t.decisive; })[0] || sim.tools[0];
    return "Lo tenías a mano: " + key.result;
  }

  function stateOf(moduleId) { return activityState(moduleId).sim2 || {}; }

  var scenarios = {
    html: function (cfg, moduleId) {
      return (
        '<section class="worksheet act sim" id="actividad" aria-labelledby="actTitle">' +
          '<div class="sim__head"><div><h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="sim__task tiny" data-sim-task></p></div>' +
          '<span class="tiny muted" data-sim-count></span></div>' +
          '<ol class="sim-rail" data-sim-rail aria-label="Casos del simulacro"></ol>' +
          '<div class="sim-stage" data-sim-stage aria-live="polite"></div>' +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var list = PVA.content.simulations || [];
      var total = list.length;
      var done = stateOf(moduleId);
      var view = "case";
      var idx = firstOpen();
      var cs = null;

      function firstOpen() {
        for (var i = 0; i < total; i++) if (!done[list[i].id]) return i;
        return -1;
      }
      function doneCount() { return list.filter(function (s) { return !!done[s.id]; }).length; }
      function bestCount() { return list.filter(function (s) { return done[s.id] && done[s.id].verdict === "best"; }).length; }
      function sim() { return list[idx]; }

      /* ---------- Estado de un caso en curso ---------- */
      function newState(i) {
        var s = list[i];
        if (done[s.id]) return { phase: "final" };
        if (s.kind === "inspect") return { phase: "inspect", checked: {} };
        var node = s.nodes[s.start];
        return { phase: "decide", node: s.start, hist: [], retried: false, pending: null, lines: node.say.map(function (t) { return { from: "them", text: t }; }) };
      }
      function enter(i) {
        idx = i; view = "case";
        cs = newState(i);
        paint();
      }

      /* ---------- Cabecera y progreso ---------- */
      function paintRail() {
        var rail = root.querySelector("[data-sim-rail]");
        rail.innerHTML = list.map(function (s, i) {
          var isDone = !!done[s.id];
          var current = view === "case" && i === idx;
          var enabled = isDone || i === firstOpen() || current;
          return '<li><button type="button" class="sim-rail__item' + (isDone ? " is-done" : "") + (current ? " is-current" : "") + '" data-sim-go="' + i + '"' +
            (enabled ? "" : " disabled") + (current ? ' aria-current="step"' : "") + ">" +
            '<span class="sim-rail__n" aria-hidden="true">' + (isDone ? icon("check") : (i + 1)) + "</span>" +
            '<span class="sim-rail__t"><b>' + esc(caseNumber(i)) + "</b><small>" + esc(s.tag) + "</small></span></button></li>";
        }).join("");
        var task = root.querySelector("[data-sim-task]");
        task.textContent = view === "result"
          ? "Revisa tu resultado y compara cómo cambió cada caso."
          : sim().task;
        root.querySelector("[data-sim-count]").textContent = doneCount() + " de " + total + " casos completados";
      }

      /* ---------- Escena (izquierda) ---------- */
      function sceneHtml() {
        var s = sim();
        if (s.kind === "inspect") {
          return (
            '<div class="device device--chat" aria-label="Mensaje SMS recibido">' +
              '<div class="device__bar"><span class="device__avatar" aria-hidden="true">' + esc(s.contact.name.charAt(0)) + "</span>" +
              '<div><b class="device__name">' + esc(s.contact.name) + '</b><span class="device__state">' + esc(s.contact.sub) + " · SMS</span></div></div>" +
              '<div class="chat device__chat"><div class="bubble">' + esc(s.text) + "</div></div>" +
            "</div>"
          );
        }
        var lines = (cs.lines || []).map(function (l) {
          if (l.from === "sys") return '<p class="call-sys">' + esc(l.text) + "</p>";
          if (s.kind === "call") {
            return '<p class="call-line call-line--' + l.from + '"><span>' + (l.from === "me" ? "Tú" : "Quien llama") + "</span>" + esc(l.text) + "</p>";
          }
          return '<div class="bubble' + (l.from === "me" ? " bubble--mine" : "") + '">' + esc(l.text) + "</div>";
        }).join("");
        if (s.kind === "call") {
          var hang = cs.phase === "decide" ? hangOption() : null;
          return (
            '<div class="device device--call" aria-label="Llamada en curso">' +
              '<div class="device__call-head"><span class="device__avatar" aria-hidden="true">' + icon("phone") + "</span>" +
              '<b class="device__name">' + esc(s.contact.name) + '</b><span class="device__state">' + (cs.phase === "end" || cs.phase === "final" || (cs.hungUp) ? "Llamada finalizada" : "Llamada en curso") + "</span></div>" +
              '<div class="call-log" data-sim-log role="log">' + lines + "</div>" +
              (hang ? '<button type="button" class="call-hang" data-sim-hang>' + icon("phone") + " Colgar</button>" : "") +
            "</div>"
          );
        }
        return (
          '<div class="device device--chat" aria-label="Conversación de ' + esc(s.channel) + '">' +
            '<div class="device__bar"><span class="device__avatar" aria-hidden="true">' + esc(s.contact.name.charAt(0)) + "</span>" +
            '<div><b class="device__name">' + esc(s.contact.name) + '</b><span class="device__state">' + esc(s.contact.sub) + " · " + esc(s.channel) + "</span></div></div>" +
            '<div class="chat device__chat" data-sim-log role="log">' + lines + "</div>" +
          "</div>"
        );
      }

      function hangOption() {
        var node = sim().nodes[cs.node];
        for (var i = 0; i < node.options.length; i++) if (node.options[i].hangup) return node.options[i];
        return null;
      }

      /* ---------- Panel (derecha): un solo paso a la vez ---------- */
      function verdictBadge(v) {
        return '<span class="vbadge vbadge--' + v + '">' + icon(VERDICT_ICON[v]) + esc(VERDICT_LABEL[v]) + "</span>";
      }

      function panelHtml() {
        var s = sim();
        if (cs.phase === "final") return finalPanel(done[s.id], s);

        if (s.kind === "inspect" && cs.phase === "inspect") return inspectPanel(s);

        if (cs.phase === "decide") {
          var node = s.kind === "inspect" ? { prompt: s.question, options: s.options } : s.nodes[cs.node];
          var opts = node.options.map(function (o, k) { return o.hangup ? "" : '<button type="button" class="opt" data-sim-opt="' + k + '"><span class="opt__k" aria-hidden="true">' + String.fromCharCode(65 + k) + "</span><span>" + esc(o.label) + "</span></button>"; }).join("");
          return (
            '<h4 class="sim-panel__q">' + esc(s.kind === "inspect" ? "Decide" : "Turno " + (cs.hist.length + 1)) + "</h4>" +
            '<p class="sim-panel__p"><strong>' + esc(node.prompt) + "</strong></p>" +
            '<div class="opt-list">' + opts + "</div>" +
            (s.kind === "call" && hangOption() ? '<p class="tiny muted">También puedes colgar con el botón del teléfono.</p>' : "")
          );
        }

        if (cs.phase === "feedback") {
          var o = cs.pending;
          var extra = s.kind === "inspect" ? '<p class="sim-panel__link">' + esc(inspectLink(s, o, cs.checked)) + "</p>" : "";
          var okPath = o.verdict === "best";
          var tail = s.kind === "inspect" || o.end
            ? '<button class="btn" type="button" data-sim-next>' + "Ver el desenlace" + " " + icon("arrowRight") + "</button>"
            : '<button class="btn" type="button" data-sim-next>Continuar ' + icon("arrowRight") + "</button>";
          return (
            verdictBadge(o.verdict) +
            '<p class="sim-panel__p">' + esc(o.why) + "</p>" + extra +
            '<div class="sim-panel__actions">' + tail +
              (!okPath ? '<button class="btn btn--ghost" type="button" data-sim-fix>Corregir mi respuesta</button>' : "") +
            "</div>" +
            (!okPath ? '<p class="tiny muted">Si corriges, esa decisión vale menos puntos, pero puedes aprender de ella.</p>' : "")
          );
        }

        if (cs.phase === "end") {
          var eo = cs.ending;
          return (
            verdictBadge(eo.verdict) +
            '<p class="sim-panel__p"><strong>Qué pasó después</strong></p>' +
            '<p class="sim-panel__p">' + esc(eo.outcome) + "</p>" +
            (eo.corrected ? '<p class="tiny muted">Corregiste tu criterio durante el caso; eso se refleja en la puntuación.</p>' : "") +
            '<div class="sim-panel__actions">' + nextButton() + "</div>"
          );
        }
        return "";
      }

      function nextButton() {
        var last = idx === total - 1 || list.every(function (x, i) { return i === idx || !!done[x.id]; });
        return '<button class="btn" type="button" data-sim-endnext>' + (last ? "Ver resultado" : "Siguiente caso") + " " + icon("arrowRight") + "</button>";
      }

      function inspectPanel(s) {
        var n = Object.keys(cs.checked).filter(function (k) { return cs.checked[k]; }).length;
        var btns = s.tools.map(function (tl, i) {
          var on = !!cs.checked[i];
          return '<button type="button" class="tool' + (on ? " is-done" : "") + '" data-sim-tool="' + i + '" aria-pressed="' + (on ? "true" : "false") + '">' +
            '<span class="tool__ico" aria-hidden="true">' + icon(on ? "check" : tl.icon) + "</span><span>" + esc(tl.label) + "</span></button>";
        }).join("");
        var found = s.tools.map(function (tl, i) {
          return cs.checked[i] ? '<li class="finding"><b>' + esc(tl.label) + "</b><span>" + esc(tl.result) + "</span></li>" : "";
        }).join("");
        return (
          '<h4 class="sim-panel__q">Comprueba antes de decidir</h4>' +
          '<p class="sim-panel__p">' + esc(s.examPrompt) + "</p>" +
          '<div class="tool-grid">' + btns + "</div>" +
          '<ul class="findings" aria-live="polite">' + found + "</ul>" +
          '<div class="sim-panel__actions"><button class="btn" type="button" data-sim-decide>Decidir qué hacer ' + icon("arrowRight") + "</button>" +
          '<span class="tiny muted">' + n + " de " + s.tools.length + " comprobaciones</span></div>"
        );
      }

      function finalPanel(entry, s) {
        return (
          verdictBadge(entry.verdict) +
          '<p class="sim-panel__p"><strong>Qué pasó después</strong></p>' +
          '<p class="sim-panel__p">' + esc(entry.outcome) + "</p>" +
          '<p class="tiny muted">' + (Math.round(entry.points * 10) / 10) + " de 3 puntos en este caso.</p>" +
          '<div class="sim-panel__actions">' + nextButton() +
            '<button class="btn btn--ghost" type="button" data-sim-replay>Repetir el caso</button></div>'
        );
      }

      /* ---------- Resultado final ---------- */
      function resultHtml() {
        var pts = 0;
        var rows = list.map(function (s, i) {
          var e = done[s.id];
          pts += e ? e.points : 0;
          return '<li class="sim-result__row sim-result__row--' + (e ? e.verdict : "danger") + '">' +
            '<div><b>' + esc(caseNumber(i)) + " · " + esc(s.title) + "</b>" +
            "<p>" + esc(e ? e.outcome : "Sin completar") + "</p></div>" +
            '<span class="vbadge vbadge--' + (e ? e.verdict : "danger") + '">' + esc(e ? VERDICT_LABEL[e.verdict] : "Pendiente") + "</span></li>";
        }).join("");
        var best = bestCount();
        var msg = best === total
          ? "Decidiste con la mayor protección en todos los casos."
          : best ? "Acertaste en " + best + " de " + total + " casos. Repite los demás y compara cómo cambia el resultado cuando verificas por un canal oficial."
                 : "Repite los casos y fíjate en cómo cambia el resultado cuando pausas y verificas por un canal oficial.";
        return (
          '<div class="sim-result">' +
            '<div class="sim-result__top"><div class="sim-result__score"><b>' + (Math.round(pts * 10) / 10) + " / " + total * 3 + "</b><span>puntos</span></div>" +
            '<p class="sim-result__msg">' + esc(msg) + "</p></div>" +
            '<ul class="sim-result__list">' + rows + "</ul>" +
            '<div class="sim-panel__actions"><button class="btn btn--ghost" type="button" data-sim-back>Revisar los casos</button></div>' +
          "</div>"
        );
      }

      /* ---------- Pintado ---------- */
      function paint(keepScroll) {
        paintRail();
        var stage = root.querySelector("[data-sim-stage]");
        if (view === "result") {
          stage.innerHTML = resultHtml();
          animateIn(stage);
          return;
        }
        var log = root.querySelector("[data-sim-log]");
        var prev = log ? log.scrollTop : 0;
        stage.innerHTML =
          '<div class="sim-case"><div class="sim-scene">' + sceneHtml() + "</div>" +
          '<div class="sim-panel" data-sim-panel>' + panelHtml() + "</div></div>";
        var newLog = root.querySelector("[data-sim-log]");
        if (newLog) newLog.scrollTop = keepScroll ? prev : newLog.scrollHeight;
        if (!keepScroll) animateIn(root.querySelector("[data-sim-panel]"));
      }

      function paintPanelOnly() {
        var panel = root.querySelector("[data-sim-panel]");
        if (!panel) return paint();
        panel.innerHTML = panelHtml();
        animateIn(panel);
      }

      function animateIn(el) {
        if (!el) return;
        el.classList.remove("is-enter");
        void el.offsetWidth;
        el.classList.add("is-enter");
      }

      /* ---------- Acciones ---------- */
      function chooseOption(k) {
        var s = sim();
        var node = s.kind === "inspect" ? { options: s.options } : s.nodes[cs.node];
        var o = node.options[k];
        if (!o) return;
        PVA.audio.play("tap");
        cs.pending = o;
        cs.pendingIndex = k;
        if (s.kind !== "inspect") {
          if (o.hangup) {
            cs.lines.push({ from: "sys", text: "Cuelgas la llamada." });
            cs.hungUp = true;
          } else if (o.reply) {
            cs.lines.push({ from: "me", text: o.reply });
          }
        }
        cs.phase = "feedback";
        paint(true);
      }

      function recordDecision() {
        cs.hist.push({ verdict: cs.pending.verdict, retried: cs.retried });
        cs.retried = false;
      }

      function finishCase(outcome) {
        var s = sim();
        var points, verdict, found = 0, totalSig = 0;
        if (s.kind === "inspect") {
          var nChecked = Object.keys(cs.checked).filter(function (k) { return cs.checked[k]; }).length;
          found = nChecked; totalSig = s.tools.length;
          points = Math.max(0, POINTS[cs.pending.verdict] - (cs.retried ? 1 : 0)) + (totalSig ? found / totalSig : 0);
          verdict = cs.pending.verdict;
        } else {
          var pts = cs.hist.map(function (h) { return Math.max(0, POINTS[h.verdict] - (h.retried ? 1 : 0)); });
          points = pathPoints(pts, pts.length);
          verdict = pathVerdict(pts, pts.length);
        }
        var corrected = cs.hist && cs.hist.some(function (h) { return h.retried; });
        cs.ending = { verdict: verdict, outcome: outcome, corrected: corrected };
        done[s.id] = { verdict: verdict, points: points, outcome: outcome, found: found, total: totalSig };
        saveActivity(moduleId, { sim2: done });
        announce(handlers, doneCount(), total, bestCount());
        completeIfReady(handlers, doneCount() === total);
        cs.phase = "end";
      }

      root.addEventListener("click", function (event) {
        var t = event.target;
        if (!root.contains(t)) return;
        var el;

        if ((el = t.closest("[data-sim-go]")) && !el.disabled) { enter(Number(el.getAttribute("data-sim-go"))); return; }

        if ((el = t.closest("[data-sim-tool]"))) {
          var ti = el.getAttribute("data-sim-tool");
          cs.checked[ti] = !cs.checked[ti] ? true : cs.checked[ti];
          PVA.audio.play("tap");
          paintPanelOnly();
          return;
        }
        if (t.closest("[data-sim-decide]")) { cs.phase = "decide"; paint(true); animateIn(root.querySelector("[data-sim-panel]")); return; }

        if ((el = t.closest("[data-sim-opt]"))) { chooseOption(Number(el.getAttribute("data-sim-opt"))); return; }
        if (t.closest("[data-sim-hang]")) {
          var h = hangOption();
          if (h) chooseOption(sim().nodes[cs.node].options.indexOf(h));
          return;
        }

        if (t.closest("[data-sim-fix]")) {
          var s0 = sim();
          if (s0.kind !== "inspect" && cs.pending.hangup) { cs.lines.pop(); cs.hungUp = false; }
          else if (s0.kind !== "inspect" && cs.pending.reply) cs.lines.pop();
          cs.retried = true;
          cs.pending = null;
          cs.phase = "decide";
          paint(true);
          animateIn(root.querySelector("[data-sim-panel]"));
          return;
        }

        if (t.closest("[data-sim-next]")) {
          var s1 = sim();
          var o = cs.pending;
          if (s1.kind === "inspect") {
            finishCase(o.outcome);
          } else {
            recordDecision();
            if (o.end) finishCase(o.end.outcome);
            else {
              cs.node = o.next;
              s1.nodes[o.next].say.forEach(function (tx) { cs.lines.push({ from: "them", text: tx }); });
              cs.phase = "decide";
              cs.pending = null;
            }
          }
          paint(true);
          animateIn(root.querySelector("[data-sim-panel]"));
          return;
        }

        if (t.closest("[data-sim-endnext]")) {
          var nxt = -1;
          for (var i = 1; i <= total; i++) {
            var cand = (idx + i) % total;
            if (!done[list[cand].id]) { nxt = cand; break; }
          }
          if (nxt === -1) { view = "result"; paint(); } else enter(nxt);
          return;
        }

        if (t.closest("[data-sim-replay]")) {
          delete done[sim().id];
          saveActivity(moduleId, { sim2: done });
          enter(idx);
          return;
        }
        if (t.closest("[data-sim-back]")) { enter(0); return; }
      });

      if (idx === -1) { idx = 0; view = "result"; paint(); }
      else enter(idx);
    }
  };

  var registry = {
    quickcheck: quickcheck,
    flagHunt: flagHunt,
    privacy: privacy,
    scenarios: scenarios
  };

  PVA.activities = {
    render: function (cfg, moduleId) {
      var activity = registry[cfg.type];
      if (!activity) return "";
      return activity.html(cfg, moduleId);
    },
    bind: function (root, cfg, moduleId, handlers) {
      var activity = registry[cfg.type];
      if (!activity) return;
      activity.bind(root, cfg, moduleId, handlers || {});
    }
  };
})(window);

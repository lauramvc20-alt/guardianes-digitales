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
  var defense = {
    html: function (cfg, moduleId) {
      var st = activityState(moduleId).defense || {};
      var placed = st.placed || {};
      var items = cfg.items;
      var order = st.order || items.map(function (it) { return it.key; });

      var zones = cfg.zones.map(function (z) {
        var inside = items.filter(function (it) { return placed[it.key] === z.key; }).map(function (it) {
          return '<li class="dz-item"><span aria-hidden="true">' + icon("check") + "</span>" + esc(it.label) + "</li>";
        }).join("");
        return (
          '<section class="dz" data-zone="' + z.key + '">' +
            '<header class="dz__head"><span class="dz__ico" aria-hidden="true">' + icon(z.icon) + "</span>" +
              "<div><h4>" + esc(z.title) + "</h4><small>" + esc(z.text) + "</small></div>" +
              '<span class="dz__count" data-zcount="' + z.key + '"></span></header>' +
            '<ul class="dz__list" data-zlist="' + z.key + '">' + inside + "</ul>" +
            '<button class="dz__drop" type="button" data-drop="' + z.key + '">Colocar aquí la medida elegida</button>' +
          "</section>"
        );
      }).join("");

      var tray = order.filter(function (k) { return !placed[k]; }).map(function (k) {
        var it = items.filter(function (x) { return x.key === k; })[0];
        return '<button class="dchip" type="button" draggable="true" data-chip="' + k + '" aria-pressed="false">' + esc(it.label) + "</button>";
      }).join("");

      return (
        '<section class="worksheet act defense" id="actividad" aria-labelledby="actTitle">' +
          '<h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="act__intro">' + esc(cfg.goal) + " Toca una medida y luego su zona, o arrástrala.</p>" +
          '<div class="defense__meter"><div class="defense__meter-top"><b data-dmeter-label></b><span class="tiny muted" data-dscore></span></div>' +
            '<div class="defense__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><span data-dbar></span></div></div>' +
          '<div class="defense__tray-wrap"><p class="tiny muted" data-dhint>Elige una medida.</p>' +
            '<div class="defense__tray" data-tray aria-label="Medidas por clasificar">' + tray + "</div></div>" +
          '<div class="defense__feedback" data-dfeedback role="status" aria-live="polite" hidden></div>' +
          '<div class="defense__zones">' + zones + "</div>" +
          '<div class="defense__end" data-dend hidden></div>' +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var items = cfg.items;
      var total = items.length;
      var state = activityState(moduleId).defense || {};
      var placed = state.placed || {};
      var first = state.first || {};
      var tries = state.tries || {};
      var order = state.order || null;
      var selected = null;

      function byKey(k) { return items.filter(function (it) { return it.key === k; })[0]; }
      function zoneOf(k) { return cfg.zones.filter(function (z) { return z.key === k; })[0]; }
      function persist() { saveActivity(moduleId, { defense: { placed: placed, first: first, tries: tries, order: order } }); }
      function placedCount() { return Object.keys(placed).length; }
      function firstCount() { return Object.keys(first).filter(function (k) { return first[k]; }).length; }
      function chipHtml(k) {
        return '<button class="dchip" type="button" draggable="true" data-chip="' + k + '" aria-pressed="false">' + esc(byKey(k).label) + "</button>";
      }

      if (!order) {
        order = items.map(function (it) { return it.key; });
        for (var i = order.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = order[i]; order[i] = order[j]; order[j] = t;
        }
        var tray0 = root.querySelector("[data-tray]");
        if (tray0) tray0.innerHTML = order.filter(function (k) { return !placed[k]; }).map(chipHtml).join("");
        persist();
      }

      function level(pct) {
        return pct >= 100 ? "Defensa completa" : pct >= 66 ? "Defensa sólida" : pct >= 33 ? "Defensa en marcha" : "Defensa por construir";
      }

      function finish() {
        var good = firstCount();
        var C = cfg.conclusion;
        var msg = good >= 10 ? C.high : good >= 7 ? C.mid : C.low;
        var weak = items.filter(function (it) { return (tries[it.key] || 0) > 0; });
        var end = root.querySelector("[data-dend]");
        end.hidden = false;
        end.innerHTML =
          '<div class="defense__score"><b>' + good + " / " + total + "</b><span>a la primera</span></div>" +
          '<div class="defense__end-body"><h4>' + esc(level(100)) + "</h4><p>" + esc(msg) + "</p>" +
          (weak.length ? '<p class="tiny muted">Para repasar: ' + weak.map(function (w) { return esc(w.label); }).join(" · ") + "</p>" : "") +
          '<button class="btn btn--ghost" type="button" data-dreset>' + icon("rotateCcw") + " Repetir el desafío</button></div>";
      }

      function paint() {
        var n = placedCount();
        var pct = Math.round((n / total) * 100);
        root.querySelector("[data-dmeter-label]").textContent = level(pct);
        root.querySelector("[data-dscore]").textContent = n + " de " + total + " medidas colocadas";
        var bar = root.querySelector("[data-dbar]");
        bar.style.width = pct + "%";
        bar.parentNode.setAttribute("aria-valuenow", String(pct));
        cfg.zones.forEach(function (z) {
          var c = root.querySelector('[data-zcount="' + z.key + '"]');
          var cnt = items.filter(function (it) { return it.zone === z.key; }).length;
          var have = items.filter(function (it) { return placed[it.key] === z.key; }).length;
          if (c) c.textContent = have + "/" + cnt;
        });
        var hint = root.querySelector("[data-dhint]");
        if (hint) hint.textContent = n >= total ? "No quedan medidas por clasificar." : selected ? "Ahora toca la zona donde cumple su función." : "Elige una medida.";
        root.querySelectorAll("[data-drop]").forEach(function (b) { b.disabled = !selected; });
        var trayWrap = root.querySelector(".defense__tray-wrap");
        announce(handlers, n, total);
        if (n >= total) {
          trayWrap.hidden = true;
          finish();
          completeIfReady(handlers, true);
        } else {
          trayWrap.hidden = false;
          root.querySelector("[data-dend]").hidden = true;
        }
      }

      function say(kind, html) {
        var f = root.querySelector("[data-dfeedback]");
        f.hidden = false;
        f.className = "defense__feedback is-" + kind;
        f.innerHTML = html;
      }

      function select(key) {
        selected = selected === key ? null : key;
        root.querySelectorAll("[data-chip]").forEach(function (c) {
          c.setAttribute("aria-pressed", c.getAttribute("data-chip") === selected ? "true" : "false");
        });
        paint();
      }

      function place(key, zoneKey) {
        var it = byKey(key);
        if (!it || placed[key]) return;
        var chip = root.querySelector('[data-chip="' + key + '"]');
        if (it.zone === zoneKey) {
          placed[key] = zoneKey;
          if (!tries[key]) first[key] = true;
          selected = null;
          if (chip) chip.remove();
          var li = document.createElement("li");
          li.className = "dz-item is-new";
          li.innerHTML = '<span aria-hidden="true">' + icon("check") + "</span>" + esc(it.label);
          root.querySelector('[data-zlist="' + zoneKey + '"]').appendChild(li);
          say("ok", "<b>Correcto.</b> " + esc(it.why));
        } else {
          tries[key] = (tries[key] || 0) + 1;
          var z = root.querySelector('[data-zone="' + zoneKey + '"]');
          if (z) { z.classList.remove("is-shake"); void z.offsetWidth; z.classList.add("is-shake"); }
          say("no", "<b>Esa no va en «" + esc(zoneOf(zoneKey).title) + "».</b> Piensa en su propósito: " + esc(it.why));
        }
        PVA.audio.play("tap");
        persist();
        paint();
      }

      root.addEventListener("click", function (event) {
        var chip = event.target.closest("[data-chip]");
        if (chip && root.contains(chip)) { select(chip.getAttribute("data-chip")); return; }
        if (event.target.closest("[data-dreset]")) {
          saveActivity(moduleId, { defense: { placed: {}, first: {}, tries: {}, order: null } });
          PVA.router.refresh();
          return;
        }
        var zone = event.target.closest("[data-zone]");
        if (zone && root.contains(zone) && selected) place(selected, zone.getAttribute("data-zone"));
      });

      /* Arrastrar y soltar (además del toque) */
      root.addEventListener("dragstart", function (event) {
        var chip = event.target.closest && event.target.closest("[data-chip]");
        if (!chip) return;
        event.dataTransfer.setData("text/plain", chip.getAttribute("data-chip"));
        event.dataTransfer.effectAllowed = "move";
      });
      root.addEventListener("dragover", function (event) {
        var zone = event.target.closest && event.target.closest("[data-zone]");
        if (zone) { event.preventDefault(); zone.classList.add("is-over"); }
      });
      root.addEventListener("dragleave", function (event) {
        var zone = event.target.closest && event.target.closest("[data-zone]");
        if (zone) zone.classList.remove("is-over");
      });
      root.addEventListener("drop", function (event) {
        var zone = event.target.closest && event.target.closest("[data-zone]");
        if (!zone) return;
        event.preventDefault();
        zone.classList.remove("is-over");
        var key = event.dataTransfer.getData("text/plain");
        if (key) place(key, zone.getAttribute("data-zone"));
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

  /* ---- Mecánica «examinar»: el texto se divide en palabras tocables, sin ninguna pista visual. ---- */
  function tokenize(parts) {
    var tokens = [];
    parts.forEach(function (part, p) {
      part.t.split(/(\s+)/).forEach(function (piece) {
        if (!piece) return;
        if (/^\s+$/.test(piece)) tokens.push({ space: piece, part: p });
        else tokens.push({ w: piece, part: p, idx: tokens.length });
      });
    });
    return tokens;
  }

  function tokenHtml(sim, marks, reveal) {
    var parts = sim.parts;
    var found = {}, missed = {}, falseA = {};
    if (reveal === true) {
      var ev = evaluateExam(sim, marks);
      ev.found.forEach(function (p) { found[p] = 1; });
      ev.missed.forEach(function (p) { missed[p] = 1; });
      ev.falseAlarms.forEach(function (p) { falseA[p] = 1; });
    }
    return tokenize(parts).map(function (tk) {
      if (tk.space) return tk.space;
      var on = !!marks[tk.idx];
      if (reveal === "plain") return '<span class="tok tok--static">' + esc(tk.w) + "</span>";
      if (!reveal) {
        return '<button type="button" class="tok' + (on ? " is-on" : "") + '" data-tok="' + tk.idx + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(tk.w) + "</button>";
      }
      var cls = found[tk.part] ? "is-hit" : missed[tk.part] ? "is-miss" : falseA[tk.part] && on ? "is-false" : on ? "is-on" : "";
      return '<span class="tok tok--static ' + cls + '">' + esc(tk.w) + "</span>";
    }).join("");
  }

  /* Una señal se considera detectada si el estudiante tocó al menos una de sus palabras. */
  function evaluateExam(sim, marks) {
    var touched = {};
    tokenize(sim.parts).forEach(function (tk) { if (!tk.space && marks[tk.idx]) touched[tk.part] = true; });
    var found = [], missed = [], falseAlarms = [];
    sim.parts.forEach(function (part, p) {
      if (typeof part.sig !== "boolean") return;
      if (part.sig && touched[p]) found.push(p);
      else if (part.sig) missed.push(p);
      else if (touched[p]) falseAlarms.push(p);
    });
    return { found: found, missed: missed, falseAlarms: falseAlarms, total: found.length + missed.length };
  }

  function examLink(sim, chosen, ev) {
    if (chosen.verdict === "best") {
      return ev.missed.length === 0
        ? "Tu decisión se apoyó en una revisión completa: viste todas las señales."
        : "Decidiste bien, aunque se te pasó alguna señal. Detectarlas todas te da más seguridad para actuar.";
    }
    if (ev.missed.length) {
      var m = sim.parts[ev.missed[0]];
      return "Esto se relaciona con lo que dejaste pasar: «" + m.t.trim() + "». " + m.why;
    }
    return "Detectaste las señales, pero la acción elegida no te protege: ver el riesgo no basta, hay que pausar y verificar por un canal oficial.";
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
        if (s.kind === "exam") return { phase: "exam", marks: {}, sel: null };
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
        if (s.kind === "exam") {
          var reveal = cs.phase !== "exam";
          return (
            '<div class="device device--chat" aria-label="Mensaje SMS recibido">' +
              '<div class="device__bar"><span class="device__avatar" aria-hidden="true">E</span>' +
              '<div><b class="device__name">' + esc(s.contact.name) + '</b><span class="device__state">' + esc(s.contact.sub) + " · SMS</span></div></div>" +
              '<div class="chat device__chat"><div class="bubble bubble--exam">' + tokenHtml(s, cs.marks || {}, cs.phase === "final" ? "plain" : reveal) + "</div></div>" +
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

        if (s.kind === "exam") {
          if (cs.phase === "exam") {
            var n = Object.keys(cs.marks).filter(function (k) { return cs.marks[k]; }).length;
            return (
              '<h4 class="sim-panel__q">Paso 1 · Examina</h4>' +
              '<p class="sim-panel__p">' + esc(s.examPrompt) + "</p>" +
              '<p class="tiny muted" data-sim-marked>' + n + " palabra(s) marcada(s)</p>" +
              '<div class="sim-panel__actions"><button class="btn" type="button" data-sim-check' + (n ? "" : " disabled") + ">Comprobar " + icon("arrowRight") + "</button></div>"
            );
          }
          if (cs.phase === "review") return reviewPanel(s);
        }

        if (cs.phase === "decide") {
          var node = s.kind === "exam" ? { prompt: s.question, options: s.options } : s.nodes[cs.node];
          var opts = node.options.map(function (o, k) { return o.hangup ? "" : '<button type="button" class="opt" data-sim-opt="' + k + '"><span class="opt__k" aria-hidden="true">' + String.fromCharCode(65 + k) + "</span><span>" + esc(o.label) + "</span></button>"; }).join("");
          return (
            '<h4 class="sim-panel__q">' + esc(s.kind === "exam" ? "Paso 2 · Decide" : "Turno " + (cs.hist.length + 1)) + "</h4>" +
            '<p class="sim-panel__p"><strong>' + esc(node.prompt) + "</strong></p>" +
            '<div class="opt-list">' + opts + "</div>" +
            (s.kind === "call" && hangOption() ? '<p class="tiny muted">También puedes colgar con el botón del teléfono.</p>' : "")
          );
        }

        if (cs.phase === "feedback") {
          var o = cs.pending;
          var extra = s.kind === "exam" ? '<p class="sim-panel__link">' + esc(examLink(s, o, evaluateExam(s, cs.marks))) + "</p>" : "";
          var okPath = o.verdict === "best";
          var tail = s.kind === "exam" || o.end
            ? '<button class="btn" type="button" data-sim-next>' + (s.kind === "exam" ? "Ver el desenlace" : "Ver el desenlace") + " " + icon("arrowRight") + "</button>"
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

      function reviewPanel(s) {
        var ev = evaluateExam(s, cs.marks);
        var chips = [];
        ev.found.forEach(function (p) { chips.push({ p: p, k: "hit", icon: "check" }); });
        ev.missed.forEach(function (p) { chips.push({ p: p, k: "miss", icon: "warning" }); });
        ev.falseAlarms.forEach(function (p) { chips.push({ p: p, k: "false", icon: "info" }); });
        var sel = cs.sel == null ? null : cs.sel;
        var part = sel == null ? null : s.parts[sel];
        var kind = sel == null ? "" : ev.found.indexOf(sel) >= 0 ? "Detectada" : ev.missed.indexOf(sel) >= 0 ? "Se te pasó" : "No era una señal";
        return (
          '<h4 class="sim-panel__q">Tu revisión</h4>' +
          '<p class="sim-panel__p"><strong>' + ev.found.length + " de " + ev.total + "</strong> señales detectadas" +
            (ev.falseAlarms.length ? " · " + ev.falseAlarms.length + " falsa(s) alarma(s)" : "") + ".</p>" +
          '<div class="sig-chips" role="group" aria-label="Señales">' + chips.map(function (c) {
            return '<button type="button" class="sig-chip sig-chip--' + c.k + (sel === c.p ? " is-selected" : "") + '" data-sim-sig="' + c.p + '" aria-pressed="' + (sel === c.p ? "true" : "false") + '">' +
              icon(c.icon) + esc(s.parts[c.p].t.trim().slice(0, 34)) + (s.parts[c.p].t.trim().length > 34 ? "…" : "") + "</button>";
          }).join("") + "</div>" +
          '<div class="sig-explain" data-sim-explain>' + (part
            ? "<b>" + kind + ".</b> " + esc(part.why)
            : '<span class="muted">Toca una señal para ver por qué importa.</span>') + "</div>" +
          '<div class="sim-panel__actions"><button class="btn" type="button" data-sim-decide>Decidir qué hacer ' + icon("arrowRight") + "</button></div>"
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
        var node = s.kind === "exam" ? { options: s.options } : s.nodes[cs.node];
        var o = node.options[k];
        if (!o) return;
        PVA.audio.play("tap");
        cs.pending = o;
        cs.pendingIndex = k;
        if (s.kind !== "exam") {
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
        if (s.kind === "exam") {
          var ev = evaluateExam(s, cs.marks);
          found = ev.found.length; totalSig = ev.total;
          points = POINTS[cs.pending.verdict] - (cs.retried ? 1 : 0);
          points = Math.max(0, points) + (ev.total ? ev.found.length / ev.total : 0);
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

        if ((el = t.closest("[data-tok]"))) {
          var key = el.getAttribute("data-tok");
          cs.marks[key] = !cs.marks[key];
          el.classList.toggle("is-on", !!cs.marks[key]);
          el.setAttribute("aria-pressed", cs.marks[key] ? "true" : "false");
          var n = Object.keys(cs.marks).filter(function (k) { return cs.marks[k]; }).length;
          var label = root.querySelector("[data-sim-marked]");
          if (label) label.textContent = n + " palabra(s) marcada(s)";
          var chk = root.querySelector("[data-sim-check]");
          if (chk) chk.disabled = n === 0;
          return;
        }

        if (t.closest("[data-sim-check]")) { cs.phase = "review"; cs.sel = null; paint(true); animateIn(root.querySelector("[data-sim-panel]")); return; }
        if ((el = t.closest("[data-sim-sig]"))) {
          cs.sel = Number(el.getAttribute("data-sim-sig"));
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
          if (s0.kind !== "exam" && cs.pending.hangup) { cs.lines.pop(); cs.hungUp = false; }
          else if (s0.kind !== "exam" && cs.pending.reply) cs.lines.pop();
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
          if (s1.kind === "exam") {
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
    defense: defense,
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

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
          '<span class="flag' + (isFound ? " is-found" : "") + '" role="button" ' +
            (isFound ? 'tabindex="-1" aria-pressed="true"' : 'tabindex="0" aria-pressed="false"') +
            ' data-flag="' + key + '">' + esc(text) + "</span>"
        );
      }

      var body = cfg.body.replace(
        /<span class="flag" role="button" tabindex="0" data-flag="([^"]+)">([^<]+)<\/span>/g,
        function (match, key, text) { return flagButton(key, text); }
      );

      var from = cfg.fromValue;
      if (cfg.headerFlag) {
        from = flagButton(cfg.headerFlag, cfg.fromValue);
      }

      var foundCount = total - cfg.signals.filter(function (s) { return !found[s.key]; }).length;
      var pct = Math.round((foundCount / total) * 100);

      var list = cfg.signals.filter(function (s) { return found[s.key]; }).map(function (s) {
        return (
          '<li><span aria-hidden="true">' + icon("warning") + "</span>" +
            "<span><strong>" + esc(s.label) + ".</strong> " + esc(s.explain) + "</span></li>"
        );
      }).join("");

      return (
        '<section class="worksheet" id="actividad" aria-labelledby="actTitle">' +
          '<span class="kicker kicker--coral">Actividad práctica</span>' +
          '<h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="muted tiny">' + esc(cfg.intro) + "</p>" +
          '<div class="case-file" style="margin-top:.9rem">' +
            '<div class="case-file__head">' +
              '<span class="chip chip--coral">SMS</span>' +
              '<span class="case-file__from">' + esc(cfg.fromLabel) + " " + from + "</span>" +
            "</div>" +
            '<p class="case-file__body">' + body + "</p>" +
          "</div>" +
          '<div class="flag-meter">' +
            '<span data-flag-count>' + foundCount + " de " + total + " señales</span>" +
            '<div class="bar" role="progressbar" aria-label="Señales encontradas" aria-valuemin="0" aria-valuemax="' + total +
              '" aria-valuenow="' + foundCount + '"><div class="bar__fill" data-flag-bar style="width:' + pct + '%"></div></div>' +
          "</div>" +
          '<ul class="signals" data-signal-list' + (list ? "" : " hidden") + ">" + list + "</ul>" +
          '<p class="tiny muted" data-flag-hint' + (foundCount === total ? " hidden" : "") + ">" +
            "Toca cada parte sospechosa del mensaje para ver la explicación." +
          "</p>" +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var found = activityState(moduleId).flags || {};
      var total = cfg.signals.length;
      var byKey = {};
      cfg.signals.forEach(function (s) { byKey[s.key] = s; });

      function paint() {
        var count = total - cfg.signals.filter(function (s) { return !found[s.key]; }).length;
        var counter = root.querySelector("[data-flag-count]");
        var bar = root.querySelector("[data-flag-bar]");
        var hint = root.querySelector("[data-flag-hint]");
        var meter = root.querySelector(".flag-meter .bar");
        if (counter) counter.textContent = count + " de " + total + " señales";
        if (bar) bar.style.width = Math.round((count / total) * 100) + "%";
        if (meter) meter.setAttribute("aria-valuenow", String(count));
        if (hint) hint.hidden = count === total;
        announce(handlers, count, total);
        completeIfReady(handlers, count === total);
      }

      function reveal(node) {
        var key = node.getAttribute("data-flag");
        if (!byKey[key] || found[key]) return;

        found[key] = true;
        saveActivity(moduleId, { flags: found });

        node.classList.add("is-found");
        node.setAttribute("aria-pressed", "true");
        node.setAttribute("tabindex", "-1");

        var list = root.querySelector("[data-signal-list]");
        if (list) {
          list.hidden = false;
          var li = document.createElement("li");
          li.innerHTML =
            '<span aria-hidden="true">' + icon("warning") + "</span>" +
            "<span><strong>" + esc(byKey[key].label) + ".</strong> " +
            esc(byKey[key].explain) + "</span>";
          list.appendChild(li);
        }

        PVA.audio.play("tap");
        paint();
      }

      root.addEventListener("click", function (event) {
        var node = event.target.closest("[data-flag]");
        if (node && root.contains(node)) reveal(node);
      });

      root.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        var node = event.target.closest("[data-flag]");
        if (node && root.contains(node)) {
          event.preventDefault();
          reveal(node);
        }
      });
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
        '<section class="worksheet defense" id="actividad" aria-labelledby="actTitle">' +
          '<span class="kicker kicker--violet">Actividad práctica · Desafío de clasificación</span>' +
          '<h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="muted tiny">' + esc(cfg.goal) + " Toca una medida y luego su zona, o arrástrala.</p>" +
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

  function isCall(sim) {
    return sim.channel === "Llamada";
  }

  function caseNumber(index) {
    return "Caso " + (index + 1);
  }

  /* Escenario ambientado: la interfaz imita el canal en el que llega el mensaje. */
  function deviceHtml(sim) {
    var incoming = sim.messages.filter(function (msg) { return msg.from === "them"; });
    if (isCall(sim)) {
      var line = incoming.map(function (msg) {
        return "<p>" + esc(msg.text) + "</p>";
      }).join("");
      return (
        '<div class="device device--call" aria-label="Pantalla de llamada entrante">' +
          '<div class="device__call-head">' +
            '<span class="device__avatar" aria-hidden="true">' + icon("phone") + "</span>" +
            '<b class="device__name">' + esc(incoming[0] ? incoming[0].name : sim.channel) + "</b>" +
            '<span class="device__state">Llamada entrante</span>' +
          "</div>" +
          '<div class="device__transcript" role="region" aria-label="Lo que dice quien llama">' +
            '<span class="device__label">Transcripción</span>' + line +
          "</div>" +
        "</div>"
      );
    }

    var sender = incoming[0] ? incoming[0].name : sim.channel;
    var bubbles = incoming.map(function (msg) {
      return '<div class="bubble">' + esc(msg.text) + "</div>";
    }).join("");
    return (
      '<div class="device device--chat" aria-label="Conversación de ' + esc(sim.channel) + '">' +
        '<div class="device__bar">' +
          '<span class="device__avatar" aria-hidden="true">' + esc(sender.charAt(0)) + "</span>" +
          '<div><b class="device__name">' + esc(sender) + "</b>" +
          '<span class="device__state">' + esc(sim.channel) + "</span></div>" +
        "</div>" +
        '<div class="chat device__chat">' + bubbles + "</div>" +
      "</div>"
    );
  }

  /* Acción previa a decidir: el estudiante marca qué revisaría. No puntúa ni bloquea. */
  var PAUSE_ITEMS = ["Quién lo envía", "Qué me pide", "Qué urgencia me impone"];
  function pauseHtml() {
    return (
      '<div class="sim-pause" role="group" aria-label="Pausa antes de decidir">' +
        '<span class="sim-pause__label">' + icon("clock") + " Pausa: ¿qué revisarías primero?</span>" +
        '<div class="sim-pause__items">' +
          PAUSE_ITEMS.map(function (label) {
            return '<button class="sim-pause__item" type="button" aria-pressed="false" data-sc-pause>' +
              icon("check") + "<span>" + esc(label) + "</span></button>";
          }).join("") +
        "</div>" +
      "</div>"
    );
  }

  function caseHtml(sim, index, saved) {
    var idx = saved[sim.id];
    var chosen = typeof idx === "number" ? sim.options[idx] : null;

    var options = sim.options.map(function (opt, oi) {
      var cls = "option";
      if (chosen) {
        if (opt.verdict === "best") cls += " is-correct";
        if (oi === idx) {
          if (chosen.verdict === "danger") cls += " is-wrong";
          else if (chosen.verdict === "risky") cls += " is-risky";
          else cls += " is-correct";
        }
      }
      return (
        '<button class="' + cls + '" type="button" data-sc="' + sim.id + '" data-opt="' + oi + '"' +
          (chosen ? " disabled" : "") + ">" +
          '<span class="option__mark" aria-hidden="true">' + U.icon("check", "ico", 12) + '</span>' +
          "<span>" + esc(opt.label) + "</span>" +
        "</button>"
      );
    }).join("");

    var result = "";
    if (chosen) {
      var kind = chosen.verdict === "best" ? "" : chosen.verdict === "risky" ? " feedback--warn" : " feedback--bad";
      var signals = chosen.signals.map(function (signal) {
        return '<li><span aria-hidden="true">' + icon("warning") + "</span><span>" + esc(signal) + "</span></li>";
      }).join("");
      result =
        '<div class="feedback' + kind + '" role="status">' +
          "<strong>" + VERDICT_LABEL[chosen.verdict] + "</strong>" +
          "<p>" + esc(chosen.feedback) + "</p>" +
          '<ul class="signals">' + signals + "</ul>" +
        "</div>" +
        '<button class="btn btn--quiet" type="button" data-reset="' + sim.id + '" style="margin-top:.75rem">' +
          "Probar otra respuesta</button>";
    }

    return (
      '<article class="sim-case" data-scenario="' + sim.id + '">' +
        '<div class="sim-case__head">' +
          '<span class="chip chip--violet">' + caseNumber(index) + "</span>" +
          "<b>" + esc(sim.title) + "</b>" +
        "</div>" +
        '<p class="muted tiny sim-case__brief">' + esc(sim.brief) + "</p>" +
        '<div class="sim-case__grid">' +
          deviceHtml(sim) +
          '<div class="sim-case__decision">' +
            "<p><strong>" + esc(sim.question) + "</strong></p>" +
            (chosen ? "" : pauseHtml()) +
            '<div class="option-list">' + options + "</div>" +
            '<div class="scenario__result" data-result>' + result + "</div>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function resultHtml(list, saved) {
    var best = 0;
    var rows = list.map(function (sim, index) {
      var idx = saved[sim.id];
      var chosen = typeof idx === "number" ? sim.options[idx] : null;
      if (chosen && chosen.verdict === "best") best += 1;
      return (
        '<li class="review__item ' + (chosen && chosen.verdict === "best" ? "is-ok" : "is-no") + '">' +
          "<b>" + caseNumber(index) + " · " + esc(sim.title) + "</b>" +
          '<p class="tiny" style="margin:.3rem 0 0">' +
            esc(chosen ? VERDICT_LABEL[chosen.verdict] : "Sin respuesta") + "</p>" +
        "</li>"
      );
    }).join("");

    return (
      '<div class="sim-result">' +
        '<h4 class="sim-result__title">Tu resultado</h4>' +
        '<p class="lede">Elegiste la opción de mayor protección en ' + best + " de " + list.length + " casos.</p>" +
        '<ul class="review sim-result__list">' + rows + "</ul>" +
        '<button class="btn btn--ghost" type="button" data-sc-back>' + icon("chevron") + " Volver a los casos</button>" +
      "</div>"
    );
  }

  var scenarios = {
    html: function (cfg, moduleId) {
      var saved = activityState(moduleId).scenarios || {};
      var list = PVA.content.simulations || [];
      var answered = list.filter(function (sim) { return typeof saved[sim.id] === "number"; }).length;

      var dots = list.map(function (sim, index) {
        var cls = "segment";
        if (typeof saved[sim.id] === "number") cls += " is-done";
        return '<li class="' + cls + '" title="' + esc(caseNumber(index)) + '"><span class="sr-only">' + esc(caseNumber(index)) + "</span></li>";
      }).join("");

      return (
        '<section class="worksheet sim" id="actividad" aria-labelledby="actTitle">' +
          '<span class="kicker kicker--coral">Simulacro interactivo</span>' +
          '<h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="muted tiny">' + esc(cfg.intro) + "</p>" +
          '<div class="sim-progress">' +
            '<ol class="segments sim-progress__dots" aria-label="Casos respondidos">' + dots + "</ol>" +
            '<span class="tiny muted" data-sc-count>' + answered + " de " + list.length + " casos</span>" +
          "</div>" +
          '<div class="sim-stage" data-sc-stage aria-live="polite"></div>' +
          '<div class="sim-nav" data-sc-nav></div>' +
          '<div data-sc-result-panel hidden></div>' +
          '<p class="tiny muted" data-sc-summary>' + summaryText(list, saved) + "</p>" +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var saved = activityState(moduleId).scenarios || {};
      var list = PVA.content.simulations || [];
      var total = list.length;
      var index = firstOpen();
      var showResult = false;

      function firstOpen() {
        for (var i = 0; i < total; i++) {
          if (typeof saved[list[i].id] !== "number") return i;
        }
        return Math.max(0, total - 1);
      }

      function countBest() {
        return list.filter(function (sim) {
          var idx = saved[sim.id];
          return typeof idx === "number" && sim.options[idx] && sim.options[idx].verdict === "best";
        }).length;
      }

      function answeredCount() {
        return list.filter(function (sim) { return typeof saved[sim.id] === "number"; }).length;
      }

      function paintDots() {
        U.qsa(".sim-progress__dots .segment", root).forEach(function (node, i) {
          var answered = typeof saved[list[i].id] === "number";
          node.classList.toggle("is-done", answered);
          node.classList.toggle("is-current", i === index && !showResult);
        });
        var count = root.querySelector("[data-sc-count]");
        if (count) count.textContent = answeredCount() + " de " + total + " casos";
      }

      function paintNav() {
        var nav = root.querySelector("[data-sc-nav]");
        if (!nav) return;
        var sim = list[index];
        var isLast = index === total - 1;
        var hasAnswer = sim && typeof saved[sim.id] === "number";
        var allDone = answeredCount() === total;
        var canNext = !isLast && hasAnswer;
        var canResult = isLast && allDone;

        nav.innerHTML =
          '<div class="flow-controls__row">' +
            '<button class="btn btn--ghost" type="button" data-sc-prev' + (index === 0 ? " disabled" : "") + ">" +
              icon("chevron") + " Caso anterior" +
            "</button>" +
            (isLast
              ? '<button class="btn" type="button" data-sc-result' + (canResult ? "" : " disabled") + ">" +
                  "Ver resultado " + icon("arrowRight") +
                "</button>"
              : '<button class="btn" type="button" data-sc-next' + (canNext ? "" : " disabled") + ">" +
                  "Siguiente caso " + icon("arrowRight") +
                "</button>") +
          "</div>" +
          (!hasAnswer
            ? '<p class="tiny muted">Elige una respuesta para poder avanzar.</p>'
            : isLast && !allDone
              ? '<p class="tiny muted">Responde todos los casos para ver el resultado.</p>'
              : "");
      }

      function paintStage() {
        var stage = root.querySelector("[data-sc-stage]");
        var panel = root.querySelector("[data-sc-result-panel]");
        var nav = root.querySelector("[data-sc-nav]");
        if (!stage || !panel) return;

        if (showResult) {
          stage.hidden = true;
          if (nav) nav.hidden = true;
          panel.hidden = false;
          panel.innerHTML = resultHtml(list, saved);
          paintDots();
          return;
        }

        stage.hidden = false;
        if (nav) nav.hidden = false;
        panel.hidden = true;
        stage.innerHTML = caseHtml(list[index], index, saved);
        paintDots();
        paintNav();
      }

      function summary() {
        var node = root.querySelector("[data-sc-summary]");
        if (node) node.textContent = summaryText(list, saved);
        var answered = answeredCount();
        announce(handlers, answered, total, countBest());
        completeIfReady(handlers, answered === total);
      }

      function choose(sim, optionIndex) {
        saved[sim.id] = optionIndex;
        saveActivity(moduleId, { scenarios: saved });
        PVA.audio.play("tap");
        summary();
        paintStage();
      }

      function resetCase(sim) {
        delete saved[sim.id];
        saveActivity(moduleId, { scenarios: saved });
        summary();
        paintStage();
      }

      function goTo(next) {
        if (next < 0 || next > total - 1) return;
        index = next;
        showResult = false;
        paintStage();
      }

      paintStage();

      root.addEventListener("click", function (event) {
        var option = event.target.closest("[data-sc][data-opt]");
        if (option && root.contains(option) && !option.disabled) {
          var sim = null;
          var simId = option.getAttribute("data-sc");
          list.forEach(function (item) { if (item.id === simId) sim = item; });
          if (!sim) return;
          choose(sim, Number(option.getAttribute("data-opt")));
          return;
        }

        var pause = event.target.closest("[data-sc-pause]");
        if (pause && root.contains(pause)) {
          pause.setAttribute("aria-pressed", pause.getAttribute("aria-pressed") === "true" ? "false" : "true");
          return;
        }

        var reset = event.target.closest("[data-reset]");
        if (reset && root.contains(reset)) {
          var id = reset.getAttribute("data-reset");
          var target = null;
          list.forEach(function (item) { if (item.id === id) target = item; });
          if (target) {
            index = list.indexOf(target);
            resetCase(target);
          }
          return;
        }

        if (event.target.closest("[data-sc-prev]") && root.contains(event.target)) {
          goTo(index - 1);
          return;
        }

        if (event.target.closest("[data-sc-next]") && root.contains(event.target)) {
          goTo(index + 1);
          return;
        }

        if (event.target.closest("[data-sc-result]") && root.contains(event.target)) {
          if (answeredCount() === total) {
            showResult = true;
            paintStage();
          }
          return;
        }

        if (event.target.closest("[data-sc-back]") && root.contains(event.target)) {
          showResult = false;
          index = total - 1;
          paintStage();
        }
      });
    }
  };

  function summaryText(list, saved) {
    var answered = list.filter(function (sim) { return typeof saved[sim.id] === "number"; }).length;
    var best = list.filter(function (sim) {
      var idx = saved[sim.id];
      return typeof idx === "number" && sim.options[idx] && sim.options[idx].verdict === "best";
    }).length;
    if (!answered) return "Aún no has respondido ningún caso. Empieza por el primero.";
    if (answered < list.length) {
      return answered + " de " + list.length + " casos respondidos · " +
        best + " decisión(es) de mayor protección.";
    }
    return "Casos respondidos: " + answered + " de " + list.length +
      " · decisiones de mayor protección: " + best + " de " + list.length +
      ". Puedes repetir un caso para comparar la retroalimentación.";
  }

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

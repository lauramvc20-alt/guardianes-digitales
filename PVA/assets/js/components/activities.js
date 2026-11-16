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
              '<span class="option__mark" aria-hidden="true">✓</span>' +
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
          questions +
          '<p class="tiny muted" data-qcount style="margin-top:1rem">' +
            countKeys(saved) + " de " + total + " comprobaciones correctas" +
          "</p>" +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var saved = activityState(moduleId).quickcheck || {};
      var total = cfg.questions.length;

      root.addEventListener("click", function (event) {
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

  /* ----------------------------------------------------------- Compromisos */
  var commitments = {
    html: function (cfg, moduleId) {
      var picked = activityState(moduleId).commitments || {};
      var total = cfg.items.length;
      var min = cfg.min || 3;
      var count = countKeys(picked);

      var items = cfg.items.map(function (item) {
        var on = !!picked[item.key];
        return (
          '<button class="practice' + (on ? " is-on" : "") + '" type="button" ' +
            'data-pick="' + item.key + '" aria-pressed="' + (on ? "true" : "false") + '">' +
            '<span class="practice__check" aria-hidden="true">' + icon("check") + "</span>" +
            '<span class="practice__text"><b>' + esc(item.title) + "</b>" +
              "<span>" + esc(item.detail) + "</span></span>" +
            '<span class="practice__flag">' + esc(item.flag) + "</span>" +
          "</button>"
        );
      }).join("");

      return (
        '<section class="worksheet" id="actividad" aria-labelledby="actTitle">' +
          '<span class="kicker kicker--violet">Actividad práctica</span>' +
          '<h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="muted tiny">' + esc(cfg.intro) + "</p>" +
          items +
          '<p class="tiny muted" data-pick-count style="margin-top:.9rem">' +
            count + " de " + total + " seleccionados · elige al menos " + min +
          "</p>" +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var picked = activityState(moduleId).commitments || {};
      var total = cfg.items.length;
      var min = cfg.min || 3;

      function paint() {
        var count = countKeys(picked);
        var counter = root.querySelector("[data-pick-count]");
        if (counter) {
          counter.textContent = count + " de " + total + " seleccionados · elige al menos " + min;
        }
        announce(handlers, count, total);
        completeIfReady(handlers, count >= min);
      }

      root.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-pick]");
        if (!btn || !root.contains(btn)) return;
        var key = btn.getAttribute("data-pick");

        if (picked[key]) {
          delete picked[key];
          btn.classList.remove("is-on");
          btn.setAttribute("aria-pressed", "false");
        } else {
          picked[key] = true;
          btn.classList.add("is-on");
          btn.setAttribute("aria-pressed", "true");
          PVA.audio.play("tap");
        }

        saveActivity(moduleId, { commitments: picked });
        paint();
      });
    }
  };

  /* ---------------------------------------------------------- Simulaciones */
  var scenarios = {
    html: function (cfg, moduleId) {
      var saved = activityState(moduleId).scenarios || {};
      var list = PVA.content.simulations || [];

      var cards = list.map(function (sim, index) {
        var messages = sim.messages.map(function (msg) {
          var mine = msg.from === "you" ? " bubble--mine" : "";
          var note = msg.from === "system" ? " bubble--note" : "";
          return (
            '<div class="bubble' + mine + note + '">' +
              '<span class="bubble__meta">' + esc(msg.name) + "</span>" +
              esc(msg.text) +
            "</div>"
          );
        }).join("");

        var options = sim.options.map(function (opt, oi) {
          return (
            '<button class="option" type="button" data-sc="' + sim.id +
              '" data-opt="' + oi + '">' +
              '<span class="option__mark" aria-hidden="true">✓</span>' +
              "<span>" + esc(opt.label) + "</span>" +
            "</button>"
          );
        }).join("");

        return (
          '<article class="scenario" data-scenario="' + sim.id + '">' +
            '<div class="scenario__head">' +
              '<span class="chip chip--violet">Caso ' + (index + 1) + "</span>" +
              "<b>" + esc(sim.title) + "</b>" +
              '<span class="chip">' + esc(sim.channel) + "</span>" +
            "</div>" +
            '<div class="scenario__body">' +
              '<p class="muted tiny">' + esc(sim.brief) + "</p>" +
              '<div class="chat">' + messages + "</div>" +
              "<p><strong>" + esc(sim.question) + "</strong></p>" +
              '<div class="option-list">' + options + "</div>" +
              '<div class="scenario__result" data-result></div>' +
            "</div>" +
          "</article>"
        );
      }).join("");

      var answered = list.filter(function (sim) { return typeof saved[sim.id] === "number"; }).length;

      return (
        '<section class="worksheet" id="actividad" aria-labelledby="actTitle">' +
          '<span class="kicker kicker--coral">Simulacro interactivo</span>' +
          '<h3 id="actTitle">' + esc(cfg.title) + "</h3>" +
          '<p class="muted tiny">' + esc(cfg.intro) + "</p>" +
          '<div style="margin-top:1rem">' + cards + "</div>" +
          '<p class="tiny muted" data-sc-summary>' +
            summaryText(list, saved) +
          "</p>" +
        "</section>"
      );
    },

    bind: function (root, cfg, moduleId, handlers) {
      var saved = activityState(moduleId).scenarios || {};
      var list = PVA.content.simulations || [];
      var total = list.length;

      function countBest() {
        return list.filter(function (sim) {
          var idx = saved[sim.id];
          return typeof idx === "number" && sim.options[idx] && sim.options[idx].verdict === "best";
        }).length;
      }

      function summary() {
        var answered = list.filter(function (sim) { return typeof saved[sim.id] === "number"; }).length;
        var node = root.querySelector("[data-sc-summary]");
        if (node) node.textContent = summaryText(list, saved);
        announce(handlers, answered, total, countBest());
        completeIfReady(handlers, answered === total);
      }

      function paintCard(sim) {
        var article = root.querySelector('[data-scenario="' + sim.id + '"]');
        if (!article) return;
        var result = article.querySelector("[data-result]");
        var options = U.qsa(".option", article);
        var idx = saved[sim.id];
        var chosen = typeof idx === "number" ? sim.options[idx] : null;

        options.forEach(function (node) {
          var oi = Number(node.getAttribute("data-opt"));
          node.classList.remove("is-correct", "is-wrong", "is-risky");
          node.disabled = !!chosen;
          if (!chosen) return;
          if (sim.options[oi].verdict === "best") node.classList.add("is-correct");
          if (oi === idx) {
            if (chosen.verdict === "danger") node.classList.add("is-wrong");
            else if (chosen.verdict === "risky") node.classList.add("is-risky");
            else node.classList.add("is-correct");
          }
        });

        if (!chosen) {
          if (result) result.innerHTML = "";
          return;
        }

        var kind = chosen.verdict === "best" ? "" : chosen.verdict === "risky" ? " feedback--warn" : " feedback--bad";
        var label = chosen.verdict === "best"
          ? "Decisión de mayor protección"
          : chosen.verdict === "risky"
            ? "Decisión de riesgo medio"
            : "Decisión de alto riesgo";

        var signals = chosen.signals.map(function (signal) {
          return (
            '<li><span aria-hidden="true">' + icon("warning") + "</span><span>" +
            esc(signal) + "</span></li>"
          );
        }).join("");

        if (result) {
          result.innerHTML =
            '<div class="feedback' + kind + '">' +
              "<strong>" + label + "</strong>" +
              "<p>" + esc(chosen.feedback) + "</p>" +
              '<ul class="signals">' + signals + "</ul>" +
            "</div>" +
            '<button class="btn btn--quiet" type="button" data-reset="' + sim.id + '" ' +
              'style="margin-top:.75rem">Probar otra respuesta</button>';
        }
      }

      root.addEventListener("click", function (event) {
        var option = event.target.closest("[data-sc][data-opt]");
        if (option && root.contains(option) && !option.disabled) {
          var sim = null;
          var simId = option.getAttribute("data-sc");
          list.forEach(function (item) { if (item.id === simId) sim = item; });
          if (!sim) return;

          saved[simId] = Number(option.getAttribute("data-opt"));
          saveActivity(moduleId, { scenarios: saved });
          PVA.audio.play("tap");
          paintCard(sim);
          summary();
          return;
        }

        var reset = event.target.closest("[data-reset]");
        if (reset && root.contains(reset)) {
          var id = reset.getAttribute("data-reset");
          delete saved[id];
          saveActivity(moduleId, { scenarios: saved });
          var target = null;
          list.forEach(function (item) { if (item.id === id) target = item; });
          if (target) paintCard(target);
          summary();
        }
      });

      list.forEach(function (sim) {
        if (typeof saved[sim.id] === "number") paintCard(sim);
      });
      summary();
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
    commitments: commitments,
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

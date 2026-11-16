/* ==========================================================================
   PVA · Vista de módulo (contenido + actividad + desbloqueo)
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;

  function keyCount(obj) {
    return Object.keys(obj || {}).filter(function (k) { return !!obj[k]; }).length;
  }

  function progressInfo(moduleId, cfg) {
    var act = store.activity(moduleId);

    if (cfg.type === "quickcheck") {
      var solved = keyCount(act.quickcheck);
      var qTotal = cfg.questions.length;
      return {
        done: solved === qTotal,
        ratio: solved / qTotal,
        text: solved + " de " + qTotal + " comprobaciones correctas"
      };
    }

    if (cfg.type === "flagHunt") {
      var found = keyCount(act.flags);
      var fTotal = cfg.signals.length;
      return {
        done: found === fTotal,
        ratio: found / fTotal,
        text: found + " de " + fTotal + " señales encontradas"
      };
    }

    if (cfg.type === "commitments") {
      var picked = keyCount(act.commitments);
      var min = cfg.min || 3;
      return {
        done: picked >= min,
        ratio: Math.min(1, picked / min),
        text: picked + " de " + cfg.items.length + " compromisos · mínimo " + min
      };
    }

    if (cfg.type === "scenarios") {
      var list = PVA.content.simulations || [];
      var answered = list.filter(function (sim) {
        return typeof (act.scenarios || {})[sim.id] === "number";
      }).length;
      return {
        done: answered === list.length,
        ratio: answered / list.length,
        text: answered + " de " + list.length + " casos respondidos"
      };
    }

    return { done: false, ratio: 0, text: "" };
  }

  function nextStageFor(id) {
    var idx = store.STAGE_IDS.indexOf(id);
    if (idx < 0 || idx >= store.STAGE_IDS.length - 1) return null;
    return store.stageById(store.STAGE_IDS[idx + 1]);
  }

  /* Acordeón exclusivo: todos los bloques nacen cerrados y solo uno puede
     permanecer abierto. La altura se anima con grid-template-rows (0fr → 1fr). */
  function stepsHtml(module) {
    return module.steps.map(function (step, index) {
      var bodyId = module.id + "-step-" + index;
      var toggleId = module.id + "-toggle-" + index;
      var tips = (step.tips || []).map(function (tip) {
        return "<li>" + U.icon("check") + "<span>" + U.esc(tip) + "</span></li>";
      }).join("");
      var paragraphs = (step.body || []).map(function (p) {
        return "<p>" + U.esc(p) + "</p>";
      }).join("");

      return (
        '<article class="step-card">' +
          '<button class="step-toggle" type="button" id="' + toggleId + '" aria-expanded="false" ' +
            'aria-controls="' + bodyId + '">' +
            '<span class="step-toggle__n" aria-hidden="true">' + String(index + 1).padStart(2, "0") + "</span>" +
            '<span class="step-toggle__t">' +
              "<b>" + U.esc(step.title) + "</b>" +
              "<span>" + U.esc(step.summary) + "</span>" +
            "</span>" +
            '<span class="step-toggle__chev" aria-hidden="true">' + U.icon("chevron") + "</span>" +
          "</button>" +
          '<div class="step-body" id="' + bodyId + '" role="region" aria-labelledby="' + toggleId + '" aria-hidden="true">' +
            '<div class="step-body__inner"><div class="step-body__pad">' +
              paragraphs +
              (tips ? '<ul class="tips">' + tips + "</ul>" : "") +
            "</div></div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  function render(root, ctx) {
    var number = ctx && ctx.route ? ctx.route.module : null;
    var module = PVA.content.modules[number];
    if (!module) {
      root.innerHTML = '<p>Este módulo no está disponible.</p>';
      return;
    }

    var stage = store.stageById(module.id);
    var done = store.isDone(module.id);
    var info = progressInfo(module.id, module.activity);
    var next = nextStageFor(module.id);

    var objectives = module.objectives.map(function (goal) {
      return "<li>" + U.icon("check") + "<span>" + U.esc(goal) + "</span></li>";
    }).join("");

    var sources = module.aside.sources.map(function (source) {
      return '<li><span aria-hidden="true">' + U.icon("book") + "</span><span>" + U.esc(source) + "</span></li>";
    }).join("");

    root.innerHTML =
      '<section class="module-head module-head--' + module.tone + ' enter">' +
        "<div>" +
          '<span class="kicker kicker--violet">' + U.esc(module.kicker) + "</span>" +
          "<h1>" + U.esc(module.title) + "</h1>" +
          '<p class="lede">' + U.esc(module.lede) + "</p>" +
          '<div class="module-head__meta">' +
            '<span class="chip">' + U.icon("clock") + " " + stage.minutes + " min</span>" +
            '<span class="chip chip--violet">' + U.icon("target") + " Actividad práctica</span>" +
            (done ? '<span class="chip chip--turq">' + U.icon("check") + " Módulo completado</span>" : "") +
          "</div>" +
        "</div>" +
        PVA.robot.svg(module.robot, { float: true }) +
      "</section>" +

      '<div class="module-layout">' +
        "<div>" +
          '<div class="stack-sm">' + stepsHtml(module) + "</div>" +
          PVA.activities.render(module.activity, module.id) +
          '<div id="moduleFoot"></div>' +
        "</div>" +

        '<aside aria-label="Información del módulo">' +
          '<section class="aside-card">' +
            '<span class="kicker kicker--violet">En este módulo</span>' +
            '<h2 style="font-size:1.05rem;margin-top:.3rem">Lo que vas a lograr</h2>' +
            '<ul class="aside-list">' + objectives + "</ul>" +
            '<div style="margin-top:1.1rem;padding-top:1rem;border-top:1px solid var(--line)">' +
              "<h3 style='font-size:.9rem'>Tu actividad</h3>" +
              '<p class="tiny" data-act-status style="margin-bottom:.45rem">' + U.esc(info.text) + "</p>" +
              PVA.ui.progressBar(Math.round(info.ratio * 100), "bar--thin", "Avance de la actividad") +
              '<p class="tiny muted" style="margin-top:.7rem" data-act-note>' +
                (done ? "Módulo completado. Puedes repetir la actividad cuando quieras." :
                  "La actividad es obligatoria para desbloquear la siguiente etapa.") +
              "</p>" +
            "</div>" +
          "</section>" +
          PVA.robot.bubble(module.robot, U.esc(module.aside.tip), module.robot === "warning" ? "warn" : "") +
          '<section class="aside-card">' +
            '<span class="kicker kicker--yellow">Basado en</span>' +
            '<ul class="aside-list">' + sources + "</ul>" +
          "</section>" +
        "</aside>" +
      "</div>";

    var foot = root.querySelector("#moduleFoot");

    function updateStatus() {
      var current = progressInfo(module.id, module.activity);
      var status = root.querySelector("[data-act-status]");
      var note = root.querySelector("[data-act-note]");
      var bar = root.querySelector(".aside-card .bar__fill");
      if (status) status.textContent = current.text;
      if (bar) bar.style.width = Math.round(current.ratio * 100) + "%";
      if (note) {
        note.textContent = store.isDone(module.id)
          ? "Módulo completado. Puedes repetir la actividad cuando quieras."
          : "La actividad es obligatoria para desbloquear la siguiente etapa.";
      }
    }

    function renderFoot() {
      if (!foot) return;
      var isDone = store.isDone(module.id);
      var nextLabel = next ? "«" + next.label + "»" : "la siguiente etapa";

      if (isDone) {
        foot.innerHTML =
          '<div class="module-cta">' +
            '<span class="chip chip--turq">' + U.icon("check") + " Módulo completado</span>" +
            (next
              ? '<a class="btn" href="' + next.route + '">Continuar con ' + U.esc(next.navLabel) +
                " " + U.icon("arrowRight") + "</a>"
              : '<a class="btn" href="#/certificado">Ir al certificado ' + U.icon("arrowRight") + "</a>") +
            '<a class="btn btn--ghost" href="#/ruta">' + U.icon("route") + " Ver la ruta</a>" +
          "</div>" +
          '<p class="note tiny muted" style="margin-top:.7rem">' +
            "Tu avance quedó guardado en este navegador." +
          "</p>";
      } else {
        foot.innerHTML =
          '<div class="module-cta">' +
            '<button class="btn" type="button" data-scroll-act>' +
              "Ir a la actividad " + U.icon("chevron") +
            "</button>" +
            '<a class="btn btn--ghost" href="#/ruta">' + U.icon("route") + " Ver la ruta</a>" +
          "</div>" +
          '<p class="note tiny muted" style="margin-top:.7rem">' +
            "Completa la actividad práctica para desbloquear " + U.esc(nextLabel) + "." +
          "</p>";
      }
    }

    function completeActivity() {
      if (!store.isDone(module.id)) {
        if (store.markDone(module.id)) {
          var unlocked = nextStageFor(module.id);
          PVA.audio.play("unlock");
          PVA.ui.toast(
            "Módulo completado. " +
            (unlocked ? "Se desbloqueó «" + unlocked.navLabel + "»." : "Continúa con la evaluación."),
            "ok",
            5200
          );
        }
      }
      updateStatus();
      renderFoot();
    }

    renderFoot();
    updateStatus();

    PVA.activities.bind(root, module.activity, module.id, {
      progress: function () { updateStatus(); },
      complete: completeActivity
    });

    root.addEventListener("click", function (event) {
      var toggle = event.target.closest(".step-toggle");
      if (toggle && root.contains(toggle)) {
        var card = toggle.closest(".step-card");
        var wasOpen = !!card && card.classList.contains("is-open");

        /* Cierra cualquier otro bloque antes de abrir el seleccionado. */
        U.qsa(".step-toggle", root).forEach(function (other) {
          if (other === toggle) return;
          other.setAttribute("aria-expanded", "false");
          var otherCard = other.closest(".step-card");
          if (otherCard) otherCard.classList.remove("is-open");
          var otherBody = document.getElementById(other.getAttribute("aria-controls"));
          if (otherBody) otherBody.setAttribute("aria-hidden", "true");
        });

        var body = document.getElementById(toggle.getAttribute("aria-controls"));
        var willOpen = !wasOpen;
        toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
        if (card) card.classList.toggle("is-open", willOpen);
        if (body) body.setAttribute("aria-hidden", willOpen ? "false" : "true");
        return;
      }

      var scrollBtn = event.target.closest("[data-scroll-act]");
      if (scrollBtn && root.contains(scrollBtn)) {
        var target = root.querySelector("#actividad");
        if (target) {
          target.scrollIntoView({ behavior: U.reduceMotion() ? "auto" : "smooth", block: "start" });
          var heading = target.querySelector("h3, h2");
          if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
          }
        }
      }
    });
  }

  PVA.views = PVA.views || {};
  PVA.views.module = { render: render };
})(window);

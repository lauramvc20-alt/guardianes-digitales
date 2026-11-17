/* ==========================================================================
   PVA · Vista de módulo (bloques progresivos + actividad + desbloqueo)
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;

  var TICK_MS = 250;
  /* Tiempo mínimo de lectura por bloque: ~250 ms por palabra (unas 240 ppm), con piso de 8 s. */
  var MS_PER_WORD = 250;
  var MIN_READ_MS = 8000;

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

    if (cfg.type === "defense") {
      var d = act.defense || {};
      var n = keyCount(d.placed);
      return {
        done: n >= cfg.items.length,
        ratio: n / cfg.items.length,
        text: n + " de " + cfg.items.length + " medidas clasificadas"
      };
    }

    if (cfg.type === "scenarios") {
      var list = PVA.content.simulations || [];
      var answered = list.filter(function (sim) {
        return !!(act.sim2 || {})[sim.id];
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

  function wordCount(step) {
    var text = (step.body || []).join(" ") + " " + (step.tips || []).join(" ");
    return text.split(/\s+/).filter(Boolean).length;
  }

  function requiredReadMs(step) {
    return Math.max(MIN_READ_MS, wordCount(step) * MS_PER_WORD);
  }

  function blockHtml(step, index, total) {
    var tips = (step.tips || []).map(function (tip) {
      return "<li>" + U.icon("check") + "<span>" + U.esc(tip) + "</span></li>";
    }).join("");
    var paragraphs = (step.body || []).map(function (p) {
      return "<p>" + U.esc(p) + "</p>";
    }).join("");

    return (
      '<section class="flow-block" id="flow-block-' + index + '" data-block="' + index + '" hidden ' +
        'aria-labelledby="flow-title-' + index + '">' +
        '<header class="flow-block__head">' +
          '<span class="flow-block__count">Bloque ' + (index + 1) + " de " + total + "</span>" +
          '<h2 class="flow-block__title" id="flow-title-' + index + '" tabindex="-1">' + U.esc(step.title) + "</h2>" +
          '<p class="flow-block__summary">' + U.esc(step.summary) + "</p>" +
        "</header>" +
        '<div class="flow-block__body">' +
          paragraphs +
          (tips ? '<ul class="tips">' + tips + "</ul>" : "") +
        "</div>" +
      "</section>"
    );
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

    var blocks = module.steps || [];
    var total = blocks.length;
    var ACT = total; /* índice del último paso: la actividad */

    /* Estado de lectura: persiste por módulo. Un módulo completado da por leídos todos los bloques. */
    var savedRead = store.activity(module.id).read || {};
    var read = {};
    blocks.forEach(function (_, i) { read[i] = done || !!savedRead[i]; });

    function allRead() {
      for (var i = 0; i < total; i++) if (!read[i]) return false;
      return true;
    }
    function activityOpen() {
      return done || allRead();
    }
    function firstUnread() {
      for (var i = 0; i < total; i++) if (!read[i]) return i;
      return ACT;
    }

    var current = firstUnread();
    var readMs = {};
    blocks.forEach(function (_, i) { readMs[i] = 0; });

    var objectives = module.objectives.map(function (goal) {
      return "<li>" + U.icon("check") + "<span>" + U.esc(goal) + "</span></li>";
    }).join("");

    var sources = module.aside.sources.map(function (source) {
      return '<li class="source"><span class="source__icon" aria-hidden="true">' + U.icon("book") + "</span><span>" + U.esc(source) + "</span></li>";
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
        '<ul class="module-goals" aria-label="Lo que vas a lograr">' + objectives + "</ul>" +
      "</section>" +

      '<section class="module-progress" aria-label="Avance de la actividad">' +
        '<div class="module-progress__row">' +
          '<h2>Tu actividad</h2>' +
          '<p class="tiny" data-act-status>' + U.esc(info.text) + "</p>" +
        "</div>" +
        PVA.ui.progressBar(Math.round(info.ratio * 100), "bar--thin", "Avance de la actividad") +
        '<p class="tiny muted" data-act-note>' +
          (done ? "Módulo completado. Puedes repetir la actividad cuando quieras." :
            "La actividad es obligatoria para desbloquear la siguiente etapa.") +
        "</p>" +
      "</section>" +

      '<div class="module-layout module-layout--wide">' +
        '<div class="flow">' +
          '<ol class="flow-nav" aria-label="Pasos del módulo" data-flow-nav></ol>' +
          '<div class="flow-stage">' +
            blocks.map(function (step, i) { return blockHtml(step, i, total); }).join("") +
            '<section class="flow-activity" id="flow-block-' + ACT + '" data-block="' + ACT + '" hidden>' +
              PVA.activities.render(module.activity, module.id) +
            "</section>" +
          "</div>" +
          '<div class="flow-controls" data-flow-controls></div>' +
          '<div id="moduleFoot"></div>' +
        "</div>" +

      "</div>" +

      '<section class="module-sources" aria-labelledby="srcTitle">' +
        '<h2 class="sources-title" id="srcTitle">' + U.icon("book") + " Bibliografía y fuentes</h2>" +
        '<ul class="aside-list aside-list--sources">' + sources + "</ul>" +
      "</section>";

    var foot = root.querySelector("#moduleFoot");
    var navEl = root.querySelector("[data-flow-nav]");
    var controlsEl = root.querySelector("[data-flow-controls]");

    function blockNode(i) {
      return root.querySelector('[data-block="' + i + '"]');
    }

    function updateStatus() {
      var status = root.querySelector("[data-act-status]");
      var note = root.querySelector("[data-act-note]");
      var bar = root.querySelector(".module-progress .bar__fill");
      var fresh = progressInfo(module.id, module.activity);
      if (status) status.textContent = fresh.text;
      if (bar) bar.style.width = Math.round(fresh.ratio * 100) + "%";
      if (note) {
        note.textContent = store.isDone(module.id)
          ? "Módulo completado. Puedes repetir la actividad cuando quieras."
          : "La actividad es obligatoria para desbloquear la siguiente etapa.";
      }
    }

    function persistRead() {
      var obj = {};
      blocks.forEach(function (_, i) { obj[i] = !!read[i]; });
      store.setActivity(module.id, { read: obj });
    }

    /* Barra de navegación del módulo: solo se puede ir a bloques ya alcanzados. */
    function renderNav() {
      var reachable = firstUnread();
      var items = blocks.map(function (step, i) {
        var cls = "flow-tab";
        if (read[i]) cls += " is-done";
        if (i === current) cls += " is-current";
        var locked = i > reachable;
        if (locked) cls += " is-locked";
        return (
          '<li><button class="' + cls + '" type="button" data-tab="' + i + '"' +
            (locked ? " disabled" : "") + (i === current ? ' aria-current="step"' : "") + ">" +
            '<span class="flow-tab__n" aria-hidden="true">' + (read[i] ? U.icon("check") : (i + 1)) + "</span>" +
            '<span class="flow-tab__t">' + U.esc(step.title) + "</span>" +
          "</button></li>"
        );
      });
      var actLocked = !activityOpen();
      items.push(
        '<li><button class="flow-tab' + (current === ACT ? " is-current" : "") + (actLocked ? " is-locked" : "") + '" type="button" data-tab="' + ACT + '"' +
          (actLocked ? " disabled" : "") + (current === ACT ? ' aria-current="step"' : "") + ">" +
          '<span class="flow-tab__n" aria-hidden="true">' + U.icon("target") + "</span>" +
          '<span class="flow-tab__t">Actividad práctica</span>' +
        "</button></li>"
      );
      navEl.innerHTML = items.join("");
    }

    function renderControls() {
      if (current === ACT) {
        controlsEl.innerHTML =
          '<div class="flow-controls__row">' +
            '<button class="btn btn--ghost" type="button" data-go="' + (total - 1) + '">' + U.icon("chevron") + " Volver a la lectura</button>" +
            '<span class="tiny muted">' + (done ? "Módulo completado" : "Completa la actividad para avanzar") + "</span>" +
          "</div>";
        return;
      }

      var isRead = !!read[current];
      var isLast = current === total - 1;
      var prev = current > 0
        ? '<button class="btn btn--ghost" type="button" data-go="' + (current - 1) + '">' + U.icon("chevron") + " Anterior</button>"
        : "";
      var label = isLast ? "Ir a la actividad" : "Continuar";
      controlsEl.innerHTML =
        '<div class="flow-controls__row">' +
          prev +
          '<button class="btn" type="button" data-continue' + (isRead ? "" : " disabled") + ">" +
            U.esc(label) + " " + U.icon("arrowRight") +
          "</button>" +
        "</div>" +
        '<div class="flow-read" aria-live="polite">' +
          (isRead
            ? '<p class="tiny muted">Bloque leído. Puedes continuar cuando quieras.</p>'
            : '<p class="tiny muted" data-read-hint>Lee el bloque. «' + U.esc(label) + '» se habilita al terminar la lectura.</p>' +
              PVA.ui.progressBar(0, "bar--thin", "Lectura del bloque")) +
        "</div>";
      updateMeter();
    }

    function updateMeter() {
      if (current >= total || read[current]) return;
      var need = requiredReadMs(blocks[current]);
      var pct = Math.min(100, Math.round((readMs[current] / need) * 100));
      var fill = controlsEl.querySelector(".flow-read .bar__fill");
      if (fill) fill.style.width = pct + "%";
    }

    function showStep(index, opts) {
      if (index < 0 || index > ACT) return;
      if (index === ACT && !activityOpen()) return;
      if (index < ACT && index > firstUnread()) return;
      current = index;
      root.classList.toggle("is-activity", current === ACT);

      for (var i = 0; i <= ACT; i++) {
        var node = blockNode(i);
        if (node) node.hidden = i !== current;
      }
      renderNav();
      renderControls();
      updateMeter();

      if (!opts || opts.focus !== false) {
        var node2 = blockNode(current);
        var heading = node2 && node2.querySelector("h2, h3");
        if (heading) heading.focus({ preventScroll: false });
      }
    }

    function markRead(i) {
      if (read[i]) return;
      read[i] = true;
      persistRead();
      if (current === i) renderControls();
      renderNav();
      if (allRead()) {
        PVA.ui.toast("Lectura completa. Ya puedes realizar la actividad práctica.", "ok", 4200);
        PVA.audio.play("tap");
      }
    }

    /* Temporizador de lectura: solo cuenta mientras el bloque actual está visible en pestaña activa. */
    var timer = global.setInterval(function () {
      if (!root.isConnected) {
        global.clearInterval(timer);
        return;
      }
      if (current >= total || read[current]) return;
      if (document.visibilityState !== "visible") return;
      readMs[current] += TICK_MS;
      updateMeter();
      if (readMs[current] >= requiredReadMs(blocks[current])) markRead(current);
    }, TICK_MS);

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
      renderNav();
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
            '<button class="btn" type="button" data-scroll-act' + (activityOpen() ? "" : " disabled") + ">" +
              "Ir a la actividad " + U.icon("chevron") +
            "</button>" +
            '<a class="btn btn--ghost" href="#/ruta">' + U.icon("route") + " Ver la ruta</a>" +
          "</div>" +
          '<p class="note tiny muted" style="margin-top:.7rem">' +
            (activityOpen()
              ? "Completa la actividad práctica para desbloquear " + U.esc(nextLabel) + "."
              : "Termina de leer los bloques para habilitar la actividad práctica.") +
          "</p>";
      }
    }

    /* Un módulo ya completado muestra todos sus bloques como leídos; la actividad se puede repetir. */
    if (done) {
      blocks.forEach(function (_, i) { read[i] = true; });
    }

    renderFoot();
    updateStatus();
    showStep(current, { focus: false });

    PVA.activities.bind(root, module.activity, module.id, {
      progress: function () { updateStatus(); },
      complete: completeActivity
    });

    root.addEventListener("click", function (event) {
      var tab = event.target.closest("[data-tab]");
      if (tab && root.contains(tab) && !tab.disabled) {
        showStep(Number(tab.getAttribute("data-tab")));
        return;
      }

      var go = event.target.closest("[data-go]");
      if (go && root.contains(go)) {
        showStep(Number(go.getAttribute("data-go")));
        return;
      }

      var cont = event.target.closest("[data-continue]");
      if (cont && root.contains(cont) && !cont.disabled) {
        var index = current;
        if (!read[index]) return;
        showStep(index + 1);
        return;
      }

      var scrollBtn = event.target.closest("[data-scroll-act]");
      if (scrollBtn && root.contains(scrollBtn) && !scrollBtn.disabled) {
        showStep(ACT);
      }
    });
  }

  PVA.views = PVA.views || {};
  PVA.views.module = { render: render };
})(window);

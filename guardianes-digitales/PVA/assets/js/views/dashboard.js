/* ==========================================================================
   PVA · Panel del estudiante
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;
  var C = PVA.content.course;

  function missingLabel(stage) {
    for (var i = 0; i < stage.requires.length; i++) {
      if (!store.isDone(stage.requires[i])) {
        var dep = store.stageById(stage.requires[i]);
        return dep ? dep.navLabel : "la etapa anterior";
      }
    }
    return "";
  }

  function stat(value, label) {
    return '<div class="stat"><b>' + U.esc(value) + "</b><span>" + U.esc(label) + "</span></div>";
  }

  /* Recorrido horizontal: una marca por etapa con su estado. */
  function stepperHtml() {
    return store.STAGES.map(function (stage, i) {
      var done = store.isDone(stage.id);
      var unlocked = store.isUnlocked(stage.id);
      var isCurrent = !done && unlocked && store.currentStage() && store.currentStage().id === stage.id;
      var cls = "stepper__item" + (done ? " is-done" : isCurrent ? " is-current" : !unlocked ? " is-locked" : "");
      var glyph = done ? U.icon("check") : !unlocked ? U.icon("lock") : U.icon(stage.icon);
      var inner = '<span class="stepper__dot" aria-hidden="true">' + glyph + "</span>" +
        '<span class="stepper__label"><small>' + (i + 1) + "</small>" + U.esc(stage.navLabel) + "</span>";
      if (done || isCurrent) {
        return '<li class="' + cls + '"><a href="' + stage.route + '"' + (isCurrent ? ' aria-current="step"' : "") + ">" + inner + "</a></li>";
      }
      return '<li class="' + cls + '"><span aria-disabled="true">' + inner +
        '<span class="sr-only">. Etapa bloqueada. Se abre al completar ' + U.esc(missingLabel(stage)) + ".</span></span></li>";
    }).join("");
  }

  function render(root) {
    var percent = store.percent();
    var completed = store.completedCount();
    var total = store.STAGES.length;
    var current = store.currentStage();
    var allDone = completed === total;

    var ctaHref = allDone ? "#/certificado" : current ? current.route : "#/bienvenida";
    var ctaLabel = allDone
      ? "Ver mi certificado"
      : completed === 0
        ? "Comenzar la bienvenida"
        : "Continuar: " + current.navLabel;

    var robotLine = allDone
      ? "Completaste los nueve pasos. Tu Kit Digital sigue disponible y la encuesta nos ayuda a mejorar."
      : completed === 0
        ? "Hola, soy <b>RO-BIT</b>. Te acompaño por nueve etapas cortas. Empieza por la bienvenida: allí está el mapa completo."
        : "Vas por <b>" + U.esc(current ? current.navLabel : "el cierre") + "</b>. Recuerda: cada etapa se abre cuando completas la anterior.";

    root.innerHTML =
      '<section class="hero enter">' +
        '<div class="hero__body">' +
          '<div class="hero__eyebrow">' +
            '<span class="chip chip--turq">' + U.icon("shieldCheck") + " Curso gratuito</span>" +
            '<span class="chip">' + U.icon("user") + " Sin registro</span>" +
            '<span class="chip">' + U.icon("clock") + " 10 a 15 minutos</span>" +
          "</div>" +
          "<h1>PAUSA, VERIFICA Y <em>ACTÚA</em></h1>" +
          '<p class="lede" style="max-width:52ch">' +
            "<strong>Sé un guardián digital.</strong> Una experiencia breve para aprender a " +
            "reconocer estafas, verificar por canales oficiales y proteger tus datos." +
          "</p>" +
          '<div class="hero__meta">' +
            "<div><b>4</b><span>módulos</span></div>" +
            "<div><b>5</b><span>preguntas</span></div>" +
            "<div><b>9</b><span>etapas</span></div>" +
            "<div><b>$0</b><span>costo</span></div>" +
          "</div>" +
          '<div class="hero__cta">' +
            '<a class="btn" href="' + ctaHref + '">' + U.esc(ctaLabel) + " " + U.icon("arrowRight") + "</a>" +
            (allDone ? '<a class="btn btn--ghost" href="#/encuesta">' + U.icon("layers") + " Ir a la encuesta</a>" : "") +
            '<a class="btn btn--ghost" href="#/ruta">' + U.icon("route") + " Ver la ruta completa</a>" +
          "</div>" +
        "</div>" +
        '<div class="hero__art">' +
          '<div class="companion">' +
            '<p class="companion__bubble" role="status">' + robotLine + "</p>" +
            '<div class="companion__robot">' + PVA.robot.svg("welcome", { float: true }) + "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +

      '<div class="dash-grid dash-grid--wide">' +
        '<section class="panel pad enter-2 journey" aria-labelledby="courseTitle">' +
          '<div class="page-head__row">' +
            "<div>" +
              '<span class="kicker kicker--violet">Tu recorrido</span>' +
              '<h2 id="courseTitle" style="margin-top:.3rem">' + completed + " de " + total + " etapas · " + percent + " %</h2>" +
            "</div>" +
            '<a class="btn btn--quiet" href="#/ruta">' + U.icon("route") + " Ver ruta</a>" +
          "</div>" +
          '<ol class="stepper" aria-label="Etapas del curso">' + stepperHtml() + "</ol>" +
          '<p class="tiny muted">' + U.esc(C.duration) + " · " + U.esc(C.access) + " · " + U.esc(C.certificate) +
            ". Tu avance se guarda en este navegador.</p>" +
        "</section>" +

        '<aside class="side-note enter-3" aria-labelledby="whyTitle">' +
          '<h2 id="whyTitle" style="font-size:1.05rem">¿Por qué este curso?</h2>' +
          '<div class="stat-strip" style="grid-template-columns:1fr 1fr">' +
            stat("85 %", "recibió mensajes o llamadas sospechosas") +
            stat("20 %", "fue víctima directa de una estafa") +
            stat("47,6 %", "identificó el smishing como frecuente") +
            stat("47,6 %", "identificó el vishing como frecuente") +
          "</div>" +
          '<p class="tiny muted" style="margin-top:.7rem">Encuesta a 20 personas en Colombia; muestra de conveniencia, no representativa.</p>' +
        "</aside>" +
      "</div>";
  }

  PVA.views = PVA.views || {};
  PVA.views.dashboard = { render: render };
})(window);

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
          '<div class="hero__cta">' +
            '<a class="btn" href="' + ctaHref + '">' + U.esc(ctaLabel) + " " + U.icon("arrowRight") + "</a>" +
            (allDone ? '<a class="btn btn--ghost" href="#/encuesta">' + U.icon("layers") + " Ir a la encuesta</a>" : "") +
            '<a class="btn btn--ghost" href="#/ruta">' + U.icon("route") + " Ver la ruta completa</a>" +
          "</div>" +
          '<button class="hero__more" type="button" data-scroll-context>' + U.icon("chevron") + " ¿Por qué este curso?</button>" +
        "</div>" +
        '<div class="hero__art">' +
          '<div class="hero__logo" aria-hidden="true">' + PVA.logo.svg() + "</div>" +
        "</div>" +
      "</section>" +

      '<div class="dash-grid dash-grid--single">' +
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

      "</div>" +
      PVA.views.context.html();

    var more = root.querySelector("[data-scroll-context]");
    if (more) {
      more.addEventListener("click", function () {
        var target = document.getElementById("contexto");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  PVA.views = PVA.views || {};
  PVA.views.dashboard = { render: render };
})(window);

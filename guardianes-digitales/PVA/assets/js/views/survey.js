/* ==========================================================================
   PVA · Encuesta de percepción (etapa independiente de la evaluación)
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;
  var S = PVA.content.survey;

  function render(root) {
    if (!store.requirementsMet("encuesta")) {
      var current = store.currentStage();
      root.innerHTML =
        '<section class="locked-panel">' +
          '<span class="locked-panel__icon" aria-hidden="true">' + U.icon("lock") + "</span>" +
          "<h1>La encuesta se abre al final del recorrido</h1>" +
          '<p class="muted">Primero completa los módulos, la evaluación, el Kit Digital y el certificado.</p>' +
          (current
            ? '<p style="margin-top:1rem"><a class="btn" href="' + current.route + '">Continuar con ' +
              U.esc(current.navLabel) + "</a></p>"
            : "") +
        "</section>";
      return;
    }

    var done = store.isDone("encuesta");

    root.innerHTML =
      '<div class="page-head enter">' +
        '<span class="kicker kicker--yellow">' + U.esc(S.kicker) + "</span>" +
        '<div class="page-head__row">' +
          "<h1>" + U.esc(S.title) + "</h1>" +
          '<span class="chip ' + (done ? "chip--turq" : "chip--yellow") + '">' +
            U.icon(done ? "check" : "star") + " " + (done ? "Completada" : "Última etapa") +
          "</span>" +
        "</div>" +
      "</div>" +

      '<section class="survey-card enter-2" aria-labelledby="surveyTitle">' +
        '<h2 id="surveyTitle" style="max-width:34ch">' + U.esc(S.lede) + "</h2>" +
        '<p style="color:var(--ink-soft);max-width:62ch;margin-top:.8rem">' + U.esc(S.text) + "</p>" +
        '<div class="hero__cta" style="margin-top:1.4rem">' +
          '<a class="btn" href="' + U.esc(S.url) + '" target="_blank" rel="noopener noreferrer" data-survey>' +
            U.icon("link") + " " + U.esc(S.button) +
          "</a>" +
          '<a class="btn ' + (done ? "btn--ghost" : "btn--quiet") + '" href="#/">' + U.icon("arrowLeft") + " Volver al panel</a>" +
        "</div>" +
        '<p class="tiny muted" style="margin-top:1rem" data-survey-state>' +
          (done
            ? U.esc(S.thanks)
            : "Al abrir la encuesta, esta etapa se marcará como completada en tu navegador.") +
        "</p>" +
        '<p class="tiny muted">' + U.esc(S.note) + "</p>" +
      "</section>" +

      '<div class="stat-strip" style="margin-top:1.2rem">' +
        '<div class="stat"><b>100 %</b><span>del recorrido al completar esta etapa</span></div>' +
        '<div class="stat"><b>9 / 9</b><span>etapas del curso</span></div>' +
        '<div class="stat"><b>Anónima</b><span>desde esta plataforma</span></div>' +
      "</div>";



    root.addEventListener("click", function (event) {
      var link = event.target.closest("[data-survey]");
      if (!link || !root.contains(link)) return;

      if (store.markDone("encuesta")) {
        PVA.audio.play("win");
        PVA.ui.toast("¡Recorrido completo! Gracias por tu percepción.", "ok", 5200);
      }

      var state = root.querySelector("[data-survey-state]");
      if (state) state.textContent = S.thanks;
    });
  }

  PVA.views = PVA.views || {};
  PVA.views.survey = { render: render };
})(window);

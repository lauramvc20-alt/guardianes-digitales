/* ==========================================================================
   PVA · Bienvenida
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;
  var C = PVA.content.course;
  var W = PVA.content.welcome;

  function render(root) {
    var done = store.isDone("bienvenida");

    var goals = W.goals.map(function (goal) {
      return "<li>" + U.icon("check") + "<span>" + U.esc(goal) + "</span></li>";
    }).join("");

    var moments = W.moments.map(function (moment) {
      return (
        '<div class="moment">' +
          '<span class="moment__n">' + U.esc(moment.n) + "</span>" +
          "<b>" + U.esc(moment.title) + "</b>" +
          "<p>" + U.esc(moment.text) + "</p>" +
        "</div>"
      );
    }).join("");

    root.innerHTML =
      '<section class="welcome-hero enter">' +
        '<div class="welcome-hero__body">' +
          '<div class="hero__eyebrow">' +
            '<span class="chip chip--turq">' + U.icon("compass") + " Bienvenida</span>" +
            '<span class="chip">' + U.icon("clock") + " 2 minutos</span>" +
            (done ? '<span class="chip chip--violet">' + U.icon("check") + " Completada</span>" : "") +
          "</div>" +
          "<h1>" + U.esc(W.title) + "</h1>" +
          '<p class="lede">' + U.esc(W.lede) + "</p>" +
          (W.intro ? '<p class="welcome-hero__intro">' + U.esc(W.intro) + "</p>" : "") +
          '<div class="hero__cta">' +
            '<button class="btn" type="button" data-start>' +
              U.esc(done ? "Ir al Módulo 1" : W.start) + " " + U.icon("arrowRight") +
            "</button>" +
            '<a class="btn btn--ghost" href="#/ruta">' + U.icon("route") + " Ver la ruta</a>" +
          "</div>" +
          '<p class="tiny muted welcome-hero__note">' +
            "Al comenzar marcarás la bienvenida como completada. Podrás volver a esta " +
            "pantalla cuando quieras." +
          "</p>" +
        "</div>" +
        '<div class="welcome-hero__logo" aria-hidden="true">' + PVA.logo.svg() + "</div>" +
      "</section>" +

      '<div class="welcome-grid enter-2">' +
        '<section class="panel pad" aria-labelledby="goalsTitle">' +
          '<span class="kicker kicker--violet">Al terminar podrás</span>' +
          '<h2 id="goalsTitle" style="margin-top:.35rem;font-size:1.35rem">' +
            "Reconocer, verificar y actuar" +
          "</h2>" +
          '<ul class="goals">' + goals + "</ul>" +
        "</section>" +

        '<section class="panel pad panel--petrol" aria-labelledby="needTitle">' +
          '<h2 id="needTitle" style="font-size:1.1rem">Qué necesitas</h2>' +
          '<ul class="aside-list aside-list--spaced">' +
            "<li>" + U.icon("check") + " Un dispositivo con navegador actualizado.</li>" +
            "<li>" + U.icon("check") + " No instalar nada ni crear una cuenta.</li>" +
            "<li>" + U.icon("check") + " Unos 12 minutos en total.</li>" +
          "</ul>" +
          '<p class="tiny muted" style="margin-top:1rem">' + U.esc(W.audience) + "</p>" +
          '<p class="tiny muted">' + U.esc(W.privacy) + "</p>" +
        "</section>" +
      "</div>" +

      '<section class="side-note welcome-moments enter-3" aria-labelledby="howTitle">' +
        '<div class="welcome-moments__head">' +
          '<span class="kicker">Cómo funciona</span>' +
          '<h2 id="howTitle" style="font-size:1.15rem;margin:.35rem 0 0">Cinco momentos</h2>' +
        "</div>" +
        '<div class="moments">' + moments + "</div>" +
      "</section>";

    var start = root.querySelector("[data-start]");
    if (start) {
      start.addEventListener("click", function () {
        PVA.audio.play("tap");
        if (store.markDone("bienvenida")) {
          PVA.ui.toast("Bienvenida completada. Empieza el Módulo 1.", "ok");
          PVA.audio.play("unlock");
        }
        PVA.router.go("/modulo/1");
      });
    }
  }

  PVA.views = PVA.views || {};
  PVA.views.welcome = { render: render };
})(window);

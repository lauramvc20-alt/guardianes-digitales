/* ==========================================================================
   PVA · Ruta de módulos
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;
  var ui = PVA.ui;

  function missingLabel(stage) {
    for (var i = 0; i < stage.requires.length; i++) {
      if (!store.isDone(stage.requires[i])) {
        var dep = store.stageById(stage.requires[i]);
        return dep ? dep.navLabel : "la etapa anterior";
      }
    }
    return "";
  }

  var COLS = 3;

  function node(stage, index) {
    var done = store.isDone(stage.id);
    var unlocked = store.isUnlocked(stage.id);
    var cur = store.currentStage();
    var isCurrent = !done && unlocked && cur && cur.id === stage.id;
    var row = Math.floor(index / COLS);
    var pos = index % COLS;
    var rtl = row % 2 === 1;
    var col = rtl ? COLS - pos : pos + 1;
    var last = index === store.STAGES.length - 1;
    var atEdge = pos === COLS - 1;
    var cls = "map-node";
    var state;
    var glyph;

    if (done) { cls += " is-done"; state = "Completada"; glyph = U.icon("check"); }
    else if (isCurrent) { cls += " is-current"; state = "Tu siguiente paso"; glyph = U.icon(stage.icon); }
    else if (unlocked) { state = "Disponible"; glyph = U.icon(stage.icon); }
    else { cls += " is-locked"; state = "Bloqueada"; glyph = U.icon("lock"); }

    if (!last) cls += atEdge ? " to-down" : (rtl ? " to-left" : " to-right");

    var inner =
      '<span class="map-node__dot" aria-hidden="true">' + glyph + "</span>" +
      '<span class="map-node__text">' +
        '<span class="map-node__step">Etapa ' + (index + 1) + " · " + state + "</span>" +
        "<b>" + U.esc(stage.label) + "</b>" +
        "<span class=\"map-node__blurb\">" + U.esc(stage.blurb) + "</span>" +
      "</span>";

    var style = ' style="grid-column:' + col + ";grid-row:" + (row + 1) + '"';
    if (!done && !unlocked) {
      return '<li class="' + cls + '"' + style + '><div class="map-node__link" aria-disabled="true">' + inner +
        '<span class="sr-only">. Etapa bloqueada. Se abre al completar ' + U.esc(missingLabel(stage)) + ".</span></div></li>";
    }
    return '<li class="' + cls + '"' + style + '><a class="map-node__link" href="' + stage.route + '"' +
      (isCurrent ? ' aria-current="step"' : "") + ">" + inner + "</a></li>";
  }

  function render(root) {
    var percent = store.percent();
    var completed = store.completedCount();
    var total = store.STAGES.length;
    var current = store.currentStage();

    var groups = '<ol class="map" aria-label="Recorrido del curso">' +
      store.STAGES.map(node).join("") + "</ol>";
    root.innerHTML =
      '<div class="page-head enter">' +
        '<span class="kicker">Mapa del curso</span>' +
        '<div class="page-head__row">' +
          "<h1>Ruta de módulos</h1>" +
          '<span class="chip chip--violet">' + completed + " de " + total + " etapas completadas</span>" +
        "</div>" +
        '<p class="lede">Nueve etapas en orden obligatorio. Cada una se desbloquea al completar ' +
        "la anterior: no se puede saltar a un módulo, a la evaluación ni al certificado.</p>" +
        '<div class="course-card__progress" style="margin-top:1.1rem;max-width:560px">' +
          ui.progressBar(percent, "", "Avance del curso") + "<b>" + percent + " %</b>" +
        "</div>" +
      "</div>" +

      groups +

      '<section class="panel pad" style="margin-top:1.6rem" aria-labelledby="legendTitle">' +
        '<h2 id="legendTitle" style="font-size:1.05rem">Cómo leer la ruta</h2>' +
        '<div class="grid grid--3" style="margin-top:.8rem">' +
          '<div class="fact"><b>' + U.icon("play") + " Disponible</b><span>Puedes entrar ahora</span></div>" +
          '<div class="fact"><b>' + U.icon("check") + " Completada</b><span>Ya cumpliste la etapa</span></div>" +
          '<div class="fact"><b>' + U.icon("lock") + " Bloqueada</b><span>Falta completar una etapa previa</span></div>" +
        "</div>" +
        (current
          ? '<p class="tiny muted" style="margin-top:1rem">Tu siguiente etapa es <strong>' +
            U.esc(current.label) + "</strong>. " +
            '<a href="' + current.route + '">Continuar ahora</a>.</p>'
          : '<p class="tiny muted" style="margin-top:1rem">Completaste todas las etapas. ' +
            '<a href="#/certificado">Revisa tu certificado</a> o <a href="#/encuesta">responde la encuesta</a>.</p>') +
      "</section>";
  }

  PVA.views = PVA.views || {};
  PVA.views.roadmap = { render: render };
})(window);

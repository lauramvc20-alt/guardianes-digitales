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

  /* Tres fases que aprovechan el ancho: cada una es un carril con sus etapas. */
  var PHASES = [
    { title: "Aprende", sub: "Base y conceptos", from: 0, to: 3, icon: "book" },
    { title: "Practica", sub: "Aplica y demuestra", from: 3, to: 6, icon: "target" },
    { title: "Cierra", sub: "Lleva y comparte", from: 6, to: 9, icon: "trophy" }
  ];

  function node(stage, index) {
    var done = store.isDone(stage.id);
    var unlocked = store.isUnlocked(stage.id);
    var cur = store.currentStage();
    var isCurrent = !done && unlocked && cur && cur.id === stage.id;
    var cls = "lane-node";
    var state;
    var glyph;

    if (done) { cls += " is-done"; state = "Completada"; glyph = U.icon("check"); }
    else if (isCurrent) { cls += " is-current"; state = "Siguiente paso"; glyph = U.icon(stage.icon); }
    else if (unlocked) { state = "Disponible"; glyph = U.icon(stage.icon); }
    else { cls += " is-locked"; state = "Bloqueada"; glyph = U.icon("lock"); }

    var inner =
      '<span class="lane-node__dot" aria-hidden="true">' + glyph + "</span>" +
      '<span class="lane-node__text">' +
        '<span class="lane-node__step">Etapa ' + (index + 1) + " · " + state + "</span>" +
        "<b>" + U.esc(stage.label) + "</b>" +
        '<span class="lane-node__blurb">' + U.esc(stage.blurb) + "</span>" +
        (isCurrent ? '<span class="lane-node__cta">Continuar ' + U.icon("arrowRight") + "</span>" : "") +
      "</span>";

    if (!done && !unlocked) {
      return '<li class="' + cls + '"><div class="lane-node__link" aria-disabled="true">' + inner +
        '<span class="sr-only">. Etapa bloqueada. Se abre al completar ' + U.esc(missingLabel(stage)) + ".</span></div></li>";
    }
    return '<li class="' + cls + '"><a class="lane-node__link" href="' + stage.route + '"' +
      (isCurrent ? ' aria-current="step"' : "") + ">" + inner + "</a></li>";
  }

  function lane(phase, pi) {
    var stages = store.STAGES.slice(phase.from, phase.to);
    var doneN = stages.filter(function (st) { return store.isDone(st.id); }).length;
    return (
      '<section class="lane enter-' + (pi + 1) + '" aria-labelledby="lane-' + pi + '">' +
        '<header class="lane__head">' +
          '<span class="lane__ico" aria-hidden="true">' + U.icon(phase.icon) + "</span>" +
          '<div><h2 id="lane-' + pi + '">' + phase.title + "</h2><span>" + phase.sub + "</span></div>" +
          '<span class="lane__count">' + doneN + "/" + stages.length + "</span>" +
        "</header>" +
        '<ol class="lane__list">' +
          stages.map(function (st, i) { return node(st, phase.from + i); }).join("") +
        "</ol>" +
      "</section>"
    );
  }

  function render(root) {
    var percent = store.percent();
    var completed = store.completedCount();
    var total = store.STAGES.length;
    var current = store.currentStage();

    root.innerHTML =
      '<div class="page-head page-head--tight enter">' +
        '<div class="page-head__row">' +
          "<div>" +
            '<span class="kicker">Mapa del curso</span>' +
            "<h1>Ruta de módulos</h1>" +
          "</div>" +
          '<div class="route-meter">' +
            '<span class="chip chip--violet">' + completed + " de " + total + " etapas</span>" +
            ui.progressBar(percent, "bar--thin", "Avance del curso") +
            "<b>" + percent + " %</b>" +
          "</div>" +
        "</div>" +
        '<p class="lede">Nueve etapas en tres fases. Cada una se abre al completar la anterior.</p>' +
      "</div>" +

      '<div class="lanes" aria-label="Recorrido del curso">' +
        PHASES.map(lane).join("") +
      "</div>" +

      '<p class="tiny muted route-foot">' +
        U.icon("lock") + " Las etapas bloqueadas se abren en orden. " +
        (current
          ? 'Tu siguiente etapa es <strong>' + U.esc(current.label) + '</strong>. <a href="' + current.route + '">Continuar ahora</a>.'
          : 'Completaste todo. <a href="#/certificado">Revisa tu certificado</a> o <a href="#/encuesta">responde la encuesta</a>.') +
      "</p>";
  }

  PVA.views = PVA.views || {};
  PVA.views.roadmap = { render: render };
})(window);

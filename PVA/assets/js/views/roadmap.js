/* ==========================================================================
   PVA · Ruta de módulos
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;
  var ui = PVA.ui;

  var GROUPS = [
    { label: "Inicio", ids: ["bienvenida"] },
    { label: "Aprendizaje", ids: ["m1", "m2", "m3", "m4"] },
    { label: "Cierre y reconocimiento", ids: ["evaluacion", "kit", "certificado", "encuesta"] }
  ];

  function missingLabel(stage) {
    for (var i = 0; i < stage.requires.length; i++) {
      if (!store.isDone(stage.requires[i])) {
        var dep = store.stageById(stage.requires[i]);
        return dep ? dep.navLabel : "la etapa anterior";
      }
    }
    return "";
  }

  function card(stage) {
    var done = store.isDone(stage.id);
    var unlocked = store.isUnlocked(stage.id);
    var isCurrent = !done && unlocked && store.currentStage() && store.currentStage().id === stage.id;
    var cls = "route-card";
    var end;

    if (done) {
      cls += " is-done";
      end = ui.doneBadge();
    } else if (isCurrent) {
      cls += " is-current";
      end = '<span class="chip chip--violet">' + U.icon("play") + " Disponible</span>";
    } else if (unlocked) {
      end = '<span class="chip">' + U.icon("play") + " Disponible</span>";
    } else {
      cls += " is-locked";
      end = ui.lockBadge();
    }

    var body =
      '<span class="route-card__num" aria-hidden="true">' + U.icon(stage.icon) + "</span>" +
      '<span class="route-card__body">' +
        "<b>" + U.esc(stage.label) + "</b>" +
        "<p>" + U.esc(stage.blurb) + "</p>" +
      "</span>" +
      '<span class="route-card__end">' + end + "</span>";

    var extra = "";
    if (!done && !unlocked) {
      extra = ' role="link" aria-disabled="true"';
      return '<div class="' + cls + '"' + extra + ">" + body +
        '<span class="sr-only">. Etapa bloqueada. Se abre al completar ' +
          U.esc(missingLabel(stage)) + ".</span></div>";
    }
    return '<a class="' + cls + '" href="' + stage.route + '">' + body + "</a>";
  }

  function render(root) {
    var percent = store.percent();
    var completed = store.completedCount();
    var total = store.STAGES.length;
    var current = store.currentStage();

    var groups = GROUPS.map(function (group) {
      var cards = group.ids.map(function (id) {
        var stage = store.stageById(id);
        if (!stage) return "";
        return card(stage);
      }).join("");
      return (
        '<div class="route-group">' +
          '<h2 class="route-group__title">' + U.esc(group.label) + "</h2>" +
          '<div class="route-grid">' + cards + "</div>" +
        "</div>"
      );
    }).join("");

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

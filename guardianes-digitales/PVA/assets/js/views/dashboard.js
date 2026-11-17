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

  function stageRow(stage, index) {
    var done = store.isDone(stage.id);
    var unlocked = store.isUnlocked(stage.id);
    var isCurrent = !done && unlocked && store.currentStage() && store.currentStage().id === stage.id;
    var num = index + 1;
    var cls = "stage-row";
    if (done) cls += " is-done";
    else if (isCurrent) cls += " is-current";
    else if (!unlocked) cls += " is-locked";

    var state;
    if (done) state = U.icon("check") + " Completado";
    else if (isCurrent) state = "Continuar " + U.icon("arrowRight");
    else state = U.icon("lock") + " Bloqueado";

    var body =
      '<span class="stage-row__num" aria-hidden="true">' + num + "</span>" +
      '<span class="stage-row__body">' +
        "<b>" + U.esc(stage.navLabel) + "</b>" +
        "<span>" + U.esc(stage.short) + "</span>" +
      "</span>" +
      '<span class="stage-row__state">' + state + "</span>";

    if (done || isCurrent) {
      return '<a class="' + cls + '" href="' + stage.route + '">' + body + "</a>";
    }
    return (
      '<div class="' + cls + '" role="link" aria-disabled="true">' +
        body +
        '<span class="sr-only">. Etapa bloqueada. Se abre al completar ' +
          U.esc(missingLabel(stage)) + ".</span>" +
      "</div>"
    );
  }

  function stat(value, label) {
    return '<div class="stat"><b>' + U.esc(value) + "</b><span>" + U.esc(label) + "</span></div>";
  }

  /* Recorrido por etapas: una marca por etapa, en orden, con su estado. */
  function segmentsHtml() {
    return store.STAGES.map(function (stage) {
      var cls = "segment";
      if (store.isDone(stage.id)) cls += " is-done";
      else if (store.isUnlocked(stage.id) && store.currentStage() && store.currentStage().id === stage.id) cls += " is-current";
      return '<li class="' + cls + '" title="' + U.esc(stage.navLabel) + '"><span class="sr-only">' + U.esc(stage.navLabel) + "</span></li>";
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

    var rows = store.STAGES.map(stageRow).join("");

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

      '<section class="course-card enter-2" aria-labelledby="courseTitle">' +
        '<div class="course-card__top">' +
          '<div>' +
            '<span class="course-card__label">Tu recorrido</span>' +
            '<h2 id="courseTitle">' + U.esc(C.title) + "</h2>" +
          "</div>" +
          '<span class="chip chip--violet">' + completed + " de " + total + " etapas</span>" +
        "</div>" +
        '<p class="course-card__desc">' + U.esc(C.description) + "</p>" +
        '<div class="course-card__facts">' +
          '<div class="fact"><b>' + U.esc(C.duration) + "</b><span>Duración estimada</span></div>" +
          '<div class="fact"><b>' + U.esc(C.access) + "</b><span>Acceso</span></div>" +
          '<div class="fact"><b>' + U.esc(C.modality) + "</b><span>Modalidad</span></div>" +
          '<div class="fact"><b>' + U.esc(C.certificate) + "</b><span>Al finalizar</span></div>" +
        "</div>" +
        '<div class="course-card__progress">' +
          '<ol class="segments" aria-label="Etapas completadas: ' + completed + " de " + total + '">' + segmentsHtml() + "</ol>" +
          "<b>" + percent + " %</b>" +
        "</div>" +
        '<p class="tiny muted course-card__save">Tu avance se guarda en este navegador. No hay cuentas ni contraseñas.</p>' +
      "</section>" +

      '<div class="dash-grid">' +
        '<section class="panel pad enter-3" aria-labelledby="routeTitle">' +
          '<div class="page-head__row">' +
            "<div>" +
              '<span class="kicker kicker--violet">Paso a paso</span>' +
              '<h2 id="routeTitle" style="margin-top:.35rem">Tu ruta de aprendizaje</h2>' +
            "</div>" +
            '<a class="btn btn--quiet" href="#/ruta">' + U.icon("layers") + " Ver detalle</a>" +
          "</div>" +
          '<p class="tiny muted" style="margin:.4rem 0 1rem">' +
            "La ruta es lineal: cada etapa se desbloquea al completar la anterior. " +
            "Así se garantiza que llegues a cada actividad con las bases necesarias." +
          "</p>" +
          '<div class="stage-list">' + rows + "</div>" +
        "</section>" +

        '<aside class="side-note enter-3" aria-labelledby="whyTitle">' +
          '<h2 id="whyTitle" style="font-size:1.15rem">¿Por qué este curso?</h2>' +
          '<p class="tiny muted">Datos de la encuesta de diagnóstico del proyecto, aplicada a 20 personas en Colombia.</p>' +
          '<div class="stat-strip" style="grid-template-columns:1fr 1fr">' +
            stat("85 %", "recibió mensajes o llamadas sospechosas") +
            stat("20 %", "fue víctima directa de una estafa") +
            stat("47,6 %", "identificó el smishing como canal frecuente") +
            stat("47,6 %", "identificó el vishing como canal frecuente") +
          "</div>" +
          '<p class="tiny muted" style="margin-top:.8rem">' +
            "Muestra pequeña y de conveniencia: los resultados no representan a toda la población colombiana." +
          "</p>" +
        "</aside>" +
      "</div>";
  }

  PVA.views = PVA.views || {};
  PVA.views.dashboard = { render: render };
})(window);

/* ==========================================================================
   PVA · Panel del estudiante
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;
  var ui = PVA.ui;
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
            '<a class="btn btn--ghost" href="#/ruta">' + U.icon("route") + " Ver la ruta completa</a>" +
          "</div>" +
        "</div>" +
        '<div class="hero__art">' + PVA.robot.svg("welcome", { float: true }) + "</div>" +
      "</section>" +

      '<section class="course-card enter-2" aria-labelledby="courseTitle">' +
        '<div class="course-card__top">' +
          '<span class="kicker">Tu recorrido</span>' +
          '<h2 id="courseTitle">' + U.esc(C.title) + "</h2>" +
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
          ui.progressBar(percent, "", "Avance del curso") +
          "<b>" + percent + " %</b>" +
          '<span class="tiny muted">Tu avance se guarda en este navegador.</span>' +
        "</div>" +
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

        '<div class="stack">' +
          '<section class="side-note" aria-labelledby="whyTitle">' +
            '<span class="kicker">Contexto</span>' +
            '<h2 id="whyTitle" style="font-size:1.15rem;margin-top:.35rem">¿Por qué este curso?</h2>' +
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
          "</section>" +

          '<section class="panel pad panel--petrol" aria-labelledby="guardTitle">' +
            '<span class="kicker">RO-BIT te acompaña</span>' +
            '<h2 id="guardTitle" style="font-size:1.1rem;margin-top:.35rem">Tu siguiente movimiento</h2>' +
            '<p class="tiny" style="color:var(--ink-soft)">' + robotLine + "</p>" +
            '<div class="hero__cta" style="margin-top:.9rem">' +
              '<a class="btn" href="' + ctaHref + '">' + U.esc(ctaLabel) + " " + U.icon("arrowRight") + "</a>" +
              (allDone ? '<a class="btn btn--ghost" href="#/encuesta">Ir a la encuesta</a>' : "") +
            "</div>" +
            '<p class="tiny muted" style="margin-top:.8rem">' +
              "No hay cuentas ni contraseñas: tu progreso es local a este dispositivo." +
            "</p>" +
          "</section>" +
        "</div>" +
      "</div>";
  }

  PVA.views = PVA.views || {};
  PVA.views.dashboard = { render: render };
})(window);

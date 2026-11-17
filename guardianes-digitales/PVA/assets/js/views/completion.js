(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;
  var C = PVA.content.course;

  function revealMarkup(name, date, score, total) {
    return (
      '<article class="cert-sheet" id="certSheet" aria-labelledby="certTitle">' +
        '<div class="cert-sheet__top">' +
          '<div>' +
            '<span class="cert-sheet__kicker">Reconocimiento simbólico · RO-BIT</span>' +
            '<h3 class="cert-sheet__main-title">PAUSA, VERIFICA Y ACTÚA</h3>' +
          '</div>' +
          '<span class="cert-sheet__seal cert-sheet__seal--logo" aria-hidden="true">' + PVA.logo.svg() + "</span>" +
        "</div>" +
        '<p style="margin-top:.8rem;font-size:.86rem;letter-spacing:.08em;text-transform:uppercase;color:#433299;font-weight:800">' +
          "Se otorga a" +
        "</p>" +
        '<div class="cert-sheet__name" data-cert-name>' + (name ? U.esc(name) : "&nbsp;") + "</div>" +
        '<p class="cert-sheet__caption">Nombre del participante</p>' +
        '<h2 id="certTitle">Guardián Digital</h2>' +
        "<p>Por completar satisfactoriamente el curso interactivo <strong>" + U.esc(C.title) + "</strong>, " +
        "una experiencia educativa sobre prevención de estafas digitales enfocada en " +
        "<strong>smishing</strong>, <strong>vishing</strong> y protección de datos personales.</p>" +
        '<div class="cert-sheet__meta">' +
          "<div><span>Curso</span><b>" + U.esc(C.title) + "</b></div>" +
          "<div><span>Fecha de finalización</span><b data-cert-date>" + U.esc(date) + "</b></div>" +
          "<div><span>Resultado de evaluación</span><b>" + score + " de " + total + " correctas</b></div>" +
        "</div>" +
        '<p class="cert-sheet__note">' +
          "El certificado emitido es un reconocimiento simbólico y no constituye una acreditación educativa." +
        "</p>" +
      "</article>"
    );
  }

  function buildFileName(rawName) {
    var clean = String(rawName || "")
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s_-]/g, "")
      .replace(/\s+/g, "_");
    return clean ? "Certificado_" + clean + ".pdf" : "Certificado_Guardian_Digital.pdf";
  }

  function render(root) {
    if (!store.requirementsMet("certificado")) {
      var current = store.currentStage();
      root.innerHTML =
        '<section class="locked-panel">' +
          '<span class="locked-panel__icon" aria-hidden="true">' + U.icon("lock") + "</span>" +
          "<h1>El certificado todavía no está disponible</h1>" +
          "<p class=\"muted\">Necesitas completar todos los módulos, la evaluación y el Kit Digital.</p>" +
          (current
            ? '<p style="margin-top:1rem"><a class="btn" href="' + current.route + '">Continuar con ' +
              U.esc(current.navLabel) + "</a></p>"
            : '<p style="margin-top:1rem"><a class="btn" href="#/ruta">Ver mi ruta</a></p>') +
        "</section>";
      return;
    }

    var state = store.state();
    var done = store.isDone("certificado");
    var act = store.activity("certificado");
    var issued = act.viewedAt || new Date().toISOString();
    var name = (state.participant && state.participant.name) || "";
    var score = state.quiz.score == null ? 0 : state.quiz.score;
    var total = state.quiz.total || PVA.content.quiz.questions.length;
    var dateLabel = U.formatLongDate(issued);

    root.innerHTML =
      '<section class="completion-hero enter print-hide">' +
        '<span class="kicker kicker--yellow">Recorrido completo</span>' +
        '<div class="badge-seal badge-seal--logo" aria-hidden="true">' + PVA.logo.svg() + "</div>" +
        '<h1>Guardián Digital</h1>' +
        '<p class="lede" style="max-width:56ch;margin:0 auto .8rem">' +
          "Completaste el protocolo PVA, los módulos de smishing y vishing, el simulacro, " +
          "la evaluación y el Kit Digital. Ahora puedes generar y descargar tu certificado simbólico." +
        "</p>" +
        '<div class="hero__eyebrow" style="justify-content:center" data-cert-chips>' +
          '<span class="chip chip--turq">' + U.icon("check") + " 4 módulos</span>" +
          '<span class="chip chip--violet">' + U.icon("target") + " " + score + " de " + total + " correctas</span>" +
          '<span class="chip">' + U.icon("download") + " Kit revisado</span>" +
          (done ? '<span class="chip chip--turq">' + U.icon("seal") + " Certificado generado</span>" : "") +
        "</div>" +
        '<div class="summary-grid">' +
          '<div class="summary-cell"><b>4 / 4</b><span>Módulos</span></div>' +
          '<div class="summary-cell"><b>' + score + " / " + total + "</b><span>Evaluación</span></div>" +
          '<div class="summary-cell"><b>5</b><span>Recursos del Kit</span></div>' +
          '<div class="summary-cell"><b data-cert-date>' + U.esc(dateLabel) + "</b><span>Finalización</span></div>" +
        "</div>" +
        '<div class="name-field">' +
          '<div class="field">' +
            '<label for="participantName">Tu nombre para el certificado (opcional)</label>' +
            '<input id="participantName" type="text" maxlength="80" autocomplete="name" ' +
              'placeholder="Escribe tu nombre" value="' + U.esc(name) + '" />' +
          "</div>" +
        "</div>" +
        '<p class="tiny muted" style="margin-top:.5rem">' +
          "Se guarda solo en este navegador. Si lo dejas en blanco, el certificado incluye un " +
          "espacio para escribir tu nombre a mano." +
        "</p>" +
        '<div class="hero__cta" style="justify-content:center;margin-top:1.1rem">' +
          '<button class="btn" type="button" data-reveal>' +
            U.icon("eye") + " VER CERTIFICADO" +
          "</button>" +
        "</div>" +
      "</section>" +

      '<div class="print-hide" style="margin-top:1.2rem">' +
        PVA.robot.bubble(
          "celebration",
          "Lo lograste. Comparte el Kit con una persona de confianza y ayúdala a " +
          "activar sus propias medidas de protección."
        ) +
      "</div>" +

      '<div class="certificate-wrap" data-cert-wrap' + (done ? "" : " hidden") + ">" +
        revealMarkup(name, dateLabel, score, total) +
      "</div>" +

      '<div class="module-cta print-hide" data-cert-actions style="margin-top:1.2rem">' +
        (done
          ? '<button class="btn" type="button" data-print>' + U.icon("download") + " Descargar certificado (PDF)</button>" +
            '<a class="btn btn--ghost" href="#/encuesta">Ir a la encuesta ' + U.icon("arrowRight") + "</a>" +
            '<span class="note tiny muted">La encuesta es independiente de la evaluación.</span>'
          : '<span class="note tiny muted">' +
            "El botón «VER CERTIFICADO» genera el reconocimiento y habilita su descarga en PDF." +
            "</span>") +
      "</div>";

    var wrap = root.querySelector("[data-cert-wrap]");
    var nameNode = root.querySelector("[data-cert-name]");
    var input = root.querySelector("#participantName");
    var actions = root.querySelector("[data-cert-actions]");
    var chips = root.querySelector("[data-cert-chips]");

    var saveTimer = null;

    function applyName(value) {
      var clean = String(value || "").slice(0, 80);
      if (nameNode) nameNode.innerHTML = clean ? U.esc(clean) : "&nbsp;";
    }

    function saveName() {
      store.setName(input ? input.value : "");
    }

    if (input) {
      input.addEventListener("input", function () {
        applyName(input.value);
        if (saveTimer) global.clearTimeout(saveTimer);
        saveTimer = global.setTimeout(saveName, 350);
      });
      input.addEventListener("blur", function () {
        if (saveTimer) global.clearTimeout(saveTimer);
        saveName();
      });
    }

    root.addEventListener("click", function (event) {
      var reveal = event.target.closest("[data-reveal]");
      if (reveal && root.contains(reveal)) {
        var wasDone = store.isDone("certificado");
        if (!wasDone) {
          store.setActivity("certificado", { viewedAt: new Date().toISOString() });
          store.markDone("certificado");
          PVA.audio.play("win");
          PVA.ui.toast("Certificado simbólico generado. Ya puedes descargarlo en PDF.", "ok", 5200);
        }

        if (wrap) {
          wrap.hidden = false;
          var heading = wrap.querySelector("#certTitle");
          if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
          }
          wrap.scrollIntoView({ behavior: U.reduceMotion() ? "auto" : "smooth", block: "start" });
        }

        if (!wasDone) {
          var already = chips
            ? U.qsa(".chip", chips).some(function (chip) {
                return chip.textContent.indexOf("Certificado generado") >= 0;
              })
            : true;
          if (chips && !already) {
            var chip = document.createElement("span");
            chip.className = "chip chip--turq";
            chip.innerHTML = U.icon("seal") + " Certificado generado";
            chips.appendChild(chip);
          }
          if (actions) {
            actions.innerHTML =
              '<button class="btn" type="button" data-print>' + U.icon("download") +
                " Descargar certificado (PDF)</button>" +
              '<a class="btn btn--ghost" href="#/encuesta">Ir a la encuesta ' + U.icon("arrowRight") + "</a>" +
              '<span class="note tiny muted">La encuesta es independiente de la evaluación.</span>';
          }
        }
        return;
      }

      var print = event.target.closest("[data-print]");
      if (print && root.contains(print)) {
        saveName();
        var currentName = input ? input.value : name;
        var prevTitle = document.title;
        document.title = buildFileName(currentName).replace(/\.pdf$/i, "");
        global.print();
        global.setTimeout(function () {
          document.title = prevTitle;
        }, 500);
      }
    });
  }

  PVA.views = PVA.views || {};
  PVA.views.completion = { render: render };
})(window);
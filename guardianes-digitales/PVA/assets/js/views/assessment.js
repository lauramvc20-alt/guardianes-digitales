/* ==========================================================================
   PVA · Evaluación de conocimientos
   Cinco preguntas, validación inmediata, retroalimentación y resultado.
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;

  var QUIZ = PVA.content.quiz;
  var TOTAL = QUIZ.questions.length;

  function emptyAnswers() {
    var list = [];
    for (var i = 0; i < TOTAL; i++) list.push(null);
    return list;
  }

  function readDraft() {
    var draft = (store.activity("evaluacion") || {}).draft;
    if (!draft || !Array.isArray(draft.answers)) return null;
    var answers = emptyAnswers();
    for (var i = 0; i < TOTAL; i++) {
      var value = draft.answers[i];
      answers[i] = typeof value === "number" && value >= 0 ? value : null;
    }
    var index = typeof draft.index === "number" ? U.clamp(draft.index, 0, TOTAL - 1) : 0;
    return { index: index, answers: answers, checked: !!draft.checked };
  }

  function persistDraft(session) {
    store.setActivity(
      "evaluacion",
      { draft: { index: session.index, answers: session.answers.slice(), checked: session.checked } },
      true
    );
  }

  function scoreOf(answers) {
    return QUIZ.questions.reduce(function (acc, question, index) {
      return acc + (answers[index] === question.answer ? 1 : 0);
    }, 0);
  }

  function feedbackMessage(score) {
    if (score === TOTAL) {
      return "Excelente: identificaste las cinco ideas clave del curso.";
    }
    if (score >= 4) {
      return "Muy bien: tienes claras casi todas las señales. Revisa el detalle de la pregunta fallada.";
    }
    if (score === 3) {
      return "Buen punto de partida. La retroalimentación te muestra qué conviene repasar.";
    }
    return "Conviene repasar los módulos y volver a intentarlo. No hay nota mínima: lo importante es comprender las señales.";
  }

  function render(root) {
    var state = store.state();
    var completed = !!(state.quiz && state.quiz.completedAt);
    var session = completed ? null : readDraft() || { index: 0, answers: emptyAnswers(), checked: false };
    var mode = completed ? "result" : "question";
    var result = completed
      ? { answers: state.quiz.answers || [], score: state.quiz.score || 0, attempts: state.quiz.attempts || 1 }
      : null;

    var shell = document.createElement("div");
    shell.className = "quiz-shell enter";
    root.appendChild(shell);

    function paint() {
      if (mode === "result") paintResult();
      else paintQuestion();
    }

    function paintQuestion() {
      var question = QUIZ.questions[session.index];
      var chosen = session.answers[session.index];
      var pct = Math.round((session.index / TOTAL) * 100);

      var options = question.options.map(function (label, index) {
        var cls = "option";
        if (session.checked) {
          if (index === question.answer) cls += " is-correct";
          else if (index === chosen) cls += " is-wrong";
        } else if (index === chosen) {
          cls += " is-picked";
        }
        return (
          '<button class="' + cls + '" type="button" data-opt="' + index + '"' +
            (session.checked ? " disabled" : "") + ">" +
            '<span class="option__mark" aria-hidden="true">' +
              String.fromCharCode(65 + index) +
            "</span>" +
            "<span>" + U.esc(label) + "</span>" +
          "</button>"
        );
      }).join("");

      var feedback = "";
      if (session.checked) {
        var isRight = chosen === question.answer;
        feedback =
          '<div class="feedback' + (isRight ? "" : " feedback--bad") + '" role="status">' +
            "<strong>" + (isRight ? "Respuesta correcta." : "Respuesta correcta: " +
              U.esc(question.options[question.answer])) + "</strong>" +
            "<p style='margin:.35rem 0 0'>" + U.esc(question.explain) + "</p>" +
          "</div>";
      }

      var last = session.index === TOTAL - 1;

      shell.innerHTML =
        '<div class="page-head">' +
          '<span class="kicker kicker--violet">Evaluación</span>' +
          "<h1>Evaluación de conocimientos</h1>" +
          '<p class="lede">Cinco preguntas para comprobar lo aprendido. Cada respuesta recibe ' +
          "retroalimentación inmediata.</p>" +
        "</div>" +
        '<div class="quiz-top">' +
          PVA.ui.progressBar(pct, "", "Progreso de la evaluación") +
          '<span class="quiz-count">Pregunta ' + (session.index + 1) + " de " + TOTAL + "</span>" +
        "</div>" +
        '<section class="quiz-card" aria-labelledby="qTitle">' +
          '<div class="quiz-topic">' +
            '<span class="chip chip--violet">' + U.icon(question.icon) + " " +
              U.esc(question.topic) + "</span>" +
          "</div>" +
          '<h2 id="qTitle">' + U.esc(question.q) + "</h2>" +
          '<div class="option-list" style="margin-top:1rem">' + options + "</div>" +
          feedback +
          '<div class="module-cta" style="justify-content:space-between">' +
            '<span class="tiny muted">Sin límite de tiempo · ' + TOTAL + " preguntas</span>" +
            (session.checked
              ? '<button class="btn" type="button" data-action="next">' +
                  (last ? "Ver resultado " : "Siguiente pregunta ") + U.icon("arrowRight") +
                "</button>"
              : '<button class="btn" type="button" data-action="check"' +
                  (chosen == null ? " disabled" : "") + ">Comprobar respuesta</button>") +
          "</div>" +
        "</section>";

      if (session.checked) {
        var nextBtn = shell.querySelector('[data-action="next"]');
        if (nextBtn) nextBtn.focus({ preventScroll: true });
      } else {
        var title = shell.querySelector("#qTitle");
        if (title) {
          title.setAttribute("tabindex", "-1");
          title.focus({ preventScroll: true });
        }
      }
    }

    function paintResult() {
      var score = result.score;
      var pct = Math.round((score / TOTAL) * 100);
      var answers = result.answers || [];
      var attempts = result.attempts || 1;

      var review = QUIZ.questions.map(function (question, index) {
        var chosen = answers[index];
        var right = chosen === question.answer;
        var chosenLabel = typeof chosen === "number" && question.options[chosen]
          ? question.options[chosen]
          : "Sin respuesta";
        return (
          '<div class="review__item ' + (right ? "is-ok" : "is-no") + '">' +
            "<b>" + U.icon(right ? "check" : "x", "ico", 14) + " " + U.esc(question.topic) + "</b>" +
            "<span>" + U.esc(question.q) + "</span>" +
            '<p class="tiny" style="margin:.35rem 0 0"><strong>Tu respuesta:</strong> ' +
              U.esc(chosenLabel) + "</p>" +
            (right
              ? ""
              : '<p class="tiny" style="margin:.15rem 0 0"><strong>Respuesta correcta:</strong> ' +
                U.esc(question.options[question.answer]) + "</p>") +
            '<p class="tiny muted" style="margin:.35rem 0 0">' + U.esc(question.explain) + "</p>" +
          "</div>"
        );
      }).join("");

      shell.innerHTML =
        '<div class="quiz-card result-hero" aria-labelledby="resultTitle">' +
          '<span class="kicker ' + (score >= 4 ? "" : "kicker--yellow") + '">Resultado</span>' +
          '<div class="score-ring" style="--pct:' + pct + '" role="img" aria-label="' +
            score + " de " + TOTAL + ' respuestas correctas">' +
            "<div><b>" + score + " / " + TOTAL + "</b>" +
            "<span>correctas</span></div>" +
          "</div>" +
          '<h2 id="resultTitle">Tu resultado</h2>' +
          '<p class="lede" style="max-width:52ch;margin:0 auto .8rem">' + U.esc(feedbackMessage(score)) + "</p>" +
          '<div class="hero__eyebrow" style="justify-content:center">' +
            '<span class="chip chip--turq">' + U.icon("check") + " Evaluación completada</span>" +
            '<span class="chip">' + U.icon("refresh") + " Intento " + attempts + "</span>" +
          "</div>" +
          '<p class="tiny muted" style="margin-top:1rem">' + U.esc(QUIZ.note) + "</p>" +
          '<div class="hero__cta" style="justify-content:center;margin-top:1.2rem">' +
            '<a class="btn" href="#/kit">Continuar al Kit Digital ' + U.icon("arrowRight") + "</a>" +
            '<button class="btn btn--ghost" type="button" data-action="retry">' +
              U.icon("refresh") + " Repetir evaluación" +
            "</button>" +
          "</div>" +
        "</div>" +
        '<section class="panel pad" style="margin-top:1.2rem" aria-labelledby="reviewTitle">' +
          '<span class="kicker kicker--violet">Revisión</span>' +
          '<h2 id="reviewTitle" style="font-size:1.25rem;margin-top:.3rem">Pregunta por pregunta</h2>' +
          '<div class="review">' + review + "</div>" +
        "</section>";
    }

    function check() {
      if (session.answers[session.index] == null) return;
      session.checked = true;
      persistDraft(session);
      PVA.audio.play(session.answers[session.index] === QUIZ.questions[session.index].answer ? "ok" : "no");
      paint();
    }

    function next() {
      if (!session.checked) return;
      if (session.index < TOTAL - 1) {
        session.index += 1;
        session.checked = false;
        persistDraft(session);
        paint();
        return;
      }

      var score = scoreOf(session.answers);
      store.setQuiz(session.answers.slice(), score, TOTAL);
      store.setActivity("evaluacion", { draft: null }, true);
      if (store.markDone("evaluacion")) {
        PVA.audio.play(score >= 4 ? "win" : "unlock");
        PVA.ui.toast("Evaluación completada. Se desbloqueó el Kit Digital.", "ok", 5200);
      } else {
        PVA.audio.play(score >= 4 ? "win" : "ok");
      }

      result = {
        answers: session.answers.slice(),
        score: score,
        attempts: store.state().quiz.attempts
      };
      mode = "result";
      paint();
      var heading = shell.querySelector("#resultTitle");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }

    root.addEventListener("click", function (event) {
      var option = event.target.closest("[data-opt]");
      if (option && shell.contains(option) && mode === "question" && !session.checked) {
        var index = Number(option.getAttribute("data-opt"));
        session.answers[session.index] = index;
        persistDraft(session);
        U.qsa("[data-opt]", shell).forEach(function (node) {
          node.classList.toggle("is-picked", node === option);
        });
        var checkBtn = shell.querySelector('[data-action="check"]');
        if (checkBtn) checkBtn.disabled = false;
        PVA.audio.play("tap");
        return;
      }

      var action = event.target.closest("[data-action]");
      if (!action || !shell.contains(action)) return;
      var name = action.getAttribute("data-action");
      if (name === "check") check();
      if (name === "next") next();
      if (name === "retry") {
        session = { index: 0, answers: emptyAnswers(), checked: false };
        persistDraft(session);
        mode = "question";
        PVA.audio.play("tap");
        paint();
      }
    });

    paint();
  }

  PVA.views = PVA.views || {};
  PVA.views.assessment = { render: render };
})(window);

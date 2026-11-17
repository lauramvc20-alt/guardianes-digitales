/* ==========================================================================
   PVA · RO-BIT, asistente del curso (100 % local, respuestas programadas)
   - Coincidencia de palabras clave + puntuación por tema (robot-kb.js).
   - No usa IA generativa, no llama a servicios externos y no guarda mensajes.
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var KB = PVA.content.robotKb;

  var open = false;
  var started = false;
  var fab, panel, log, form, input, sugg;

  /* ---------- Procesamiento de texto ---------- */
  function norm(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  var topicIndex = KB.topics.map(function (t) {
    return {
      topic: t,
      kws: t.keywords.map(function (k) { return norm(k); })
    };
  });

  function score(entry, q, tokens) {
    var total = 0;
    var padded = " " + q + " ";
    entry.kws.forEach(function (kw) {
      if (!kw) return;
      var words = kw.split(" ").length;
      if (padded.indexOf(" " + kw + " ") !== -1) {
        total += 2 + words * 1.5;
      } else if (words === 1 && kw.length >= 5) {
        for (var i = 0; i < tokens.length; i++) {
          if (tokens[i].length >= 5 && (tokens[i].indexOf(kw) === 0 || kw.indexOf(tokens[i]) === 0)) {
            total += 1.5;
            break;
          }
        }
      }
    });
    return total;
  }

  function findTopic(text) {
    var q = norm(text);
    if (!q) return null;
    var tokens = q.split(" ");
    var best = null, bestScore = 0;
    topicIndex.forEach(function (entry) {
      var s = score(entry, q, tokens);
      if (s > bestScore) { bestScore = s; best = entry.topic; }
    });
    return bestScore >= 2.5 ? best : null;
  }

  function topicById(id) {
    for (var i = 0; i < KB.topics.length; i++) if (KB.topics[i].id === id) return KB.topics[i];
    return null;
  }

  /* ---------- Render ---------- */
  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addUser(text) {
    var el = document.createElement("div");
    el.className = "rb-msg rb-msg--user";
    el.textContent = text;
    log.appendChild(el);
    scrollDown();
  }

  function linksHtml(links) {
    if (!links || !links.length) return "";
    return '<div class="rb-links">' + links.map(function (l) {
      return '<button type="button" class="rb-link" data-go="' + U.esc(l.to) + '">' + U.icon("arrowRight") + U.esc(l.label) + "</button>";
    }).join("") + "</div>";
  }

  function followHtml(ids) {
    var items = (ids || []).map(topicById).filter(Boolean);
    if (!items.length) return "";
    return '<div class="rb-chips" aria-label="Preguntas relacionadas">' + items.map(function (t) {
      return '<button type="button" class="rb-chip" data-ask="' + U.esc(t.title) + '" data-topic="' + t.id + '">' + U.esc(t.title) + "</button>";
    }).join("") + "</div>";
  }

  function addBot(paragraphs, links, follow) {
    var el = document.createElement("div");
    el.className = "rb-msg rb-msg--bot";
    el.innerHTML =
      '<span class="rb-avatar" aria-hidden="true">' + PVA.robot.svg("explain") + "</span>" +
      '<div class="rb-bubble">' +
        paragraphs.map(function (p) { return "<p>" + U.esc(p) + "</p>"; }).join("") +
        linksHtml(links) + followHtml(follow) +
      "</div>";
    log.appendChild(el);
    scrollDown();
  }

  function reduceMotion() {
    return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function respond(topic) {
    var typing = document.createElement("div");
    typing.className = "rb-msg rb-msg--bot rb-typing";
    typing.innerHTML = '<span class="rb-avatar" aria-hidden="true">' + PVA.robot.svg("reflection") +
      '</span><div class="rb-bubble"><span class="rb-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr-only">RO-BIT está escribiendo</span></div>';
    log.appendChild(typing);
    scrollDown();
    setTimeout(function () {
      typing.remove();
      if (topic) {
        addBot(topic.answer, topic.links, topic.follow);
      } else {
        addBot([KB.fallback], KB.fallbackLinks, ["pva", "smishing", "dospasos", "navegacion"]);
      }
    }, reduceMotion() ? 0 : 420);
  }

  function ask(text, topicId) {
    text = String(text || "").trim();
    if (!text) return;
    addUser(text);
    if (sugg) sugg.innerHTML = "";
    var topic = topicId ? topicById(topicId) : findTopic(text);
    if (topic && topic.id === "gracias") {
      respond(topic);
      return;
    }
    respond(topic);
  }

  function renderSuggestions() {
    sugg.innerHTML = KB.suggestions.map(function (s) {
      return '<button type="button" class="rb-chip" data-ask="' + U.esc(s) + '">' + U.esc(s) + "</button>";
    }).join("");
  }

  function start() {
    if (started) return;
    started = true;
    addBot([KB.greeting]);
    renderSuggestions();
  }

  /* ---------- Abrir y cerrar ---------- */
  function setOpen(next, returnFocus) {
    open = next;
    panel.hidden = !open;
    panel.classList.toggle("is-open", open);
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    fab.classList.toggle("is-hidden", open && global.innerWidth <= 640);
    document.body.classList.toggle("robit-open", open);
    if (open) {
      start();
      var tip = document.getElementById("rbTip");
      if (tip) tip.remove();
      setTimeout(function () { input.focus(); }, 60);
    } else if (returnFocus) {
      fab.focus();
    }
  }

  function build() {
    fab = document.createElement("button");
    fab.type = "button";
    fab.className = "rb-fab print-hide";
    fab.id = "rbFab";
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-controls", "rbPanel");
    fab.setAttribute("aria-label", "Abrir el chat con RO-BIT, tu asistente del curso");
    fab.innerHTML = '<span class="rb-fab__robot">' + PVA.robot.svg("welcome") + '</span><span class="rb-fab__label">Pregúntale a RO-BIT</span>';

    panel = document.createElement("section");
    panel.className = "rb-panel print-hide";
    panel.id = "rbPanel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Chat con RO-BIT");
    panel.innerHTML =
      '<header class="rb-head">' +
        '<span class="rb-head__robot" aria-hidden="true">' + PVA.robot.svg("welcome") + "</span>" +
        '<div class="rb-head__t"><strong>RO-BIT</strong><small>Asistente del curso</small></div>' +
        '<button type="button" class="rb-icon" data-close aria-label="Cerrar el chat">' + U.icon("x") + "</button>" +
      "</header>" +
      '<div class="rb-log" id="rbLog" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="rb-sugg" id="rbSugg"></div>' +
      '<form class="rb-form" autocomplete="off">' +
        '<label class="sr-only" for="rbInput">Escribe tu pregunta para RO-BIT</label>' +
        '<input id="rbInput" type="text" maxlength="160" placeholder="Escribe tu pregunta…" enterkeyhint="send" />' +
        '<button type="submit" class="rb-send" aria-label="Enviar pregunta">' + U.icon("send") + "</button>" +
      "</form>" +
      '<p class="rb-note">' + U.icon("info") + "<span>" + U.esc(KB.disclaimer) + "</span></p>";

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    log = panel.querySelector("#rbLog");
    form = panel.querySelector("form");
    input = panel.querySelector("#rbInput");
    sugg = panel.querySelector("#rbSugg");

    fab.addEventListener("click", function () { setOpen(!open, false); });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("[data-close]")) { setOpen(false, true); return; }
      var chip = event.target.closest("[data-ask]");
      if (chip) { ask(chip.getAttribute("data-ask"), chip.getAttribute("data-topic")); return; }
      var go = event.target.closest("[data-go]");
      if (go) {
        PVA.router.go(go.getAttribute("data-go"));
        if (global.innerWidth <= 640) setOpen(false, false);
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = input.value;
      input.value = "";
      ask(text);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && open) setOpen(false, true);
    });

    /* Aviso suave una sola vez por visita, sin guardar nada. */
    var tip = document.createElement("div");
    tip.id = "rbTip";
    tip.className = "rb-tip print-hide";
    tip.setAttribute("role", "status");
    tip.textContent = "¿Dudas? Soy RO-BIT y puedo ayudarte.";
    document.body.appendChild(tip);
    setTimeout(function () { var t = document.getElementById("rbTip"); if (t) t.classList.add("is-in"); }, 1600);
    setTimeout(function () { var t = document.getElementById("rbTip"); if (t) t.remove(); }, 9000);
  }

  PVA.chatbot = { open: function () { setOpen(true, false); }, close: function () { setOpen(false, false); }, findTopic: findTopic };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})(window);

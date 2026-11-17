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
  var STOP = {};
  ("a al algo algun alguna alguno ante como con contra cual cuales cuando de del desde donde e el ella ellos en entre era eres es esa ese eso esta este esto estoy fue ha han hay la las le les lo los me mi mis muy ni no nos o os para pero por porque que quien se si sin sobre son su sus te tengo ti tu tus un una uno unos y ya yo puedo puede quiero quisiera necesito hacer hago haga dime dig explicame cuentame sabes saber")
    .split(" ").forEach(function (w) { if (w) STOP[w] = 1; });

  function norm(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* Raíz aproximada: ignora plurales y terminaciones frecuentes. */
  function stem(w) {
    if (w.length <= 4) return w;
    return w.replace(/(mente|aciones|acion|iones|ion|ando|iendo|ados|adas|ado|ida|idos|ar|er|ir|es|s|o|a)$/, "") .slice(0, 6);
  }

  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      var cur = [i], best = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  var topicIndex = KB.topics.map(function (t) {
    var kws = t.keywords.map(norm).filter(Boolean);
    var stems = {}, words = {};
    kws.forEach(function (k) {
      k.split(" ").forEach(function (w) {
        if (w.length >= 4 && !STOP[w]) { stems[stem(w)] = 1; if (w.length >= 5) words[w] = 1; }
      });
    });
    return { topic: t, kws: kws, stems: stems, words: Object.keys(words) };
  });

  var synIndex = (KB.synonyms || []).map(function (g) {
    return { w: g.w, topics: g.topics, triggers: g.triggers.map(norm) };
  });

  function contentTokens(q) {
    return q.split(" ").filter(function (w) { return w && !STOP[w]; });
  }

  /* Puntúa todos los temas. Devuelve una lista ordenada de {topic, score}. */
  function rank(text) {
    var q = norm(text);
    if (!q) return [];
    var padded = " " + q + " ";
    var tokens = contentTokens(q);
    var scores = {};
    function add(id, v) { scores[id] = (scores[id] || 0) + v; }

    /* 1. Expresiones y sinónimos (relacionan una frase con varios temas) */
    synIndex.forEach(function (g) {
      var hit = g.triggers.some(function (t) { return t && padded.indexOf(" " + t + " ") !== -1; });
      if (hit) g.topics.forEach(function (id, i) { add(id, g.w - i * 0.4); });
    });

    topicIndex.forEach(function (entry) {
      var id = entry.topic.id;
      /* 2. Palabras clave: frase completa pesa más */
      entry.kws.forEach(function (kw) {
        var words = kw.split(" ").length;
        if (padded.indexOf(" " + kw + " ") !== -1) add(id, 2 + words * 1.5);
      });
      /* 3. Raíces de palabras y coincidencia aproximada (errores de escritura) */
      tokens.forEach(function (tok) {
        if (tok.length < 4) return;
        var st = stem(tok);
        if (entry.stems[st]) { add(id, 1.6); return; }
        if (tok.length >= 5) {
          var max = tok.length >= 8 ? 2 : 1;
          for (var n = 0; n < entry.words.length; n++) {
            if (lev(tok, entry.words[n], max) <= max) { add(id, 3); break; }
          }
        }
      });
    });

    return Object.keys(scores).map(function (id) { return { topic: topicById(id), score: scores[id] }; })
      .filter(function (r) { return r.topic; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  /* Decide qué hacer: responder, preguntar «¿te refieres a…?» o reconocer que no sabe. */
  function analyze(text) {
    var r = rank(text);
    if (!r.length) return { type: "none" };
    var s1 = r[0].score, s2 = r[1] ? r[1].score : 0;
    if (s1 >= 4 && s1 >= s2 * 1.3) {
      var extra = r[1] && s2 >= 3 ? [r[1].topic.id] : [];
      return { type: "match", topic: r[0].topic, extra: extra };
    }
    if (s1 >= 3 && s1 >= s2 * 1.6) {
      return { type: "match", topic: r[0].topic, extra: [] };
    }
    if (s1 >= 2.5) {
      return { type: "ambiguous", alts: r.slice(0, 3).filter(function (x) { return x.score >= s1 * 0.5; }).map(function (x) { return x.topic; }) };
    }
    return { type: "none" };
  }

  function findTopic(text) {
    var a = analyze(text);
    return a.type === "match" ? a.topic : null;
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

  function respond(result) {
    var typing = document.createElement("div");
    typing.className = "rb-msg rb-msg--bot rb-typing";
    typing.innerHTML = '<span class="rb-avatar" aria-hidden="true">' + PVA.robot.svg("reflection") +
      '</span><div class="rb-bubble"><span class="rb-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr-only">RO-BIT está escribiendo</span></div>';
    log.appendChild(typing);
    scrollDown();
    setTimeout(function () {
      typing.remove();
      if (result.type === "match") {
        var follow = (result.extra || []).concat(result.topic.follow || []);
        var seen = {};
        follow = follow.filter(function (id) { if (seen[id] || id === result.topic.id) return false; seen[id] = 1; return true; }).slice(0, 3);
        addBot(result.topic.answer, result.topic.links, follow);
      } else if (result.type === "ambiguous") {
        addBot([KB.ambiguous], null, result.alts.map(function (t) { return t.id; }));
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
    var topic = topicId ? topicById(topicId) : null;
    respond(topic ? { type: "match", topic: topic } : analyze(text));
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

  PVA.chatbot = { open: function () { setOpen(true, false); }, close: function () { setOpen(false, false); }, findTopic: findTopic, analyze: analyze };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})(window);

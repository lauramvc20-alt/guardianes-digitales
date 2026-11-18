/* ==========================================================================
   PVA · Visor integrado de recursos
   - Documentos PDF: se dibujan dentro de la plataforma con PDF.js (se carga solo al abrir uno),
     de modo que funcionan igual en celulares, tabletas y computadores.
   - Videos: reproductor HTML5 nativo, responsivo.
   Los archivos se sirven desde la propia plataforma (carpeta recursos/).
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;

  var PDFJS_SRC = "assets/vendor/pdfjs/pdf.min.js";
  var PDFJS_WORKER = "assets/vendor/pdfjs/pdf.worker.min.js";
  var pdfjsPromise = null;
  var active = null;

  function loadPdfJs() {
    if (global.pdfjsLib) return Promise.resolve(global.pdfjsLib);
    if (pdfjsPromise) return pdfjsPromise;
    pdfjsPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = PDFJS_SRC;
      s.onload = function () {
        if (!global.pdfjsLib) { reject(new Error("pdfjs")); return; }
        global.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(global.pdfjsLib);
      };
      s.onerror = function () { pdfjsPromise = null; reject(new Error("pdfjs")); };
      document.head.appendChild(s);
    });
    return pdfjsPromise;
  }

  function fileUrl(path) { return encodeURI(path); }

  function close() {
    if (!active) return;
    var a = active;
    active = null;
    if (a.video) { try { a.video.pause(); } catch (e) {} }
    if (a.observer) a.observer.disconnect();
    if (a.pdf && a.pdf.destroy) { try { a.pdf.destroy(); } catch (e) {} }
    global.removeEventListener("resize", a.onResize);
    document.removeEventListener("keydown", a.onKey, true);
    a.root.remove();
    document.documentElement.classList.remove("viewer-open");
    if (a.opener && a.opener.focus) a.opener.focus({ preventScroll: true });
  }

  function failureHtml(res) {
    return (
      '<div class="viewer__msg" role="alert"><p>No se pudo mostrar este archivo aquí.</p>' +
      '<p class="muted">Puedes abrirlo en una pestaña nueva o descargarlo.</p>' +
      '<p><a class="btn" href="' + U.esc(fileUrl(res.file)) + '" target="_blank" rel="noopener">Abrir en una pestaña nueva</a></p></div>'
    );
  }

  /* ---------- PDF ---------- */
  function renderPdf(state, res) {
    var body = state.body;
    body.innerHTML = '<p class="viewer__loading" role="status">Cargando documento…</p>';
    loadPdfJs().then(function (lib) {
      return lib.getDocument({ url: fileUrl(res.file) }).promise;
    }).then(function (pdf) {
      if (active !== state) { if (pdf.destroy) pdf.destroy(); return; }
      state.pdf = pdf;
      state.meta.textContent = pdf.numPages + (pdf.numPages === 1 ? " página" : " páginas");
      var list = document.createElement("div");
      list.className = "viewer__pages";
      body.innerHTML = "";
      body.appendChild(list);

      var jobs = [];
      for (var n = 1; n <= pdf.numPages; n++) jobs.push(pdf.getPage(n));
      return Promise.all(jobs).then(function (pages) {
        if (active !== state) return;
        var wraps = pages.map(function (page, i) {
          var vp = page.getViewport({ scale: 1 });
          var ratio = vp.width / vp.height;
          /* Ancho máximo según la forma de la página: diapositiva apaisada, hoja vertical o infografía alta. */
          var maxW = ratio >= 1 ? 1120 : ratio > 0.6 ? 860 : 460;
          var wrap = document.createElement("div");
          wrap.className = "viewer__page";
          wrap.style.setProperty("--pw", maxW + "px");
          wrap.style.aspectRatio = vp.width + " / " + vp.height;
          wrap.setAttribute("data-page", String(i + 1));
          var canvas = document.createElement("canvas");
          canvas.setAttribute("role", "img");
          canvas.setAttribute("aria-label", res.name + ", página " + (i + 1) + " de " + pages.length);
          wrap.appendChild(canvas);
          list.appendChild(wrap);
          wrap._page = page;
          return wrap;
        });

        function draw(wrap) {
          var page = wrap._page;
          var width = wrap.clientWidth;
          if (!width) return;
          if (wrap._drawnWidth === width) return;
          wrap._drawnWidth = width;
          var dpr = Math.min(global.devicePixelRatio || 1, 2);
          var base = page.getViewport({ scale: 1 });
          var vp = page.getViewport({ scale: (width * dpr) / base.width });
          var canvas = wrap.firstChild;
          canvas.width = Math.floor(vp.width);
          canvas.height = Math.floor(vp.height);
          wrap.classList.add("is-drawn");
          page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
        }

        if ("IntersectionObserver" in global) {
          state.observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) draw(e.target); });
          }, { root: body, rootMargin: "600px 0px" });
          wraps.forEach(function (w) { state.observer.observe(w); });
        } else {
          wraps.forEach(draw);
        }

        var t = null;
        state.onResize = function () {
          global.clearTimeout(t);
          t = global.setTimeout(function () {
            wraps.forEach(function (w) { w._drawnWidth = 0; });
            if (state.observer) { wraps.forEach(function (w) { state.observer.unobserve(w); state.observer.observe(w); }); }
            else wraps.forEach(draw);
          }, 200);
        };
        global.addEventListener("resize", state.onResize);
      });
    }).catch(function () {
      if (active === state) body.innerHTML = failureHtml(res);
    });
  }

  /* ---------- Video ---------- */
  function renderVideo(state, res) {
    state.meta.textContent = res.duration || "Video";
    state.body.innerHTML =
      '<div class="viewer__stage">' +
        '<video class="viewer__video" controls playsinline preload="metadata" ' +
          'aria-label="' + U.esc(res.name) + '" src="' + U.esc(fileUrl(res.file)) + '#t=0.1">' +
          'Tu navegador no puede reproducir este video. ' +
          '<a href="' + U.esc(fileUrl(res.file)) + '" download>Descárgalo aquí</a>.' +
        "</video>" +
      "</div>";
    state.video = state.body.querySelector("video");
    state.video.addEventListener("error", function () {
      if (active === state) state.body.innerHTML = failureHtml(res);
    });
  }

  function open(res, opener) {
    close();
    var root = document.createElement("div");
    root.className = "viewer";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "viewerTitle");
    root.innerHTML =
      '<div class="viewer__bar">' +
        '<div class="viewer__head"><h2 id="viewerTitle" class="viewer__title">' + U.esc(res.name) + "</h2>" +
        '<span class="viewer__meta" data-viewer-meta></span></div>' +
        '<a class="btn viewer__dl" href="' + U.esc(fileUrl(res.file)) + '" download data-viewer-download>' + U.icon("download") + "<span>Descargar</span></a>" +
        '<button class="icon-btn viewer__close" type="button" data-viewer-close aria-label="Cerrar visor">' + U.icon("x") + "</button>" +
      "</div>" +
      '<div class="viewer__body" data-viewer-body tabindex="0"></div>';
    document.getElementById("modal-root").appendChild(root);
    document.documentElement.classList.add("viewer-open");

    var state = { root: root, body: root.querySelector("[data-viewer-body]"), meta: root.querySelector("[data-viewer-meta]"), opener: opener || null };
    state.onKey = function (e) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key !== "Tab") return;
      var f = U.qsa("a[href], button, [tabindex='0'], video", root).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", state.onKey, true);
    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-viewer-close]")) close();
      var dl = e.target.closest("[data-viewer-download]");
      if (dl && res.onDownload) res.onDownload();
    });
    active = state;
    root.querySelector("[data-viewer-close]").focus({ preventScroll: true });

    if (res.type === "video") renderVideo(state, res); else renderPdf(state, res);
  }

  PVA.viewer = { open: open, close: close };
})(window);

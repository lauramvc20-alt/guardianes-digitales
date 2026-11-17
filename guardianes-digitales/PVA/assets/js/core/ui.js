/* ==========================================================================
   PVA · Interfaz compartida: avisos, modales, barras y estados
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;

  var toastStack = null;

  function ensureToastStack() {
    if (!toastStack) toastStack = document.getElementById("toasts");
    return toastStack;
  }

  function toast(message, kind, duration) {
    var stack = ensureToastStack();
    if (!stack) return;
    var node = document.createElement("div");
    var iconName = kind === "lock" ? "lock" : kind === "ok" ? "shieldCheck" : "info";
    node.className = "toast toast--" + (kind || "info");
    node.setAttribute("role", "status");
    node.innerHTML =
      U.icon(iconName, "toast__icon") +
      '<div class="toast__body">' + U.esc(message) + "</div>";
    stack.appendChild(node);

    var life = duration || 4200;
    var timer = global.setTimeout(function () { dismiss(); }, life);

    function dismiss() {
      global.clearTimeout(timer);
      node.classList.add("is-leaving");
      global.setTimeout(function () {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, 240);
    }

    node.addEventListener("click", dismiss);
    return dismiss;
  }

  /* ----------------------------------------------------------- confirmación */
  function confirmDialog(options) {
    var opts = options || {};
    return new Promise(function (resolve) {
      var root = document.getElementById("modal-root");
      var scrim = document.getElementById("scrim");
      if (!root) { resolve(false); return; }

      var previousFocus = document.activeElement;
      root.innerHTML =
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">' +
          '<div class="modal__card">' +
            '<span class="kicker ' + (opts.danger ? "kicker--coral" : "kicker--violet") + '">' +
              U.esc(opts.kicker || "Confirmación") +
            "</span>" +
            '<h2 id="modalTitle" style="margin-top:.4rem">' + U.esc(opts.title || "¿Continuar?") + "</h2>" +
            '<p class="muted" style="margin-top:.6rem">' + U.esc(opts.body || "") + "</p>" +
            '<div class="modal__actions">' +
              '<button class="btn btn--ghost" type="button" data-modal="cancel">' +
                U.esc(opts.cancelLabel || "Cancelar") +
              "</button>" +
              '<button class="btn ' + (opts.danger ? "btn--coral" : "") + '" type="button" data-modal="ok">' +
                U.esc(opts.confirmLabel || "Continuar") +
              "</button>" +
            "</div>" +
          "</div>" +
        "</div>";

      if (scrim) { scrim.hidden = false; }

      var modal = root.querySelector(".modal");
      var card = root.querySelector(".modal__card");
      var focusables = card.querySelectorAll("button, [href], input, select, textarea");
      var okBtn = card.querySelector('[data-modal="ok"]');
      if (okBtn) okBtn.focus();

      function close(result) {
        document.removeEventListener("keydown", onKey);
        if (scrim) scrim.hidden = true;
        root.innerHTML = "";
        if (previousFocus && previousFocus.focus) previousFocus.focus();
        resolve(result);
      }

      function onKey(event) {
        if (event.key === "Escape") { event.preventDefault(); close(false); return; }
        if (event.key !== "Tab" || !focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }

      modal.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-modal]");
        if (btn) close(btn.getAttribute("data-modal") === "ok");
      });
      if (scrim) scrim.addEventListener("click", function () { close(false); });
      document.addEventListener("keydown", onKey);
    });
  }

  /* --------------------------------------------------------------- piezas */
  function progressBar(value, extraClass, label) {
    var pct = U.clamp(Math.round(value || 0), 0, 100);
    return (
      '<div class="bar ' + (extraClass || "") + '" role="progressbar" aria-label="' + U.esc(label || "Progreso") + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '">' +
        '<div class="bar__fill" style="width:' + pct + '%"></div>' +
      "</div>"
    );
  }

  function chip(text, kind) {
    return '<span class="chip ' + (kind ? "chip--" + kind : "") + '">' + U.esc(text) + "</span>";
  }

  function lockBadge() {
    return '<span class="chip chip--coral">' + U.icon("lock") + " Bloqueado</span>";
  }

  function doneBadge() {
    return '<span class="chip chip--turq">' + U.icon("check") + " Completado</span>";
  }

  function scrollToTop() {
    var view = document.getElementById("view");
    if (!view) return;
    var top = view.getBoundingClientRect().top + global.scrollY - 80;
    global.scrollTo({ top: Math.max(0, top), behavior: U.reduceMotion() ? "auto" : "smooth" });
  }

  function focusView() {
    var view = document.getElementById("view");
    if (!view) return;
    var heading = view.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    } else {
      view.focus({ preventScroll: true });
    }
  }

  PVA.ui = {
    toast: toast,
    confirm: confirmDialog,
    progressBar: progressBar,
    chip: chip,
    lockBadge: lockBadge,
    doneBadge: doneBadge,
    scrollToTop: scrollToTop,
    focusView: focusView
  };
})(window);

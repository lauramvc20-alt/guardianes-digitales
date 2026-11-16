/* ==========================================================================
   PVA · Utilidades, iconografía y helpers de DOM
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = (global.PVA = global.PVA || {});

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function on(target, type, handler, options) {
    if (!target) return function () {};
    target.addEventListener(type, handler, options);
    return function () { target.removeEventListener(type, handler, options); };
  }

  /* Delegación de eventos sencilla */
  function delegate(root, selector, type, handler) {
    return on(root, type, function (event) {
      var node = event.target.closest(selector);
      if (node && root.contains(node)) handler(event, node);
    });
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function formatDate(value) {
    var date = value ? new Date(value) : new Date();
    if (isNaN(date.getTime())) date = new Date();
    return pad(date.getDate()) + "/" + pad(date.getMonth() + 1) + "/" + date.getFullYear();
  }

  function formatLongDate(value) {
    var date = value ? new Date(value) : new Date();
    if (isNaN(date.getTime())) date = new Date();
    try {
      return date.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return formatDate(value);
    }
  }

  function plural(n, one, many) { return n === 1 ? one : many; }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  /* ---------------------------------------------------------------- iconos */
  var paths = {
    shield: '<path d="M12 3 20 6v6c0 4.4-3.1 8.1-8 9.8C7.1 20.1 4 16.4 4 12V6l8-3Z"/>',
    shieldCheck: '<path d="M12 3 20 6v6c0 4.4-3.1 8.1-8 9.8C7.1 20.1 4 16.4 4 12V6l8-3Z"/><path d="m8.6 11.8 2.3 2.4 4.5-4.7"/>',
    lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2.6"/><path d="M8 10V7.4a4 4 0 0 1 8 0V10"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrowRight: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    arrowLeft: '<path d="M20 12H5"/><path d="m11 18-6-6 6-6"/>',
    play: '<path d="M8 5.5v13l11-6.5-11-6.5Z"/>',
    soundOn: '<path d="M4 9.5h3.5L12 6v12L7.5 14.5H4v-5Z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/>',
    soundOff: '<path d="M4 9.5h3.5L12 6v12L7.5 14.5H4v-5Z"/><path d="m16 9.5 5 5"/><path d="m21 9.5-5 5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    layers: '<path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z"/><path d="m4 12.5 8 4.2 8-4.2"/><path d="m4 16.8 8 4.2 8-4.2"/>',
    route: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M6 15.8V10a4 4 0 0 1 4-4h5.8"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1"/>',
    book: '<path d="M5 4.5h5.5a3 3 0 0 1 3 3V20a2.4 2.4 0 0 0-2.4-2.4H5V4.5Z"/><path d="M19 4.5h-2.5a3 3 0 0 0-3 3V20a2.4 2.4 0 0 1 2.4-2.4H19V4.5Z"/>',
    guide: '<path d="M6 3.5h9.5L19 7v13.5H6V3.5Z"/><path d="M15 3.5V7h4"/><path d="M9 11h7M9 14.5h7M9 18h4"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17.5 4.5-4.5 3 3 3-3 3.5 3.5"/>',
    map: '<path d="M9 4.5 3.5 6.8v13L9 17.5l6 2.4 5.5-2.3v-13L15 6.8 9 4.5Z"/><path d="M9 4.5v13M15 6.8v13"/>',
    star: '<path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.8l5.9-.9L12 3.6Z"/>',
    grad: '<path d="M2.5 8.5 12 4.5l9.5 4L12 12.5 2.5 8.5Z"/><path d="M6.5 10.3v4.6c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4.6"/><path d="M21 9v5.5"/>',
    warning: '<path d="M12 4 21 19.5H3L12 4Z"/><path d="M12 9.5v4.6"/><path d="M12 17h.01"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c0-3.1 2.7-5.2 6-5.2s6 2.1 6 5.2"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6"/><path d="M17.5 14.6c2.1.6 3.5 2.3 3.5 4.4"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4.5V10h-5.2"/>',
    trophy: '<path d="M8 4.5h8v4.2a4 4 0 0 1-8 0V4.5Z"/><path d="M8 6H5.2v1.6A3.2 3.2 0 0 0 8 10.8"/><path d="M16 6h2.8v1.6a3.2 3.2 0 0 1-2.8 3.2"/><path d="M12 12.8V17"/><path d="M8.5 20h7"/><path d="M10 17h4"/>',
    sms: '<path d="M20.5 12.4c0 4.1-3.8 7.4-8.5 7.4a10 10 0 0 1-2.6-.3L4.5 21l1.1-3.6a6.9 6.9 0 0 1-2.1-5c0-4.1 3.8-7.4 8.5-7.4s8.5 3.3 8.5 7.4Z"/>',
    phone: '<path d="M7.5 3.8h-2A2 2 0 0 0 3.6 6c.4 7.4 6.9 13.9 14.3 14.3a2 2 0 0 0 2.1-2v-2a1.6 1.6 0 0 0-1.3-1.6l-2.6-.5a1.6 1.6 0 0 0-1.6.7l-.8 1.2a12.6 12.6 0 0 1-5.6-5.6l1.2-.8a1.6 1.6 0 0 0 .7-1.6l-.5-2.6a1.6 1.6 0 0 0-1.6-1.3Z"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7.5 8 5.6 8-5.6"/>',
    briefcase: '<rect x="3.5" y="7.5" width="17" height="12" rx="2.4"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/><path d="M3.5 12.5h17"/>',
    flag: '<path d="M6 3.5v17"/><path d="M6 4.8h9.5l-1.4 3.2 1.4 3.2H6"/>',
    eye: '<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12Z"/><circle cx="12" cy="12" r="3"/>',
    sparkle: '<path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 18l-1.6-5.8L5 10.6 10.4 9 12 3.5Z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
    download: '<path d="M12 4v11"/><path d="m7.5 11 4.5 4.5L16.5 11"/><path d="M4.5 19.5h15"/>',
    link: '<path d="M10 13.8a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7L11 7.1"/><path d="M14 10.2a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 0 0 5.7 5.7l1.8-1.8"/>',
    user: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c0-3.4 3.1-5.6 7-5.6s7 2.2 7 5.6"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5.2-5.2 2 2-5.2 5.2-2Z"/>',
    bolt: '<path d="M13.5 3 6 13.2h4.6L10 21l7.6-10.4H13l.5-7.6Z"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2.6"/><path d="M3 10h18"/><path d="M7 14.5h4"/>',
    puzzle: '<path d="M10 4.5h4v2.2a2 2 0 1 0 2.8 2.8H19v4h-2.2a2 2 0 1 0-2.8 2.8v2.2h-4v-2.2a2 2 0 1 0-2.8-2.8H5v-4h2.2A2 2 0 1 0 10 6.7V4.5Z"/>',
    seal: '<circle cx="12" cy="9.5" r="5.5"/><path d="m8.5 14.2-1 6.3 4.5-2.4 4.5 2.4-1-6.3"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v6"/><path d="M12 7.5h.01"/>',
    eyeOff: '<path d="M4 4.5 20 20.5"/><path d="M9.7 5.9A9.6 9.6 0 0 1 12 5.8c5.8 0 9.2 6.2 9.2 6.2a17 17 0 0 1-2.9 3.6"/><path d="M6.3 7.6A16.6 16.6 0 0 0 2.8 12s3.4 6.2 9.2 6.2a9.7 9.7 0 0 0 3.9-.8"/>'
  };

  function icon(name, cls, size) {
    var body = paths[name];
    if (!body) return "";
    var attrs = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
    if (size) attrs += ' width="' + size + '" height="' + size + '"';
    return '<svg class="' + (cls || "ico") + '" ' + attrs + ">" + body + "</svg>";
  }

  function reduceMotion() {
    return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  PVA.utils = {
    esc: esc,
    qs: qs,
    qsa: qsa,
    on: on,
    delegate: delegate,
    formatDate: formatDate,
    formatLongDate: formatLongDate,
    plural: plural,
    clamp: clamp,
    icon: icon,
    reduceMotion: reduceMotion
  };
})(window);

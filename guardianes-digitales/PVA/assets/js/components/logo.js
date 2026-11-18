/* ==========================================================================
   PVA · Logo "Guardián": hexágono vigía con un ojo cuya pupila es el símbolo de pausa.
   Pausa (pupila) + Verifica (ojo) + Guardián (hexágono que vigila).
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = (global.PVA = global.PVA || {});
  var uid = 0;

  function svg(opts) {
    opts = opts || {};
    var id = "pvaLg" + ++uid;
    var title = opts.title ? "<title>" + opts.title + "</title>" : "";
    var role = opts.title ? 'role="img"' : 'role="presentation" aria-hidden="true"';
    return (
      '<svg class="logo-mark" viewBox="0 0 48 48" ' + role + ' focusable="false">' + title +
        "<defs>" +
          '<linearGradient id="' + id + '" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">' +
            '<stop offset="0" stop-color="#6ff0d3"/><stop offset="0.55" stop-color="#4fe0c1"/>' +
            '<stop offset="1" stop-color="#a98cff"/>' +
          "</linearGradient>" +
        "</defs>" +
        /* Hexágono con esquinas suaves */
        '<path d="M24 3.2 42 13.4v21.2L24 44.8 6 34.6V13.4L24 3.2Z" fill="url(#' + id + ')" ' +
          'stroke="url(#' + id + ')" stroke-width="3" stroke-linejoin="round"/>' +
        /* Ojo: verificar */
        '<path d="M9.8 24C13.4 17.6 18.4 14.4 24 14.4S34.6 17.6 38.2 24C34.6 30.4 29.6 33.6 24 33.6S13.4 30.4 9.8 24Z" ' +
          'fill="#0b1226"/>' +
        /* Pupila: pausa */
        '<rect x="19.2" y="19.2" width="3.6" height="9.6" rx="1.4" fill="#4fe0c1"/>' +
        '<rect x="25.2" y="19.2" width="3.6" height="9.6" rx="1.4" fill="#4fe0c1"/>' +
      "</svg>"
    );
  }

  /* Favicon en data URI (sin pedir archivos extra). */
  function faviconHref() {
    var s =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' +
      '<defs><linearGradient id="g" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="#6ff0d3"/><stop offset="1" stop-color="#a98cff"/></linearGradient></defs>' +
      '<path d="M24 3.2 42 13.4v21.2L24 44.8 6 34.6V13.4L24 3.2Z" fill="url(#g)" stroke="url(#g)" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M9.8 24C13.4 17.6 18.4 14.4 24 14.4S34.6 17.6 38.2 24C34.6 30.4 29.6 33.6 24 33.6S13.4 30.4 9.8 24Z" fill="#0b1226"/>' +
      '<rect x="19.2" y="19.2" width="3.6" height="9.6" rx="1.4" fill="#4fe0c1"/>' +
      '<rect x="25.2" y="19.2" width="3.6" height="9.6" rx="1.4" fill="#4fe0c1"/></svg>';
    return "data:image/svg+xml," + encodeURIComponent(s);
  }

  PVA.logo = { svg: svg, faviconHref: faviconHref };
})(window);

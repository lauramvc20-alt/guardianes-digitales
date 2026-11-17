/* ==========================================================================
   PVA · Sección de contexto (se integra en el panel principal)
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;

  function fmt(n) { return String(n).replace(".", ","); }

  function peopleRow(item, total) {
    var dots = "";
    for (var i = 0; i < total; i++) {
      dots += '<i class="pdot' + (i < item.count ? " is-on" : "") + '"></i>';
    }
    return (
      '<div class="ctx-people ctx-people--' + item.tone + '">' +
        '<div class="ctx-people__num"><b>' + fmt(item.value) + '<small> %</small></b></div>' +
        '<div class="ctx-people__body">' +
          '<p>' + U.esc(item.label) + "</p>" +
          '<div class="pdots" role="img" aria-label="' + item.count + " de " + total + ' personas">' + dots + "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function channelBar(item) {
    return (
      '<div class="ctx-bar">' +
        '<span class="ctx-bar__ico" aria-hidden="true">' + U.icon(item.icon) + "</span>" +
        '<div class="ctx-bar__body">' +
          '<div class="ctx-bar__top"><b>' + fmt(item.value) + " %</b></div>" +
          '<div class="ctx-bar__track" role="img" aria-label="' + fmt(item.value) + ' por ciento"><span style="--w:' + item.value + '%"></span></div>' +
          "<p>" + U.esc(item.label) + "</p>" +
        "</div>" +
      "</div>"
    );
  }

  function html() {
    var C = PVA.content.context;
    var R = C.reality, S = C.survey, W = C.why;

    return (
      '<section class="context" id="contexto" aria-labelledby="ctxTitle">' +
        '<header class="context__head">' +
          '<span class="kicker kicker--violet">' + U.esc(C.kicker) + "</span>" +
          '<h2 id="ctxTitle">' + U.esc(C.title) + "</h2>" +
          '<p class="lede">' + U.esc(C.lede) + "</p>" +
        "</header>" +

        '<div class="context__grid">' +
          '<article class="ctx-card ctx-card--reality">' +
            '<h3><span class="ctx-n">A</span>' + U.esc(R.title) + "</h3>" +
            "<p>" + U.esc(R.text) + "</p>" +
            '<ul class="ctx-channels">' +
              R.channels.map(function (c) {
                return '<li><span aria-hidden="true">' + U.icon(c.icon) + "</span>" + U.esc(c.label) + "</li>";
              }).join("") +
            "</ul>" +
          "</article>" +

          '<article class="ctx-card ctx-card--survey">' +
            '<h3><span class="ctx-n">B</span>' + U.esc(S.title) + "</h3>" +
            '<div class="ctx-survey">' +
              '<div class="ctx-survey__people">' +
                S.people.map(function (p) { return peopleRow(p, S.sampleN); }).join("") +
              "</div>" +
              '<div class="ctx-survey__channels">' +
                S.channels.map(channelBar).join("") +
              "</div>" +
            "</div>" +
            '<p class="ctx-method" role="note">' + U.icon("info") + "<span>" + U.esc(S.method) + "</span></p>" +
          "</article>" +

          '<article class="ctx-card ctx-card--why">' +
            '<h3><span class="ctx-n">C</span>' + U.esc(W.title) + "</h3>" +
            "<p>" + U.esc(W.text) + "</p>" +
            '<ul class="ctx-levers">' +
              W.levers.map(function (l) {
                return '<li><span aria-hidden="true">' + U.icon(l.icon) + "</span><div><b>" + U.esc(l.title) +
                  "</b><small>" + U.esc(l.text) + "</small></div></li>";
              }).join("") +
            "</ul>" +
            '<div class="ctx-conseq"><span class="ctx-conseq__t">Pueden afectar</span>' +
              W.consequences.map(function (c) {
                return '<span class="chip">' + U.icon(c.icon) + " " + U.esc(c.label) + "</span>";
              }).join("") +
            "</div>" +
            '<p class="ctx-closing">' + U.icon("shieldCheck") + "<span>" + U.esc(W.closing) + "</span></p>" +
          "</article>" +
        "</div>" +
      "</section>"
    );
  }

  PVA.views = PVA.views || {};
  PVA.views.context = { html: html };
})(window);

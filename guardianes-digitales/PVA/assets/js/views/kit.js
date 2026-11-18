/* ==========================================================================
   PVA · Kit Digital
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;
  var KIT = PVA.content.kit;

  function countOpened(opened) {
    return KIT.resources.filter(function (r) { return !!opened[r.id]; }).length;
  }

  function render(root) {
    var act = store.activity("kit");
    var opened = act.opened || {};
    var done = store.isDone("kit");
    var total = KIT.resources.length;

    var cards = KIT.resources.map(function (resource) {
      var isOpen = !!opened[resource.id];
      var href = U.esc(encodeURI(resource.file));
      return (
        '<article class="kit-card">' +
          '<span class="kit-card__icon">' + U.icon(resource.icon) + "</span>" +
          "<h3>" + U.esc(resource.name) + "</h3>" +
          '<p class="kit-card__kind">' + U.esc(resource.kind) + "</p>" +
          "<p>" + U.esc(resource.description) + "</p>" +
          '<p class="kit-card__file">' + U.esc(resource.meta) + "</p>" +
          '<div class="kit-card__actions">' +
            '<button class="btn" type="button" data-view="' + resource.id + '">' +
              U.icon(resource.type === "video" ? "play" : "eye") + (resource.type === "video" ? " Reproducir" : " Ver") +
            "</button>" +
            '<a class="btn btn--ghost" href="' + href + '" download data-resource="' + resource.id + '">' +
              U.icon("download") + " Descargar" +
            "</a>" +
          "</div>" +
          '<span class="tiny kit-card__seen" data-opened-note="' + resource.id + '"' +
            (isOpen ? "" : " hidden") + ">" +
            U.icon("check") + " Consultado" +
          "</span>" +
        "</article>"
      );
    }).join("");

    var openedCount = countOpened(opened);

    root.innerHTML =
      '<div class="page-head enter">' +
        '<span class="kicker">Cierre · Recursos</span>' +
        '<div class="page-head__row">' +
          "<h1>" + U.esc(KIT.title) + "</h1>" +
          '<span class="chip chip--turq">' + U.icon("download") + " Acceso gratuito</span>" +
        "</div>" +
        '<p class="lede">' + U.esc(KIT.lede) + "</p>" +
        '<div class="module-head__meta">' +
          '<span class="chip">' + U.icon("layers") + " " + total + " recursos</span>" +
          '<span class="chip">' + U.icon("eye") + " Ver y descargar</span>" +
          (done ? '<span class="chip chip--turq">' + U.icon("check") + " Kit revisado</span>" : "") +
        "</div>" +
      "</div>" +

      '<section class="kit-grid" style="margin-top:1.2rem" aria-label="Recursos del Kit Digital">' +
        cards +
      "</section>" +

      '<section class="panel pad panel--petrol" style="margin-top:1.4rem" aria-labelledby="kitNextTitle">' +
        '<div class="page-head__row">' +
          "<div>" +
            '<span class="kicker">Siguiente paso</span>' +
            '<h2 id="kitNextTitle" style="margin-top:.35rem">Del Kit al certificado</h2>' +
            '<p class="muted tiny" data-kit-count>' + openedCount + " de " + total +
              " recursos consultados.</p>" +
          "</div>" +
          '<button class="btn" type="button" data-finish>' +
            (done ? "Ir al certificado " : "Kit revisado, continuar ") + U.icon("arrowRight") +
          "</button>" +
        "</div>" +
        '<p class="tiny muted" style="margin-top:.9rem">' + U.esc(KIT.note) + "</p>" +
        '<p class="tiny muted">Puedes continuar sin consultar todos los recursos: seguirán ' +
        "disponibles en esta página.</p>" +
      "</section>";

    function refreshCount() {
      var node = root.querySelector("[data-kit-count]");
      if (node) node.textContent = countOpened(opened) + " de " + total + " recursos consultados.";
    }

    function markOpened(id) {
      opened[id] = true;
      store.setActivity("kit", { opened: opened });
      var note = root.querySelector('[data-opened-note="' + id + '"]');
      if (note) note.hidden = false;
      refreshCount();
    }

    root.addEventListener("click", function (event) {
      var view = event.target.closest("[data-view]");
      if (view && root.contains(view)) {
        var rid = view.getAttribute("data-view");
        var res = KIT.resources.filter(function (r) { return r.id === rid; })[0];
        if (res) {
          PVA.audio.play("tap");
          markOpened(rid);
          PVA.viewer.open(Object.assign({}, res, { onDownload: function () { markOpened(rid); } }), view);
        }
        return;
      }

      var link = event.target.closest("[data-resource]");
      if (link && root.contains(link)) {
        markOpened(link.getAttribute("data-resource"));
        PVA.audio.play("tap");
        return;
      }

      var finish = event.target.closest("[data-finish]");
      if (finish && root.contains(finish)) {
        if (store.markDone("kit")) {
          PVA.audio.play("unlock");
          PVA.ui.toast("Kit Digital revisado. Sigamos con tu certificado.", "ok");
        }
        PVA.router.go("/certificado");
      }
    });
  }

  PVA.views = PVA.views || {};
  PVA.views.kit = { render: render };
})(window);

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

  function videoPanel() {
    var v = KIT.video;
    if (!v) return "";
    var steps = v.steps.map(function (x) { return "<li>" + U.esc(x) + "</li>"; }).join("");
    return (
      '<section class="panel pad kit-video" style="margin-top:1.2rem" aria-labelledby="kitVideoTitle">' +
        '<div class="kit-video__media">' +
          '<video class="kit-video__player" controls preload="metadata" playsinline ' +
            'poster="' + U.esc(v.poster) + '" aria-label="' + U.esc(v.title) + '">' +
            '<source src="' + U.esc(v.src) + '" type="video/mp4" />' +
            '<track kind="subtitles" srclang="es" label="Español" src="' + U.esc(v.captions) + '" default />' +
            "Tu navegador no puede reproducir este video. " +
            '<a href="' + U.esc(v.src) + '">Descárgalo aquí</a>.' +
          "</video>" +
        "</div>" +
        '<div class="kit-video__info">' +
          '<span class="kicker">' + U.esc(v.kicker) + "</span>" +
          '<h2 id="kitVideoTitle">' + U.esc(v.title) + "</h2>" +
          '<p class="muted">' + U.esc(v.description) + "</p>" +
          '<ol class="kit-video__steps">' + steps + "</ol>" +
          '<p class="tiny muted">Los subtítulos se activan desde el botón CC del reproductor. ' +
            '<a href="' + U.esc(v.captioned) + '" download>Descargar versión con subtítulos incrustados</a></p>' +
        "</div>" +
      "</section>"
    );
  }

  function render(root) {
    var act = store.activity("kit");
    var opened = act.opened || {};
    var done = store.isDone("kit");
    var total = KIT.resources.length;

    var cards = KIT.resources.map(function (resource, index) {
      var isOpen = !!opened[resource.id];
      return (
        '<article class="kit-card">' +
          '<span class="kit-card__icon">' + U.icon(resource.icon) + "</span>" +
          '<span class="kicker kicker--violet">Recurso ' + (index + 1) + "</span>" +
          "<h3>" + U.esc(resource.name) + "</h3>" +
          '<p class="tiny muted" style="margin-top:-.3rem">' + U.esc(resource.kind) + "</p>" +
          "<p>" + U.esc(resource.description) + "</p>" +
          '<a class="btn btn--ghost" href="' + U.esc(resource.url) + '" target="_blank" ' +
            'rel="noopener noreferrer" data-resource="' + resource.id + '">' +
            U.icon("link") + " Abrir recurso" +
          "</a>" +
          '<span class="tiny" data-opened-note="' + resource.id + '" style="color:var(--turq)"' +
            (isOpen ? "" : " hidden") + ">" +
            U.icon("check") + " Abierto desde esta plataforma" +
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
          '<span class="chip">' + U.icon("link") + " Google Drive</span>" +
          (done ? '<span class="chip chip--turq">' + U.icon("check") + " Kit revisado</span>" : "") +
        "</div>" +
      "</div>" +

      PVA.robot.bubble(
        "celebration",
        "Completaste la evaluación. Este Kit es tuyo: descárgalo, guárdalo y compártelo " +
        "con alguien que pueda necesitarlo."
      ) +

      videoPanel() +

      '<section class="kit-grid" style="margin-top:1.2rem" aria-label="Recursos del Kit Digital">' +
        cards +
      "</section>" +

      '<section class="panel pad panel--petrol" style="margin-top:1.4rem" aria-labelledby="kitNextTitle">' +
        '<div class="page-head__row">' +
          "<div>" +
            '<span class="kicker">Siguiente paso</span>' +
            '<h2 id="kitNextTitle" style="margin-top:.35rem">Del Kit al certificado</h2>' +
            '<p class="muted tiny" data-kit-count>' + openedCount + " de " + total +
              " recursos abiertos desde esta plataforma.</p>" +
          "</div>" +
          '<button class="btn" type="button" data-finish>' +
            (done ? "Ir al certificado " : "Kit revisado, continuar ") + U.icon("arrowRight") +
          "</button>" +
        "</div>" +
        '<p class="tiny muted" style="margin-top:.9rem">' + U.esc(KIT.note) + "</p>" +
        '<p class="tiny muted">Puedes continuar sin abrir todos los recursos: los enlaces ' +
        "seguirán disponibles en esta página. La plataforma no descarga ni copia los archivos; " +
        "solo enlaza a las carpetas oficiales del proyecto.</p>" +
      "</section>";

    function refreshCount() {
      var node = root.querySelector("[data-kit-count]");
      if (node) node.textContent = countOpened(opened) + " de " + total + " recursos abiertos desde esta plataforma.";
    }

    root.addEventListener("click", function (event) {
      var link = event.target.closest("[data-resource]");
      if (link && root.contains(link)) {
        var id = link.getAttribute("data-resource");
        opened[id] = true;
        store.setActivity("kit", { opened: opened });
        var note = root.querySelector('[data-opened-note="' + id + '"]');
        if (note) note.hidden = false;
        refreshCount();
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

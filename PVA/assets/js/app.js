/* ==========================================================================
   PVA · Arranque de la aplicación: navegación, sonido, reinicio y menú móvil
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var U = PVA.utils;
  var store = PVA.store;

  var rail = document.getElementById("rail");
  var nav = document.getElementById("nav");
  var railProgress = document.getElementById("railProgress");
  var menuBtn = document.getElementById("menuBtn");
  var scrim = document.getElementById("scrim");
  var soundBtn = document.getElementById("soundBtn");
  var soundIcon = document.getElementById("soundIcon");
  var resetBtn = document.getElementById("resetBtn");

  var NAV_GROUPS = [
    {
      label: "Inicio",
      items: [
        { path: "/", label: "Panel del estudiante", short: "Tu avance y siguiente paso", icon: "layers" },
        { stage: "bienvenida" },
        { path: "/ruta", label: "Ruta de módulos", short: "Mapa completo del curso", icon: "route" }
      ]
    },
    {
      label: "Aprendizaje",
      items: [{ stage: "m1" }, { stage: "m2" }, { stage: "m3" }, { stage: "m4" }]
    },
    {
      label: "Cierre",
      items: [{ stage: "evaluacion" }, { stage: "kit" }, { stage: "certificado" }, { stage: "encuesta" }]
    }
  ];

  function missingLabel(stage) {
    for (var i = 0; i < stage.requires.length; i++) {
      if (!store.isDone(stage.requires[i])) {
        var dep = store.stageById(stage.requires[i]);
        return dep ? dep.navLabel : "la etapa anterior";
      }
    }
    return "";
  }

  function itemBody(label, short, iconName, badge) {
    return (
      '<span class="nav-item__index" aria-hidden="true">' + U.icon(iconName) + "</span>" +
      '<span class="nav-item__label"><span>' + U.esc(label) + "</span>" +
        "<small>" + U.esc(short) + "</small></span>" +
      (badge ? '<span class="nav-item__badge" aria-hidden="true">' + badge + "</span>" : "")
    );
  }

  function navItem(item) {
    if (item.stage) {
      var stage = store.stageById(item.stage);
      if (!stage) return "";
      var done = store.isDone(stage.id);
      var unlocked = store.isUnlocked(stage.id);
      var badge = done ? U.icon("check") : !unlocked ? U.icon("lock") : "";
      if (!unlocked) {
        return (
          '<span class="nav-item is-locked" role="link" aria-disabled="true" ' +
            'title="' + U.esc("Se abre al completar " + missingLabel(stage)) + '">' +
            itemBody(stage.navLabel, stage.short, stage.icon, badge) +
            '<span class="sr-only">. Etapa bloqueada. Se abre al completar ' +
              U.esc(missingLabel(stage)) + ".</span>" +
          "</span>"
        );
      }
      return (
        '<a class="nav-item' + (done ? " is-done" : "") + '" href="' + stage.route + '" ' +
          'data-path="' + stage.route.replace("#", "") + '">' +
          itemBody(stage.navLabel, stage.short, stage.icon, badge) +
        "</a>"
      );
    }

    return (
      '<a class="nav-item" href="#' + item.path + '" data-path="' + item.path + '">' +
        itemBody(item.label, item.short, item.icon, "") +
      "</a>"
    );
  }

  function renderNav() {
    if (!nav) return;
    nav.innerHTML = NAV_GROUPS.map(function (group) {
      return (
        '<div class="rail__group">' + U.esc(group.label) + "</div>" +
        group.items.map(navItem).join("")
      );
    }).join("");
    setActiveNav(PVA.router ? PVA.router.currentPath() : "/");
  }

  function setActiveNav(path) {
    if (!nav) return;
    U.qsa("[data-path]", nav).forEach(function (link) {
      if (link.getAttribute("data-path") === path) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function renderProgress() {
    if (!railProgress) return;
    var percent = store.percent();
    var count = store.completedCount();
    var total = store.STAGES.length;
    railProgress.innerHTML =
      '<div class="mini-progress__head"><span>Avance</span><b>' + percent + " %</b></div>" +
      '<div class="bar" role="progressbar" aria-label="Avance del curso" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '">' +
        '<div class="bar__fill" style="width:' + percent + '%"></div>' +
      "</div>" +
      '<p class="mini-progress__sub">' + count + " de " + total + " etapas completadas</p>";
  }

  function renderSound() {
    if (!soundBtn || !soundIcon) return;
    var on = !!store.state().sound;
    soundIcon.innerHTML = U.icon(on ? "soundOn" : "soundOff");
    soundBtn.setAttribute("aria-pressed", on ? "true" : "false");
    soundBtn.setAttribute("aria-label", on ? "Silenciar sonidos" : "Activar sonidos");
    soundBtn.setAttribute("title", on ? "Sonido activado: pulsa para silenciar" : "Sonido desactivado: pulsa para activar");
  }

  function openMenu() {
    if (!rail || !menuBtn) return;
    rail.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    if (scrim) scrim.hidden = false;
    document.body.classList.add("nav-open");
    var first = rail.querySelector(".nav-item");
    if (first) first.focus();
  }

  function closeMenu(returnFocus) {
    if (!rail || !menuBtn) return;
    var wasOpen = rail.classList.contains("is-open");
    rail.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    if (scrim) scrim.hidden = true;
    document.body.classList.remove("nav-open");
    if (wasOpen && returnFocus) menuBtn.focus();
  }

  function bindUi() {
    if (menuBtn) {
      menuBtn.addEventListener("click", function () {
        if (rail.classList.contains("is-open")) closeMenu(true);
        else openMenu();
      });
    }

    if (scrim) scrim.addEventListener("click", function () { closeMenu(false); });

    if (nav) {
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) closeMenu(false);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && rail && rail.classList.contains("is-open")) {
        closeMenu(true);
      }
    });

    global.addEventListener("resize", function () {
      if (global.innerWidth > 940) closeMenu(false);
    });

    if (soundBtn) {
      soundBtn.addEventListener("click", function () {
        var next = !store.state().sound;
        store.setSound(next);
        PVA.audio.setEnabled(next);
        renderSound();
        if (next) PVA.audio.play("tap");
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        PVA.ui.confirm({
          kicker: "Reiniciar recorrido",
          title: "¿Empezar de nuevo?",
          body:
            "Se borrarán el avance, tus respuestas, tus compromisos y el nombre del " +
            "certificado guardados en este navegador. Los recursos externos del Kit " +
            "no se modifican.",
          confirmLabel: "Sí, reiniciar",
          cancelLabel: "Conservar mi avance",
          danger: true
        }).then(function (confirmed) {
          if (!confirmed) return;
          store.reset();
          PVA.audio.setEnabled(store.state().sound);
          renderSound();
          closeMenu(false);
          PVA.router.go("/", true);
          PVA.ui.toast("Recorrido reiniciado. Puedes comenzar de nuevo desde la bienvenida.", "ok", 4800);
        });
      });
    }
  }

  function init() {
    var state = store.load();
    PVA.audio.setEnabled(!!state.sound);

    bindUi();
    renderSound();
    renderNav();
    renderProgress();

    store.onChange(function () {
      renderProgress();
      renderNav();
      renderSound();
    });

    PVA.router.start();
  }

  PVA.app = {
    init: init,
    setActiveNav: setActiveNav,
    refreshChrome: function () {
      renderNav();
      renderProgress();
      renderSound();
    },
    closeMenu: closeMenu
  };

  init();
})(window);

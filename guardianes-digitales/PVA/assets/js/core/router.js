(function (global) {
  "use strict";

  var PVA = global.PVA;
  var store = PVA.store;

  var routes = [
    { path: "/", view: "dashboard", title: "Panel del estudiante", stage: null },
    { path: "/bienvenida", view: "welcome", title: "Bienvenida", stage: "bienvenida" },
    { path: "/ruta", view: "roadmap", title: "Ruta del curso", stage: null },
    { path: "/modulo/1", view: "module", title: "Módulo 1 · Protocolo PVA", stage: "m1", module: 1 },
    { path: "/modulo/2", view: "module", title: "Módulo 2 · Smishing y vishing", stage: "m2", module: 2 },
    { path: "/modulo/3", view: "module", title: "Módulo 3 · Protección de datos", stage: "m3", module: 3 },
    { path: "/modulo/4", view: "module", title: "Módulo 4 · Simulaciones", stage: "m4", module: 4 },
    { path: "/evaluacion", view: "assessment", title: "Evaluación de conocimientos", stage: "evaluacion" },
    { path: "/kit", view: "kit", title: "Kit Digital", stage: "kit" },
    { path: "/certificado", view: "completion", title: "Finalización y certificado", stage: "certificado" },
    { path: "/encuesta", view: "survey", title: "Encuesta de satisfacción", stage: "encuesta" }
  ];

  function currentPath() {
    var raw = global.location.hash || "#/";
    var path = raw.replace(/^#/, "") || "/";
    if (path.charAt(0) !== "/") path = "/" + path;
    return path.replace(/\/+$/, "") || "/";
  }

  function resolve(path) {
    for (var i = 0; i < routes.length; i++) {
      if (routes[i].path === path) return routes[i];
    }
    return null;
  }

  function navigate(path, replace) {
    var target = "#" + path;
    if (replace && global.history && global.history.replaceState) {
      global.history.replaceState(null, "", target);
      render();
    } else if (global.location.hash === target) {
      render();
    } else {
      global.location.hash = target;
    }
  }

  function render() {
    var path = currentPath();
    var route = resolve(path);
    var view = document.getElementById("view");
    var crumb = document.getElementById("crumb");
    if (!view) return;

    if (!route) {
      navigate("/", true);
      return;
    }

    if (route.stage && !store.isUnlocked(route.stage)) {
      var stage = store.stageById(route.stage);
      var blocked = store.currentStage();
      var hint = blocked
        ? "Continúa con «" + blocked.navLabel + "» para avanzar."
        : "Sigue el recorrido desde la ruta.";
      PVA.ui.toast(
        "Aún no puedes abrir " + (stage ? stage.label : "esta etapa") + ". " + hint,
        "lock",
        5200
      );
      navigate("/", true);
      return;
    }

    var renderer = PVA.views[route.view];
    if (!renderer || typeof renderer.render !== "function") {
      navigate("/", true);
      return;
    }

    var fresh = view.cloneNode(false);
    if (view.parentNode) view.parentNode.replaceChild(fresh, view);
    view = fresh;

    document.title = route.title + " · PVA Guardián Digital";
    if (crumb) crumb.textContent = route.title;
    document.body.setAttribute("data-view", route.view);
    if (global.PVA.app && PVA.app.setActiveNav) PVA.app.setActiveNav(path);

    view.innerHTML = "";
    renderer.render(view, { route: route, path: path });

    PVA.ui.scrollToTop();
    PVA.ui.focusView();
  }

  PVA.router = {
    routes: routes,
    currentPath: currentPath,
    resolve: resolve,
    go: navigate,
    refresh: render,
    start: function () {
      global.addEventListener("hashchange", render);
      if (!global.location.hash) {
        global.history.replaceState(null, "", "#/");
      }
      render();
    }
  };
})(window);
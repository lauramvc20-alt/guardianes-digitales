/* ==========================================================================
   PVA · Estado del curso: etapas, desbloqueos y persistencia local
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  var KEY = "pva.guardian.v1";

  /* Etapas del recorrido, en orden obligatorio.
     requires: etapas que deben estar completas para desbloquear esta. */
  var STAGES = [
    {
      id: "bienvenida",
      label: "Bienvenida",
      navLabel: "Bienvenida",
      short: "Objetivo y recorrido",
      route: "#/bienvenida",
      minutes: 2,
      requires: [],
      icon: "compass",
      blurb: "Qué vas a aprender y cómo funciona la experiencia."
    },
    {
      id: "m1",
      label: "Módulo 1 · Protocolo PVA",
      navLabel: "Protocolo PVA",
      short: "Pausa, Verifica y Actúa",
      route: "#/modulo/1",
      minutes: 3,
      requires: [],
      icon: "shieldCheck",
      blurb: "Los tres pasos que ordenan cualquier decisión digital."
    },
    {
      id: "m2",
      label: "Módulo 2 · Phishing y vishing",
      navLabel: "Phishing y vishing",
      short: "Amenazas y señales de alerta",
      route: "#/modulo/2",
      minutes: 3,
      requires: ["m1"],
      icon: "mail",
      blurb: "Cómo reconocer mensajes y llamadas que suplantan entidades."
    },
    {
      id: "m3",
      label: "Módulo 3 · Protección de datos",
      navLabel: "Protección de datos",
      short: "Cuentas, claves y datos",
      route: "#/modulo/3",
      minutes: 3,
      requires: ["m2"],
      icon: "lock",
      blurb: "Prácticas concretas para cuidar tus cuentas y tu información."
    },
    {
      id: "m4",
      label: "Módulo 4 · Simulaciones",
      navLabel: "Simulaciones",
      short: "Tres escenarios prácticos",
      route: "#/modulo/4",
      minutes: 4,
      requires: ["m3"],
      icon: "puzzle",
      blurb: "Decide qué harías en tres situaciones basadas en casos reales."
    },
    {
      id: "evaluacion",
      label: "Evaluación de conocimientos",
      navLabel: "Evaluación",
      short: "Cinco preguntas",
      route: "#/evaluacion",
      minutes: 3,
      requires: ["m4"],
      icon: "target",
      blurb: "Comprueba lo aprendido antes de recibir el Kit Digital."
    },
    {
      id: "kit",
      label: "Kit Digital",
      navLabel: "Kit Digital",
      short: "Recursos para llevar contigo",
      route: "#/kit",
      minutes: 2,
      requires: ["evaluacion"],
      icon: "card",
      blurb: "Guía, infografía, ruta, recomendaciones y tutorial."
    },
    {
      id: "certificado",
      label: "Finalización y certificado",
      navLabel: "Certificado",
      short: "Reconocimiento Guardián Digital",
      route: "#/certificado",
      minutes: 1,
      requires: ["bienvenida", "m1", "m2", "m3", "m4", "evaluacion", "kit"],
      icon: "trophy",
      blurb: "Tu insignia y certificado simbólico de finalización."
    },
    {
      id: "encuesta",
      label: "Encuesta de satisfacción",
      navLabel: "Encuesta",
      short: "Cuéntanos tu experiencia",
      route: "#/encuesta",
      minutes: 1,
      requires: ["certificado"],
      icon: "star",
      blurb: "Un paso independiente para evaluar esta propuesta educativa."
    }
  ];

  var STAGE_IDS = STAGES.map(function (s) { return s.id; });

  function emptyState() {
    return {
      v: 1,
      done: {},
      activity: { m1: {}, m2: {}, m3: {}, m4: {} },
      quiz: { answers: [], score: null, total: null, completedAt: null, attempts: 0 },
      participant: { name: "" },
      sound: false,
      createdAt: null,
      updatedAt: null
    };
  }

  var listeners = [];

  function mergeState(raw) {
    var base = emptyState();
    if (!raw || typeof raw !== "object") return base;

    base.v = 1;
    base.done = raw.done && typeof raw.done === "object" ? raw.done : {};
    base.activity = Object.assign(base.activity, raw.activity || {});
    base.quiz = Object.assign(base.quiz, raw.quiz || {});
    base.participant = Object.assign(base.participant, raw.participant || {});
    base.sound = !!raw.sound;
    base.createdAt = raw.createdAt || null;
    base.updatedAt = raw.updatedAt || null;

    // Solo etapas válidas cuentan como completadas.
    var cleanDone = {};
    STAGE_IDS.forEach(function (id) { if (base.done[id]) cleanDone[id] = true; });
    base.done = cleanDone;

    return base;
  }

  var state = emptyState();

  function readStorage() {
    try {
      var raw = global.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeStorage() {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  function emit(reason) {
    listeners.forEach(function (fn) {
      try { fn(state, reason); } catch (e) { /* noop */ }
    });
  }

  function save(reason) {
    state.updatedAt = new Date().toISOString();
    writeStorage();
    emit(reason || "save");
  }

  function load() {
    var stored = readStorage();
    state = mergeState(stored);
    if (!stored) {
      state.createdAt = new Date().toISOString();
      save("init");
    }
    return state;
  }

  function stageById(id) {
    for (var i = 0; i < STAGES.length; i++) {
      if (STAGES[i].id === id) return STAGES[i];
    }
    return null;
  }

  function isDone(id) { return !!state.done[id]; }

  function areRequirementsMet(stage) {
    return stage.requires.every(function (dep) { return isDone(dep); });
  }

  function isUnlocked(id) {
    var stage = stageById(id);
    if (!stage) return false;
    return areRequirementsMet(stage);
  }

  function markDone(id) {
    var stage = stageById(id);
    if (!stage) return false;
    if (!areRequirementsMet(stage)) return false;
    if (state.done[id]) return false;
    state.done[id] = true;
    save("stage:" + id);
    return true;
  }

  function completedCount() {
    return STAGE_IDS.filter(isDone).length;
  }

  function percent() {
    return Math.round((completedCount() / STAGES.length) * 100);
  }

  function currentStage() {
    for (var i = 0; i < STAGES.length; i++) {
      var stage = STAGES[i];
      if (!isDone(stage.id) && areRequirementsMet(stage)) return stage;
    }
    return null;
  }

  function nextStageAfter(id) {
    var index = STAGE_IDS.indexOf(id);
    if (index < 0) return null;
    for (var i = index + 1; i < STAGES.length; i++) {
      if (areRequirementsMet(STAGES[i])) return STAGES[i];
    }
    return null;
  }

  function activity(id) {
    if (!state.activity[id]) state.activity[id] = {};
    return state.activity[id];
  }

  function setActivity(id, patch, silent) {
    var target = activity(id);
    Object.keys(patch || {}).forEach(function (key) { target[key] = patch[key]; });
    if (!silent) save("activity:" + id);
    else { state.updatedAt = new Date().toISOString(); writeStorage(); }
    return target;
  }

  function reset() {
    var sound = state.sound;
    state = emptyState();
    state.sound = sound;
    state.createdAt = new Date().toISOString();
    save("reset");
    return state;
  }

  function setName(name) {
    state.participant.name = String(name || "").trim().slice(0, 80);
    save("participant");
  }

  function setSound(enabled) {
    state.sound = !!enabled;
    save("sound");
  }

  function setQuiz(answers, score, total) {
    state.quiz = {
      answers: answers.slice(),
      score: score,
      total: total,
      completedAt: new Date().toISOString(),
      attempts: (state.quiz.attempts || 0) + 1
    };
    save("quiz");
  }

  PVA.store = {
    KEY: KEY,
    STAGES: STAGES,
    STAGE_IDS: STAGE_IDS,
    state: function () { return state; },
    load: load,
    save: save,
    onChange: function (fn) { listeners.push(fn); },
    stageById: stageById,
    isDone: isDone,
    isUnlocked: isUnlocked,
    markDone: markDone,
    completedCount: completedCount,
    percent: percent,
    currentStage: currentStage,
    nextStageAfter: nextStageAfter,
    activity: activity,
    setActivity: setActivity,
    reset: reset,
    setName: setName,
    setSound: setSound,
    setQuiz: setQuiz,
    requirementsMet: function (id) {
      var stage = stageById(id);
      return stage ? areRequirementsMet(stage) : false;
    }
  };
})(window);

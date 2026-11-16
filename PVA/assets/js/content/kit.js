/* ==========================================================================
   PVA · Kit Digital y encuesta
   Los enlaces externos son los definidos por el proyecto. No se modifican
   ni se generan direcciones alternativas.
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;

  PVA.content.kit = {
    title: "Kit Digital «PAUSA, VERIFICA Y ACTÚA»",
    lede:
      "Un paquete de recursos para llevar contigo y compartir. Puedes abrirlos " +
      "cuando quieras: quedan disponibles en este navegador y en los enlaces " +
      "oficiales del proyecto.",
    note:
      "Los recursos abren en Google Drive, en una pestaña nueva. Son de acceso " +
      "gratuito y no requieren registro en esta plataforma.",
    resources: [
      {
        id: "guia",
        name: "Guía PVA",
        kind: "Guía preventiva y protocolo",
        icon: "guide",
        tone: "violet",
        description:
          "Documento descargable que profundiza el protocolo PAUSA (detener la " +
          "interacción), VERIFICA (corroborar por canales oficiales) y ACTÚA " +
          "(aplicar prácticas seguras).",
        url: "https://drive.google.com/drive/folders/1auwRH2jWUAvJfmi-Dj7t2llkqyS4D1JB?usp=sharing"
      },
      {
        id: "infografia",
        name: "Infografía",
        kind: "Pieza visual de prevención",
        icon: "image",
        tone: "turq",
        description:
          "Resumen visual de las señales de alerta y las medidas preventivas frente " +
          "a mensajes y llamadas fraudulentas.",
        url: "https://drive.google.com/drive/folders/1Y0H55qVHzQF54IAoJ8_aWVrWhGgQT44R?usp=drive_link"
      },
      {
        id: "ruta",
        name: "Ruta de emergencia",
        kind: "Ficha de actuación inmediata",
        icon: "map",
        tone: "coral",
        description:
          "Guía de tres pasos para actuar tras sufrir un engaño y cómo realizar una " +
          "denuncia formal al CAI virtual de la Policía Nacional.",
        url: "https://drive.google.com/drive/folders/1H5rwjqXke1v2U0RQLbcZjVcXO2sQrawp?usp=drive_link"
      },
      {
        id: "recomendaciones",
        name: "Recomendaciones",
        kind: "Llamado a la acción",
        icon: "star",
        tone: "yellow",
        description:
          "Tarjeta digital con recomendaciones y una invitación a asumir un rol " +
          "activo para ayudar a otras personas a proteger su información.",
        url: "https://drive.google.com/drive/folders/12uMG-vlo0c2nvoEGR6buyry8s-7_UbI2?usp=drive_link"
      },
      {
        id: "tutorial",
        name: "Tutorial",
        kind: "Tutorial visual",
        icon: "play",
        tone: "lavender",
        description:
          "Paso a paso de acciones preventivas concretas, por ejemplo la activación " +
          "de la autenticación en dos pasos (2FA).",
        url: "https://drive.google.com/drive/folders/1pPNm8w8X2cNsgAGGd7lWhCmtLL8jrB-6?usp=drive_link"
      }
    ]
  };

  PVA.content.survey = {
    title: "Encuesta de satisfacción",
    kicker: "Cierre · Tu experiencia",
    lede:
      "Tu opinión es importante. Ayúdanos a evaluar esta propuesta educativa y a " +
      "identificar oportunidades de mejora",
    text:
      "La encuesta es independiente de la evaluación: no modifica tu resultado ni " +
      "tu certificado. Se responde en Google Forms y es anónima desde esta " +
      "plataforma.",
    button: "COMPLETAR ENCUESTA",
    url: "https://forms.gle/JM6KNtX9RvKmXwUu9",
    thanks:
      "Gracias por completar el recorrido y por aportar a la evaluación de esta " +
      "propuesta educativa.",
    note:
      "Si la encuesta no se abre, copia este enlace en tu navegador: " +
      "https://forms.gle/JM6KNtX9RvKmXwUu9"
  };
})(window);

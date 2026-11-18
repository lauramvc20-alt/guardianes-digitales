/* ==========================================================================
   PVA · Kit Digital y encuesta
   Los recursos se sirven desde la propia plataforma (carpeta recursos/).
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;

  PVA.content.kit = {
    title: "Kit Digital «PAUSA, VERIFICA Y ACTÚA»",
    lede:
      "Cinco recursos para consultar aquí mismo y llevar contigo: míralos sin salir " +
      "del curso o descárgalos cuando quieras.",
    note:
      "Los recursos se abren dentro de la plataforma y se pueden descargar. Son de " +
      "acceso gratuito y no requieren registro.",
    /* Los archivos viven en recursos/ (se sirven desde la propia plataforma). `id` es la clave del
       progreso guardado: no se renombra aunque cambie el nombre visible. */
    resources: [
      {
        id: "guia",
        name: "Guía PVA",
        kind: "Guía preventiva y protocolo",
        icon: "guide",
        tone: "violet",
        type: "pdf",
        file: "recursos/Guía PVA.pdf",
        meta: "PDF · 8 páginas · 1,4 MB",
        description:
          "Protocolo PAUSA, VERIFICA Y ACTÚA paso a paso, con ejemplos de SMS y " +
          "llamadas sospechosas y los hábitos que fortalecen tu seguridad."
      },
      {
        id: "infografia",
        name: "Infografía",
        kind: "Pieza visual de prevención",
        icon: "image",
        tone: "turq",
        type: "pdf",
        file: "recursos/Infografía.pdf",
        meta: "PDF · 1 página · 1,5 MB",
        description:
          "Cómo activar la verificación en dos pasos (2FA) en cuatro pasos y qué " +
          "tener en cuenta para que proteja de verdad tus cuentas."
      },
      {
        id: "ruta",
        name: "Ruta de emergencia",
        kind: "Ficha de actuación inmediata",
        icon: "map",
        tone: "coral",
        type: "pdf",
        file: "recursos/Ruta de emergencia.pdf",
        meta: "PDF · 1 página · 3,3 MB",
        description:
          "Qué hacer si fuiste víctima de una estafa digital: detenerte y protegerte, " +
          "conservar evidencias y denunciar ante el CAI Virtual de la Policía Nacional."
      },
      {
        id: "recomendaciones",
        name: "Tips",
        kind: "Acciones preventivas",
        icon: "lightbulb",
        tone: "yellow",
        type: "pdf",
        file: "recursos/Recomendaciones.pdf",
        meta: "PDF · 1 página · 3,4 MB",
        description:
          "Ocho tips para protegerte de las estafas digitales: verificación en dos " +
          "pasos, claves únicas, señales de alerta, datos personales y más."
      },
      {
        id: "tutorial",
        name: "Videotutorial",
        kind: "Video paso a paso",
        icon: "video",
        tone: "lavender",
        type: "video",
        file: "recursos/Tutorial.mp4",
        duration: "Video · 0:28",
        meta: "Video MP4 · 0:28 · 9,3 MB",
        description:
          "Video de menos de 30 segundos que muestra en cuatro pasos cómo activar " +
          "la verificación en dos pasos en tus cuentas."
      }
    ]
  };

  PVA.content.survey = {
    title: "Encuesta de percepción",
    kicker: "Cierre · Tu experiencia",
    lede: "Ayúdanos a evaluar este proyecto educativo",
    text:
      "La encuesta se responde en Google Forms, no necesitas registro previo o inicio de sesión.",
    button: "COMPLETAR ENCUESTA",
    url: "https://forms.gle/JM6KNtX9RvKmXwUu9",
    thanks: "Gracias por completar el recorrido y por tu percepción sobre este proyecto.",
    note:
      "Si la encuesta no se abre, copia este enlace en tu navegador: " +
      "https://forms.gle/JM6KNtX9RvKmXwUu9"
  };
})(window);

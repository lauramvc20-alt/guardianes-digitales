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
      "Seis recursos para consultar aquí mismo y llevar contigo: míralos sin salir " +
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
        id: "tutorial", /* clave interna del progreso guardado: no se renombra aunque cambie el nombre visible */
        name: "Video",
        kind: "Prácticas seguras",
        icon: "video",
        tone: "lavender",
        type: "video",
        file: "recursos/Video.mp4",
        meta: "Video MP4 · 0:53 · 16,0 MB",
        duration: "Video · 0:53",
        description:
          "Todo se puede falsificar: un comprobante de pago, una encuesta que pide " +
          "tus datos y una llamada urgente de un familiar, con el mismo reflejo ante " +
          "todas: pausa, verifica por tu cuenta y actúa."
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
        id: "llamado",
        name: "Llamado a la acción",
        kind: "Tarjeta para compartir",
        icon: "share",
        tone: "turq",
        type: "image",
        file: "recursos/Tarjeta.jpg",
        meta: "Imagen JPG · 1,8 MB",
        shareable: true,
        alt:
          "Tarjeta «La seguridad digital también está en tus manos»: invita a informarse, " +
          "verificar antes de actuar y proteger los datos personales, con un código QR para escanear.",
        description:
          "Comparte este mensaje con familiares, amigos y conocidos, entre todos " +
          "podemos construir una comunidad digital más segura."
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

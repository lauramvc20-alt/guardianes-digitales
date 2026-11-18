(function (global) {
  "use strict";

  var PVA = global.PVA;
  PVA.content = PVA.content || {};

  /* Contexto del proyecto: resumen de la problemática y de la encuesta diagnóstica.
     Las cifras provienen de la encuesta del proyecto (20 personas, muestra de conveniencia). */
  PVA.content.context = {
    kicker: "Contexto",
    title: "El problema está más cerca de lo que parece",
    lede: "Las estafas digitales no ocurren en sitios lejanos: llegan por los mismos canales que usamos todos los días.",

    reality: {
      title: "Una realidad cotidiana",
      text:
        "Pagamos con billeteras digitales, consultamos el banco desde el celular, vendemos y compramos en plataformas " +
        "de compraventa y coordinamos todo por mensajería. Esos mismos canales sirven para intentar engañarnos con " +
        "mensajes, llamadas, enlaces y suplantaciones de entidades conocidas, como falsas ofertas de empleo, ventas " +
        "fraudulentas o supuestos asesores de bancos y empresas de domicilios.",
      stat: "En nuestra encuesta, el 75 % de las 20 personas usa billeteras digitales y el 35 % banca móvil.",
      channels: [
        { icon: "wallet", label: "Billeteras digitales" },
        { icon: "bank", label: "Apps bancarias" },
        { icon: "users", label: "Redes sociales" },
        { icon: "cart", label: "Compraventa" },
        { icon: "sms", label: "Mensajería" }
      ]
    },

    survey: {
      title: "Lo que encontramos en nuestra encuesta",
      sampleN: 20,
      people: [
        { value: 85, count: 17, label: "recibió mensajes o llamadas sospechosas: 55 % de forma ocasional y 30 % de forma frecuente", tone: "turq" },
        { value: 20, count: 4, label: "manifestó haber sido víctima directa de una estafa", tone: "coral" }
      ],
      channels: [
        { value: 47.6, label: "de las elecciones identificó el smishing (SMS y mensajería) como un canal frecuente", icon: "sms" },
        { value: 47.6, label: "de las elecciones identificó el vishing (llamadas de voz) como un canal frecuente", icon: "phone" }
      ],
      extra: "Además, el 50 % conoce a un familiar o amigo cercano que fue víctima: el 90 % de la muestra tiene alguna cercanía con las consecuencias del cibercrimen.",
      method:
        "Aclaración metodológica: es una encuesta aplicada a una muestra de conveniencia de 20 personas. " +
        "Sus resultados describen a quienes participaron y no representan estadísticamente a toda Colombia. " +
        "En algunas preguntas hubo 19 respuestas y en otras 20, y las preguntas sobre canales podían tener varias selecciones."
    },

    why: {
      title: "¿Por qué es importante aprender a prevenirlas?",
      text:
        "Quien engaña no busca la fuerza de una contraseña: busca que reacciones sin pensar. " +
        "Se apoya en emociones reales y en la prisa del día a día. Hoy, además, la inteligencia artificial permite " +
        "redactar mensajes más convincentes e incluso clonar voces.",
      levers: [
        { icon: "hourglass", title: "Urgencia", text: "«Tienes dos horas antes del bloqueo»." },
        { icon: "warning", title: "Miedo", text: "El temor inducido a perder una cuenta o dinero." },
        { icon: "shieldCheck", title: "Confianza", text: "Una voz amable o una marca conocida, como Bancolombia o Rappi." },
        { icon: "briefcase", title: "Necesidad de empleo", text: "Ofertas laborales que piden tus documentos o pagos." }
      ],
      consequences: [
        { icon: "card", label: "Dinero y deudas" },
        { icon: "lock", label: "Datos personales" },
        { icon: "heartPulse", label: "Tranquilidad y confianza" }
      ],
      closing:
        "Este curso te ayuda a reconocer señales de alerta, verificar por canales oficiales y actuar con seguridad " +
        "con el protocolo PAUSA, VERIFICA y ACTÚA."
    }
  };
})(window);

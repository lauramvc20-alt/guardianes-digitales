(function (global) {
  "use strict";

  var PVA = global.PVA;
  PVA.content = PVA.content || {};

  PVA.content.quiz = {
    title: "Evaluación de conocimientos",
    intro:
      "Cinco preguntas sobre el protocolo PVA, smishing, vishing, protección de " +
      "cuentas y ofertas de empleo sospechosas. Cada respuesta recibe " +
      "retroalimentación inmediata.",
    note:
      "No hay nota mínima para continuar: el Kit Digital se desbloquea al " +
      "completar las cinco preguntas. Puedes repetir la evaluación cuando quieras.",
    questions: [
      {
        topic: "Protocolo PVA",
        icon: "shieldCheck",
        q: "Un mensaje SMS te pide «verificar tu cuenta» en las próximas horas. ¿Cuál es la secuencia correcta del protocolo PVA?",
        options: [
          "Pausar, verificar por un canal oficial y actuar (bloquear o reportar).",
          "Hacer clic, llenar el formulario y avisar al banco después.",
          "Responder para pedir el nombre del asesor y continuar la conversación.",
          "Reenviar el mensaje a tus contactos para que estén advertidos."
        ],
        answer: 0,
        explain:
          "PAUSA detiene la interacción; VERIFICA comprueba por un canal oficial elegido " +
          "por ti; ACTÚA bloquea, reporta y protege tus cuentas."
      },
      {
        topic: "Smishing",
        icon: "sms",
        q: "¿Cuál es la característica principal del smishing?",
        options: [
          "Robar físicamente el teléfono para entrar a la banca móvil.",
          "Enviar publicidad de productos con descuentos reales por correo.",
          "Enviar mensajes de texto (SMS o mensajería) suplantando entidades con enlaces falsos para robar datos.",
          "Actualizar el sistema operativo sin pedir permiso."
        ],
        answer: 2,
        explain:
          "El smishing es una modalidad de suplantación que usa mensajes SMS o de " +
          "mensajería instantánea imitando comunicaciones oficiales para que la víctima " +
          "ingrese a enlaces falsos o entregue datos personales y bancarios."
      },
      {
        topic: "Vishing",
        icon: "phone",
        q: "En un caso de vishing, recibes una llamada de alguien que dice ser tu banco y te pide el código de verificación. ¿Qué haces?",
        options: [
          "Le doy el código porque la voz y el tono parecen de un asesor real.",
          "Cuelgo de inmediato y llamo al número oficial del banco desde la app o la tarjeta.",
          "Le pido que me llame luego y le comparto el código por SMS.",
          "Le dicto solo la mitad del código para comprobar."
        ],
        answer: 1,
        explain:
          "Ningún banco legítimo pide el código de verificación por llamada telefónica. El " +
          "vishing usa la suplantación de voz y la urgencia para obtener ese código, que es " +
          "la segunda llave de tu cuenta. Corta y verifica por un canal oficial."
      },
      {
        topic: "Protección de cuentas y datos",
        icon: "lock",
        q: "¿Cuál conjunto de prácticas protege mejor tus cuentas y tu información?",
        options: [
          "La misma contraseña en todos los servicios para no olvidarla.",
          "Compartir el código de 2FA con un familiar por si acaso.",
          "Publicar el número de la tarjeta solo en redes sociales privadas.",
          "Una contraseña distinta por servicio, autenticación en dos pasos y revisión de movimientos."
        ],
        answer: 3,
        explain:
          "La combinación de contraseñas únicas, 2FA y alertas bancarias reduce el " +
          "impacto de una filtración y evita que una sola clave comprometa todo."
      },
      {
        topic: "Ofertas de empleo sospechosas",
        icon: "briefcase",
        q: "Una oferta de empleo por chat te pide foto de la cédula y un pago para el examen de selección. ¿Qué haces?",
        options: [
          "Pago el examen porque todo proceso de selección cobra ese requisito.",
          "Verifico la empresa por su canal oficial y no envío documentos ni pago.",
          "Envío la cédula con una marca de agua y espero la respuesta.",
          "Comparto los datos de mi cuenta bancaria para recibir el salario."
        ],
        answer: 1,
        explain:
          "El pago anticipado y la solicitud de documentos por canales informales son " +
          "señales de una falsa oferta. Verifica la vacante por el sitio oficial de la empresa."
      }
    ]
  };
})(window);
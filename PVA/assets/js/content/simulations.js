/* ==========================================================================
   PVA · Simulaciones del Módulo 4
   Escenarios hipotéticos construidos a partir de las modalidades de estafa
   descritas en el documento académico del proyecto (2026).
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;

  PVA.content.simulations = [
    {
      id: "empleo",
      tag: "Falsa oferta de empleo",
      channel: "WhatsApp",
      icon: "briefcase",
      title: "Una vacante que pide demasiado",
      brief:
        "Un número desconocido te escribe por WhatsApp. Dice representar a una " +
        "empresa de tecnología y ofrece trabajo desde casa.",
      messages: [
        {
          from: "them",
          name: "Reclutador · +57 310 000 0000",
          text:
            "Hola, vimos tu perfil y quedaste seleccionado para una vacante de medio " +
            "tiempo. Pago semanal de $250.000, trabajo desde casa. Para iniciar el " +
            "lunes, envía foto de tu cédula y consigna $50.000 por el examen de " +
            "selección."
        },
        {
          from: "system",
          name: "Nota del simulacro",
          text: "El número no está verificado y la empresa no aparece en el mensaje."
        }
      ],
      question: "¿Qué harías primero?",
      options: [
        {
          label: "Enviar la cédula y pagar el examen: la oferta es buena y el pago es semanal.",
          verdict: "danger",
          feedback:
            "Es la respuesta de mayor riesgo. Una oferta legítima no debería pedirte " +
            "pagos anticipados ni una foto de tu documento antes de un contrato. " +
            "Con esos datos pueden suplantarte y solicitar créditos a tu nombre, " +
            "como ocurrió en el caso reseñado en el proyecto.",
          signals: [
            "Pago anticipado por «exámenes» o «trámites».",
            "Solicitud de documentos personales por un canal informal.",
            "Oferta con salario atractivo y sin proceso formal.",
            "Número desconocido que no se identifica con la empresa."
          ]
        },
        {
          label: "Buscar la empresa por su sitio oficial y verificar la vacante, sin enviar documentos ni pagar.",
          verdict: "best",
          feedback:
            "Buena decisión. Aplicaste PAUSA y VERIFICA: no entregaste datos ni " +
            "dinero y comprobaste la vacante por un canal oficial que tú elegiste. " +
            "Si la empresa no confirma el proceso, bloquea y reporta el número.",
          signals: [
            "Verificación independiente por el sitio o canal oficial.",
            "No se comparten documentos ni se hacen pagos anticipados."
          ]
        },
        {
          label: "Responder con la foto del documento marcada con la frase «solo para la vacante».",
          verdict: "risky",
          feedback:
            "La marca de agua no impide que usen tus datos. Sigue siendo una " +
            "entrega de información personal a un contacto no verificado. Primero " +
            "confirma la empresa por su canal oficial; solo después entrega lo " +
            "estrictamente necesario.",
          signals: [
            "Documento de identidad enviado por chat.",
            "La marca de agua no protege frente a la suplantación.",
            "Contacto sin verificación previa."
          ]
        }
      ]
    },
    {
      id: "paquete",
      tag: "Smishing · paquete retenido",
      channel: "SMS",
      icon: "sms",
      title: "Un cobro pequeño con un enlace extraño",
      brief:
        "Recibes un SMS que dice venir de una empresa de envíos. Avisa que tu " +
        "paquete está retenido y pide un pago mínimo para liberarlo.",
      messages: [
        {
          from: "them",
          name: "Envíos Express · +57 301 000 0000",
          text:
            "TU PAQUETE ESTÁ RETENIDO EN BODEGA. Paga $3.900 en las próximas 24 horas " +
            "o será devuelto: http://envios-express-pago.info/retener"
        },
        {
          from: "system",
          name: "Nota del simulacro",
          text: "No recuerdas haber comprado nada, pero el monto es muy bajo."
        }
      ],
      question: "¿Qué haces con el mensaje?",
      options: [
        {
          label: "Pagar el valor: es poco dinero y no quieres perder el paquete.",
          verdict: "danger",
          feedback:
            "El monto bajo es parte del engaño: reduce la desconfianza. Al pagar en " +
            "el enlace entregas los datos de tu tarjeta o tu cuenta a un sitio que " +
            "no es oficial. Además, el supuesto paquete puede no existir.",
          signals: [
            "Urgencia de 24 horas y amenaza de devolución.",
            "Enlace con un dominio que no es el oficial.",
            "Cobro pequeño para bajar la guardia.",
            "No hay una compra previa que explique el envío."
          ]
        },
        {
          label: "Abrir el enlace solo para mirar la página, sin pagar ni escribir datos.",
          verdict: "risky",
          feedback:
            "Abrir el enlace ya es interactuar y puede cargar una página diseñada " +
            "para capturar datos, instalar algo o confirmar que el número está " +
            "activo. Verifica en la aplicación oficial de la transportadora o " +
            "escribe tú el dominio.",
          signals: [
            "El enlace sigue siendo un canal controlado por el estafador.",
            "Abrir no es lo mismo que verificar por un canal oficial."
          ]
        },
        {
          label: "Revisar el estado del envío en la app oficial o en el sitio escrito por mí.",
          verdict: "best",
          feedback:
            "Correcto. Verificaste por un canal oficial y no usaste el enlace del " +
            "SMS. Si la transportadora no reconoce el envío, bloquea y reporta el " +
            "número, y conserva una captura del mensaje.",
          signals: [
            "Verificación independiente por la app o el sitio oficial.",
            "El enlace del mensaje no se utiliza."
          ]
        }
      ]
    },
    {
      id: "llamada",
      tag: "Vishing · supuesto banco",
      channel: "Llamada",
      icon: "phone",
      title: "Una llamada que te pide el código",
      brief:
        "Suena el teléfono. Una persona dice ser del área de seguridad de tu banco y " +
        "habla con tono urgente sobre una compra no autorizada.",
      messages: [
        {
          from: "them",
          name: "Supuesto asesor bancario",
          text:
            "Buenas tardes, le habla el área de seguridad del banco. Detectamos una " +
            "compra no autorizada en su tarjeta. Para bloquearla, dígame el código de " +
            "6 dígitos que acaba de recibir. No cuelgue, el proceso se cancela."
        },
        {
          from: "system",
          name: "Nota del simulacro",
          text: "El número entrante no coincide con el que aparece en tu tarjeta."
        }
      ],
      question: "¿Cuál es tu respuesta?",
      options: [
        {
          label: "Dictar el código: quieres bloquear la compra cuanto antes.",
          verdict: "danger",
          feedback:
            "Ese código es la segunda llave de tu cuenta. Al dictarlo, el estafador " +
            "puede completar una operación o cambiar tus credenciales. Ningún banco " +
            "legítimo te pide el código de verificación por teléfono.",
          signals: [
            "Solicitud del código de 2FA por llamada.",
            "Urgencia y presión para no cortar.",
            "El número no coincide con el canal oficial."
          ]
        },
        {
          label: "Colgar y llamar al número oficial del banco desde la app o la tarjeta.",
          verdict: "best",
          feedback:
            "Muy bien. Aplicaste PAUSA al no dictar el código y VERIFICA al usar un " +
            "canal oficial elegido por ti. El banco podrá confirmar si existe la " +
            "compra y bloquearte la tarjeta si es necesario.",
          signals: [
            "Se corta la interacción y se verifica por un canal oficial.",
            "No se entrega ningún código ni dato."
          ]
        },
        {
          label: "Pedir el nombre y el número de empleado del asesor y seguir la llamada.",
          verdict: "risky",
          feedback:
            "Un nombre y un número de empleado se pueden inventar. La llamada sigue " +
            "siendo un canal controlado por quien llama. Corta y verifica por el " +
            "número oficial; no hay razón para continuar.",
          signals: [
            "La identidad se puede falsificar.",
            "Seguir en la llamada mantiene la presión psicológica."
          ]
        }
      ]
    }
  ];
})(window);

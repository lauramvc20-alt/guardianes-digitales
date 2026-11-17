/* ==========================================================================
   PVA · Simulaciones del Módulo 4
   Escenarios hipotéticos construidos a partir de las modalidades de estafa
   descritas en el documento académico del proyecto (2026).

   Cada caso tiene la mecánica que corresponde a su situación:
   - kind "chat"  : conversación por turnos (los mensajes siguientes dependen de lo que respondes).
   - kind "exam"  : examinar un SMS por cuenta propia y después decidir.
   - kind "call"  : llamada por etapas, con la opción de colgar en cualquier momento.

   En los casos con árbol de decisiones, cada opción tiene:
     verdict  best | risky | danger
     why      por qué la decisión es adecuada o qué riesgo implica
     next     id del siguiente turno (si la conversación continúa)
     end      { outcome } si ese camino termina aquí
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;

  PVA.content.simulations = [
    /* ------------------------------------------------ Caso 1 · conversación por turnos */
    {
      id: "empleo",
      kind: "chat",
      tag: "Falsa oferta de empleo",
      channel: "WhatsApp",
      icon: "briefcase",
      title: "Una vacante que pide demasiado",
      brief: "Un número desconocido te escribe por WhatsApp y ofrece trabajo desde casa. Tú decides qué responder; el reclutador contesta según lo que hagas.",
      task: "Responde en cada turno. La conversación cambia según tu decisión.",
      contact: { name: "Reclutador", sub: "+57 310 000 0000" },
      start: "n0",
      nodes: {
        n0: {
          say: [
            "Hola, vimos tu perfil y quedaste seleccionado para una vacante de medio tiempo. Pago semanal de $250.000, trabajo desde casa.",
            "Para iniciar el lunes, envía foto de tu cédula y consigna $50.000 por el examen de selección."
          ],
          prompt: "¿Cómo respondes?",
          options: [
            {
              label: "Enviar la foto de mi cédula y preguntar cómo hago el pago.",
              reply: "Listo, te envío la foto de mi cédula. ¿A dónde consigno?",
              verdict: "danger",
              why: "Entregas un documento de identidad a un contacto sin verificar y aceptas un pago anticipado: dos señales clásicas de una falsa oferta. Con esos datos pueden suplantarte y pedir créditos a tu nombre.",
              next: "n1a"
            },
            {
              label: "Decir que primero verificaré la empresa por su sitio oficial.",
              reply: "Gracias. Antes de enviar nada voy a verificar la empresa por su sitio oficial.",
              verdict: "best",
              why: "Aplicas PAUSA y VERIFICA: no entregas datos ni dinero y compruebas por un canal que tú eliges, no por el del contacto.",
              next: "n1b"
            },
            {
              label: "Pedir más detalles: nombre de la empresa, contrato y horario.",
              reply: "¿Cómo se llama la empresa y cuándo firmo el contrato?",
              verdict: "risky",
              why: "Preguntar es razonable, pero sigues dentro de un canal controlado por quien escribe: cualquier respuesta se puede inventar. La verificación hay que hacerla por fuera.",
              next: "n1c"
            }
          ]
        },
        n1a: {
          say: ["Perfecto. Consigna los $50.000 por Nequi al 310 000 0000 y mándame el comprobante. Con eso te activo el cupo hoy mismo."],
          prompt: "¿Qué haces ahora?",
          options: [
            {
              label: "Pagar y enviar el comprobante.",
              reply: "Ya consigné, te envío el comprobante.",
              verdict: "danger",
              why: "Pagar un «examen» es una de las señales de la oferta falsa: pierdes el dinero y ya habías entregado tu documento.",
              end: { outcome: "Dos semanas después llega el aviso de un crédito solicitado con tu cédula, y el «reclutador» nunca vuelve a responder." }
            },
            {
              label: "Detenerme: no pagaré ni enviaré nada más y verificaré la empresa.",
              reply: "Prefiero esperar. Voy a verificar la empresa antes de seguir.",
              verdict: "best",
              why: "Rectificas a tiempo. Ya compartiste tu documento, así que conviene vigilar tus cuentas y reportar el número. Detener el proceso evita la pérdida de dinero.",
              end: { outcome: "No pagas. Bloqueas el número, guardas las capturas y revisas tus movimientos por si usaron tu cédula." }
            }
          ]
        },
        n1b: {
          say: ["No hace falta, ya estás seleccionado. Si no envías hoy los datos, le damos la vacante a otra persona."],
          prompt: "El reclutador te presiona. ¿Qué haces?",
          options: [
            {
              label: "Enviar los datos para no perder la oportunidad.",
              reply: "Está bien, te envío todo ahora.",
              verdict: "danger",
              why: "La presión por perder la oportunidad es una palanca de ingeniería social: busca que no verifiques.",
              end: { outcome: "Entregas tu documento y pagas. El contacto desaparece y empiezan a llegar cobros a tu nombre." }
            },
            {
              label: "Mantener mi decisión: buscar la empresa y no enviar nada.",
              reply: "Prefiero verificar. Si la oferta es real, no hay problema en esperar.",
              verdict: "best",
              why: "Una oferta legítima puede esperar a que verifiques. La urgencia es una señal de alerta, no una razón para saltarte la verificación.",
              next: "n2"
            }
          ]
        },
        n1c: {
          say: ["Somos una empresa de tecnología. El contrato se firma el lunes. Solo falta la foto de tu cédula y los $50.000 del examen."],
          prompt: "¿Qué haces?",
          options: [
            {
              label: "Enviar la foto de la cédula, pero no pagar.",
              reply: "Te envío la cédula, pero el pago lo hago el lunes.",
              verdict: "danger",
              why: "Aunque no pagues, entregaste tu documento a alguien sin verificar. Es justo lo que se necesita para suplantarte.",
              end: { outcome: "No pierdes dinero, pero con tu cédula piden un crédito a tu nombre semanas después." }
            },
            {
              label: "Buscar la empresa por su sitio oficial antes de enviar nada.",
              reply: "Voy a revisar la empresa por su sitio oficial antes de continuar.",
              verdict: "best",
              why: "Rectificas: el criterio correcto es comprobar por un canal tuyo antes de entregar datos.",
              next: "n2"
            },
            {
              label: "Pagar el examen: es poco dinero y quiero la vacante.",
              reply: "Voy a consignar los $50.000.",
              verdict: "danger",
              why: "El monto bajo reduce la desconfianza, pero cobrar por un proceso de selección es señal de fraude.",
              end: { outcome: "Pagas y el contacto deja de responder: perdiste el dinero y no existe ninguna vacante." }
            }
          ]
        },
        n2: {
          say: ["Resultado de tu verificación: la empresa real no reconoce ninguna vacante ni a ese reclutador."],
          prompt: "¿Qué haces con el contacto?",
          options: [
            {
              label: "Bloquear y reportar el número, y guardar las capturas.",
              reply: "",
              verdict: "best",
              why: "Completas el protocolo: ACTÚA. Bloquear corta el contacto, reportar protege a otras personas y las capturas sirven como evidencia.",
              end: { outcome: "Cortas el contacto, reportas el número y conservas las pruebas por si hace falta una denuncia." }
            },
            {
              label: "Responderle para reclamar que es una estafa.",
              reply: "",
              verdict: "risky",
              why: "Responder confirma que tu número está activo y mantiene la conversación abierta. Es mejor bloquear y reportar.",
              end: { outcome: "El número queda marcado como activo y recibes nuevos intentos por otros canales." }
            },
            {
              label: "Ignorarlo sin bloquear ni reportar.",
              reply: "",
              verdict: "risky",
              why: "Te proteges a ti, pero sin reportar no ayudas a que otras personas eviten el engaño.",
              end: { outcome: "Tú no caes, pero el número sigue activo y puede engañar a otras personas." }
            }
          ]
        }
      }
    },

    /* ------------------------------------------------ Caso 2 · examinar y decidir */
    {
      id: "paquete",
      kind: "exam",
      tag: "Smishing · paquete retenido",
      channel: "SMS",
      icon: "sms",
      title: "Un cobro pequeño con un enlace extraño",
      brief: "Recibes un SMS de una supuesta empresa de envíos que dice que tu paquete está retenido.",
      task: "Primero examina el mensaje por tu cuenta y toca lo que te parezca sospechoso. Después decide qué hacer.",
      contact: { name: "Envíos Express", sub: "+57 301 000 0000" },
      examPrompt: "Toca las palabras o frases que te parezcan sospechosas. Puedes marcar y desmarcar.",
      parts: [
        { t: "Envíos Express: ", sig: false, why: "El nombre de una empresa de envíos no es una señal por sí solo: lo sospechoso es lo que te pide el mensaje." },
        { t: "TU PAQUETE ESTÁ RETENIDO EN BODEGA", sig: true, why: "No hay una compra previa que explique el envío, y las mayúsculas buscan alarmarte." },
        { t: ". " },
        { t: "Paga $3.900", sig: true, why: "El cobro pequeño baja la guardia: parece que no vale la pena desconfiar." },
        { t: " " },
        { t: "en las próximas 24 horas o será devuelto", sig: true, why: "Urgencia y amenaza de perder el paquete para que no verifiques." },
        { t: ": " },
        { t: "http://envios-express-pago.info/retener", sig: true, why: "El dominio no es el de una transportadora oficial; el enlace es un canal controlado por el estafador." }
      ],
      question: "¿Qué haces con el mensaje?",
      options: [
        {
          label: "Pagar el valor: es poco dinero y no quieres perder el paquete.",
          verdict: "danger",
          why: "El monto bajo es parte del engaño. Al pagar en el enlace entregas los datos de tu tarjeta o cuenta a un sitio que no es oficial, y el paquete puede no existir.",
          outcome: "El pago sale de tu cuenta y al día siguiente aparecen otros cobros que no reconoces."
        },
        {
          label: "Abrir el enlace solo para mirar la página, sin pagar ni escribir datos.",
          verdict: "risky",
          why: "Abrir el enlace ya es interactuar: puede cargar una página para capturar datos o confirmar que tu número está activo. Verifica en la app oficial o escribe tú el dominio.",
          outcome: "La página te pide los datos de tu tarjeta «para verificar» y tu número queda confirmado como activo para nuevos intentos."
        },
        {
          label: "Revisar el estado del envío en la app oficial o en el sitio escrito por mí.",
          verdict: "best",
          why: "Verificaste por un canal oficial y no usaste el enlace del SMS. Si la transportadora no reconoce el envío, bloquea el número y conserva una captura.",
          outcome: "La app no muestra ningún paquete retenido. Bloqueas el número y guardas una captura."
        }
      ]
    },

    /* ------------------------------------------------ Caso 3 · llamada por etapas */
    {
      id: "llamada",
      kind: "call",
      tag: "Vishing · supuesto banco",
      channel: "Llamada",
      icon: "phone",
      title: "Una llamada que te pide el código",
      brief: "Suena el teléfono: una persona dice ser del área de seguridad de tu banco. Puedes responder o colgar en cualquier momento.",
      task: "Escucha, responde o cuelga. La llamada avanza según lo que hagas.",
      contact: { name: "Número desconocido", sub: "Llamada entrante" },
      start: "c0",
      nodes: {
        c0: {
          say: ["Buenas tardes, le habla el área de seguridad del banco. Detectamos una compra no autorizada en su tarjeta."],
          prompt: "¿Qué haces?",
          options: [
            {
              hangup: true,
              label: "Colgar y llamar al número oficial del banco desde la app o la tarjeta.",
              verdict: "best",
              why: "Cortas la interacción (PAUSA) y verificas por un canal oficial que tú eliges (VERIFICA). Sin escuchar más, no hay presión.",
              end: { outcome: "El banco confirma que no existe ninguna alerta y refuerza tu tarjeta por precaución." }
            },
            {
              label: "Preguntar qué compra fue.",
              reply: "¿Qué compra fue?",
              verdict: "risky",
              why: "Preguntar parece prudente, pero seguir en la llamada te deja en un canal controlado por quien llama: puede inventar cualquier detalle.",
              next: "c1"
            },
            {
              label: "Decir «Sí, dígame qué necesita».",
              reply: "Sí, dígame qué necesita.",
              verdict: "risky",
              why: "Cooperar sin verificar le da el control de la conversación a quien llama.",
              next: "c1"
            }
          ]
        },
        c1: {
          say: ["Una compra de $1.850.000 en una tienda de tecnología. Para bloquearla, dígame el código de 6 dígitos que acaba de recibir."],
          prompt: "Te piden un código. ¿Qué haces?",
          options: [
            {
              hangup: true,
              label: "Colgar y verificar con el número oficial del banco.",
              verdict: "best",
              why: "Ningún banco pide por teléfono un código de verificación. Cortar aquí te protege: rectificaste a tiempo.",
              end: { outcome: "Cuelgas antes de entregar nada. Al llamar al banco confirman que no había ninguna compra sospechosa." }
            },
            {
              label: "Dictar el código para bloquear la compra cuanto antes.",
              reply: "Es 482915.",
              verdict: "danger",
              why: "Ese código es la segunda llave de tu cuenta: quien lo tiene puede completar operaciones o cambiar tus credenciales.",
              end: { outcome: "En minutos se aprueba una compra con tu tarjeta y cambian tus credenciales de acceso." }
            },
            {
              label: "Pedir su nombre y su número de empleado.",
              reply: "¿Cómo se llama y cuál es su número de empleado?",
              verdict: "risky",
              why: "Un nombre y un número de empleado se pueden inventar. No sirven como prueba de identidad.",
              next: "c2"
            }
          ]
        },
        c2: {
          say: ["Soy Andrés, número de empleado 4471. No cuelgue: si corta, el proceso se cancela y pierde su dinero."],
          prompt: "Ahora presionan para que no cuelgues. ¿Qué haces?",
          options: [
            {
              hangup: true,
              label: "Colgar: la presión por no cortar es una señal de alerta.",
              verdict: "best",
              why: "«No cuelgue» es una táctica para evitar que verifiques. Cortar y llamar al banco por su número oficial es lo correcto.",
              end: { outcome: "Cuelgas. El banco confirma que nunca te llamó y tú no entregaste ningún dato." }
            },
            {
              label: "Dictar el código para cancelar la compra.",
              reply: "Está bien, el código es 482915.",
              verdict: "danger",
              why: "Cedes ante la presión y entregas la segunda llave de tu cuenta.",
              end: { outcome: "Con el código completan la operación y quedas sin acceso a tu cuenta." }
            }
          ]
        }
      }
    }
  ];
})(window);

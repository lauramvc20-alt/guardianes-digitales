/* ==========================================================================
   PVA · Contenido del curso
   Fuente académica: "PAUSA, VERIFICA Y ACTÚA" (Fundación Universitaria del
   Área Andina, Ingeniería de Sistemas, Cátedra Pablo Oliveros, 2026).
   Los textos pedagógicos se basan en ese documento; las citas y cifras
   conservan su origen. Las decisiones de diseño se documentan en README.md.
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  PVA.content = PVA.content || {};

  var COURSE = {
    title: "PAUSA, VERIFICA Y ACTÚA: Sé un guardián digital",
    shortTitle: "PAUSA, VERIFICA Y ACTÚA",
    tagline: "Sé un guardián digital",
    institution: "Fundación Universitaria del Área Andina",
    program: "Ingeniería de Sistemas",
    chair: "Cátedra Pablo Oliveros",
    year: "2026",
    teacher: "Jhoana Alexandra Reina",
    authors:
      "Brayan Andrés Vega Fernández, Laura Melissa Varela Cabezas, " +
      "José Eduardo Zapata Echeverría y Osnaider Vivas",
    duration: "10 a 15 minutos",
    access: "Libre, gratuito y sin registro",
    modality: "Experiencia digital interactiva",
    certificate: "Certificado simbólico de finalización",
    description:
      "Experiencia educativa gamificada de corta duración para reconocer señales de " +
      "smishing y vishing, verificar la información por canales oficiales y adoptar " +
      "buenas prácticas de protección de datos. No requiere registro previo ni " +
      "credenciales de ingreso.",
    purpose:
      "Fortalecer la capacidad de identificar, prevenir y reportar estafas digitales " +
      "en adultos jóvenes y adultos usuarios de servicios financieros y plataformas " +
      "digitales en Colombia.",
    source:
      "Proyecto académico «PAUSA, VERIFICA Y ACTÚA» (2026). Las cifras citadas " +
      "provienen de la encuesta de diagnóstico aplicada a 20 personas por el equipo " +
      "autor; la muestra es pequeña y de conveniencia, por lo que no representa " +
      "estadísticamente a toda la población colombiana."
  };

  /* ---------------------------------------------------------------- Bienvenida */
  var WELCOME = {
    kicker: "Bienvenida · Punto de partida",
    title: "Bienvenido, futuro guardián digital",
    lede:
      "Vas a recorrer una experiencia breve y práctica: no una clase teórica, sino " +
      "un espacio para decidir, equivocarte sin riesgo y aprender a reconocer un " +
      "engaño antes de responder.",
    intro:
      "El proyecto parte de una situación cercana: las estafas digitales y la " +
      "ingeniería social afectan a personas que usan billeteras digitales, banca " +
      "móvil, redes sociales y plataformas de compraventa. En la encuesta del " +
      "proyecto, el 85 % de las 20 personas consultadas había recibido mensajes o " +
      "llamadas sospechosas.",
    goals: [
      "Reconocer señales de smishing (mensajes de texto) y vishing (llamadas).",
      "Identificar señales de alerta antes de responder o hacer clic.",
      "Verificar la información únicamente por canales oficiales.",
      "Adoptar prácticas seguras y preventivas para cuidar tus datos."
    ],
    moments: [
      {
        n: "01",
        title: "Introducción",
        text:
          "Sensibilización y protocolo PAUSA, VERIFICA y ACTÚA. Es el mapa que " +
          "usarás en todo el recorrido."
      },
      {
        n: "02",
        title: "Contenido guiado",
        text:
          "Tres módulos cortos sobre el protocolo, phishing y vishing, y protección " +
          "de cuentas y datos."
      },
      {
        n: "03",
        title: "Simulacro interactivo",
        text:
          "Tres escenarios hipotéticos basados en situaciones reales. Eliges una " +
          "acción y recibes retroalimentación."
      },
      {
        n: "04",
        title: "Evaluación breve",
        text:
          "Cinco preguntas con retroalimentación para comprobar lo aprendido."
      },
      {
        n: "05",
        title: "Kit y certificado",
        text:
          "Recursos descargables para llevar contigo y un reconocimiento simbólico " +
          "como guardián digital."
      }
    ],
    audience:
      "Dirigido a compañeros de la comunidad educativa, familiares y vecinos que " +
      "utilizan servicios de mensajería, billeteras o aplicaciones bancarias.",
    privacy:
      "No se solicitan datos personales ni credenciales. Tu avance se guarda " +
      "únicamente en este navegador y dispositivo, así que no se sincroniza entre " +
      "equipos.",
    start: "Comenzar por el Módulo 1"
  };

  /* ------------------------------------------------------------------ Módulos */
  var MODULES = {
    1: {
      id: "m1",
      n: 1,
      title: "El protocolo PVA",
      navTitle: "Protocolo PVA",
      kicker: "Módulo 1 · La base",
      lede:
        "Tres pasos para ordenar cualquier decisión digital: detenerte, comprobar " +
        "por un canal oficial y actuar con cuidado.",
      robot: "explain",
      tone: "violet",
      objectives: [
        "Comprender PAUSA, VERIFICA y ACTÚA como una secuencia, no como tres consejos sueltos.",
        "Reconocer la urgencia y la presión como señales de riesgo.",
        "Elegir el canal correcto para verificar una supuesta comunicación."
      ],
      steps: [
        {
          title: "PAUSA: detén la interacción",
          summary: "No respondas, no hagas clic, no dictes códigos.",
          body: [
            "El protocolo empieza por no interactuar. Cuando un mensaje, una llamada " +
            "o una publicación te pide datos personales, códigos de verificación, " +
            "contraseñas o dinero, el primer movimiento es detener la conversación.",
            "Los estafadores necesitan que actúes rápido. La urgencia, el miedo a " +
            "perder una cuenta, la curiosidad o la necesidad de empleo reducen el " +
            "tiempo que dedicamos a verificar. Vishwanath et al. (2011) encontraron " +
            "que las señales de urgencia influyen en cómo se procesan los mensajes " +
            "de phishing."
          ],
          tips: [
            "No respondas ni pulses enlaces del mensaje.",
            "No dictes códigos de verificación, contraseñas ni datos bancarios.",
            "Si sientes presión para decidir «ya», trátalo como una señal de alerta."
          ]
        },
        {
          title: "VERIFICA: corroborar por canales oficiales",
          summary: "Comprueba por tu cuenta, no por el canal que te contactó.",
          body: [
            "Verificar no es responder al mismo mensaje para preguntar si es real. " +
            "Consiste en comprobar la información por un canal que tú elijas y que " +
            "sepas que es oficial: la aplicación del banco, el sitio web escrito por " +
            "ti o el número que aparece en la tarjeta o en la página oficial de la " +
            "empresa.",
            "El documento del proyecto lo resume así: PAUSA es detener la " +
            "interacción; VERIFICA es corroborar únicamente por canales oficiales; " +
            "ACTÚA es aplicar prácticas seguras."
          ],
          tips: [
            "Abre la aplicación oficial y revisa si el aviso existe de verdad.",
            "Llama al número oficial de la entidad, no al que aparece en el mensaje.",
            "Escribe el dominio manualmente y desconfía de enlaces acortados.",
            "Pide a la empresa, por su canal oficial, que confirme la solicitud."
          ]
        },
        {
          title: "ACTÚA: aplica prácticas seguras y reporta",
          summary: "Bloquea, conserva evidencias y protege tus cuentas.",
          body: [
            "Después de verificar, actúa. Bloquea y reporta el contacto, conserva las " +
            "evidencias (capturas, número, correo), cambia las contraseñas si " +
            "entregaste datos y activa la autenticación en dos pasos.",
            "Si fuiste víctima, acude a los canales oficiales de tu banco y de las " +
            "autoridades. La Ficha de ruta de emergencia del Kit Digital resume tres " +
            "pasos de actuación inmediata y el reporte al CAI virtual de la Policía " +
            "Nacional."
          ],
          tips: [
            "Bloquea y reporta el número, perfil o correo.",
            "Conserva capturas y no borres la conversación.",
            "Cambia contraseñas y revisa los movimientos de tus cuentas.",
            "Cuéntale a alguien de confianza y comparte el protocolo."
          ]
        }
      ],
      activity: {
        type: "quickcheck",
        title: "Tres comprobaciones rápidas",
        intro:
          "Elige la opción que mejor aplica el protocolo. Si te equivocas, puedes " +
          "volver a intentarlo: la retroalimentación explica el porqué.",
        questions: [
          {
            q: "¿Cuál es el primer paso del protocolo PVA?",
            options: [
              "Pausar y no interactuar con el mensaje",
              "Responder para pedir más información",
              "Reenviar el mensaje a un amigo",
              "Hacer clic para comprobar si el enlace funciona"
            ],
            answer: 0,
            explain:
              "PAUSA significa detener la interacción. Responder, reenviar o hacer " +
              "clic ya es interactuar y puede confirmar al estafador que el número o " +
              "el correo están activos."
          },
          {
            q: "Un supuesto asesor de tu banco te pide un código de verificación. ¿Cómo verificas?",
            options: [
              "Le pido el código de la empresa por el mismo chat",
              "Llamo al número oficial del banco o abro su aplicación",
              "Busco el número en el mensaje y llamo allí",
              "Le envío un código falso para probar qué pasa"
            ],
            answer: 1,
            explain:
              "La verificación se hace por un canal oficial que tú eliges: la " +
              "aplicación del banco o el número que aparece en la tarjeta o en la " +
              "página oficial. El número del mensaje no es una fuente confiable."
          },
          {
            q: "¿Cuál acción corresponde al paso ACTÚA?",
            options: [
              "Ignorar el mensaje y no hacer nada más",
              "Borrar todo para no volver a verlo",
              "Bloquear, reportar y conservar evidencias",
              "Compartir tus datos para que dejen de escribirte"
            ],
            answer: 2,
            explain:
              "ACTÚA busca reducir el riesgo y dejar rastro útil: bloquear y reportar " +
              "el contacto, conservar capturas y reforzar la seguridad de tus cuentas."
          }
        ]
      },
      aside: {
        tip:
          "La urgencia no es un detalle de estilo: es una herramienta para que " +
          "decidas sin verificar.",
        sources: [
          "Protocolo PVA (documento del proyecto, 2026).",
          "Vishwanath et al. (2011), sobre urgencia y phishing."
        ]
      },
      close:
        "Ya tienes el mapa. En el siguiente módulo lo usarás para leer mensajes y " +
        "llamadas que intentan suplantar a una entidad."
    },

    2: {
      id: "m2",
      n: 2,
      title: "Phishing y vishing: reconocer el engaño",
      navTitle: "Phishing y vishing",
      kicker: "Módulo 2 · Las amenazas",
      lede:
        "Los mensajes y las llamadas pueden imitar a tu banco, a una tienda o a una " +
        "empresa de domicilios. Aprende a mirar las señales antes de responder.",
      robot: "warning",
      tone: "petrol",
      objectives: [
        "Distinguir phishing, smishing y vishing.",
        "Reconocer señales de alerta en un mensaje o una llamada.",
        "Entender por qué la ingeniería social y la IA hacen más convincentes los engaños."
      ],
      steps: [
        {
          title: "Phishing, smishing y vishing",
          summary: "El mismo engaño por canales distintos.",
          body: [
            "El phishing agrupa los mensajes de texto, correos electrónicos y enlaces " +
            "que imitan las comunicaciones de empresas o entidades financieras. " +
            "Buscan que entregues información personal o bancaria, o que ingreses a " +
            "páginas falsas.",
            "Cuando el intento llega por SMS se llama smishing; cuando llega por una " +
            "llamada telefónica de suplantación se llama vishing. En la encuesta del " +
            "proyecto, ambos canales fueron los más reportados: 47,6 % para SMS y " +
            "47,6 % para llamadas."
          ],
          tips: [
            "Un banco no te pide contraseñas ni códigos por mensaje.",
            "El canal de contacto no es, por sí solo, prueba de legitimidad.",
            "Una comunicación oficial también se puede verificar por la app."
          ]
        },
        {
          title: "Señales de alerta que sí puedes observar",
          summary: "Urgencia, amenazas, enlaces raros y solicitudes de códigos.",
          body: [
            "Los casos revisados en el proyecto coinciden en varios patrones: avisos " +
            "de bloqueo de cuentas, problemas con una transacción, paquetes " +
            "retenidos, ofertas de empleo con pagos anticipados y suplantación de " +
            "empresas como Rappi o entidades financieras como Bancolombia.",
            "Alsharnouby et al. (2015) mostraron que incluso usuarios advertidos no " +
            "identifican todos los sitios fraudulentos. Por eso conviene revisar " +
            "varias señales a la vez y no confiar en una sola."
          ],
          tips: [
            "Urgencia o amenaza de bloqueo: «tienes 2 horas», «cuenta suspendida».",
            "Solicitud de códigos, contraseñas o datos bancarios.",
            "Enlaces con dominios extraños, acortados o con errores.",
            "Saludos genéricos y remitentes que no coinciden con la entidad.",
            "Ofertas demasiado buenas o pagos para acceder a un empleo."
          ]
        },
        {
          title: "Por qué funciona: ingeniería social e IA",
          summary: "El engaño explota confianza, miedo, prisa y curiosidad.",
          body: [
            "La ingeniería social manipula psicológicamente a las personas para " +
            "conseguir información confidencial. Los delincuentes se aprovechan de " +
            "situaciones reales: el afán, el miedo a perder una cuenta o la " +
            "necesidad de conseguir empleo.",
            "La inteligencia artificial añade un riesgo nuevo: permite redactar " +
            "mensajes más personalizados y convincentes e incluso clonar voces con " +
            "pocas muestras (Jabir et al., 2025). Ya no basta con buscar errores de " +
            "ortografía."
          ],
          tips: [
            "La confianza se construye con contexto, no con prisa.",
            "Si la llamada te aísla o te pide no colgar, sospecha.",
            "Verifica por otro canal aunque la voz o el mensaje parezcan reales."
          ]
        }
      ],
      activity: {
        type: "flagHunt",
        title: "Detecta las señales en este SMS",
        intro:
          "Toca cada parte del mensaje que te parezca sospechosa. No necesitas " +
          "responder al mensaje: solo marcar las pistas.",
        fromLabel: "De:",
        fromValue: "+57 300 123 4567",
        body:
          '<span class="flag" role="button" tabindex="0" data-flag="saludo">Estimado cliente</span>, ' +
          "detectamos un movimiento inusual en tu cuenta. Por seguridad, " +
          '<span class="flag" role="button" tabindex="0" data-flag="amenaza">tu cuenta será bloqueada</span> ' +
          '<span class="flag" role="button" tabindex="0" data-flag="urgencia">en las próximas 2 horas</span>. ' +
          "Confirma tus datos aquí: " +
          '<span class="flag" role="button" tabindex="0" data-flag="enlace">https://bancolombia-seguridad.xyz/verificar</span> ' +
          "y " +
          '<span class="flag" role="button" tabindex="0" data-flag="codigo">envíanos el código de 6 dígitos</span> ' +
          "que acabamos de enviar a tu celular.",
        headerFlag: "remitente",
        signals: [
          {
            key: "remitente",
            label: "Remitente desconocido",
            explain:
              "El número es un celular común, no un canal oficial de la entidad. Un " +
              "banco no te escribe desde un número desconocido para pedir datos."
          },
          {
            key: "saludo",
            label: "Saludo genérico",
            explain:
              "«Estimado cliente» no usa tu nombre. Es una plantilla que se envía a " +
              "muchas personas a la vez."
          },
          {
            key: "amenaza",
            label: "Amenaza de bloqueo",
            explain:
              "El miedo a perder la cuenta es una palanca clásica de ingeniería " +
              "social: busca que actúes sin verificar."
          },
          {
            key: "urgencia",
            label: "Urgencia artificial",
            explain:
              "Un plazo de dos horas impide comparar, preguntar o abrir la " +
              "aplicación oficial con calma."
          },
          {
            key: "enlace",
            label: "Enlace con dominio extraño",
            explain:
              "El dominio no es el oficial: agrega palabras y un sufijo para parecer " +
              "legítimo. Escribe tú el dominio o abre la aplicación."
          },
          {
            key: "codigo",
            label: "Solicitud de código de verificación",
            explain:
              "Ningún banco legítimo te pide por SMS el código que acaba de enviar. " +
              "Ese código protege tu cuenta; compartirlo es entregar la llave."
          }
        ]
      },
      aside: {
        tip:
          "Si el mensaje te apura, te asusta o te ofrece algo demasiado bueno, " +
          "detente: esos son los tres ganchos más frecuentes.",
        sources: [
          "Modalidades de estafa del documento del proyecto (2026).",
          "Encuesta del proyecto: 47,6 % smishing y 47,6 % vishing.",
          "Alsharnouby et al. (2015); Jabir et al. (2025)."
        ]
      },
      close:
        "Reconocer la señal es el primer paso. El siguiente módulo convierte esa " +
        "lectura en hábitos concretos para proteger tus cuentas y tus datos."
    },

    3: {
      id: "m3",
      n: 3,
      title: "Protección de datos y cuentas",
      navTitle: "Protección de datos",
      kicker: "Módulo 3 · Los hábitos",
      lede:
        "La prevención no depende solo de detectar el engaño: también de reducir lo " +
        "que un delincuente puede obtener de tus cuentas y de tu información.",
      robot: "reflection",
      tone: "lavender",
      objectives: [
        "Aplicar contraseñas únicas y autenticación en dos pasos.",
        "Limitar la información personal que publicas y compartes.",
        "Usar alertas, actualizaciones y reporte oportuno."
      ],
      steps: [
        {
          title: "Contraseñas únicas y un gestor confiable",
          summary: "Una clave distinta para cada servicio importante.",
          body: [
            "En la encuesta del proyecto, el 57,9 % de las personas utiliza " +
            "contraseñas diferentes para cada aplicación, pero un 5,3 % limita su " +
            "seguridad al uso de claves básicas. Reutilizar la misma contraseña " +
            "significa que una filtración puede abrir varias cuentas a la vez.",
            "La recomendación del documento es usar claves diferentes para cada " +
            "servicio y considerar un gestor de contraseñas confiable."
          ],
          tips: [
            "Usa frases largas y fáciles de recordar solo para ti.",
            "No repitas la contraseña del correo o del banco en otros servicios.",
            "Si usas un gestor, protégelo con una clave principal robusta."
          ]
        },
        {
          title: "Autenticación en dos pasos (2FA)",
          summary: "Una segunda verificación además de la contraseña.",
          body: [
            "La autenticación de dos factores añade una verificación adicional para " +
            "proteger las cuentas. En la encuesta, el 47,4 % mantiene activada la " +
            "2FA: es una práctica positiva, pero todavía no generalizada.",
            "Actívala primero en el correo electrónico y en las cuentas bancarias. " +
            "El correo suele ser la llave para recuperar el resto de tus servicios."
          ],
          tips: [
            "Prefiere una aplicación de autenticación cuando esté disponible.",
            "Nunca compartas el código de 2FA con nadie.",
            "Revisa los dispositivos conectados a tus cuentas."
          ]
        },
        {
          title: "Datos personales y privacidad",
          summary: "Publica menos y entrega solo lo necesario.",
          body: [
            "La publicación excesiva de información personal facilita la " +
            "personalización de los engaños. Los estafadores pueden usar tu nombre, " +
            "tus contactos o tu actividad para que un mensaje parezca auténtico.",
            "La recomendación es limitar la información publicada en redes y " +
            "entregar solo los datos necesarios. Una fotografía de tu documento de " +
            "identidad puede servir para suplantarte, como ocurrió en el caso de la " +
            "falsa oferta laboral reseñado en el proyecto."
          ],
          tips: [
            "Revisa la privacidad de tus perfiles y limita quién ve tus datos.",
            "No envíes fotos de documentos por canales informales.",
            "Desconfía de formularios y encuestas que piden más datos de los necesarios."
          ]
        },
        {
          title: "Alertas bancarias y revisión de movimientos",
          summary: "Enterarte a tiempo cambia la respuesta.",
          body: [
            "Activar notificaciones de movimientos y revisar periódicamente las " +
            "transacciones permite detectar cobros extraños y reaccionar antes. Si " +
            "ves un movimiento que no reconoces, contacta a tu banco por su canal " +
            "oficial y conserva la evidencia."
          ],
          tips: [
            "Activa alertas para compras y transferencias.",
            "Revisa tus movimientos al menos una vez por semana.",
            "Reporta de inmediato un cargo desconocido; no esperes el extracto."
          ]
        },
        {
          title: "Enlaces, actualizaciones y reporte",
          summary: "Menos superficie de ataque, más capacidad de respuesta.",
          body: [
            "Solo un 5,3 % de las personas encuestadas realiza una verificación " +
            "técnica de los enlaces URL antes de interactuar con ellos. Verificar el " +
            "dominio, mantener actualizados el sistema, el navegador y las " +
            "aplicaciones, y reportar perfiles, números o páginas sospechosas " +
            "reduce el riesgo y protege a otras personas.",
            "El reporte oportuno a la plataforma y a las autoridades también es una " +
            "medida de prevención: interrumpe la cadena y deja evidencia."
          ],
          tips: [
            "Pasa el cursor o mantén pulsado el enlace para ver el destino real.",
            "Actualiza el sistema y las aplicaciones cuando haya parches.",
            "Reporta el perfil, el número o el correo sospechoso."
          ]
        }
      ],
      activity: {
        type: "commitments",
        title: "Elige al menos tres compromisos",
        intro:
          "Estas son medidas de prevención tomadas del documento del proyecto. " +
          "Selecciona las que puedas asumir desde hoy; no se envía nada a terceros.",
        min: 3,
        items: [
          {
            key: "claves",
            flag: "Claves",
            title: "Usaré una contraseña distinta para cada servicio importante",
            detail: "Empezaré por el correo y la banca móvil."
          },
          {
            key: "dospasos",
            flag: "2FA",
            title: "Activaré la autenticación en dos pasos",
            detail: "En mi correo y en mis cuentas bancarias."
          },
          {
            key: "privacidad",
            flag: "Privacidad",
            title: "Revisaré la privacidad de mis redes y publicaré menos datos",
            detail: "Limitaré quién puede ver mi información personal."
          },
          {
            key: "alertas",
            flag: "Alertas",
            title: "Activaré las alertas de movimientos de mi banco",
            detail: "Revisaré las transacciones periódicamente."
          },
          {
            key: "actualizaciones",
            flag: "Updates",
            title: "Mantendré actualizados el sistema, el navegador y las apps",
            detail: "Instalaré los parches de seguridad disponibles."
          },
          {
            key: "reporte",
            flag: "Reporte",
            title: "Reportaré números, correos o perfiles sospechosos",
            detail: "Bloquearé y conservaré las evidencias."
          }
        ]
      },
      aside: {
        tip:
          "La 2FA y una contraseña única no eliminan el riesgo, pero hacen que un " +
          "dato filtrado no sea suficiente para entrar a tu cuenta.",
        sources: [
          "Soluciones de prevención del documento del proyecto (2026).",
          "Encuesta del proyecto: 57,9 % claves distintas; 47,4 % 2FA; 5,3 % verifica URL."
        ]
      },
      close:
        "Ya tienes prácticas concretas. Ahora es momento de ponerlas a prueba en " +
        "situaciones parecidas a las que ocurren todos los días."
    },

    4: {
      id: "m4",
      n: 4,
      title: "Simulaciones: decide en tiempo real",
      navTitle: "Simulaciones",
      kicker: "Módulo 4 · El simulacro",
      lede:
        "Tres escenarios hipotéticos basados en situaciones reales. Elige una acción " +
        "y recibe retroalimentación sobre los riesgos y las señales de alerta.",
      robot: "feedback",
      tone: "coral",
      objectives: [
        "Aplicar el protocolo PVA en situaciones concretas.",
        "Identificar las señales de urgencia, presión y solicitud de datos.",
        "Comparar decisiones y comprender sus consecuencias."
      ],
      steps: [
        {
          title: "Cómo funciona el simulacro",
          summary: "Elige, lee la retroalimentación y compara.",
          body: [
            "Cada escenario presenta un caso ficticio: una oferta de empleo, un " +
            "mensaje de paquete retenido y una llamada de un supuesto asesor " +
            "bancario. Debes seleccionar una acción de respuesta y luego recibirás " +
            "retroalimentación sobre los riesgos y las señales de alerta.",
            "No hay datos reales ni se envía información a terceros. Puedes repetir " +
            "un caso para comparar respuestas: el objetivo es aprender, no acertar " +
            "a la primera."
          ],
          tips: [
            "Lee el caso completo antes de elegir.",
            "Pregúntate qué haría el protocolo PVA en cada paso.",
            "Revisa las señales de alerta después de tu decisión."
          ]
        }
      ],
      activity: {
        type: "scenarios",
        title: "Tres decisiones, tres aprendizajes",
        intro:
          "Responde los tres casos. Al final verás cuántas de tus decisiones fueron " +
          "las de mayor protección."
      },
      aside: {
        tip:
          "En un caso real, la mejor decisión suele ser la que te da tiempo y no " +
          "entrega información.",
        sources: [
          "Casos y modalidades descritos en el documento del proyecto (2026).",
          "Metodología de simulacro interactivo con retroalimentación."
        ]
      },
      close:
        "Has practicado el protocolo. La evaluación de cinco preguntas te ayudará a " +
        "comprobar qué ideas quedaron claras."
    }
  };

  PVA.content.course = COURSE;
  PVA.content.welcome = WELCOME;
  PVA.content.modules = MODULES;
})(window);

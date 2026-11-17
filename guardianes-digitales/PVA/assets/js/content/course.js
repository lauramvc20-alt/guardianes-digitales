(function (global) {
  "use strict";

  var PVA = global.PVA;
  PVA.content = PVA.content || {};

  PVA.content.course = {
    title: "PAUSA, VERIFICA Y ACTÚA: Sé un guardián digital",
    shortTitle: "PAUSA, VERIFICA Y ACTÚA",
    tagline: "Sé un guardián digital",
    duration: "10 a 15 minutos",
    access: "Libre, gratuito y sin registro",
    modality: "Experiencia digital interactiva",
    certificate: "Certificado simbólico de finalización",
    description:
      "Experiencia educativa gamificada de corta duración para reconocer señales de " +
      "smishing (engaños por SMS y mensajería) y vishing (engaños por llamadas de voz), " +
      "verificar la información por canales oficiales y adoptar buenas prácticas de " +
      "protección de datos. No requiere registro previo ni credenciales de ingreso."
  };

  PVA.content.welcome = {
    title: "Bienvenido, futuro guardián digital",
    lede:
      "Vas a recorrer una experiencia breve y práctica: no una clase teórica, sino " +
      "un espacio para decidir, equivocarte sin riesgo y aprender a reconocer un " +
      "engaño por SMS o llamada antes de responder.",
    intro:
      "El proyecto parte de una situación cercana: el smishing y el vishing afectan a " +
      "personas que usan billeteras digitales, banca móvil, redes sociales y plataformas " +
      "de compraventa. En la encuesta del proyecto, el 85 % de las 20 personas consultadas " +
      "había recibido mensajes o llamadas sospechosas.",
    goals: [
      "Reconocer señales de smishing (mensajes de texto y mensajería instantánea).",
      "Identificar intentos de vishing (llamadas telefónicas y clonación de voz).",
      "Verificar la información únicamente por canales oficiales.",
      "Adoptar prácticas seguras y preventivas para cuidar tus datos."
    ],
    moments: [
      { n: "01", title: "Introducción", text: "Sensibilización y protocolo PAUSA, VERIFICA y ACTÚA. Es el mapa que usarás en todo el recorrido." },
      { n: "02", title: "Contenido guiado", text: "Tres módulos cortos sobre el protocolo PVA, smishing y vishing, y protección de cuentas y datos." },
      { n: "03", title: "Simulacro interactivo", text: "Tres escenarios hipotéticos basados en situaciones reales. Eliges una acción y recibes retroalimentación." },
      { n: "04", title: "Evaluación breve", text: "Cinco preguntas con retroalimentación para comprobar lo aprendido." },
      { n: "05", title: "Kit y certificado", text: "Recursos descargables para llevar contigo y un reconocimiento simbólico como guardián digital." }
    ],
    audience: "Dirigido a estudiantes, familiares y ciudadanos que utilizan servicios de mensajería, llamadas, billeteras o aplicaciones bancarias.",
    privacy: "No se solicitan datos personales ni credenciales. Tu avance se guarda únicamente en este navegador y dispositivo.",
    start: "Comenzar por el Módulo 1"
  };

  PVA.content.modules = {
    1: {
      id: "m1",
      n: 1,
      title: "El protocolo PVA",
      navTitle: "Protocolo PVA",
      kicker: "Módulo 1 · La base",
      lede: "Tres pasos para ordenar cualquier decisión digital: detenerte, comprobar por un canal oficial y actuar con cuidado.",
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
            "El protocolo empieza por no interactuar. Cuando un mensaje SMS, un chat o una llamada te pide datos personales, códigos de verificación, contraseñas o dinero, el primer movimiento es detener la conversación.",
            "Los estafadores necesitan que actúes rápido. La urgencia, el miedo a perder una cuenta, la curiosidad o la necesidad de empleo reducen el tiempo que dedicamos a verificar. Vishwanath et al. (2011) encontraron que las señales de urgencia influyen directamente en cómo se procesan los mensajes fraudulentos de ingeniería social."
          ],
          tips: [
            "No respondas ni pulses enlaces del mensaje SMS.",
            "No dictes códigos de verificación, contraseñas ni datos bancarios en llamadas.",
            "Si sientes presión para decidir «ya», trátalo como una señal de alerta."
          ]
        },
        {
          title: "VERIFICA: corroborar por canales oficiales",
          summary: "Comprueba por tu cuenta, no por el canal que te contactó.",
          body: [
            "Verificar no es responder al mismo mensaje ni devolver la llamada al mismo número para preguntar si es real. Consiste en comprobar la información por un canal que tú elijas y que sepas que es oficial: la aplicación del banco, el sitio web escrito por ti o el número que aparece al respaldo de tu tarjeta.",
            "El documento del proyecto lo resume así: PAUSA es detener la interacción; VERIFICA es corroborar únicamente por canales oficiales; ACTÚA es aplicar prácticas seguras."
          ],
          tips: [
            "Abre la aplicación oficial y revisa si el aviso existe de verdad.",
            "Llama al número oficial de la entidad, no al que aparece en el SMS o identificador.",
            "Escribe el dominio manualmente y desconfía de enlaces acortados."
          ]
        },
        {
          title: "ACTÚA: aplica prácticas seguras y reporta",
          summary: "Bloquea, conserva evidencias y protege tus cuentas.",
          body: [
            "Después de verificar, actúa. Bloquea y reporta el número o contacto, conserva las evidencias (capturas de pantalla, número telefónico), cambia las contraseñas si entregaste datos y activa la autenticación en dos pasos.",
            "Si fuiste víctima, acude a los canales oficiales de tu banco y realiza el reporte formal al CAI Virtual de la Policía Nacional."
          ],
          tips: [
            "Bloquea y reporta el número sospechoso.",
            "Conserva capturas y no borres la conversación o registro de llamada.",
            "Cambia contraseñas y revisa los movimientos de tus cuentas."
          ]
        }
      ],
      activity: {
        type: "quickcheck",
        title: "Tres comprobaciones rápidas",
        intro: "Elige la opción que mejor aplica el protocolo. Si te equivocas, puedes volver a intentarlo: la retroalimentación explica el porqué.",
        questions: [
          {
            q: "¿Cuál es el primer paso del protocolo PVA?",
            options: [
              "Pausar y no interactuar con el mensaje o llamada",
              "Responder para pedir más información",
              "Reenviar el mensaje a un amigo",
              "Hacer clic para comprobar si el enlace funciona"
            ],
            answer: 0,
            explain: "PAUSA significa detener la interacción. Responder, reenviar o hacer clic ya es interactuar y confirma al estafador que tu línea está activa."
          },
          {
            q: "Un supuesto asesor de tu banco te llama y pide un código de verificación. ¿Cómo verificas?",
            options: [
              "Le pido su número de extensión por la misma llamada",
              "Cuelgo y llamo al número oficial del banco o abro su aplicación",
              "Devuelvo la llamada al mismo número que apareció en pantalla",
              "Le dicto un código falso para probar qué pasa"
            ],
            answer: 1,
            explain: "La verificación se hace por un canal oficial que tú eliges: la aplicación del banco o el número oficial. El identificador de llamadas puede ser suplantado."
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
            explain: "ACTÚA busca reducir el riesgo y dejar rastro útil: bloquear y reportar el contacto, conservar capturas y reforzar la seguridad de tus cuentas."
          }
        ]
      },
      aside: {
        tip: "La urgencia no es un detalle de estilo: es una herramienta psicológica para que decidas sin verificar.",
        sources: [
          "Vishwanath et al. (2011), sobre urgencia en engaños digitales."
        ]
      },
      close: "Ya tienes el mapa. En el siguiente módulo lo usarás para analizar mensajes SMS y llamadas telefónicas que intentan suplantar a una entidad."
    },

    2: {
      id: "m2",
      n: 2,
      title: "Smishing y vishing: reconocer el engaño",
      navTitle: "Smishing y vishing",
      kicker: "Módulo 2 · Las amenazas",
      lede: "Los mensajes SMS y las llamadas telefónicas pueden imitar a tu banco, a una tienda o a una empresa de domicilios. Aprende a detectar las señales antes de responder.",
      robot: "warning",
      tone: "petrol",
      objectives: [
        "Distinguir claramente entre smishing (mensajes SMS/mensajería) y vishing (llamadas de voz).",
        "Reconocer señales de alerta en un mensaje de texto o una llamada telefónica.",
        "Entender cómo la ingeniería social y la clonación de voz con IA hacen más creíbles los engaños."
      ],
      steps: [
        {
          title: "Smishing y vishing: el engaño por texto y por voz",
          summary: "Dos modalidades de suplantación que atacan tu teléfono.",
          body: [
            "Dentro de las estafas de suplantación (conocidas en general como phishing), las dos modalidades más frecuentes en dispositivos móviles son el smishing y el vishing. El smishing ocurre cuando los delincuentes envían mensajes de texto (SMS o mensajería instantánea) haciéndose pasar por bancos o empresas con enlaces falsos.",
            "Por su parte, el vishing utiliza llamadas telefónicas o mensajes de voz donde un supuesto asesor finge una emergencia financiera para extraer claves o códigos. En la encuesta del proyecto, ambos canales fueron los más reportados por los participantes: 47,6 % para smishing y 47,6 % para vishing."
          ],
          tips: [
            "Smishing (SMS): desconfía de enlaces cortos o dominios raros que piden confirmar datos.",
            "Vishing (Llamadas): ningún banco te pide dictar códigos OTP ni claves por teléfono.",
            "El identificador de llamada o remitente SMS puede ser falsificado (spoofing)."
          ]
        },
        {
          title: "Señales de alerta en SMS y llamadas",
          summary: "Urgencia, amenazas de bloqueo, enlaces raros y petición de códigos.",
          body: [
            "Los casos revisados en el proyecto coinciden en varios patrones de smishing y vishing: alertas SMS de bloqueo de cuentas, llamadas sobre compras no reconocidas, mensajes de paquetes retenidos, falsas ofertas de empleo por chat y suplantación de plataformas como Rappi o entidades como Bancolombia.",
            "Alsharnouby et al. (2015) mostraron que incluso usuarios advertidos no identifican todos los engaños. Por eso conviene revisar varias señales a la vez y nunca confiar únicamente en la apariencia del mensaje o el tono de voz."
          ],
          tips: [
            "Urgencia o amenaza: «tienes 2 horas antes del bloqueo» o «no cuelgue la llamada».",
            "Solicitud de códigos de 6 dígitos (OTP), contraseñas o números de tarjeta.",
            "En smishing: enlaces con dominios alterados, acortados o con terminaciones atípicas.",
            "En vishing: ruido de call center de fondo y presión psicológica para decidir rápido."
          ]
        },
        {
          title: "Ingeniería social y clonación de voz con IA",
          summary: "El engaño explota confianza, miedo, prisa y tecnología.",
          body: [
            "La ingeniería social manipula psicológicamente a las personas para conseguir información confidencial. Los delincuentes aprovechan emociones reales: el afán diario, el temor a perder dinero o la necesidad de empleo.",
            "La inteligencia artificial añade un riesgo crítico en smishing y vishing: permite redactar textos sin errores ortográficos y clonar voces reales con apenas unos segundos de audio (Jabir et al., 2025). Por ello, verificar por un canal oficial independiente es indispensable."
          ],
          tips: [
            "La confianza se verifica por canales oficiales, nunca por la voz al teléfono.",
            "Si el operador telefónico te pide no colgar, cuelga de inmediato.",
            "Verifica siempre desde la app oficial del banco o llamando al número de tu tarjeta."
          ]
        }
      ],
      activity: {
        type: "flagHunt",
        title: "Detecta las señales en este SMS (Smishing)",
        intro: "Toca cada parte del mensaje que te parezca sospechosa. No necesitas responder al mensaje: solo marcar las pistas.",
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
          { key: "remitente", label: "Remitente desconocido", explain: "El número es un celular común, no un canal oficial de la entidad. Un banco no te escribe desde un número desconocido para pedir datos." },
          { key: "saludo", label: "Saludo genérico", explain: "«Estimado cliente» no usa tu nombre. Es una plantilla masiva de smishing que se envía a miles de números." },
          { key: "amenaza", label: "Amenaza de bloqueo", explain: "El miedo a perder la cuenta es una palanca clásica de ingeniería social: busca que actúes sin verificar." },
          { key: "urgencia", label: "Urgencia artificial", explain: "Un plazo de dos horas impide comparar, preguntar o abrir la aplicación oficial con calma." },
          { key: "enlace", label: "Enlace con dominio extraño", explain: "El dominio no es el oficial: agrega palabras y un sufijo (.xyz) para parecer legítimo. Escribe tú el dominio o abre la aplicación." },
          { key: "codigo", label: "Solicitud de código de verificación", explain: "Ningún banco legítimo te pide por SMS el código OTP que acaba de enviar. Ese código protege tu cuenta; compartirlo es entregar la llave." }
        ]
      },
      aside: {
        tip: "Si un SMS o llamada te apura, te asusta o te ofrece algo demasiado bueno, detente: esos son los tres ganchos más frecuentes.",
        sources: [
          "Modalidades de smishing y vishing del proyecto (2026).",
          "Encuesta del proyecto: 47,6 % smishing y 47,6 % vishing.",
          "Alsharnouby et al. (2015); Jabir et al. (2025)."
        ]
      },
      close: "Ya sabes leer las señales en SMS y llamadas. El siguiente paso es reducir la superficie de riesgo en tus cuentas."
    },

    3: {
      id: "m3",
      n: 3,
      title: "Protección de datos y cuentas",
      navTitle: "Protección de datos",
      kicker: "Módulo 3 · Los hábitos",
      lede: "La prevención no depende solo de detectar el engaño: también de reducir lo que un delincuente puede obtener de tus cuentas y de tu información.",
      robot: "reflection",
      tone: "lavender",
      objectives: [
        "Aplicar contraseñas únicas y autenticación en dos pasos (2FA).",
        "Limitar la información personal que publicas y compartes.",
        "Usar alertas bancarias, actualizaciones y reporte oportuno."
      ],
      steps: [
        {
          title: "Contraseñas únicas y un gestor confiable",
          summary: "Una clave distinta para cada servicio importante.",
          body: [
            "En la encuesta del proyecto, el 57,9 % de las personas utiliza contraseñas diferentes para cada aplicación, pero un 5,3 % limita su seguridad al uso de claves básicas. Reutilizar la misma contraseña significa que una filtración puede abrir varias cuentas a la vez.",
            "La recomendación del documento es usar claves diferentes para cada servicio y considerar un gestor de contraseñas confiable."
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
            "La autenticación de dos factores añade una verificación adicional para proteger las cuentas. En la encuesta, el 47,4 % mantiene activada la 2FA: es una práctica positiva, pero todavía no generalizada.",
            "Actívala primero en el correo electrónico y en las cuentas bancarias. El correo suele ser la llave para recuperar el resto de tus servicios."
          ],
          tips: [
            "Prefiere una aplicación de autenticación cuando esté disponible.",
            "Nunca compartas el código de 2FA con nadie por SMS ni por llamada.",
            "Revisa los dispositivos conectados a tus cuentas."
          ]
        },
        {
          title: "Datos personales y privacidad",
          summary: "Publica menos y entrega solo lo necesario.",
          body: [
            "La publicación excesiva de información personal facilita la personalización de los ataques de smishing y vishing. Los estafadores usan tu nombre, tus contactos o tu actividad para que el engaño parezca auténtico.",
            "La recomendación es limitar la información publicada en redes y entregar solo los datos necesarios. Una fotografía de tu documento de identidad puede servir para suplantarte, como ocurrió en el caso de la falsa oferta laboral reseñado en el proyecto."
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
            "Activar notificaciones de movimientos y revisar periódicamente las transacciones permite detectar cobros extraños y reaccionar antes. Si ves un movimiento que no reconoces, contacta a tu banco por su canal oficial y conserva la evidencia."
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
            "Solo un 5,3 % de las personas encuestadas realiza una verificación técnica de los enlaces URL antes de interactuar con ellos. Verificar el dominio, mantener actualizados el sistema, el navegador y las aplicaciones, y reportar números o páginas sospechosas reduce el riesgo y protege a otras personas."
          ],
          tips: [
            "Mantén pulsado el enlace del SMS para inspeccionar el destino real sin abrirlo.",
            "Actualiza el sistema y las aplicaciones cuando haya parches.",
            "Reporta el número o perfil sospechoso a tu operador y al CAI Virtual."
          ]
        }
      ],
      activity: {
        type: "commitments",
        title: "Elige al menos tres compromisos",
        intro: "Elige al menos tres hábitos que puedas empezar hoy. Marca cada compromiso que quieras asumir: tu selección se guarda solo en este navegador y no se envía a nadie.",
        min: 3,
        items: [
          { key: "claves", flag: "Claves", title: "Usaré una contraseña distinta para cada servicio importante", detail: "Empezaré por el correo y la banca móvil." },
          { key: "dospasos", flag: "2FA", title: "Activaré la autenticación en dos pasos", detail: "En mi correo y en mis cuentas bancarias." },
          { key: "privacidad", flag: "Privacidad", title: "Revisaré la privacidad de mis redes y publicaré menos datos", detail: "Limitaré quién puede ver mi información personal." },
          { key: "alertas", flag: "Alertas", title: "Activaré las alertas de movimientos de mi banco", detail: "Revisaré las transacciones periódicamente." },
          { key: "actualizaciones", flag: "Updates", title: "Mantendré actualizados el sistema, el navegador y las apps", detail: "Instalaré los parches de seguridad disponibles." },
          { key: "reporte", flag: "Reporte", title: "Reportaré números, mensajes o llamadas sospechosas", detail: "Bloquearé y conservaré las evidencias." }
        ]
      },
      aside: {
        tip: "La 2FA y una contraseña única no eliminan el riesgo, pero hacen que un dato filtrado no sea suficiente para entrar a tu cuenta.",
        sources: [
          "Soluciones de prevención del documento del proyecto (2026).",
          "Encuesta del proyecto: 57,9 % claves distintas; 47,4 % 2FA; 5,3 % verifica URL."
        ]
      },
      close: "Con el protocolo y los hábitos claros, llega el simulacro: tres escenarios prácticos para ponerlo todo a prueba."
    },

    4: {
      id: "m4",
      n: 4,
      title: "Simulaciones: decide en tiempo real",
      navTitle: "Simulaciones",
      kicker: "Módulo 4 · El simulacro",
      lede: "Tres escenarios hipotéticos basados en casos de smishing y vishing. Elige una acción y recibe retroalimentación sobre los riesgos y las señales de alerta.",
      robot: "feedback",
      tone: "coral",
      objectives: [
        "Aplicar el protocolo PVA en situaciones concretas de mensajería y llamadas.",
        "Identificar las señales de urgencia, presión y solicitud de datos.",
        "Comparar decisiones y comprender sus consecuencias."
      ],
      steps: [
        {
          title: "Cómo funciona el simulacro",
          summary: "Elige, lee la retroalimentación y compara.",
          body: [
            "Cada escenario presenta un caso ficticio: una oferta de empleo por WhatsApp, un SMS de paquete retenido (smishing) y una llamada de un supuesto asesor bancario (vishing). Debes seleccionar una acción de respuesta y luego recibirás retroalimentación sobre los riesgos y las señales de alerta.",
            "No hay datos reales ni se envía información a terceros. Puedes repetir un caso para comparar respuestas: el objetivo es aprender, no acertar a la primera."
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
        intro: "Responde los tres casos. Al final verás cuántas de tus decisiones fueron las de mayor protección."
      },
      aside: {
        tip: "En un caso real de smishing o vishing, la mejor decisión siempre es la que te da tiempo y no entrega información.",
        sources: [
          "Casos y modalidades descritos en el documento del proyecto (2026).",
          "Metodología de simulacro interactivo con retroalimentación."
        ]
      },
      close: "Completaste los cuatro módulos. Sigue la evaluación breve de cinco preguntas para desbloquear el Kit Digital."
    }
  };
})(window);
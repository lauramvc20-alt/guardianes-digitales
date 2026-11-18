(function (global) {
  "use strict";

  var PVA = global.PVA;
  PVA.content = PVA.content || {};

  PVA.content.course = {
    title: "PAUSA, VERIFICA Y ACTÚA: Sé un guardián digital",
    shortTitle: "PAUSA, VERIFICA Y ACTÚA",
    tagline: "Sé un guardián digital",
    duration: "Unos 12 minutos",
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
      "El smishing y el vishing afectan a quienes usan billeteras digitales, banca móvil, " +
      "redes sociales y plataformas de compraventa. El 85 % de las 20 personas consultadas " +
      "en la encuesta diagnóstica había recibido mensajes o llamadas sospechosas.",
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
            "Una estafa digital rara vez depende de que seas descuidado; depende de que no tengas tiempo. Un mensaje que anuncia un bloqueo, una llamada que pide un código «para protegerte» o una oferta de empleo que «cierra hoy» están pensados para que reacciones antes de pensar.",
            "Pausar es decidir que todavía no interactúas: no contestas, no pulsas el enlace, no dictas nada. No significa desconfiar de todo, sino separar el momento en que recibes el mensaje del momento en que decides qué hacer con él. Mientras no respondas ni toques nada, el engaño no ha conseguido su objetivo.",
            "Imagina que estás en la fila de una tienda y llega un SMS: «Tu cuenta será bloqueada en 2 horas». El contexto empuja a resolverlo ya. Guardar el celular y terminar lo que hacías es, en sí mismo, una defensa."
          ],
          tips: [
            "Guarda el celular y termina lo que estabas haciendo antes de decidir.",
            "Colgar una llamada sin dar explicaciones no es mala educación: es una forma de pausar.",
            "Un mensaje que fija un plazo muy corto merece más cuidado, no menos."
          ]
        },
        {
          title: "VERIFICA: corroborar por canales oficiales",
          summary: "Comprueba por tu cuenta, no por el canal que te contactó.",
          body: [
            "Verificar es comprobar si lo que te dicen es cierto sin usar el camino que el propio mensaje te ofrece. El enlace, el número para «devolver la llamada» y el supuesto asesor pertenecen a quien te contactó; si los usas para comprobar, la respuesta la controla justo quien podría estar engañándote.",
            "Un canal oficial es uno al que llegas por tu cuenta y que ya conocías antes del mensaje: la aplicación descargada de la tienda oficial, la página escrita por ti en el navegador o el número impreso en tu tarjeta.",
            "Si una empresa de mensajería te escribe porque «tu paquete está retenido», no abras el enlace: entra a la aplicación de la tienda donde compraste y revisa el estado del pedido. Si el aviso es real, estará ahí."
          ],
          tips: [
            "Abre tú la aplicación o el sitio de la entidad y busca allí el aviso.",
            "Llama al número del reverso de tu tarjeta, no al del SMS ni al que aparece en pantalla.",
            "Escribe la dirección web a mano en lugar de pulsar un enlace."
          ]
        },
        {
          title: "ACTÚA: aplica prácticas seguras y reporta",
          summary: "Bloquea, conserva evidencias y protege tus cuentas.",
          body: [
            "Verificar termina de una de dos maneras: el aviso era real y lo resuelves en el canal oficial, o no existe y ya sabes que fue un intento de estafa. En el segundo caso, actuar es cerrar el episodio de forma segura.",
            "Bloquea el número o el contacto y denúncialo en la aplicación de mensajería o ante tu operador. Guarda las capturas y el número, porque son la evidencia para cualquier reporte. Si entregaste algún dato, cambia tus contraseñas y avisa a tu banco por su canal oficial.",
            "Si fuiste víctima, el reporte formal se hace ante el CAI Virtual de la Policía Nacional. Reportar pronto ayuda a que el banco y las autoridades puedan actuar. Cómo dejar tus cuentas mejor protegidas lo verás en el módulo 3."
          ],
          tips: [
            "Bloquea y reporta el número o perfil sospechoso.",
            "Conserva capturas y no borres la conversación ni el registro de llamadas.",
            "Si compartiste datos, avisa a tu banco por su canal oficial y revisa tus movimientos."
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
      close: "Ya tienes el método. Falta conocer al adversario: en el siguiente módulo verás cómo se disfrazan los mensajes y las llamadas, y por qué suenan creíbles."
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
            "Phishing es el nombre general de los engaños que imitan a una entidad para obtener tus datos. Cuando llegan por mensaje de texto (SMS o mensajería instantánea) se llaman smishing; cuando llegan por llamada o mensaje de voz, vishing.",
            "En el smishing, el enlace lleva a una página falsa que copia a la verdadera y recoge lo que escribas. En el vishing, un supuesto asesor finge una emergencia financiera y te guía paso a paso para que le entregues claves o códigos. La voz genera confianza y permite al delincuente adaptarse a tus reacciones en el momento.",
            "Tampoco el nombre que ves en pantalla es una garantía: el remitente de un SMS y el número de una llamada pueden falsificarse (spoofing), de modo que un mensaje puede aparecer junto a los de tu banco sin venir de él."
          ],
          tips: [
            "Smishing: un SMS que te manda a «confirmar datos» en un enlace no es la forma en que una entidad te atiende.",
            "Vishing: ninguna entidad legítima te pide por teléfono el código que acaba de llegar a tu celular.",
            "El remitente y el identificador de llamada pueden falsificarse: no los tomes como prueba."
          ]
        },
        {
          title: "Señales de alerta en SMS y llamadas",
          summary: "Urgencia, amenazas de bloqueo, enlaces raros y petición de códigos.",
          body: [
            "Los engaños cambian de disfraz, pero sus pedidos se parecen: que entregues un dato, un código, un pago o un documento. Los casos más frecuentes incluyen alertas de bloqueo de cuentas, llamadas sobre compras no reconocidas, paquetes retenidos y suplantación de empresas como Rappi o de entidades como Bancolombia.",
            "También hay falsas ofertas de empleo, que piden fotos del documento de identidad o pagos por exámenes y trámites, y publicaciones fraudulentas en plataformas de compraventa, donde un supuesto vendedor cobra y no entrega, o un comprador muestra comprobantes falsos.",
            "Alsharnouby et al. (2015) encontraron que incluso usuarios advertidos no identificaron todos los sitios fraudulentos. Por eso conviene mirar varias señales a la vez y no apoyarse en una sola, como la apariencia del mensaje o el tono de voz."
          ],
          tips: [
            "Plazos y amenazas: «tienes 2 horas antes del bloqueo» o «no cuelgue la llamada».",
            "Piden códigos de 6 dígitos, contraseñas, números de tarjeta, documentos o un pago por adelantado.",
            "Saludo genérico, como «Estimado cliente», en un mensaje que dice venir de tu banco.",
            "Enlaces con dominios alterados, acortados o con terminaciones atípicas.",
            "En llamadas: ruido de call center de fondo y presión para decidir sin colgar."
          ]
        },
        {
          title: "Ingeniería social y clonación de voz con IA",
          summary: "El engaño explota confianza, miedo, prisa y tecnología.",
          body: [
            "La ingeniería social consiste en manipular a las personas, no a los sistemas, para obtener información. Los delincuentes aprovechan emociones reales: la confianza en una voz conocida, el miedo a perder dinero, la curiosidad o la necesidad de empleo. Algunas encuestas o formularios falsos están diseñados solo para recoger datos personales.",
            "La inteligencia artificial hace estos engaños más creíbles. Los modelos de lenguaje redactan mensajes sin errores y con tu nombre, de modo que ya no basta con buscar faltas de ortografía. Los bots pueden enviar mensajes o hacer llamadas masivas con variaciones mínimas, y analizar datos de redes sociales para dirigirse a cada persona con un mensaje a su medida (Jabir et al., 2025).",
            "La IA también puede clonar una voz con pocas muestras de audio. En 2024, unos delincuentes imitaron la voz de un directivo para engañar a un empleado y desviar 25 millones de dólares. Es un caso extremo, pero muestra que oír una voz conocida ya no prueba que la persona esté al otro lado."
          ],
          tips: [
            "Un mensaje bien redactado no es prueba de que sea legítimo.",
            "Si un familiar o un jefe te pide dinero con urgencia por llamada o audio, contáctalo por otro medio que ya uses antes de actuar.",
            "Una encuesta o formulario que pide datos personales sin explicar para qué puede ser una forma de ingeniería social."
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
        tip: "Un mensaje bien escrito o una voz conocida ya no son prueba de autenticidad: la IA permite imitar ambos.",
        sources: [
          "Alsharnouby et al. (2015); Jabir et al. (2025).",
          "Documento del proyecto: modalidades de estafa y uso de la IA en los fraudes digitales."
        ]
      },
      close: "Ya sabes cómo se disfraza el engaño. Ahora toca lo que depende de ti antes de que llegue: qué puede obtener alguien de tus cuentas y de tu información."
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
            "Cuando un servicio sufre una filtración, las contraseñas robadas se prueban en otros sitios. Si usas la misma clave en varios, un solo descuido ajeno abre todas esas puertas a la vez.",
            "Un caso típico: usas para una tienda en línea pequeña la misma clave que para tu correo. Si esa tienda es vulnerada, quien obtiene la clave puede entrar a tu correo y, desde allí, a lo demás.",
            "Lo recomendable es una clave distinta para cada servicio. Como es imposible memorizar tantas, un gestor de contraseñas confiable las guarda por ti y solo necesitas recordar una principal."
          ],
          tips: [
            "Usa frases largas y fáciles de recordar solo para ti, mejor que palabras cortas con símbolos.",
            "Empieza por cambiar la clave del correo y la del banco si se repiten en otros servicios.",
            "Si usas un gestor, protégelo con una clave principal robusta."
          ]
        },
        {
          title: "Autenticación en dos pasos (2FA)",
          summary: "Una segunda verificación además de la contraseña.",
          body: [
            "La autenticación de dos pasos pide, además de la contraseña (algo que sabes), una segunda prueba que solo tú tienes, como un código generado en tu teléfono. Así, una clave robada deja de ser suficiente para entrar.",
            "Actívala primero en el correo electrónico: casi todos los servicios envían allí los enlaces para restablecer la contraseña, de modo que quien controla tu correo puede apoderarse de lo demás.",
            "Entre las opciones, una aplicación de autenticación suele ser más segura que el SMS, porque el código se genera en tu propio dispositivo. Ese código existe para que entres tú; si alguien más lo conoce, la protección desaparece."
          ],
          tips: [
            "Elige una aplicación de autenticación cuando el servicio lo permita.",
            "Revisa qué dispositivos tienen sesión abierta y cierra los que no reconozcas.",
            "Activa también los avisos de inicio de sesión desde un dispositivo nuevo."
          ]
        },
        {
          title: "Datos personales y privacidad",
          summary: "Publica menos y entrega solo lo necesario.",
          body: [
            "Cada dato que publicas es una pieza que un estafador puede usar. Tu nombre, tu lugar de trabajo, tus contactos o lo que compartes en redes sirven para que el mensaje o la llamada parezcan auténticos y para dirigirse a ti de forma personalizada.",
            "Un ejemplo cotidiano: si tu perfil es público y muestra dónde trabajas, una llamada de alguien que dice ser de tu empresa y conoce tu nombre y tu cargo suena creíble sin serlo.",
            "El riesgo es mayor con los documentos. Una persona envió la foto de su cédula a una falsa oferta de empleo y después descubrió que habían solicitado un crédito a su nombre. Entrega solo los datos necesarios y por canales que puedas comprobar."
          ],
          tips: [
            "Revisa la privacidad de tus perfiles y limita quién ve tu información.",
            "No envíes fotos de documentos por chats informales; pregunta para qué los necesitan y quién los recibe.",
            "Desconfía de formularios y encuestas que piden más datos de los necesarios."
          ]
        },
        {
          title: "Alertas bancarias y revisión de movimientos",
          summary: "Enterarte a tiempo cambia la respuesta.",
          body: [
            "Muchas veces el daño no está en el engaño, sino en el tiempo que pasa sin que te des cuenta. Activar las notificaciones de compras y transferencias hace que cada movimiento llegue a tu celular en el momento en que ocurre.",
            "Revisa además tus movimientos con regularidad. Un cobro pequeño que no reconoces puede ser una señal de que alguien tiene datos de tu tarjeta o cuenta, aunque el monto parezca irrelevante.",
            "Si ves un cargo desconocido, actúa en este orden: bloquea la tarjeta desde la aplicación del banco, contacta a la entidad por su canal oficial y guarda capturas del movimiento como evidencia."
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
            "Para leer un enlace, fíjate en el dominio: lo que va justo antes de la primera barra. «bancolombia-seguridad.xyz» no es el sitio del banco aunque contenga su nombre, porque cualquiera puede registrar un dominio con esas palabras.",
            "Mantener actualizados el sistema, el navegador y las aplicaciones cierra fallas de seguridad ya conocidas, que de otro modo los atacantes pueden aprovechar.",
            "Reportar números, perfiles o páginas sospechosas a la plataforma, al operador y a las autoridades también protege a otras personas: ayuda a que esos canales se bloqueen antes de que lleguen a más gente."
          ],
          tips: [
            "Mantén pulsado el enlace del SMS para ver el destino real sin abrirlo.",
            "Activa las actualizaciones automáticas del sistema y de las aplicaciones.",
            "Reporta el número o perfil sospechoso a tu operador, a la plataforma y al CAI Virtual."
          ]
        }
      ],
      activity: {
        type: "privacy",
        title: "Ajusta tu perfil",
        goal: "Así está tu cuenta hoy. Mueve los interruptores hasta dejarla protegida.",
        idle: "Toca un interruptor para cambiar el ajuste. Aquí verás qué pasa.",
        items: [
          { key: "perfil", icon: "eye", label: "Perfil visible para cualquiera", hint: "Quién puede ver tu foto, nombre y publicaciones", start: true, safe: false,
            ok: "Solo tus contactos te ven. Un desconocido tiene menos datos para inventar un engaño creíble.",
            bad: "Cualquiera puede ver tus datos y usarlos para hacerse pasar por alguien cercano." },
          { key: "telefono", icon: "phone", label: "Mostrar mi número de teléfono", hint: "Visible en tu perfil y en grupos", start: true, safe: false,
            ok: "Tu número ya no está a la vista: es más difícil que te lleguen SMS o llamadas de estafadores.",
            bad: "Con tu número público, es fácil que te lleguen SMS y llamadas de estafadores." },
          { key: "ubicacion", icon: "pin", label: "Compartir mi ubicación en tiempo real", hint: "Se actualiza mientras te mueves", start: true, safe: false,
            ok: "Nadie sabe dónde estás. Compartirla solo cuando haga falta evita que se use en tu contra.",
            bad: "Mostrar dónde estás permite saber cuándo estás fuera o solo, y personalizar una estafa." },
          { key: "grupos", icon: "users", label: "Cualquiera puede añadirme a grupos", hint: "Chats y comunidades", start: true, safe: false,
            ok: "Solo tus contactos pueden añadirte. Se reducen los grupos falsos de empleo o inversión.",
            bad: "Te pueden meter en grupos falsos de empleo o inversión sin que lo pidas." },
          { key: "dospasos", icon: "shieldCheck", label: "Verificación en dos pasos", hint: "Un código extra al iniciar sesión", start: false, safe: true,
            ok: "Aunque alguien tenga tu clave, necesita además el código. Nunca lo compartas con nadie.",
            bad: "Sin la segunda verificación, una clave filtrada basta para entrar a tu cuenta." },
          { key: "avisos", icon: "bell", label: "Avisarme de inicios de sesión nuevos", hint: "Alerta cuando entran desde otro dispositivo", start: false, safe: true,
            ok: "Si alguien entra a tu cuenta, te enteras al instante y puedes cambiar la clave.",
            bad: "Sin avisos, un acceso ajeno puede pasar días sin que lo notes." }
        ],
        done: { title: "Cuenta protegida.", text: "Con seis ajustes dejaste menos datos al alcance y más barreras. Repasa hoy los mismos ajustes en tus cuentas reales." }
      },
      aside: {
        tip: "La 2FA y una contraseña única no eliminan el riesgo, pero hacen que un dato filtrado no sea suficiente para entrar a tu cuenta.",
        sources: [
          "Documento del proyecto: soluciones generales de prevención y ejemplo de falsa oferta de empleo."
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
            "Saber qué hacer no es lo mismo que hacerlo cuando llega el mensaje. Con prisa se lee peor y se decide peor; por eso conviene ensayar antes, con casos ficticios donde equivocarse no cuesta nada.",
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
          "Casos y modalidades de smishing y vishing (2026)."
        ]
      },
      close: "Completaste los cuatro módulos. Sigue la evaluación breve de cinco preguntas para desbloquear el Kit Digital."
    }
  };
})(window);
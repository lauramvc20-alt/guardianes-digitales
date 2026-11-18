/* ==========================================================================
   PVA · Base de conocimiento de RO-BIT
   Respuestas PROGRAMADAS a partir de los materiales del curso. No es IA generativa:
   el asistente solo reconoce palabras clave y devuelve el texto escrito aquí.
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;
  PVA.content = PVA.content || {};

  var M1 = { label: "Módulo 1 · Protocolo PVA", to: "/modulo/1" };
  var M2 = { label: "Módulo 2 · Smishing y vishing", to: "/modulo/2" };
  var M3 = { label: "Módulo 3 · Protección de datos", to: "/modulo/3" };
  var M4 = { label: "Módulo 4 · Simulaciones", to: "/modulo/4" };

  PVA.content.robotKb = {
    name: "RO-BIT",
    greeting:
      "¡Hola! Soy RO-BIT, tu acompañante del curso. Respondo con textos preparados a partir de los materiales " +
      "del curso (no soy una inteligencia artificial generativa). Elige una pregunta o escribe la tuya.",
    disclaimer:
      "Asistente con respuestas predefinidas. Funciona en tu navegador: no envía tus preguntas a ningún servicio ni guarda datos personales.",
    suggestions: ["¿Qué es el smishing?", "¿Qué es el protocolo PVA?", "¿Qué es la autenticación en dos pasos?", "¿Cómo me muevo por el curso?"],
    fallback:
      "No tengo una respuesta segura para eso, y prefiero no inventarla. Puedes revisar los módulos del curso o probar con " +
      "uno de estos temas.",
    ambiguous: "No estoy seguro de haber entendido tu pregunta. ¿Se parece a alguno de estos temas? Elige uno y te explico.",
    fallbackLinks: [M1, M2, M3],
    thanks: "¡Con gusto! Si te surge otra duda, aquí estoy.",

    topics: [
      {
        id: "hola",
        title: "Saludo",
        keywords: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "hey", "saludos", "quien eres", "que eres", "quien es robit", "robit", "ayuda", "ayudame"],
        answer: [
          "¡Hola! Soy RO-BIT, el robot que te acompaña en el curso. Puedo explicarte conceptos (smishing, vishing, phishing, ingeniería social, autenticación en dos pasos), el protocolo PAUSA, VERIFICA y ACTÚA, y cómo moverte por la plataforma.",
          "Mis respuestas son textos preparados con los materiales del curso: no genero respuestas nuevas con IA."
        ],
        follow: ["pva", "smishing", "navegacion"]
      },
      {
        id: "pva",
        title: "Protocolo PAUSA, VERIFICA y ACTÚA",
        keywords: ["pva", "protocolo", "pausa verifica", "pausa, verifica", "pausa verifica y actua", "tres pasos", "que hago", "que debo hacer", "como me protejo", "como actuar"],
        answer: [
          "El protocolo PVA son tres pasos en secuencia: PAUSA (detén la interacción: no respondas, no hagas clic, no dictes códigos), VERIFICA (comprueba por un canal oficial que tú elijas) y ACTÚA (bloquea, reporta, conserva evidencias y protege tus cuentas).",
          "No son tres consejos sueltos: se aplican en orden."
        ],
        links: [M1],
        follow: ["pausa", "verifica", "actua"]
      },
      {
        id: "pausa",
        title: "PAUSA",
        keywords: ["pausa", "pausar", "detener", "detenerme", "urgencia", "presion", "no responder"],
        answer: [
          "PAUSA es el primer paso: detén la interacción. No respondas, no pulses enlaces del SMS y no dictes códigos, contraseñas ni datos bancarios por llamada.",
          "Quien engaña necesita que actúes rápido. Si sientes presión para decidir «ya», trátalo como una señal de alerta."
        ],
        links: [M1],
        follow: ["verifica", "senales"]
      },
      {
        id: "verifica",
        title: "VERIFICA",
        keywords: ["verifica", "verificar", "canal oficial", "canales oficiales", "comprobar", "corroborar", "como verifico", "devolver la llamada"],
        answer: [
          "VERIFICAR no es responder al mismo mensaje ni devolver la llamada al mismo número. Es comprobar por un canal que tú elijas y sepas que es oficial: la aplicación del banco, el sitio web escrito por ti o el número al respaldo de tu tarjeta.",
          "Escribe el dominio manualmente y desconfía de los enlaces acortados."
        ],
        links: [M1],
        follow: ["actua", "enlaces"]
      },
      {
        id: "actua",
        title: "ACTÚA",
        keywords: ["actua", "actuar", "bloquear", "reportar", "reporte", "denunciar", "evidencias", "evidencia", "cai virtual", "policia"],
        answer: [
          "ACTÚA es el tercer paso: bloquea y reporta el número o contacto, conserva las evidencias (capturas y número telefónico), cambia las contraseñas si entregaste datos y activa la autenticación en dos pasos.",
          "Si fuiste víctima, acude a los canales oficiales de tu banco y haz el reporte formal al CAI Virtual de la Policía Nacional."
        ],
        links: [M1],
        follow: ["victima", "dospasos"]
      },
      {
        id: "victima",
        title: "Si caí en una estafa",
        keywords: ["fui victima", "me estafaron", "ya di mis datos", "ya entregue", "ya hice clic", "ya di el codigo", "caí", "cai en", "me robaron", "que hago si", "entregue datos"],
        answer: [
          "Según el curso: contacta de inmediato a tu banco por su canal oficial, cambia las contraseñas, activa la autenticación en dos pasos, revisa los movimientos de tus cuentas y conserva las evidencias (capturas y número telefónico).",
          "Después haz el reporte formal al CAI Virtual de la Policía Nacional. No borres la conversación ni el registro de llamada."
        ],
        links: [M1, M3],
        follow: ["actua"]
      },
      {
        id: "smishing",
        title: "Smishing",
        keywords: ["smishing", "sms", "mensaje de texto", "mensajes de texto", "mensaje falso", "paquete retenido", "whatsapp falso"],
        answer: [
          "El smishing es una estafa de suplantación por mensajes de texto (SMS o mensajería instantánea): se hacen pasar por bancos o empresas e incluyen enlaces falsos.",
          "Desconfía de enlaces cortos o dominios raros que piden confirmar datos. En la encuesta del proyecto, el 47,6 % de las personas lo identificó como un canal frecuente (muestra de 20 personas)."
        ],
        links: [M2],
        follow: ["senales", "vishing"]
      },
      {
        id: "vishing",
        title: "Vishing",
        keywords: ["vishing", "llamada", "llamadas", "asesor bancario", "falso asesor", "mensaje de voz", "me llamaron"],
        answer: [
          "El vishing usa llamadas o mensajes de voz: un supuesto asesor finge una emergencia financiera para sacarte claves o códigos.",
          "Ningún banco te pide dictar códigos OTP ni claves por teléfono. Si te piden no colgar, cuelga de inmediato y verifica por el número oficial."
        ],
        links: [M2],
        follow: ["otp", "voz"]
      },
      {
        id: "phishing",
        title: "Phishing",
        keywords: ["phishing", "suplantacion", "suplantar", "pishing", "fishing", "correo falso", "correo fraudulento"],
        answer: [
          "El phishing es el nombre general de las estafas de suplantación: alguien se hace pasar por una entidad o persona de confianza para que entregues datos, claves o dinero.",
          "En dispositivos móviles, las dos modalidades que trabaja este curso son el smishing (texto) y el vishing (voz)."
        ],
        links: [M2],
        follow: ["smishing", "vishing"]
      },
      {
        id: "social",
        title: "Ingeniería social",
        keywords: ["ingenieria social", "manipulacion", "manipular", "engano psicologico", "emociones", "estafadores"],
        answer: [
          "La ingeniería social manipula psicológicamente a las personas para conseguir información confidencial. En vez de vulnerar un sistema, se aprovecha de emociones reales: la prisa diaria, el miedo a perder dinero, la confianza o la necesidad de empleo.",
          "Por eso la confianza se verifica por canales oficiales, nunca por la voz al teléfono."
        ],
        links: [M2],
        follow: ["voz", "pva"]
      },
      {
        id: "voz",
        title: "Clonación de voz con IA",
        keywords: ["clonacion de voz", "clonar voz", "voz clonada", "inteligencia artificial", "deepfake", "ia", "voz falsa"],
        answer: [
          "La inteligencia artificial permite redactar textos sin errores y clonar voces reales con apenas unos segundos de audio. Por eso una voz conocida o un mensaje bien escrito no prueban que sea real.",
          "Verifica siempre por un canal oficial independiente, como la app del banco o el número de tu tarjeta."
        ],
        links: [M2],
        follow: ["verifica"]
      },
      {
        id: "senales",
        title: "Señales de alerta",
        keywords: ["senales", "senal de alerta", "como reconozco", "como identifico", "como saber si es estafa", "es estafa", "sospechoso", "banderas rojas", "me llego un mensaje"],
        answer: [
          "Señales frecuentes: urgencia o amenaza («tienes 2 horas antes del bloqueo»), petición de códigos de 6 dígitos (OTP), contraseñas o datos de tarjeta, enlaces con dominios alterados o acortados, y en llamadas, presión psicológica para decidir rápido.",
          "Conviene revisar varias señales a la vez: nunca confíes solo en la apariencia del mensaje o el tono de voz."
        ],
        links: [M2],
        follow: ["pva", "enlaces"]
      },
      {
        id: "otp",
        title: "Códigos OTP",
        keywords: ["otp", "codigo de verificacion", "codigo de 6 digitos", "codigo por sms", "dictar codigo", "compartir codigo", "me piden un codigo"],
        answer: [
          "Un código de verificación (OTP) nunca se comparte: ni por SMS, ni por llamada, ni con alguien que diga ser del banco.",
          "Si alguien te lo pide, haz PAUSA, corta la comunicación y verifica por el canal oficial."
        ],
        links: [M2, M3],
        follow: ["dospasos"]
      },
      {
        id: "dospasos",
        title: "Autenticación en dos pasos (2FA)",
        keywords: ["autenticacion en dos pasos", "dos pasos", "2fa", "doble factor", "dos factores", "autenticacion de dos factores", "verificacion en dos pasos", "autenticacion"],
        answer: [
          "La autenticación en dos pasos (2FA) agrega una segunda verificación además de la contraseña. Actívala primero en el correo electrónico, ya que suele ser la llave para recuperar el resto de tus servicios si llegas a ser víctima.",
          "Prefiere una aplicación de autenticación cuando esté disponible y nunca compartas el código con nadie."
        ],
        links: [M3],
        follow: ["claves", "otp"]
      },
      {
        id: "claves",
        title: "Contraseñas",
        keywords: ["contrasena", "contrasenas", "clave", "claves", "gestor de contrasenas", "password", "frase larga"],
        answer: [
          "Usa una contraseña distinta para cada servicio importante y empieza por el correo y la banca móvil. Si reutilizas la misma, una filtración puede abrir varias cuentas.",
          "Las frases largas que solo tú recuerdes funcionan bien, y un gestor de contraseñas confiable ayuda: protégelo con una clave principal robusta."
        ],
        links: [M3],
        follow: ["dospasos", "privacidad"]
      },
      {
        id: "privacidad",
        title: "Datos personales y privacidad",
        keywords: ["privacidad", "datos personales", "redes sociales", "publicar", "foto de la cedula", "documento de identidad", "proteger mis datos", "mis datos"],
        answer: [
          "Publicar mucho de tu información facilita que los ataques parezcan auténticos. Revisa la privacidad de tus perfiles, limita quién ve tus datos y entrega solo lo necesario.",
          "No envíes fotos de tu documento de identidad por canales informales: pueden servir para suplantarte."
        ],
        links: [M3],
        follow: ["claves", "alertas"]
      },
      {
        id: "alertas",
        title: "Alertas bancarias",
        keywords: ["alertas", "notificaciones", "movimientos", "cobro desconocido", "cargo desconocido", "extracto", "transacciones"],
        answer: [
          "Activa las alertas de compras y transferencias y revisa tus movimientos al menos una vez por semana. Si ves un cobro que no reconoces, contacta a tu banco por su canal oficial y conserva la evidencia.",
          "Reporta de inmediato: no esperes al extracto."
        ],
        links: [M3],
        follow: ["actua"]
      },
      {
        id: "enlaces",
        title: "Enlaces sospechosos",
        keywords: ["enlace", "enlaces", "link", "links", "url", "dominio", "acortado", "hacer clic", "pulsar enlace"],
        answer: [
          "Antes de abrir un enlace, mantén pulsado el del SMS para ver el destino real sin abrirlo. Desconfía de dominios alterados, acortados o con terminaciones atípicas.",
          "Mejor aún: escribe tú mismo el sitio oficial o usa la app oficial."
        ],
        links: [M3],
        follow: ["verifica"]
      },
      {
        id: "empleo",
        title: "Ofertas de empleo falsas",
        keywords: ["empleo", "oferta laboral", "vacante", "trabajo", "reclutador", "oferta de trabajo"],
        answer: [
          "Las falsas ofertas de empleo por chat se aprovechan de la necesidad de conseguir trabajo y suelen pedir tus documentos o datos desde el primer momento.",
          "No envíes fotos de tu documento por canales informales y verifica a la empresa por sus canales oficiales. El simulacro del Módulo 4 trabaja un caso así."
        ],
        links: [M4],
        follow: ["simulaciones", "privacidad"]
      },
      {
        id: "actividades",
        title: "Actividades de los módulos",
        keywords: ["actividad", "actividades", "no puedo avanzar", "no se desbloquea", "como se hace la actividad", "continuar bloqueado", "boton continuar", "boton de continuar"],
        answer: [
          "Cada módulo se estudia en bloques cortos. El botón «Continuar» se habilita cuando terminas de leer el bloque, y la actividad del módulo aparece al final, en una pantalla aparte.",
          "Si no puedes avanzar, lee el bloque completo y espera unos segundos: el tiempo de lectura cuenta. Al completar la actividad se abre el siguiente módulo."
        ],
        links: [M1],
        follow: ["navegacion"]
      },
      {
        id: "simulaciones",
        title: "Simulaciones",
        keywords: ["simulacion", "simulaciones", "simulacro", "escenario", "escenarios", "modulo 4", "caso"],
        answer: [
          "El Módulo 4 tiene tres escenarios ficticios: una oferta de empleo por WhatsApp, un SMS de paquete retenido (smishing) y una llamada de un supuesto asesor bancario (vishing).",
          "Eliges una acción y recibes retroalimentación sobre riesgos y señales de alerta. Puedes repetir un caso: el objetivo es aprender, no acertar a la primera."
        ],
        links: [M4],
        follow: ["evaluacion"]
      },
      {
        id: "evaluacion",
        title: "Evaluación",
        keywords: ["evaluacion", "examen", "quiz", "preguntas", "prueba", "nota minima", "puntaje", "calificacion"],
        answer: [
          "La evaluación tiene cinco preguntas con retroalimentación inmediata. No hay nota mínima: el Kit Digital se desbloquea al completar las cinco preguntas, y puedes repetirla cuando quieras."
        ],
        links: [{ label: "Evaluación", to: "/evaluacion" }],
        follow: ["kit"]
      },
      {
        id: "kit",
        title: "Kit Digital",
        keywords: ["kit", "kit digital", "recursos", "descargar", "guia pva", "infografia", "ruta de emergencia", "tips", "videotutorial", "tutorial"],
        answer: [
          "El Kit Digital reúne cinco recursos para llevar contigo: Guía PVA, Infografía, Ruta de emergencia, Tips y Videotutorial. Se abre al completar la evaluación: puedes verlos dentro de la plataforma y descargarlos."
        ],
        links: [{ label: "Kit Digital", to: "/kit" }],
        follow: ["certificado"]
      },
      {
        id: "certificado",
        title: "Certificado",
        keywords: ["certificado", "diploma", "insignia", "constancia", "reconocimiento", "imprimir"],
        answer: [
          "El certificado es un reconocimiento simbólico de finalización. Se habilita cuando completas la bienvenida, los cuatro módulos, la evaluación y el Kit. Escribes tu nombre y lo descargas o imprimes."
        ],
        links: [{ label: "Certificado", to: "/certificado" }],
        follow: ["encuesta"]
      },
      {
        id: "encuesta",
        title: "Encuesta de percepción",
        keywords: ["encuesta de satisfaccion", "opinar", "calificar el curso", "evaluar el curso", "feedback"],
        answer: [
          "La encuesta de percepción es el último paso, independiente del certificado, para evaluar esta propuesta educativa."
        ],
        links: [{ label: "Encuesta", to: "/encuesta" }]
      },
      {
        id: "navegacion",
        title: "Navegación del curso",
        keywords: ["navegacion", "navegar", "como funciona", "como me muevo", "por donde empiezo", "empezar", "como empiezo", "ruta", "etapas", "bloqueado", "bloqueada", "desbloquear", "panel", "menu"],
        answer: [
          "El curso tiene nueve etapas: bienvenida, cuatro módulos, evaluación, kit, certificado y encuesta. Cada una se abre al completar la anterior. Puedes ver todo el mapa en la ruta del curso.",
          "El panel lateral se puede ocultar con su botón y volver a abrir con «Menú»."
        ],
        links: [{ label: "Ruta del curso", to: "/ruta" }, { label: "Panel del estudiante", to: "/" }],
        follow: ["progreso", "actividades"]
      },
      {
        id: "progreso",
        title: "Progreso y reinicio",
        keywords: ["progreso", "avance", "se pierde", "guardar", "guarda", "reiniciar", "empezar de nuevo", "borrar mi avance"],
        answer: [
          "Tu avance se guarda únicamente en este navegador y dispositivo. Si cambias de equipo o borras los datos del navegador, empezarás de cero.",
          "Puedes reiniciar el recorrido con «Reiniciar recorrido» en el panel lateral; se borrarán avance, respuestas y el nombre del certificado."
        ],
        follow: ["navegacion"]
      },
      {
        id: "privacidad-plataforma",
        title: "Privacidad de la plataforma",
        keywords: ["registro", "cuenta", "costo", "gratis", "cuanto cuesta", "mis preguntas", "recopilan", "espian", "duracion", "cuanto dura", "cuanto tarda"],
        answer: [
          "El curso es libre, gratuito y sin registro; dura unos 12 minutos. No se solicitan datos personales ni credenciales y tu avance se guarda solo en tu navegador.",
          "Yo funciono localmente: lo que me escribes no sale de tu navegador."
        ]
      },
      {
        id: "encuesta-datos",
        title: "Encuesta de diagnóstico",
        keywords: ["85", "20 personas", "cifras", "porcentaje", "resultados de la encuesta", "muestra", "colombia", "estadistica", "por que este curso", "encuesta de diagnostico", "diagnostico", "datos del proyecto", "estadisticas"],
        answer: [
          "En la encuesta de diagnóstico (20 personas, Google Forms): el 85 % recibió mensajes o llamadas sospechosas (55 % de forma ocasional y 30 % frecuente), el 20 % fue víctima directa de una estafa y el 50 % conoce a un familiar o amigo cercano que lo fue. El smishing y el vishing concentran cada uno el 47,6 % de las elecciones de canal.",
          "Ojo: es una muestra de conveniencia de 20 personas. Describe a quienes participaron y no representa estadísticamente a toda Colombia."
        ],
        follow: ["habitos", "origen"]
      },
      {
        id: "habitos",
        title: "Hábitos de seguridad en la encuesta",
        keywords: ["habitos", "que hace la gente", "autopercepcion", "se sienten capacitados", "cuantos usan 2fa", "cuantos verifican", "78", "57", "47 4"],
        answer: [
          "Entre las 20 personas: el 78,9 % cuelga o ignora el contacto sospechoso y verifica por el canal oficial; el 57,9 % usa contraseñas distintas por aplicación y el 47,4 % tiene activada la autenticación en dos pasos. Solo el 5,3 % revisa técnicamente los enlaces.",
          "En autopercepción (escala 1 a 5), el 55 % se siente moderadamente capacitado y el 30 % poco capacitado. Es una muestra pequeña y de conveniencia."
        ],
        links: [M3],
        follow: ["dospasos", "enlaces"]
      },
      {
        id: "origen",
        title: "¿De dónde surge el curso?",
        keywords: ["origen", "nacio", "surgio", "surge", "nacio este curso", "de donde surge", "para que sirve el curso", "objetivo del curso", "quien hizo", "quienes hicieron", "areandina", "proyecto", "problema", "planteamiento", "por que existe", "justificacion", "ods"],
        answer: [
          "El curso nace de un proyecto de Ingeniería de Sistemas de la Fundación Universitaria del Área Andina. Parte de un problema: muchos adultos jóvenes y adultos que usan servicios financieros y plataformas digitales en Colombia desconocen cómo identificar, prevenir y reaccionar ante estafas e ingeniería social.",
          "La propuesta es una experiencia gamificada de microlearning, gratuita y sin registro, con el protocolo PAUSA, VERIFICA y ACTÚA y un Kit digital. Se relaciona con los ODS 4, 8, 9 y 16."
        ],
        follow: ["encuesta-datos", "consecuencias"]
      },
      {
        id: "modalidades",
        title: "Modalidades de estafa",
        keywords: ["modalidades", "tipos de estafa", "tipos de estafas", "que estafas hay", "formas de estafa", "marketplace", "compraventa", "compra y venta", "comprobante falso", "rappi", "bancolombia", "encuesta falsa", "encuestas enganosas"],
        answer: [
          "El documento del proyecto destaca cinco: falsas ofertas de empleo (piden documentos o pagos), estafas en compras y ventas por internet (como en Facebook Marketplace), phishing y mensajes fraudulentos, suplantación de empresas y entidades (por ejemplo Rappi o Bancolombia) e ingeniería social con encuestas engañosas.",
          "En todas se busca que entregues datos, códigos o dinero sin verificar."
        ],
        links: [M2, M4],
        follow: ["empleo", "social"]
      },
      {
        id: "causas",
        title: "Causas del problema",
        keywords: ["causas", "por que caen", "por que la gente cae", "por que funcionan", "por que me pueden enganar", "alfabetizacion digital", "vulnerable", "vulnerabilidad"],
        answer: [
          "Según el proyecto, influyen la brecha de alfabetización digital (no siempre se sabe comprobar dominios o distinguir una comunicación oficial), la urgencia, el miedo a perder una cuenta, la curiosidad y la necesidad de empleo, la publicación excesiva de datos personales, la reutilización de contraseñas y la falta de autenticación en dos pasos.",
          "Además, la inteligencia artificial permite crear mensajes más personalizados y convincentes."
        ],
        links: [M2],
        follow: ["consecuencias", "ia"]
      },
      {
        id: "consecuencias",
        title: "Consecuencias de una estafa",
        keywords: ["consecuencias", "que pasa si me estafan", "efectos", "danos", "perder dinero", "deudas", "estres", "vergüenza", "verguenza", "ansiedad"],
        answer: [
          "Van más allá de perder dinero: pueden perderse ahorros, asumirse deudas ajenas o pagar por productos inexistentes, además del tiempo en bloqueos y reclamaciones.",
          "También hay efectos emocionales y sociales: desconfianza, vergüenza, ansiedad y estrés, y menos confianza en los servicios digitales."
        ],
        links: [M1],
        follow: ["actua", "victima"]
      },
      {
        id: "ia",
        title: "La IA y las estafas",
        keywords: ["ia en estafas", "la ia", "usan la ia", "inteligencia artificial estafas", "estafadores usan", "fraudes con ia", "spear phishing", "spear-phishing", "deepfake", "bots", "llamadas automaticas", "25 millones", "interpol", "mensajes personalizados"],
        answer: [
          "El proyecto señala que la IA permite crear mensajes muy creíbles y adaptados a la víctima (spear-phishing), clonar voces con pocas muestras, automatizar miles de llamadas o mensajes y segmentar víctimas con datos de redes sociales.",
          "Un caso citado ocurrió en 2024: clonaron la voz de un directivo para desviar 25 millones de dólares. Por eso se verifica siempre por un canal oficial independiente."
        ],
        links: [M2],
        follow: ["voz", "verifica"]
      },
      {
        id: "actualizaciones",
        title: "Actualizaciones",
        keywords: ["actualizar", "actualizacion", "actualizaciones", "parche", "parches", "sistema operativo", "antivirus", "desactualizado"],
        answer: [
          "Mantén actualizados el sistema operativo, el navegador y las aplicaciones: las actualizaciones instalan parches de seguridad y reducen la superficie de ataque.",
          "Es una de las prácticas de prevención del curso, junto con las claves únicas, la autenticación en dos pasos y las alertas bancarias."
        ],
        links: [M3],
        follow: ["claves", "dospasos"]
      },
      {
        id: "spoofing",
        title: "Identificador falsificado (spoofing)",
        keywords: ["spoofing", "identificador de llamada", "numero falsificado", "numero clonado", "remitente falso", "numero del banco", "aparece el nombre del banco"],
        answer: [
          "El identificador de llamada o el remitente de un SMS puede ser falsificado (spoofing): que aparezca el nombre o el número de tu banco no prueba que sea real.",
          "Por eso se verifica por un canal que tú elijas: la app oficial o el número que aparece al respaldo de tu tarjeta."
        ],
        links: [M2],
        follow: ["verifica", "vishing"]
      },
      {
        id: "gracias",
        title: "Agradecimiento",
        keywords: ["gracias", "muchas gracias", "ok gracias", "listo gracias", "perfecto", "genial", "chao", "adios", "hasta luego"],
        answer: ["¡Con gusto! Si te surge otra duda, aquí estoy. Recuerda: PAUSA, VERIFICA y ACTÚA."],
        follow: []
      }
    ],

    /* Expresiones coloquiales y sinónimos que se relacionan con uno o varios temas.
       Permiten entender preguntas que no coinciden literalmente con una palabra clave. */
    synonyms: [
      { w: 6, topics: ["claves", "dospasos"], triggers: ["nadie entre a mi cuenta", "que no entren a mi cuenta", "entren a mi cuenta", "entre a mi cuenta", "entre en mi cuenta", "entrar a mi cuenta", "hackeen", "hackear", "hackeo", "me hackearon", "roben mi cuenta", "robar mi cuenta", "proteger mi cuenta", "proteger mis cuentas", "cuenta segura", "asegurar mi cuenta", "acceso no autorizado", "que nadie use mi cuenta", "que no me roben la cuenta"] },
      { w: 5, topics: ["senales", "smishing"], triggers: ["mensaje raro", "mensaje extrano", "mensaje sospechoso", "texto raro", "me llego un mensaje", "me llego un sms", "me mandaron un mensaje", "me escribieron", "me enviaron un mensaje"] },
      { w: 5, topics: ["vishing", "senales"], triggers: ["me llamaron", "llamada rara", "llamada sospechosa", "numero desconocido", "llamada del banco", "dicen que son del banco", "dicen ser del banco", "supuesto banco", "me llamo alguien"] },
      { w: 5, topics: ["senales", "verifica"], triggers: ["es real", "es falso", "es verdad", "es fraude", "es seguro", "es legitimo", "sera estafa", "como se si es real", "como saber si es real", "como se que es verdad", "es confiable", "puedo confiar"] },
      { w: 5, topics: ["otp"], triggers: ["me pidieron un codigo", "me piden un codigo", "piden el codigo", "codigo que llega al celular", "codigo que llega", "clave dinamica", "token", "codigo de seguridad", "codigos que llegan", "codigo que llegan", "codigos por sms", "codigo por sms", "codigos de verificacion"] },
      { w: 5, topics: ["victima", "enlaces"], triggers: ["di clic", "di click", "hice clic", "abri el enlace", "abri un link", "toque el enlace", "entre al link", "pinche el enlace", "abri el mensaje"] },
      { w: 6, topics: ["victima", "alertas"], triggers: ["me quitaron plata", "me sacaron plata", "me robaron plata", "me sacaron dinero", "me quitaron dinero", "falta plata", "desaparecio dinero", "cobro que no hice", "me cobraron", "me robaron dinero", "movimiento que no reconozco"] },
      { w: 5, topics: ["actua"], triggers: ["donde denuncio", "como denuncio", "a quien reporto", "donde reporto", "quien me ayuda", "fiscalia", "denuncia"] },
      { w: 4, topics: ["privacidad"], triggers: ["facebook", "instagram", "tiktok", "whatsapp", "mis redes", "perfil publico", "que publico", "mi foto", "mi cedula"] },
      { w: 5, topics: ["empleo"], triggers: ["me ofrecen trabajo", "oferta de trabajo", "buscar trabajo", "busco empleo", "buscando empleo", "piden mi cedula", "piden documentos", "piden dinero para trabajar", "trabajo desde casa"] },
      { w: 5, topics: ["navegacion", "actividades"], triggers: ["como funciona esta pagina", "como uso esto", "no entiendo la plataforma", "que sigue", "siguiente paso", "que hago ahora", "no me deja entrar", "modulo bloqueado", "no puedo entrar al modulo", "como avanzo", "no avanza"] },
      { w: 5, topics: ["claves"], triggers: ["mi clave es facil", "clave debil", "olvide mi clave", "misma clave", "misma contrasena", "guardar claves", "guardar contrasenas", "administrador de claves", "que clave uso", "crear una clave"] },
      { w: 5, topics: ["progreso"], triggers: ["reinicio", "reiniciar", "reinicia", "empezar de cero", "borrar todo", "volver a empezar", "borrar mi progreso"] },
      { w: 5, topics: ["hola"], triggers: ["que haces", "que sabes hacer", "en que me ayudas", "para que sirves", "que puedes hacer", "que haces tu"] },
      { w: 5, topics: ["dospasos"], triggers: ["doble verificacion", "verificacion doble", "segundo paso", "segundo factor", "codigo extra", "google authenticator", "authenticator", "autenticador"] },
      { w: 4, topics: ["modalidades", "senales"], triggers: ["compre algo", "vendedor", "comprador", "mercado libre", "pagina falsa", "tienda falsa", "comprar por internet", "venta por internet", "pago por adelantado"] },
      { w: 4, topics: ["actualizaciones"], triggers: ["celular viejo", "actualizar el celular", "sistema desactualizado", "app desactualizada"] },
      { w: 4, topics: ["social", "pva"], triggers: ["me presionan", "me apuran", "me dicen que es urgente", "me asustaron", "me amenazan", "me amenazaron"] }
    ]
  };
})(window);

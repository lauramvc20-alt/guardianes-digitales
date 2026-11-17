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
          "La autenticación en dos pasos (2FA) agrega una segunda verificación además de la contraseña. Actívala primero en tu correo y en tus cuentas bancarias: el correo suele ser la llave para recuperar el resto de tus servicios.",
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
        keywords: ["kit", "kit digital", "recursos", "descargar", "guia pva", "infografia", "ruta de emergencia", "tutorial"],
        answer: [
          "El Kit Digital reúne cinco recursos para llevar contigo: Guía PVA, Infografía, Ruta de emergencia, Recomendaciones y Tutorial. Se abre al completar la evaluación y los enlaces llevan a las carpetas oficiales del proyecto."
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
        title: "Encuesta de satisfacción",
        keywords: ["encuesta de satisfaccion", "opinar", "calificar el curso", "evaluar el curso", "feedback"],
        answer: [
          "La encuesta de satisfacción es el último paso, independiente del certificado, para evaluar esta propuesta educativa."
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
          "El curso es libre, gratuito y sin registro; dura entre 10 y 15 minutos. No se solicitan datos personales ni credenciales y tu avance se guarda solo en tu navegador.",
          "Yo funciono localmente: lo que me escribes no sale de tu navegador."
        ]
      },
      {
        id: "encuesta-datos",
        title: "Encuesta de diagnóstico",
        keywords: ["85", "20 personas", "cifras", "porcentaje", "resultados de la encuesta", "muestra", "colombia", "estadistica", "por que este curso"],
        answer: [
          "En la encuesta de diagnóstico del proyecto, el 85 % de las 20 personas consultadas recibió mensajes o llamadas sospechosas, el 20 % dijo haber sido víctima directa de una estafa y el 47,6 % identificó el smishing, y también el vishing, como canales frecuentes.",
          "Ojo: es una muestra de conveniencia de 20 personas. Describe a quienes participaron y no representa a toda Colombia."
        ],
        follow: ["pva"]
      },
      {
        id: "gracias",
        title: "Agradecimiento",
        keywords: ["gracias", "muchas gracias", "ok gracias", "listo gracias", "perfecto", "genial", "chao", "adios", "hasta luego"],
        answer: ["¡Con gusto! Si te surge otra duda, aquí estoy. Recuerda: PAUSA, VERIFICA y ACTÚA."],
        follow: []
      }
    ]
  };
})(window);

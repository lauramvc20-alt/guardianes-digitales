Quiero replantear integralmente la identidad visual y la experiencia de usuario de PVA Guardián Digital. No estoy satisfecho con la interfaz actual.

1. Dirección visual

Quiero una plataforma educativa con apariencia de producto tecnológico profesional: moderna, limpia, dinámica y visualmente coherente.

- Mejora la jerarquía visual, tipografía, colores y distribución.
- Elimina espacios vacíos innecesarios.
- Evita las tarjetas repetitivas y las estructuras genéricas.
- Sustituye los emojis por iconos SVG de Lucide.
- Mantén coherencia entre modo claro y oscuro.
- Utiliza animaciones discretas y funcionales.

2. Navegación y aprendizaje progresivo

Este es uno de los aspectos más importantes del rediseño.

No quiero que la plataforma tenga una estructura lineal, con todos los contenidos, actividades y simulaciones apilados verticalmente.

Quiero una experiencia de navegación progresiva, visual e interactiva.

Ruta de aprendizaje:

- Evita la lista vertical de módulos.
- Diseña una distribución que aproveche el ancho de la pantalla.
- Presenta los módulos de forma visual, organizada y dinámica.
- Utiliza una disposición no lineal que permita visualizar el recorrido sin demasiado scroll.

Explicaciones y actividades prácticas:

- Implementa navegación por pasos o bloques independientes.
- Cada explicación debe mostrarse de manera individual.
- El estudiante debe completar la lectura de cada bloque para habilitar el botón «Continuar».
- No muestres las actividades debajo de las explicaciones.
- No permitas que el estudiante llegue a las preguntas simplemente desplazándose hacia abajo.
- Al terminar la lectura, habilita el acceso a la actividad correspondiente.
- La actividad debe presentarse en una interfaz independiente, no como otro bloque apilado.
- Mantén visible el progreso del estudiante.

Simulaciones:

- Evita las listas verticales tradicionales.
- Utiliza carruseles, navegación lateral o paneles interactivos.
- Muestra una simulación a la vez.
- Permite avanzar a la siguiente después de completar la anterior.
- Adapta visualmente cada simulación al escenario que representa.

No quiero que simplemente cambies una lista vertical por otra lista con tarjetas. Quiero un cambio real en la experiencia de navegación y en la composición visual.

3. Criterios de diseño

- Aprovecha el espacio horizontal y vertical.
- Evita scroll innecesario.
- No superpongas componentes.
- Mantén una experiencia responsive.
- Conserva las funcionalidades y la lógica educativa.
- Prioriza claridad, accesibilidad y facilidad de uso.
- Evita diseños excesivamente recargados.

4. Metodología

Primero analiza toda la plataforma y detecta por qué las actividades prácticas y la ruta de aprendizaje siguen presentándose de forma lineal.

Presenta una propuesta de rediseño que explique cómo cambiarás la estructura de navegación, no solamente su apariencia.

Identifica los componentes y archivos que necesitan modificarse.

No escribas ni modifiques código todavía. Espera mi aprobación.

Quiero una transformación real de PVA Guardián Digital, tanto en su identidad visual como en su experiencia de aprendizaje.
---

# Ronda 2 · Inicio, identidad visual, contexto y asistente (implementada)

Estado: implementada en la rama de desarrollo.

1. Panel lateral desplegable y ocultable (botón en el panel + botón «Menú» al ocultarlo; estado en `localStorage`).
2. Nuevo logo «Guardián» (hexágono vigía con ojo y pupila de pausa) en barra lateral, portada, favicon, insignia y certificado.
3. Portada simplificada: se retiran los cuatro indicadores (4 módulos, 5 preguntas, 9 etapas, $0).
4. Sección independiente de contexto «El problema está más cerca de lo que parece» (A. realidad cotidiana, B. encuesta con aclaración metodológica, C. por qué prevenir), fundamentada en `Taller_Wiki_Eje3.docx-1.md`.
5. RO-BIT como chatbot local y gratuito (respuestas programadas; sin IA generativa, sin API, sin datos personales).

---

# Ronda 3 · Nuevos ajustes (implementada)

Estado: implementada. Detalle: botón «Menú» dentro de la cabecera (sin superposición); RO-BIT solo como chat con interpretación local de intenciones (sinónimos, raíces, coincidencia aproximada, preguntas relacionadas); módulos a todo el ancho con bibliografía independiente; actividad «Arma tu defensa» (clasificación) en Protección de datos; simulaciones con pasos Examinar → Decidir → Resultado, consecuencias por decisión y puntuación.

## 1. Botón del menú sin superposición
- El botón de reapertura debe tener ubicación propia, sin cubrir el encabezado de la página.
- El encabezado se adapta cuando el panel está abierto o cerrado.
- El contenido aprovecha el ancho liberado; transición fluida; correcto en distintos tamaños de pantalla.

## 2. RO-BIT solo como acompañante conversacional
- Quitar todas las tarjetas y burbujas laterales de RO-BIT (módulos, kit, certificado, encuesta, panel) y el robot decorativo del encabezado de los módulos.
- RO-BIT: consultar conceptos del curso, resolver dudas de módulos, explicar términos de seguridad digital, orientar cuando algo no se entiende, ofrecer preguntas sugeridas.
- Mejorar la comprensión de preguntas libres con un sistema local de palabras clave e intenciones: normalización (mayúsculas, tildes, puntuación), sinónimos y expresiones relacionadas, coincidencia aproximada, preguntas relacionadas cuando no hay coincidencia clara y respuesta de orientación sin inventar información.
- Ejemplo de referencia: «¿cómo hago para que nadie entre a mi cuenta?» debe llevar a contraseñas y autenticación en dos pasos.
- Sin API de pago ni servicios externos; no presentarlo como IA generativa; respuestas basadas en el contenido del curso.

## 6. Eliminar los espacios laterales de RO-BIT y reorganizar el módulo y la bibliografía
- Retirar los mensajes de RO-BIT bajo «Tu actividad», las tarjetas de consejos y los espacios reservados; no ocultarlos dejando huecos.
- Reorganizar la composición: contenido principal con anchura suficiente, actividad con espacio adecuado, bibliografía en sección independiente y ordenada, sin acumular elementos en una columna lateral.

## 7. Nueva actividad práctica de «Protección de datos»
- Reemplazar por completo «Elige al menos tres compromisos».
- Actividad interactiva de conocimientos (asociar, clasificar u organizar), distinta del simulacro del módulo 4: sin escenarios de mensajes, llamadas ni correos, sin casillas de compromiso.
- Temas: contraseñas diferentes y seguras, autenticación en dos pasos, privacidad en redes, alertas bancarias, actualizaciones, reporte de contactos sospechosos.
- Con objetivo, dinámica, retroalimentación educativa, conclusión y puntuación o progreso si aporta valor.

## 8. Lógica y funcionalidad de las simulaciones del módulo 4
- Revisar todas las preguntas y decisiones; eliminar o sustituir las decorativas (p. ej. «Pausa: ¿qué revisarías primero?», que hoy solo alterna un botón sin efecto).
- Las decisiones deben tener consecuencias: modificar la retroalimentación, mostrar información relacionada o afectar el resultado, con explicación de por qué es adecuada o inadecuada y coherencia con el resultado final.
- Conservar las simulaciones de smishing y vishing.

## 9. Revisión general de diseño y experiencia de usuario
Identidad coherente; aprovechamiento del ancho; jerarquía tipográfica; espaciados consistentes; responsive; modo claro y oscuro; transiciones discretas; iconos Lucide; sin tarjetas innecesarias, columnas estrechas ni huecos por elementos eliminados.

## 10. Condiciones técnicas
No eliminar actividades, evaluaciones, puntuaciones ni progreso; no alterar el desbloqueo de etapas; sin dependencias de pago; sin duplicar código; respetar la arquitectura; controles con comportamiento real; no tocar lo no relacionado.

---

# Ronda 4 · Ajustes visuales y funcionales (pendiente de aprobación)

Skills de diseño solicitadas: Figma Design, Emil Kowalski e Impeccable (aplicar sus criterios, no solo mencionarlas).

1. **Bibliografía:** referencias apiladas verticalmente, una por fila, con iconos mucho más pequeños y sin aspecto de tarjetas grandes.
2. **Módulo 2 · legibilidad en modo claro:** revisar contraste de texto principal, instrucciones, SMS, remitente, fragmentos interactivos, señales, retroalimentaciones, progreso y botones, con jerarquía visual propia (no solo oscurecer).
   - 2.1. Las explicaciones de las señales no se acumulan hacia abajo: un panel de retroalimentación que cambia según la señal seleccionada. Sin resaltar de antemano ninguna parte del mensaje. Conservar lógica de evaluación y progreso.
3. **Distribución con el menú oculto:** la composición de cada página se adapta a ambos estados (anchuras máximas, columnas y márgenes), sin vacíos laterales ni líneas de texto excesivamente largas, con transición fluida.
4. **Simulacro del módulo 4:**
   - 4.1. No revelar señales antes de la interacción (ni subrayadas ni resaltadas).
   - 4.2. Mecánica distinta según el caso (no repetir «seleccionar palabras»).
   - 4.3. Una pregunta o decisión a la vez, retroalimentación en un espacio definido, sin acumulación vertical.
   - 4.4. Cada decisión con consecuencia pedagógica real.
   - 4.5. Progresión clara: caso actual, qué hacer, qué se completó, qué falta y cuándo avanzar.
5. **Dirección visual:** identidad propia, evitar tarjetas genéricas, iconos grandes, columnas estrechas y vacíos; animaciones discretas y útiles; coherencia entre modo claro y oscuro.
6. **Condiciones técnicas:** reutilizar componentes, no duplicar código, conservar contenidos, referencias, progreso y evaluación; sin dependencias de pago.

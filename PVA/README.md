# PAUSA, VERIFICA Y ACTÚA · Sé un guardián digital

Plataforma educativa web estática, gratuita y sin cuentas de usuario. Simula un
campus virtual con panel de avance, cuatro módulos interactivos, una evaluación de
cinco preguntas, un Kit Digital descargable, un certificado simbólico y una
encuesta final.

Proyecto académico de la **Fundación Universitaria del Área Andina**, programa
**Ingeniería de Sistemas**, **Cátedra Pablo Oliveros** (2026).

- **Autores:** Brayan Andrés Vega Fernández, Laura Melissa Varela Cabezas,
  José Eduardo Zapata Echeverría y Osnaider Vivas.
- **Docente:** Jhoana Alexandra Reina.
- **Fuente de contenido:** documento académico `Taller_Wiki_Eje3.docx.pdf`.

---

## 1. Cómo ejecutarlo

No hay dependencias, compilación ni instalación. Todo funciona con HTML, CSS y
JavaScript clásico (sin módulos ES, sin `fetch`, sin backend).

### Opción A · Abrir el archivo directamente

Abre `index.html` con doble clic en Chrome, Edge o Firefox.

> El avance se guarda en `localStorage`. En algunos navegadores la política de
> `file://` puede bloquear el almacenamiento local; en ese caso la plataforma
> funciona igual, pero el progreso no se conserva al recargar. Usa la opción B si
> necesitas persistencia garantizada.

### Opción B · Servidor estático local

Con PowerShell (incluido en Windows), desde la carpeta del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File .\servir.ps1
```

Luego abre <http://localhost:8137/>. Para usar otro puerto:
`powershell -ExecutionPolicy Bypass -File .\servir.ps1 -Port 8080`.

También sirve cualquier servidor estático (IIS, Live Server, Nginx, etc.).

---

## 2. Estructura del proyecto

```text
PVA/
├─ index.html                 Shell: rail de navegación, topbar, avisos, modales
├─ servir.ps1                 Servidor estático opcional para desarrollo
├─ README.md
└─ assets/
   ├─ css/
   │  ├─ base.css             Tokens de color, tipografía, botones y utilidades
   │  ├─ shell.css            Estructura, rail, topbar, toasts, modales, responsive
   │  └─ views.css            Estilos de cada vista, actividades y certificado
   └─ js/
      ├─ core/
      │  ├─ utils.js          Escape HTML, iconos SVG, fechas, helpers de DOM
      │  ├─ audio.js          Sonidos sintetizados opcionales (sin archivos)
      │  ├─ store.js          Etapas, requisitos, desbloqueos y persistencia
      │  ├─ ui.js             Toasts, confirmaciones, barras y badges
      │  └─ router.js         Rutas hash con guardas de desbloqueo
      ├─ content/
      │  ├─ course.js         Bienvenida, módulos 1–3 y metadatos del curso
      │  ├─ simulations.js    Tres escenarios del módulo 4
      │  ├─ quiz.js           Exactamente 5 preguntas de evaluación
      │  └─ kit.js            5 recursos del Kit y datos de la encuesta
      ├─ components/
      │  ├─ robot.js          RO-BIT con 6 poses SVG
      │  └─ activities.js     Renderizado y validación de actividades
      ├─ views/
      │  ├─ dashboard.js      Panel del estudiante
      │  ├─ welcome.js        Bienvenida
      │  ├─ roadmap.js        Ruta completa con estados
      │  ├─ module.js         Vista de módulo + actividad + desbloqueo
      │  ├─ assessment.js     Evaluación con retroalimentación y revisión
      │  ├─ kit.js            Kit Digital y seguimiento de apertura
      │  ├─ completion.js     Finalización y certificado imprimible
      │  └─ survey.js         Encuesta final
      └─ app.js               Arranque: navegación, sonido, reinicio, menú móvil
```

### Separación de responsabilidades

- **Contenido** (`content/`): textos, preguntas, escenarios y enlaces. No conoce el DOM.
- **Estado y reglas** (`core/store.js`): única fuente de verdad sobre avance y desbloqueos.
- **Navegación** (`core/router.js`): valida la etapa antes de renderizar cualquier vista.
- **Interfaz** (`core/ui.js`, `components/`): piezas reutilizables.
- **Vistas** (`views/`): composición de cada pantalla y eventos propios.

---

## 3. Recorrido y reglas de desbloqueo

El curso tiene **9 etapas** en orden lineal. Cada una pesa lo mismo en el porcentaje
(11,1 %; el indicador se redondea).

| # | Etapa | Ruta | Requisito para abrir |
|---|-------|------|----------------------|
| 1 | Bienvenida | `#/bienvenida` | Disponible desde el inicio |
| 2 | Módulo 1 · Protocolo PVA | `#/modulo/1` | Disponible desde el inicio |
| 3 | Módulo 2 · Phishing y vishing | `#/modulo/2` | Módulo 1 completado |
| 4 | Módulo 3 · Protección de datos | `#/modulo/3` | Módulo 2 completado |
| 5 | Módulo 4 · Simulaciones | `#/modulo/4` | Módulo 3 completado |
| 6 | Evaluación | `#/evaluacion` | Módulo 4 completado |
| 7 | Kit Digital | `#/kit` | Evaluación completada |
| 8 | Certificado | `#/certificado` | Bienvenida + M1–M4 + Evaluación + Kit |
| 9 | Encuesta | `#/encuesta` | Certificado generado |

Las guardas se aplican en cuatro capas, no solo visualmente:

1. El rail y la ruta deshabilitan las etapas bloqueadas.
2. El router redirige al panel e informa el motivo ante un enlace profundo bloqueado.
3. `store.markDone()` rechaza completar una etapa si faltan requisitos.
4. Las vistas de Kit, Certificado y Encuesta vuelven a comprobar los requisitos al renderizar.

### Qué completa cada etapa

| Etapa | Criterio real de finalización |
|-------|-------------------------------|
| Bienvenida | Pulsar «Comenzar por el Módulo 1» |
| Módulo 1 | Acertar las 3 comprobaciones del protocolo PVA |
| Módulo 2 | Detectar las 6 señales del SMS fraudulento |
| Módulo 3 | Seleccionar al menos 3 compromisos de protección |
| Módulo 4 | Responder los 3 escenarios (sin importar el veredicto) |
| Evaluación | Responder y comprobar las 5 preguntas |
| Kit Digital | Pulsar «Kit revisado, continuar» |
| Certificado | Pulsar «VER CERTIFICADO» |
| Encuesta | Pulsar «COMPLETAR ENCUESTA» |

No existen botones “de mentira”: cada interacción registrada cambia el estado
persistido y, cuando corresponde, desbloquea la siguiente etapa.

### Decisiones de diseño (no están en el PDF)

- **Estructura de 9 etapas** y desbloqueo lineal: decisión de experiencia, no del documento.
- **Actividades interactivas** de cada módulo: elaboradas por el equipo a partir del contenido.
- **Evaluación de 5 preguntas:** el PDF no trae un cuestionario previo; las preguntas
  y sus retroalimentaciones se redactaron desde los conceptos del documento.
- **Sin nota mínima:** la evaluación se completa al responder las cinco preguntas.
  El objetivo es formativo; el Kit se desbloquea con cualquier puntaje.
- **Kit:** se marca revisado al pulsar el botón de continuar, sin obligar a abrir los 5 recursos.
- **Encuesta:** se marca completada al abrir el enlace externo. Es independiente del puntaje.
- **Certificado:** reconocimiento simbólico, no una acreditación académica oficial.

---

## 4. Evaluación

Cinco preguntas, una por eje:

1. Protocolo PVA.
2. Phishing.
3. Vishing.
4. Protección de cuentas y datos.
5. Ofertas de empleo sospechosas.

Cada pregunta tiene cuatro opciones, validación inmediata, explicación y revisión
final pregunta por pregunta. La posición correcta varía entre opciones. El intento
se guarda y puede repetirse; el puntaje se muestra como «X de 5 correctas».

> No hay calificación mínima para continuar. Esta decisión está documentada arriba
> para no confundirla con una regla del documento académico.

---

## 5. Kit Digital

Los cinco enlaces son los definidos por el proyecto y no se generan direcciones
alternativas:

| Recurso | Enlace |
|---------|--------|
| Guía PVA | <https://drive.google.com/drive/folders/1auwRH2jWUAvJfmi-Dj7t2llkqyS4D1JB?usp=sharing> |
| Infografía | <https://drive.google.com/drive/folders/1Y0H55qVHzQF54IAoJ8_aWVrWhGgQT44R?usp=drive_link> |
| Ruta de emergencia | <https://drive.google.com/drive/folders/1H5rwjqXke1v2U0RQLbcZjVcXO2sQrawp?usp=drive_link> |
| Recomendaciones | <https://drive.google.com/drive/folders/12uMG-vlo0c2nvoEGR6buyry8s-7_UbI2?usp=drive_link> |
| Tutorial | <https://drive.google.com/drive/folders/1pPNm8w8X2cNsgAGGd7lWhCmtLL8jrB-6?usp=drive_link> |

La plataforma no descarga ni copia archivos: solo enlaza a las carpetas oficiales
en Google Drive, que se abren en una pestaña nueva.

## 6. Encuesta final

- Enlace exacto: <https://forms.gle/JM6KNtX9RvKmXwUu9>
- Texto: «Tu opinión es importante. Ayúdanos a evaluar esta propuesta educativa y
  a identificar oportunidades de mejora».
- Botón: «COMPLETAR ENCUESTA».
- Se abre en Google Forms, en una pestaña nueva. Es anónima desde esta plataforma y
  no modifica el resultado de la evaluación ni el certificado.

## 7. Certificado

- Incluye nombre del proyecto, nombre del curso, espacio para el nombre del
  participante, fecha de finalización y el resultado de la evaluación.
- El nombre es opcional y se guarda solo en `localStorage`. Si se deja vacío, el
  certificado conserva un espacio para escribirlo a mano.
- Se genera únicamente al pulsar **VER CERTIFICADO**. El botón de impresión usa el
  diálogo del navegador (A4 horizontal, sin rail, topbar ni botones).
- Es un **reconocimiento simbólico de finalización**. No es una acreditación
  académica formal o legal ni reemplaza certificaciones oficiales.

---

## 8. Persistencia, privacidad y reinicio

- Clave de almacenamiento: `pva.guardian.v1` en `localStorage`.
- Guarda: etapas completadas, respuestas de actividades, borrador y resultado de la
  evaluación, nombre del certificado y preferencia de sonido.
- **No hay cuentas, login, servidor ni envío de datos.** Todo queda en el navegador
  y dispositivo actual; **no se sincroniza entre equipos**.
- Borrar los datos del navegador o usar modo incógnito elimina el avance.
- «Reiniciar recorrido» pide confirmación y borra avance, respuestas y nombre. Los
  recursos externos del Kit no se modifican.

---

## 9. Diseño, accesibilidad y responsive

- Identidad nocturna: azules profundos y petróleo con acentos violeta, lavanda,
  turquesa, coral y amarillo. Superficies y encabezados varían de tono por módulo.
- Tipografía de sistema, esquinas redondeadas, microinteracciones y robot guía
  RO-BIT en seis poses con función pedagógica (bienvenida, explicación, advertencia,
  reflexión, retroalimentación y celebración).
- **Sonido opcional y silenciado por defecto**, con botón visible y `aria-pressed`.
  Los sonidos se sintetizan con Web Audio; no hay archivos de audio.
- Respeta `prefers-reduced-motion`: desactiva animaciones y desplazamientos suaves.
- Navegación por teclado, foco visible, enlace «Saltar al contenido principal»,
  etiquetas accesibles en etapas bloqueadas y `aria-live` para avisos.
- Responsive verificado en anchos de 360, 390, 768, 1024 y 1440 px: sin desbordamiento
  horizontal; en móvil el rail se convierte en menú deslizante con fondo y cierre
  por `Escape`.
- Auditoría Lighthouse local: Accesibilidad 100, Buenas prácticas 100, SEO 100.

---

## 10. Origen del contenido y cifras

Los textos pedagógicos, conceptos, ejemplos y cifras provienen del documento
académico del proyecto. Entre los datos citados en la plataforma están:

- Encuesta de diagnóstico aplicada a **20 personas**: 85 % recibió mensajes o
  llamadas sospechosas (55 % de forma ocasional y 30 % frecuente).
- 47,6 % identificó el smishing y 47,6 % el vishing como canales frecuentes.
- 20 % fue víctima directa; 50 % conoce a alguien cercano afectado.
- 78,9 % cuelga o ignora y verifica; 57,9 % usa contraseñas únicas; 47,4 % usa 2FA;
  5,3 % verifica URLs; 55 % autoevalúa su nivel en 3 de 5.

> **Advertencia metodológica:** la muestra es pequeña y de conveniencia. Los
> porcentajes describen a las 20 personas consultadas y no representan
> estadísticamente a toda la población colombiana.

Todo lo que no estaba en el documento (cuestionario, actividades, estructura de
etapas, criterios de finalización, certificado simbólico) se identifica como
decisión de diseño en la sección 3.

---

## 11. Lista de verificación manual

Puedes repetir estas pruebas desde una ventana privada o tras «Reiniciar recorrido»:

**Desbloqueo inicial**
- [ ] Un visitante nuevo ve 0 % y solo puede entrar a Bienvenida y Módulo 1.
- [ ] Módulos 2, 3 y 4 aparecen bloqueados con su motivo.
- [ ] Evaluación, Kit, Certificado y Encuesta aparecen bloqueados.

**Sin saltos por URL**
- [ ] Abrir `#/modulo/2`, `#/modulo/3`, `#/modulo/4`, `#/evaluacion`, `#/kit`,
      `#/certificado` o `#/encuesta` al inicio redirige al panel con un aviso.

**Cadena completa**
- [ ] Completar Bienvenida habilita el Módulo 1 (ya disponible) y el avance sube.
- [ ] Módulo 1 requiere acertar las 3 comprobaciones.
- [ ] Módulo 2 requiere encontrar las 6 señales.
- [ ] Módulo 3 requiere 3 compromisos.
- [ ] Módulo 4 requiere responder los 3 escenarios.
- [ ] La evaluación no se abre antes de completar el Módulo 4.
- [ ] El Kit no se abre antes de completar la evaluación.
- [ ] El certificado exige toda la ruta, evaluación y Kit.
- [ ] La encuesta solo se abre después de generar el certificado.

**Persistencia y reinicio**
- [ ] Recargar a mitad del curso conserva porcentaje, etapa actual y respuestas.
- [ ] Recargar con una etapa bloqueada en la URL sigue bloqueando el acceso.
- [ ] «Reiniciar recorrido» pide confirmación; cancelar conserva el avance.
- [ ] Confirmar el reinicio deja 0 % y vuelve al panel.

**Evaluación y encuesta**
- [ ] Hay exactamente 5 preguntas y cada una valida y explica.
- [ ] Se puede repetir la evaluación; se conserva el resultado del último intento y el contador de intentos.
- [ ] Completar con 0–5 correctas desbloquea el Kit (no hay nota mínima).
- [ ] La encuesta usa el enlace y el texto exactos, y no altera el puntaje.

**Kit y certificado**
- [ ] Los 5 enlaces del Kit coinciden exactamente con la tabla de la sección 5.
- [ ] El certificado está oculto hasta pulsar «VER CERTIFICADO».
- [ ] El nombre escrito se refleja y persiste; en blanco deja espacio para escribir.
- [ ] Imprimir/Guardar PDF oculta navegación y botones y conserva el certificado.

**Dispositivos y accesibilidad**
- [ ] En móvil el menú abre y cierra; el fondo bloquea el scroll; `Escape` cierra.
- [ ] No hay scroll horizontal en 360–1440 px.
- [ ] Se puede recorrer todo con teclado y el foco es visible.
- [ ] Con «reducir movimiento» activo no hay animaciones molestas.
- [ ] El sonido está apagado por defecto y el botón lo activa o silencia.

---

## 12. Limitaciones conocidas

- El avance es local: no hay sincronización entre dispositivos ni recuperación de
  progreso si se borran los datos del navegador.
- La encuesta se marca como completada al abrir el enlace; Google Forms no devuelve
  confirmación de envío a la plataforma.
- La disponibilidad del Kit depende de los permisos de las carpetas de Google Drive.
- El certificado es simbólico y no tiene validez oficial.
- La plataforma es formativa: no analiza correos, SMS ni llamadas reales.
- Las cifras provienen de una muestra de 20 personas y no son generalizables.

---

## 13. Créditos

**PAUSA, VERIFICA Y ACTÚA: Sé un guardián digital** · 2026  
Fundación Universitaria del Área Andina · Ingeniería de Sistemas · Cátedra Pablo Oliveros  
Autores: Brayan Andrés Vega Fernández, Laura Melissa Varela Cabezas, José Eduardo
Zapata Echeverría y Osnaider Vivas · Docente: Jhoana Alexandra Reina.

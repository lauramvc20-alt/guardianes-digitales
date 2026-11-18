1. xperiencia en dispositivos móviles: desplazamiento de la página

Existe un problema en la versión móvil: al deslizar hacia arriba o hacia abajo, la página completa se desplaza y el contenido termina moviéndose hacia abajo, generando una experiencia de navegación incómoda.

Analiza cómo está implementado el desplazamiento y corrige el comportamiento.

Requisitos:

- Evita que el contenedor principal se desplace de forma inesperada.
- Define correctamente qué elementos deben tener desplazamiento propio y cuáles deben permanecer fijos.
- Mantén visibles y accesibles los controles de navegación.
- Evita que el contenido se desplace fuera del área prevista.
- Conserva el desplazamiento natural cuando sea necesario leer contenido que realmente exceda el espacio disponible.
- Comprueba el comportamiento en diferentes tamaños de pantalla móvil.

No apliques "overflow: hidden" indiscriminadamente ni bloquees el desplazamiento táctil. La solución debe corregir la causa del problema sin impedir que el participante navegue con normalidad.

2. Sonido: activado de forma predeterminada

Quiero que el sonido de la plataforma inicie activado por defecto.

Requisitos:

- El estado inicial del sonido debe ser activo.
- El participante podrá desactivarlo cuando lo desee mediante el control de sonido existente.
- Si lo desactiva, todos los sonidos de la plataforma deben respetar esa elección.
- Mantén sincronizado el estado visual del botón con el estado real del sonido.
- Evita que algunas secciones reproduzcan sonidos aunque el participante haya desactivado la opción.
- Si existe una preferencia guardada, revisa su lógica para que no contradiga el nuevo comportamiento inicial.

Importante: los navegadores móviles pueden bloquear la reproducción automática de audio antes de que exista una interacción del usuario. Implementa el sonido activo como estado predeterminado, pero inicia la reproducción efectiva cuando el navegador lo permita, sin intentar eludir sus restricciones. No reproduzcas audio de manera inesperada ni generes sonidos continuos.

3. Rediseño de la paleta de colores en modo claro

No me convence la combinación de colores actual del modo claro. Quiero una paleta mejorada, más armónica, moderna y profesional.

Analiza los colores actuales y plantea una nueva combinación que mantenga la identidad de Guardián Digital, pero que mejore notablemente la experiencia visual.

Criterios:

- Utiliza fondos claros y suaves, evitando el blanco excesivamente brillante.
- Elige colores principales y secundarios que combinen entre sí.
- Mantén una jerarquía visual clara entre fondos, tarjetas, títulos, textos, botones y elementos interactivos.
- Evita colores demasiado saturados o combinaciones que cansen la vista.
- Asegura suficiente contraste entre texto y fondo.
- Diferencia claramente los estados de éxito, advertencia, error e información.
- Mantén consistencia en todos los módulos, simulaciones, evaluación, Kit Digital, certificado y pantallas finales.
- Revisa también los estados hover, focus, active y disabled.

No quiero simplemente cambiar el color de fondo. Necesito una paleta completa y coherente aplicada a todo el sistema visual del modo claro.

Antes de implementarla, revisa si los colores están centralizados en variables CSS, tokens o un sistema de temas. Aprovecha esa estructura para evitar colores inconsistentes o repetidos.

El modo oscuro debe conservar su apariencia y funcionamiento actuales, salvo los ajustes estrictamente necesarios para mantener la coherencia entre ambos temas.

4. Verificación específica de estos cambios

Después de implementar:

1. Prueba el desplazamiento en un teléfono móvil y comprueba que no se mueva toda la página de forma inesperada.
2. Comprueba que el sonido aparezca activado al iniciar la experiencia y que pueda desactivarse correctamente.
3. Verifica que la preferencia de sonido se respete en todas las secciones.
4. Revisa la nueva paleta en todas las pantallas del modo claro.
5. Comprueba el contraste y la legibilidad de textos, botones y tarjetas.
6. Confirma que el modo oscuro no haya sufrido cambios visuales no deseados.

No simules pruebas que no hayas ejecutado. Informa qué dispositivos o tamaños de pantalla utilizaste y qué aspectos no pudiste verificar.

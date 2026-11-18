Realiza los siguientes ajustes en la plataforma Guardián Digital: PAUSA, VERIFICA Y ACTÚA. Antes de modificar, revisa la estructura actual del proyecto y utiliza las skills instaladas que sean pertinentes para mantener la calidad del diseño y la implementación.

1. Corrección de contenido

Realiza los siguientes cambios de texto:

- Cambiar: «En nuestra encuesta, el 75 % de la muestra utiliza billeteras digitales y el 35 % banca móvil».
- Quitar por completo: «En algunas preguntas hubo 19 respuestas y en otras 20, y las preguntas sobre canales podían tener varias selecciones».
- Cambiar: «Actívala primero en el correo electrónico, ya que suele ser la llave para recuperar el resto de tus servicios si llegas a ser víctima».

Conserva el sentido de los textos y verifica que los cambios se reflejen en todos los lugares donde aparezcan.

2. Corregir navegación hacia el certificado desde el Kit Digital

En la vista de escritorio visualizada desde un celular, al ingresar al Kit Digital y pulsar el botón «Ir al certificado», la plataforma desplaza al usuario hasta el inicio de toda la página en lugar de llevarlo a la sección del certificado.

Revisa el comportamiento de navegación y corrige el destino del botón. Debe dirigir correctamente a la sección del certificado, independientemente del dispositivo o tamaño de pantalla.

Verifica que funcione tanto en la vista de escritorio como en la versión móvil.

3. Visualización nativa de los recursos del Kit Digital

Ya no quiero que los recursos del Kit Digital dependan de Google Drive para su visualización.

Modifica la implementación para que los recursos puedan visualizarse directamente dentro de la plataforma, sin tener que abrir Google Drive ni salir del curso.

Requisitos:

- Los documentos deben contar con un visor integrado en la plataforma.
- Debe existir una opción para descargar cada recurso.
- Los videos deben reproducirse mediante un reproductor nativo integrado en la plataforma.
- El reproductor debe tener un diseño responsivo y adaptarse correctamente a celulares, tabletas y computadores.
- Mantén una experiencia de navegación sencilla y coherente con la identidad visual del proyecto.
- Evita que los documentos o videos se corten, desborden sus contenedores o generen problemas de desplazamiento.
- Revisa cómo están almacenados actualmente los archivos y adapta la solución para que los recursos se sirvan desde la propia plataforma o desde una ubicación compatible con su visualización integrada. No mantengas Google Drive como requisito para acceder a ellos.

Importante: conserva los recursos existentes y sus contenidos. No sustituyas los archivos por versiones de ejemplo ni elimines materiales.

4. Mejorar el diseño responsivo del certificado emitido

Mejora la presentación del certificado que aparece en pantalla después de completar el curso.

Importante: me refiero al certificado que se muestra dentro de la plataforma antes de descargarlo, no al diseño del archivo descargable.

Ajusta su presentación para que:

- Se adapte correctamente a celulares, tabletas y computadores.
- Mantenga una distribución equilibrada de los elementos.
- Los textos sean legibles y no queden cortados.
- El nombre del participante, la fecha, el reconocimiento y los demás elementos tengan una jerarquía visual clara.
- No se generen desbordamientos horizontales ni espacios innecesarios.
- Mantenga la identidad visual del proyecto y su apariencia de certificado.

No alteres la información ni las condiciones de emisión del certificado.

5. Verificación final

Una vez implementados los cambios:

- Comprueba que los textos se hayan actualizado correctamente.
- Prueba el botón «Ir al certificado» desde el Kit Digital en diferentes tamaños de pantalla.
- Verifica la visualización y descarga de los documentos.
- Comprueba la reproducción de los videos en el reproductor integrado.
- Revisa el diseño del certificado emitido en celular, tableta y computador.
- Asegúrate de que no se hayan afectado otras secciones ni funcionalidades existentes.

Realiza los cambios directamente en el proyecto. No te limites a presentar recomendaciones o fragmentos de código. Conserva la arquitectura y las funcionalidades que ya funcionan, evita introducir dependencias o servicios de pago y, al finalizar, informa qué archivos modificaste, qué ajustes implementaste y qué pruebas realizaste.

Antes de implementar los cambios del Kit Digital, inspecciona los recursos disponibles en la carpeta "public/recursos/" del proyecto.

Identifica los documentos, videos e imágenes existentes y relaciónalos con las tarjetas correspondientes del Kit Digital.

Utiliza los archivos originales para implementar la visualización integrada y las opciones de descarga. Para los videos, implementa un reproductor HTML5 nativo y responsivo.

No inventes recursos, no sustituyas los archivos originales ni utilices enlaces de Google Drive. Si falta algún archivo necesario, indícame exactamente cuál es antes de reemplazarlo por otra alternativa.

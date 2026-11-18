1. Kit Digital: corregir nombres y contenido de los recursos

Realiza los siguientes ajustes en la sección Kit Digital:

2.  Tutorial visual → Videotutorial

- Cambia el nombre «Tutorial visual» por «Videotutorial».
- Conserva el propósito educativo del recurso, pero asegúrate de que su presentación corresponda a un videotutorial.

3. Recomendaciones → Tips

- Cambia el nombre «Recomendaciones» por «Tips».
- Este recurso debe contener acciones preventivas concretas para evitar estafas digitales y proteger los datos personales.
- Incluye consejos breves, claros y aplicables en situaciones cotidianas.
- Utiliza las acciones preventivas que ya hacen parte del contenido educativo de Guardián Digital.
- No lo presentes como una tarjeta digital de invitación, una invitación a compartir el curso ni un mensaje promocional.
- Su finalidad es que el participante consulte y aplique los tips para fortalecer su seguridad digital.

4. Coherencia del Kit Digital

- Revisa los títulos, descripciones, iconos y contenido de las tarjetas para que correspondan realmente con cada recurso.
- Asegúrate de que no queden referencias al nombre anterior ni contenido que confunda los Tips con una invitación digital.
- Conserva la distribución visual equilibrada de las tarjetas solicitada anteriormente.

5. Revisa y corrige el espaciado entre el globo de texto que aparece encima del botón flotante de RO-BIT y el propio botón.

Actualmente, ambos elementos están demasiado juntos, lo que hace que la interfaz se vea poco equilibrada. Ajusta la separación para que exista un espacio visual adecuado entre el globo de texto y el botón.

Requisitos:

- Aplica la corrección tanto en la versión de escritorio como en la versión móvil.
- Mantén una separación proporcional y visualmente equilibrada entre ambos elementos.
- Evita que el globo de texto se superponga con el botón o quede demasiado pegado.
- Conserva la posición y el funcionamiento del botón flotante de RO-BIT.
- Asegúrate de que el ajuste sea responsivo y se mantenga en diferentes tamaños de pantalla.

Antes de modificar, revisa cómo están posicionados actualmente ambos elementos y corrige el espaciado desde los estilos o contenedores correspondientes. No modifiques otros elementos de la interfaz.

---

## Ronda 7 (implementada)

- Kit: «Recomendaciones» pasó a «Tips» (acciones preventivas concretas, sin tono de invitación ni de tarjeta promocional) y «Tutorial visual» a «Videotutorial». Nuevos iconos (bombilla, cámara), descripciones, README, chat de RO-BIT y avance. Se conservan los enlaces, los identificadores internos (el progreso guardado sigue válido) y la distribución equilibrada 3 + 2.
- RO-BIT: el globo se posiciona a partir del botón mediante variables (`--rb-bottom`, `--rb-fab-h`, `--rb-gap`). Antes quedaba a 2 px en escritorio y se superponía 2 px en móvil; ahora hay 14 px (12 px en móvil) en todos los tamaños.

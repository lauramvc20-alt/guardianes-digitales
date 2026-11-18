# Tutorial «Lo que ves y oyes se puede falsificar» · Guardián Digital (Remotion)

Video de ~53 s (1920×1080, 30 fps, H.264 + AAC) para el **Kit Digital**. Tres situaciones cotidianas
(vender por internet, responder una encuesta, recibir la llamada de un «familiar») con un hábito
para cada una y RO-BIT como guía. Sustituye al tutorial de 2FA.

## Flujo de trabajo
```bash
cd video-src/habitos
npm install
ELEVENLABS_API_KEY=... python3 audio/voz_elevenlabs.py   # narración (voz Daniel, plan gratuito); la clave va en el entorno
npm run audio                                            # sincroniza voz, música y efectos; genera timings.json y VTT
npm run estudio                                          # vista previa
npm run render                                           # out/tutorial-habitos.mp4
npm run render:subtitulos                                # out/tutorial-habitos-subtitulado.mp4
npm run poster
```
En entornos restringidos: `REMOTION_BROWSER=/ruta/a/chrome npm run render -- --chrome-mode=chrome-for-testing`.
La animación se sincroniza con palabras concretas del guion gracias a los tiempos por carácter que
devuelve ElevenLabs (`audio/lines/*.json`); si cambias la voz o el texto, repite `voz_elevenlabs.py`
y `npm run audio`.

## Fuentes de las prácticas
- Comprobante de pago ≠ pago; confirmar en la propia cuenta: documento del proyecto (compraventa) y
  prensa colombiana que cita a Nequi y a la Policía.
- Datos mínimos y encuestas engañosas: documento del proyecto y Módulo 3 del curso.
- Voz clonada con IA, colgar y llamar al número de siempre: FTC (consumer.ftc.gov).
- Palabra clave familiar: FBI, IC3 PSA241203.

## Créditos
Narración: ElevenLabs (plan gratuito, voz Daniel; mencionar en los créditos). Música y efectos:
síntesis propia en `audio/build_audio.py`. RO-BIT: diseño de la plataforma PVA. Motion graphics: Remotion.

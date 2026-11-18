import React from "react";
import { Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS, T } from "./theme";
import { Background, BrandChip, ProgressBar, Subtitle } from "./ui";
import { Guide, Scene1, Scene2, Scene3, Scene4, Scene5, StepDots } from "./Scenes";

export const Tutorial: React.FC<{ subtitulos: boolean }> = ({ subtitulos }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const zoom = 1 + 0.025 * (t / T.total);
  return (
    <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden", background: "#070b18" }}>
      <Audio src={staticFile("audio/mix.wav")} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 50%" }}>
        <Background t={t} />
        <BrandChip t={t} />
        <StepDots t={t} />
        <Scene1 t={t} />
        <Scene2 t={t} />
        <Scene3 t={t} />
        <Scene4 t={t} />
        <Scene5 t={t} />
        <Guide t={t} />
      </div>
      {subtitulos && <Subtitle t={t} />}
      <ProgressBar t={t} />
    </div>
  );
};

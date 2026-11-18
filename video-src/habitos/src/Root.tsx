import React from "react";
import { Composition } from "remotion";
import { Tutorial } from "./Video";
import { FPS, H, T, W } from "./theme";

const frames = Math.ceil(T.total * FPS);

export const Root: React.FC = () => (
  <>
    <Composition id="Habitos" component={Tutorial} durationInFrames={frames} fps={FPS} width={W} height={H} defaultProps={{ subtitulos: false }} />
    <Composition id="HabitosConSubtitulos" component={Tutorial} durationInFrames={frames} fps={FPS} width={W} height={H} defaultProps={{ subtitulos: true }} />
  </>
);

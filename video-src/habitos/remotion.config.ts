import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// En equipos con Chrome instalado, Remotion lo descarga solo. En este entorno se
// usa el Chromium local si existe la variable REMOTION_BROWSER.
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}

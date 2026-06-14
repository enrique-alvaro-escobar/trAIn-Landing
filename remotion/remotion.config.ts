import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Las capturas son fotográficas: H.264 con buena calidad y compatible con <video> en la landing.
Config.setCodec("h264");
Config.setCrf(20);

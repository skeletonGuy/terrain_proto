import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { updateSunPosition } from "../../src/utils/updateSunPosition";

const gui = new GUI();

//TODO: Lots of params to be reduced when GameScene class is built out
export function initSunUI({
  gui,
  Sun,
  Sky,
  WaterPlane,
  sceneEnv,
  scene,
  pmremGenerator,
}) {
  const folderSun = gui.addFolder("Sun");

  folderSun.add(Sun, "elevation", 0, 90, 0.1).onChange((event) =>
    updateSunPosition({
      Sun,
      Sky,
      WaterPlane,
      sceneEnv,
      scene,
      pmremGenerator,
    })
  );

  folderSun.add(Sun, "azimuth", -180, 180, 0.1).onChange((event) =>
    updateSunPosition({
      Sun,
      Sky,
      WaterPlane,
      sceneEnv,
      scene,
      pmremGenerator,
    })
  );
}

export function initWaterUI(gui, WaterPlane) {
  const folderWater = gui.addFolder("water");
  const water = WaterPlane.getMesh();
  const waterUniforms = water.material.uniforms;

  folderWater
    .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
    .name("distortion scale");
  folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");
  folderWater.add(water.position, "y").name("Water Elevation");

  folderWater.open();
}

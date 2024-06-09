import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const gui = new GUI();

//TODO: Lots of params to be reduced when GameScene class is built out
export function initSunUI(sunBehavior) {
  const folderSun = gui.addFolder("Sun");

  folderSun
    .add(sunBehavior.parameters, "elevation", 0, 90, 0.1)
    .onChange(
      (v) =>
        (sunBehavior.parameters = { ...sunBehavior.parameters, elevation: v }),
    );
  folderSun
    .add(sunBehavior.parameters, "azimuth", -180, 180, 0.1)
    .onChange(
      (v) =>
        (sunBehavior.parameters = { ...sunBehavior.parameters, azimuth: v }),
    );
}

export function initWaterUI(waterPlane) {
  const folderWater = gui.addFolder("water");
  const water = waterPlane.getMesh();
  const waterUniforms = water.material.uniforms;

  folderWater
    .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
    .name("distortion scale");
  folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");
  folderWater.add(water.position, "y", 50, 1000, 1).name("Water Elevation");

  folderWater.open();
}

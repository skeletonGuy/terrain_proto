import * as THREE from "three";

//TODO: Lots of params to be reduced when GameScene class is built out
export function updateSunPosition({
  Sun,
  WaterPlane,
  Sky,
  sceneEnv,
  scene,
  pmremGenerator,
}) {
  const sky = Sky.getMesh();
  const water = WaterPlane.getMesh();

  sky.material.uniforms["sunPosition"].value.copy(Sun.position);
  water.material.uniforms["sunDirection"].value.copy(Sun.position).normalize();

  sceneEnv.add(sky);
  let renderTarget = pmremGenerator.fromScene(sceneEnv);
  scene.add(sky);

  scene.environment = renderTarget.texture;
}

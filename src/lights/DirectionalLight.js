import * as THREE from "three";

export const DirectionalLight = () => {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-5, 0, 0);

  return light;
};

export default DirectionalLight;

import * as THREE from 'three';

export const MainCamera = () => {
  const fov = 40;
  const aspect = 2;
  const near = 1;
  const far = 50000;

  const mainCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  mainCamera.position.set(2000, 3000, 6000);

  return mainCamera;
};

export default MainCamera;

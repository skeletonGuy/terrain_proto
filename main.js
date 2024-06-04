import * as THREE from "three";

/** Objects */
import MappedTerrain from "./src/objects/MappedTerrain";
import { WaterPlane } from "./src/objects/WaterPlane";

/** Camera */
import MainCamera from "./src/cameras/MainCamera";

/** Lights */
import DirectionalLight from "./src/lights/DirectionalLight";

/** UTILS */
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";
import resizeRendererToDisplaySize from "./src/utils/resizeRendererToDisplaySize";
import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();
const gui = new GUI();
const canvas = document.getElementById("main_canvas");
const container = document.getElementById("container");
/** RENDERER */
const renderer = new THREE.WebGLRenderer({ canvas });
//renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

const camera = MainCamera();
const controls = new OrbitControls(camera, canvas);

/**  STATS */
const stats = new Stats();
container.appendChild(stats.dom);

let sun = new THREE.Vector3();
const waterObj = new WaterPlane({
  sunVector: sun,
  scene,
  gui,
});
const water = waterObj.getMesh();

const sky = new Sky();
sky.scale.setScalar(10000);
const skyUniforms = sky.material.uniforms;

skyUniforms["turbidity"].value = 10;
skyUniforms["rayleigh"].value = 2;
skyUniforms["mieCoefficient"].value = 0.005;
skyUniforms["mieDirectionalG"].value = 0.8;

scene.add(water, sky);

const skyParameters = {
  elevation: 2,
  azimuth: 180,
};
const heightMap = new THREE.TextureLoader().load(
  "textures/terrain_depth_map.png",
  function (texture) {
    const terrain = new MappedTerrain({
      mapTexture: texture,
      width: 5000,
      depth: 5000,
      segments: 65,
    });
    scene.add(terrain.getTerrain());
  }
);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
const sceneEnv = new THREE.Scene();

let renderTarget;

//** GUI */
const folderSky = gui.addFolder("Sky");
folderSky.add(skyParameters, "elevation", 0, 90, 0.1).onChange(updateSun);
folderSky.add(skyParameters, "azimuth", -180, 180, 0.1).onChange(updateSun);
folderSky.open();

function updateSun() {
  const phi = THREE.MathUtils.degToRad(90 - skyParameters.elevation);
  const theta = THREE.MathUtils.degToRad(skyParameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms["sunPosition"].value.copy(sun);
  water.material.uniforms["sunDirection"].value.copy(sun).normalize();

  if (renderTarget !== undefined) renderTarget.dispose();

  sceneEnv.add(sky);
  renderTarget = pmremGenerator.fromScene(sceneEnv);
  scene.add(sky);

  scene.environment = renderTarget.texture;
}

updateSun();

function render() {
  const time = performance.now() * 0.001;
  stats.update();
  water.material.uniforms["time"].value += 0.5 / 60.0;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

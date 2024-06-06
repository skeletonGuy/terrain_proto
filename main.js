import * as THREE from "three";

/** Objects */
import MappedTerrain from "./src/objects/MappedTerrain";
import { WaterPlane } from "./src/objects/WaterPlane";
import { SkyBox } from "./src/objects/SkyBox";
import { Sun } from "./src/objects/Sun";

/** Camera */
import MainCamera from "./src/cameras/MainCamera";

/** UTILS */
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import resizeRendererToDisplaySize from "./src/utils/resizeRendererToDisplaySize";
import Stats from "three/addons/libs/stats.module.js";
import { updateSunPosition } from "./src/utils/updateSunPosition";
import { initSunUI, initWaterUI } from "./devUtils/uis/initUI";

const scene = new THREE.Scene();
const sceneEnv = new THREE.Scene();
const gui = new GUI();
const canvas = document.getElementById("main_canvas");
const container = document.getElementById("container");

/** RENDERER */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const camera = MainCamera();
const controls = new OrbitControls(camera, canvas);

/**  STATS */
const stats = new Stats();
container.appendChild(stats.dom);

/** OBJECTS */
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
const sun = new Sun({ gui });
const waterObj = new WaterPlane({
  sunVector: sun,
  scene,
  gui,
});
const water = waterObj.getMesh();
const sky = new SkyBox({ scene, gui, sceneEnv });

updateSunPosition({
  Sun: sun,
  WaterPlane: waterObj,
  Sky: sky,
  sceneEnv,
  scene,
  pmremGenerator,
});

initSunUI({
  gui,
  Sun: sun,
  Sky: sky,
  WaterPlane: waterObj,
  sceneEnv,
  scene,
  pmremGenerator,
});

initWaterUI(gui, waterObj);

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

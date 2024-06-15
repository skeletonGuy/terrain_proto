import * as THREE from 'three';

/** scenes */
import GameScene from './src/scenes/GameScene';
import GameSceneBehavior from './src/scenes/GameSceneBehavior';

/** Objects */
import ObjectAnimationBehavior from './src/objects/ObjectAnimationBehavior';
import MappedTerrain from './src/objects/MappedTerrain';
import WaterPlane from './src/objects/WaterPlane';
import SkyBox from './src/objects/SkyBox';

/** Camera */
import MainCamera from './src/cameras/MainCamera';

/** UTILS */
import { initSunUI, initWaterUI } from './devUtils/uis/initUI';
import { initMapFileInput } from './src/utils/initMapFileInput';

function main() {
  const canvas = document.getElementById('main_canvas');

  /** RENDERER */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  const scene = new GameScene(renderer, { enableStats: true });
  scene.addCamera(MainCamera());
  scene.initOrbitControls();

  const water = scene.addObject(new WaterPlane({ name: 'water' }));

  /** OBJECTS */
  const terrain = scene.addObject(
    new MappedTerrain({
      name: 'terrain',
      heightMapPath: 'textures/terrain_depth_map.png',
      width: 5000,
      depth: 5000,
      segments: 65,
    }),
  );

  water.addAnimationBehavior(function ({ deltaTime, time }) {
    function easeInOutSine(t) {
      return -(Math.cos(Math.PI * t) - 1) / 2;
    }
    const maxY = 700;
    const minY = 670;

    // Time in seconds
    const duration = 10; // Duration of one full up and down cycle (seconds)
    this.mesh.material.uniforms['time'].value += deltaTime / 1000;
    const cycleTime = (time / 1000) % duration;

    // Normalize cycleTime to range [0, 1]
    let t = cycleTime / duration;

    // Apply the easing function
    const easedT = easeInOutSine(t * 2 > 1 ? 2 - t * 2 : t * 2); // Adjust easing for up and down

    // Calculate the new position using the eased progress
    const newY = minY + (maxY - minY) * easedT;

    // Update the water's position
    this.mesh.position.y = newY;
  });

  scene.addObject(new SkyBox({ name: 'sky' }));
  scene.setEnvironmentGenerator(new THREE.PMREMGenerator(renderer));

  const sunBehavior = new GameSceneBehavior({
    gameScene: scene,
    runOnInit: true,
    parameters: {
      azimuth: 180,
      elevation: 2,
    },
    onChange: (scene, parameters) => {
      const { elevation, azimuth } = parameters;
      const sky = scene.getObject('sky');
      const water = scene.getObject('water');
      const phi = THREE.MathUtils.degToRad(90 - elevation);
      const theta = THREE.MathUtils.degToRad(azimuth);
      const position = new THREE.Vector3().setFromSphericalCoords(
        1,
        phi,
        theta,
      );

      sky.mesh.material.uniforms['sunPosition'].value.copy(position);
      water.mesh.material.uniforms['sunDirection'].value
        .copy(position)
        .normalize();
      scene.setEnvironment([sky]);
    },
  });

  scene.start();

  initSunUI(sunBehavior);
  initWaterUI(scene.getObject('water'));
  initMapFileInput((image) => terrain.updateHeightMap(image.src));
}

main();

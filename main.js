import * as THREE from 'three';

/** scenes */
import { GameScene } from './src/scenes/GameScene';
import GameSceneBehavior from './src/scenes/GameSceneBehavior';

/** Objects */
import MappedTerrain from './src/objects/MappedTerrain';
import { WaterPlane } from './src/objects/WaterPlane';
import { SkyBox } from './src/objects/SkyBox';

/** Camera */
import MainCamera from './src/cameras/MainCamera';

/** UTILS */
import { initSunUI, initWaterUI } from './devUtils/uis/initUI';

function main() {
  const canvas = document.getElementById('main_canvas');

  /** RENDERER */
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  const scene = new GameScene(renderer, { enableStats: true });
  scene.addCamera(MainCamera());
  scene.initOrbitControls();

  /** OBJECTS */
  scene.addObject(
    new MappedTerrain({
      name: 'terrain',
      heightMapPath: 'textures/terrain_depth_map.png',
      width: 5000,
      depth: 5000,
      segments: 65,
    }),
  );
  scene.addObject(new WaterPlane({ name: 'water' }));
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
}

main();

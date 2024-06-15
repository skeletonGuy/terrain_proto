import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import resizeRendererToDisplaySize from '../utils/resizeRendererToDisplaySize';
import Stats from 'three/addons/libs/stats.module.js';

class GameScene {
  constructor(renderer, { enableStats } = {}) {
    this._scene = new THREE.Scene();
    this._sceneEnvironment;
    this._environmentObjects = [];
    this._environmentRenderTarget;
    this._environmentGenerator;
    this._objects = [];
    this._renderer = renderer;
    this._cameras = [];
    this._activeCamera;
    this._lastRenderTime = 0;
    this._orbitControls;
    this._stats;
    this._animationsPool = [];

    if (enableStats) {
      this.enableStats();
    }
  }

  addCamera(camera) {
    if (this._cameras.length === 0) {
      this._activeCamera = camera;
    }

    this._cameras.push(camera);

    return camera;
  }

  initOrbitControls() {
    this._orbitControls = new OrbitControls(
      this._activeCamera,
      this._renderer.domElement,
    );
  }

  getObject(name) {
    return this._objects.find((obj) => obj.name === name);
  }

  addObject(object) {
    this._objects.push(object);
    this._scene.add(object.mesh);

    return object;
  }

  setEnvironment(objects) {
    if (!this._environmentGenerator) {
      throw Error(
        'GameScene.setEnvironment: A generator must be added to the scene before an environment can be set \n Set one with GameScene.environmentGenerator = <environmentGenerator>',
      );
    }

    if (!this._sceneEnvironment) {
      this._sceneEnvironment = new THREE.Scene();
    }

    this._environmentObjects.forEach(({ mesh }) => {
      this._sceneEnvironment.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else {
          mesh.material.dispose();
        }
      }
      if (mesh.texture) mesh.texture.dispose();
    });

    this._environmentObjects = [];

    objects.forEach((obj) => {
      if (!this._sceneEnvironment.children.includes(obj.mesh)) {
        this._environmentObjects.push(obj);
        this._sceneEnvironment.add(obj.mesh);
      }
    });

    this._environmentRenderTarget = this._environmentGenerator.fromScene(
      this._sceneEnvironment,
    );
    this._scene.environment = this._environmentRenderTarget.texture;
    objects.forEach((obj) => this._scene.add(obj.mesh));
  }

  setEnvironmentGenerator(generator) {
    this._environmentGenerator = generator;
  }

  enableStats() {
    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);
  }

  start() {
    const animate = (time) => {
      const deltaTime = time - this._lastRenderTime;
      this._lastRenderTime = time;

      if (resizeRendererToDisplaySize(this._renderer)) {
        const canvas = this._renderer.domElement;
        this._activeCamera.aspect = canvas.clientWidth / canvas.clientHeight;
        this._activeCamera.updateProjectionMatrix();
      }

      this._objects.forEach((obj) => {
        obj.animationBehaviors.forEach((behavior) => {
          behavior({ deltaTime, time });
        });
      });

      requestAnimationFrame(animate);
      this._renderer.render(this._scene, this._activeCamera);

      if (this._stats) {
        this._stats.update();
      }
    };

    animate(0);
  }
}

export default GameScene;

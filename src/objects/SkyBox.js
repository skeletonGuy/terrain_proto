import { Sky } from "three/addons/objects/Sky.js";
import { Object } from "./Object";

export class SkyBox extends Object {
  constructor({ name, scene, gui, sceneEnv }) {
    super({ name });
    const sky = new Sky();
    sky.scale.setScalar(10000);

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    this._mesh = sky;
    // TODO: scene objects should be stored in the parent GameScene object
    // Object class items should not interact with scene directly
    this._scene = scene;
    this._sceneEnv = sceneEnv;
    this._scene.add(this.mesh);
  }

  getMesh() {
    return this._mesh;
  }
}

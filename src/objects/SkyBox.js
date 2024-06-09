import { Sky } from 'three/addons/objects/Sky.js';
import Object from './Object';

class SkyBox extends Object {
  constructor({ name }) {
    super({ name });
    const sky = new Sky();
    sky.scale.setScalar(10000);

    const skyUniforms = sky.material.uniforms;

    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    this._mesh = sky;
  }
}

export default SkyBox;

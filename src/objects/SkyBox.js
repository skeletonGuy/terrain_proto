export class SkyBox {
  constructor({ scene, gui, sceneEnv }) {
    const sky = new Sky();
    sky.setScalar(10000);

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    this.mesh = sky;
    this.scene = scene;
    this.sceneEnv = sceneEnv;
    this.scene.add(this.mesh);
  }

  updateSunPosition(vector3) {
    this.mesh.material.uniforms["sunPosition"].value.copy(vector3);
    sceneEnv.add(this.mesh);
    this.scene.add(this.mesh);
  }
}

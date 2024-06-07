import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";
import { Object } from "./Object";

export class WaterPlane extends Object {
  constructor({ name, scene }) {
    super({ name });
    // TODO: scene objects should be stored in the parent GameScene object
    // Object class items should not interact with scene directly
    this.scene = scene;
    this._geometry = new THREE.PlaneGeometry(5000, 5000);
    this._sunVector = new THREE.Vector3();

    this._mesh = new Water(this._geometry, {
      textureWidth: 2048,
      textureHeight: 2048,
      waterNormals: new THREE.TextureLoader().load(
        "textures/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        },
      ),
      sunDirection: this._sunVector,
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
      side: THREE.DoubleSide,
    });

    this._mesh.rotation.x = -Math.PI / 2;
    this._mesh.position.y = 600;

    this.scene.add(this._mesh);
  }

  destroy() {
    this.scene.remove(this._mesh);
  }

  getMesh() {
    return this._mesh;
  }

  updateSunDirection(vector3) {
    this._sunVector = vector3;
    this._mesh.material.uniforms["sunDirection"].value
      .copy(this._sunVector)
      .normalize();
  }
}

import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";

export class WaterPlane {
  constructor({ scene }) {
    this.scene = scene;
    this.geometry = new THREE.PlaneGeometry(5000, 5000);
    this.sunVector = new THREE.Vector3();

    this.mesh = new Water(this.geometry, {
      textureWidth: 2048,
      textureHeight: 2048,
      waterNormals: new THREE.TextureLoader().load(
        "textures/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: this.sunVector,
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
      side: THREE.DoubleSide,
    });

    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = 600;

    this.scene.add(this.mesh);
  }

  destroy() {
    this.scene.remove(this.mesh);
  }

  getMesh() {
    return this.mesh;
  }

  updateSunDirection(vector3) {
    this.sunVector = vector3;
    this.mesh.material.uniforms["sunDirection"].value
      .copy(this.sunVector)
      .normalize();
  }
}

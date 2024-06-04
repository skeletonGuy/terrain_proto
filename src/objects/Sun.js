import * as THREE from "three";

export class Sun {
  constructor({ elevation, azimuth, gui }) {
    this.properties = {
      elevation: elevation ?? 2,
      azimuth: azimuth ?? 180,
    };
    this.position = this.updatePosition();

    if (gui) {
      this.initDevUI(gui);
    }
  }

  get position() {
    return this.position;
  }

  updatePosition() {
    const updatedPosition = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad(90 - this.properties.elevation);
    const theta = THREE.MathUtils.degToRad(this.properties.azimuth);

    this.position = updatedPosition.setFromSphericalCoords(1, phi, theta);
  }

  initDevUI(gui) {
    const folderSun = gui.addFolder("Sun");
    folderSun
      .add(this.properties, "elevation", 0, 90, 0.1)
      .onChange(updatePosition);
    folderSun
      .add(this.properties, "azimuth", -180, 180, 0.1)
      .onChange(updatePosition);
  }
}

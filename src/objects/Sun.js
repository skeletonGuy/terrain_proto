import * as THREE from "three";

export class Sun {
  constructor({ elevation, azimuth }) {
    //this._properties = {
    //  elevation: elevation ?? 2,
    //  azimuth: azimuth ?? 180,
    //};
    this._elevation = elevation ?? 2;
    this._azimuth = azimuth ?? 180;
    this._position = new THREE.Vector3();

    this.updatePosition();
  }

  get position() {
    return this._position;
  }

  get properties() {
    return {
      azimuth: this._azimuth,
      position: this._position,
    };
  }

  get azimuth() {
    return this._azimuth;
  }

  get elevation() {
    return this._elevation;
  }

  set elevation(value) {
    if (value && !isNaN(value)) {
      this._elevation = value;

      this.updatePosition();
    }
  }

  set azimuth(value) {
    if (value && !isNaN(value)) {
      this._azimuth = value;

      this.updatePosition();
    }
  }

  set properties({ azimuth, elevation }) {
    if (azimuth !== undefined) {
      this._properties.azimuth = azimuth;
    }

    if (elevation !== undefined) {
      this._properties.elevation = elevation;
    }

    this._position = this.updatePosition();
  }

  updatePosition() {
    const updatedPosition = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad(90 - this._elevation);
    const theta = THREE.MathUtils.degToRad(this._azimuth);

    this._position = updatedPosition.setFromSphericalCoords(1, phi, theta);
  }
}

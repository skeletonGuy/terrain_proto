import * as THREE from 'three';
import Object from './Object';

class MappedTerrain extends Object {
  constructor({ name, heightMapPath, width, depth, segments = 65 } = {}) {
    super(name);
    const texture = new THREE.TextureLoader().load(
      '/textures/aerial_ground_rock.jpg',
    );
    this._geometry = new THREE.PlaneGeometry(width, depth, segments, segments);
    this._material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 1,
      map: texture,
    });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.rotation.x = -Math.PI / 2;

    new THREE.TextureLoader().load(heightMapPath, (mapTexture) => {
      const mapData = this.getMapData(mapTexture);
      this.updateTerrain(mapData, segments, mapTexture);
    });
  }

  updateTerrain(mapData, segments, mapTexture) {
    const positionAttribute = this._mesh.geometry.attributes.position;
    const vertices = positionAttribute.array;

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const index = (i * (segments + 1) + j) * 3;
        const x = Math.floor((i / segments) * (mapTexture.image.width - 1));
        const y = Math.floor((j / segments) * (mapTexture.image.height - 1));
        const pixelIndex = (y * mapTexture.image.width + x) * 4;
        const height = mapData[pixelIndex] * 5; // Normalize height to a range, e.g., 0 to 10
        vertices[index + 2] = height;
      }
    }
    positionAttribute.needsUpdate = true;
  }

  getMapData(mapTexture) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = mapTexture.image.width;
    canvas.height = mapTexture.image.height;
    context.drawImage(mapTexture.image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    return imageData.data;
  }
}

export default MappedTerrain;

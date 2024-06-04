import * as THREE from "three";

class MappedTerrain {
  constructor({ mapTexture, width, depth, segments = 65 } = {}) {
    this.geometry = new THREE.PlaneGeometry(width, depth, segments, segments);
    this.vertices = this.geometry.attributes.position.array;

    const mapData = this.processMapdata(mapTexture);

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const index = (i * (segments + 1) + j) * 3;
        const x = Math.floor((i / segments) * (mapTexture.image.width - 1));
        const y = Math.floor((j / segments) * (mapTexture.image.height - 1));
        const pixelIndex = (y * mapTexture.image.width + x) * 4;
        const height = mapData[pixelIndex] * 5; // Normalize height to a range, e.g., 0 to 10
        this.vertices[index + 2] = height;
      }
    }
    this.geometry.needsUpdate = true;

    const texture = new THREE.TextureLoader().load(
      "/textures/aerial_ground_rock.jpg"
    );

    this.material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 1,
      map: texture,
    });
    this.terrain = new THREE.Mesh(this.geometry, this.material);

    this.terrain.rotation.x = -Math.PI / 2;
  }

  processMapdata(mapTexture) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = mapTexture.image.width;
    canvas.height = mapTexture.image.height;
    context.drawImage(mapTexture.image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    //canvas.remove();
    return imageData.data;
  }

  getTerrain() {
    return this.terrain;
  }
}

export default MappedTerrain;

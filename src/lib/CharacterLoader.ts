import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { iDataCharacter } from "../components/wardrobe.interface";
import * as THREE from "three";

export const LoadCharacter = (params: iDataCharacter) => {
  const loader = new FBXLoader();
  return new Promise<THREE.Group>((resolve, rejects) => {
    loader.load(
      params.path,
      (model) => {
        model.scale.multiplyScalar(0.01);
        model.position.set(0, 0.25, 0);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const textureOutfit = new THREE.TextureLoader().load(params.textures.outfit.path);
            const textureBody = new THREE.TextureLoader().load(params.textures.skin.path);
            const textureEye = new THREE.TextureLoader().load(params.textures.eye.path);
            textureOutfit.encoding = THREE.sRGBEncoding;
            textureBody.encoding = THREE.sRGBEncoding;
            textureEye.encoding = THREE.sRGBEncoding;
            if (child.material.name.includes("tshirt_")) {
              child.material = new THREE.MeshStandardMaterial({
                map: textureOutfit,
                transparent: true,
                metalness: 0.05,
              });
            }
            if (child.material.name === "skin_body") {
              child.material = new THREE.MeshStandardMaterial({ map: textureBody, metalness: 0.05 });
            }
            if (child.material.name === "skin_eyes") {
              child.material = new THREE.MeshStandardMaterial({ map: textureEye, metalness: 0.05 });
            }
          }
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        model.name = params.name;
        resolve(model);
      },
      (xhr) => {}
    );
  });
};

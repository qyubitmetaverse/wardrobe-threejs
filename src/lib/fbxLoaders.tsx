import { FC, useContext } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GameContext } from "../contexts/GameContexts";

export const LoadFBX = (path: string) => {
  const loader = new FBXLoader();
  return new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        resolve(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (err) => {
        reject(err);
      }
    );
  });
};

export const LoadCharacter = (scene: any, path: string, callback?: (event: ProgressEvent<EventTarget>) => void) => {
  const loader = new FBXLoader();
  return new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        const scl = new THREE.Vector3(1, 1, 1);
        model.scale.x = scl.x;
        model.scale.y = scl.y;
        model.scale.z = scl.z;
        model.position.set(-0.2, 0.25, 0);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const texture = new THREE.TextureLoader().load("/assets/characters/texture_ou1_op.png");
            const textureBody = new THREE.TextureLoader().load("/assets/characters/skin_chibi.png");
            const textureEye = new THREE.TextureLoader().load("/assets/characters/eye-1.png");
            const math = new THREE.MeshStandardMaterial({
              map: texture,
              fog: false,
              transparent: true,
              metalness: 0.05,
            });
            const mathBody = new THREE.MeshStandardMaterial({ map: textureBody, fog: false, metalness: 0.05 });
            const mathEye = new THREE.MeshStandardMaterial({ map: textureEye });
            if (child.material.name === "tshirt_g_ou1") {
              child.material = math;
              // child.material = math;
            }
            if (child.material.name === "skin_body") {
              child.material = mathBody;
            }

            if (child.material.name === "skin_eyes") {
              child.material = mathEye;
            }
          }
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        model.name = "character-female";
        // scene.add(model);
        resolve(model);
      },
      callback,
      (err) => {
        reject(err);
      }
    );
  });
};

export const LoadCharacterNormal = (scene: any, path: string) => {
  const loader = new FBXLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(model);

        resolve(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (err) => {
        reject(err);
      }
    );
  });
};

export const LoadSkin = (path: string, pathTexture?: string) => {
  const loader = new FBXLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (pathTexture) {
              const texture = new THREE.TextureLoader().load(pathTexture);
              const math = new THREE.MeshPhysicalMaterial({ map: texture, fog: false, transparent: true });
              child.material = math;
            }
          }
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        resolve(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (err) => {
        reject(err);
      }
    );
  });
};

export const LoadRoom = (scene: any, path: string) => {
  const loader = new FBXLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        const scl = new THREE.Vector3(0.01, 0.01, 0.01);
        const rotate = new THREE.Vector3(0, 90, 0);
        model.scale.x = scl.x;
        model.scale.y = scl.y;
        model.scale.z = scl.z;
        model.rotateOnAxis(rotate, 0);
        // model.position.set(0, 0.2, -1.3); //mobile
        model.position.set(0, 0, -1.3);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const blueLightMath = new THREE.MeshStandardMaterial({
              color: "#5FD4F3",
              emissive: "#5FD4F3",
              emissiveIntensity: 0.5,
            });
            const blueMath = new THREE.MeshStandardMaterial({ color: "#0B2965", metalness: 0.5 });
            const blueMathTransparent = new THREE.MeshStandardMaterial({
              color: "#0B2965",
              transparent: true,
              opacity: 0.5,
            });

            const floorTexture = new THREE.TextureLoader().load("/assets/env/floor.jpg");
            const floorMath = new THREE.MeshBasicMaterial({ color: "#3D434E" });
            const wallTexture = new THREE.TextureLoader().load("/assets/env/wall.jpg");
            const wallMath = new THREE.MeshBasicMaterial({ map: wallTexture, color: "#4B586B" });
            if (child.name === "Cube044") {
              child.material = blueLightMath;
              console.log(child.position);
            }
            if (child.name === "Cube042") child.material = blueLightMath;
            if (child.name === "Cube042") child.material = blueLightMath;
            if (child.name === "Cube018") child.material = blueLightMath;
            if (child.name === "Cube016") child.material = blueMath;
            if (child.name === "Cube019") child.material = blueMath;
            if (child.name === "Cube022") child.material = blueMathTransparent;
            if (child.name === "Cube023") child.material = blueMathTransparent;
            if (child.name === "Cube026") child.material = blueMathTransparent;
            // if (child.name === "Cube") child.material = floorMath;
            // if (child.name === "Cube027") child.material = wallMath;
            // if (child.name === "Cube005") child.material = wallMath;
            // if (child.name === "Cube006") child.material = wallMath;
            // if (child.name === "Cube009") child.material = wallMath;
            // if (child.name === "Cube010") child.material = wallMath;
          }

          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(model);
        resolve(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (err) => {
        reject(err);
      }
    );
  });
};

export const LoadRoomGltf = (scene: any, path: string) => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        model.scene.position.set(0, 0.2, -1.3);
        model.scene.traverse(function (child) {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.receiveShadow = true;
            m.castShadow = true;
          }
          if ((child as THREE.Light).isLight) {
            const l = child as THREE.Light;
            l.castShadow = true;
            l.shadow.bias = -0.003;
            l.shadow.mapSize.width = 2048;
            l.shadow.mapSize.height = 2048;
          }
        });

        scene.add(model.scene);
        resolve(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (err) => {
        reject(err);
      }
    );
  });
};

export const LoadTest = (scene: any, path: string) => {
  const loader = new FBXLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        model.position.set(0, 0, -1);
        model.scale.set(0.001, 0.001, 0.001);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(model);

        resolve(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (err) => {
        reject(err);
      }
    );
  });
};

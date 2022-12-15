import { chdir } from "process";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
        model.scale.multiplyScalar(0.01);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const textureOutfit = new THREE.TextureLoader().load("/assets/characters/female/texture_ou1_op.png");
            const textureBody = new THREE.TextureLoader().load("/assets/characters/female/skin_chibi.png");
            const textureEye = new THREE.TextureLoader().load("/assets/characters/eye-1.png");
            textureOutfit.encoding = THREE.sRGBEncoding;
            textureBody.encoding = THREE.sRGBEncoding;
            textureEye.encoding = THREE.sRGBEncoding;
            console.log(child.material.name);

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
        resolve(model);
      },
      callback,
      (err) => {
        reject(err);
      }
    );
  });
};

export const LoadCharacterMale = (scene: any, path: string, callback?: (event: ProgressEvent<EventTarget>) => void) => {
  const loader = new FBXLoader();
  return new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        const scl = new THREE.Vector3(1, 1, 1);
        model.scale.x = scl.x;
        model.scale.y = scl.y;
        model.scale.z = scl.z;
        model.position.set(0, 0.25, 0);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const textureOutfit = new THREE.TextureLoader().load("/assets/characters/male/outfit1_male.png");
            const textureBody = new THREE.TextureLoader().load("/assets/characters/male/skin_chibi_male.png");
            const textureEye = new THREE.TextureLoader().load("/assets/characters/eye-1.png");
            const mathOutfit = new THREE.MeshStandardMaterial({
              map: textureOutfit,
              fog: false,
              transparent: true,
              metalness: 0.05,
            });
            const mathBody = new THREE.MeshStandardMaterial({ map: textureBody, fog: false, metalness: 0.05 });
            const mathEye = new THREE.MeshStandardMaterial({ map: textureEye });
            console.log(child.material.name);

            if (child.material.name === "ou1_male") {
              child.material = mathOutfit;
            }
            if (child.material.name === "skin_male") {
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

        model.name = "character-male";
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
              texture.encoding = THREE.sRGBEncoding;
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

export const LoadRoom = (scene: any, path: string, video: any, isMobile: boolean = false) => {
  const loader = new FBXLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        const rotate = new THREE.Vector3(0, 90, 0);
        // model.scale.set(0.01, 0.01, 0.01);
        model.rotateOnAxis(rotate, 0);
        if (isMobile) model.position.set(0, -0.2, -0.2); //mobile
        if (!isMobile) model.position.set(0, -0.3, 0.1);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const baseTexture = new THREE.TextureLoader().load("/assets/env/room_v2/txt_base.webp");
            const lightTexture = new THREE.TextureLoader().load("/assets/env/room_v2/txt_lighting.webp");
            const transparentTexture = new THREE.TextureLoader().load("/assets/env/room_v2/txt_transparent.webp");
            baseTexture.encoding = THREE.sRGBEncoding;
            lightTexture.encoding = THREE.sRGBEncoding;
            transparentTexture.encoding = THREE.sRGBEncoding;

            const lightMath = new THREE.MeshStandardMaterial({
              map: lightTexture,
              roughness: 0.5,
              fog: false,
              metalness: 0.6,
            });

            const transparentMath = new THREE.MeshStandardMaterial({
              map: transparentTexture,
              roughness: 0.5,
              fog: false,
              transparent: true,
              metalness: 0.6,
            });
            const BaseMath = new THREE.MeshStandardMaterial({
              map: baseTexture,
              roughness: 0.5,
              fog: false,
              metalness: 0.6,
            });

            if (child.material.name === "Wardrobe_Texture") child.material = BaseMath;
            if (child.material.name === "Lighting") child.material = lightMath;
            if (child.material.name === "Transprent" && child.name !== "wall_behind_frame")
              child.material = transparentMath;
            if (child.name === "wall_behind_frame" || child.name === "wall_left_part") {
              const tvVideo = video as HTMLVideoElement;
              tvVideo.playsInline = true;
              tvVideo.play();
              const vTexture = new THREE.VideoTexture(tvVideo);
              vTexture.needsPMREMUpdate = true;
              vTexture.encoding = THREE.sRGBEncoding;
              const vm = new THREE.MeshBasicMaterial({ map: vTexture, side: THREE.FrontSide });
              child.material = vm;
            }
          }

          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        model.layers.set(0);
        scene.add(model);
        resolve(model);
      },
      (xhr) => {},
      (err) => {
        reject(err);
      }
    );
  });
};

export const LoadRoomGltf = (scene: any, path: string, video: any) => {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        model.scene.position.set(0, 0.2, -1.3);
        model.scene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            const baseTexture = new THREE.TextureLoader().load("/assets/env/room_v2/txt_base.webp");
            const lightTexture = new THREE.TextureLoader().load("/assets/env/room_v2/txt_lighting.webp");
            const transparentTexture = new THREE.TextureLoader().load("/assets/env/room_v2/txt_transparent.webp");
            baseTexture.encoding = THREE.sRGBEncoding;
            baseTexture.needsPMREMUpdate = true;
            lightTexture.encoding = THREE.sRGBEncoding;

            transparentTexture.encoding = THREE.sRGBEncoding;

            const lightMath = new THREE.MeshStandardMaterial({
              map: lightTexture,
              roughness: 0.5,
              fog: false,
              metalness: 0.6,
            });

            const transparentMath = new THREE.MeshStandardMaterial({
              map: transparentTexture,
              roughness: 0.5,
              fog: false,
              transparent: true,
              metalness: 0.6,
            });
            const BaseMath = new THREE.MeshStandardMaterial({
              map: baseTexture,
              roughness: 0.5,
              fog: false,
              metalness: 0.6,
            });
            console.log(child.material.name);

            if (child.material.name === "Wardrobe_Texture") child.material = BaseMath;
            if (child.material.name === "Lighting") child.material = lightMath;
            if (child.material.name === "Transprent") child.material = transparentMath;
            if (child.material.name === "texture_video") {
              const tvVideo = video as HTMLVideoElement;
              tvVideo.playsInline = true;
              tvVideo.play();
              const vTexture = new THREE.VideoTexture(tvVideo);
              vTexture.needsPMREMUpdate = true;
              vTexture.encoding = THREE.sRGBEncoding;
              vTexture.flipY = false;
              const vm = new THREE.MeshBasicMaterial({ map: vTexture, side: THREE.FrontSide });
              child.material = vm;
            }
          }

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

export const LoadBox = (scene: any, path: string) => {
  const loader = new FBXLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (model) => {
        model.position.set(-150, 0.44, 0);
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

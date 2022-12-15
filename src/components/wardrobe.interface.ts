export interface iSkins {
  _id: string;
  name: string;
  type: string;
  pathImg: string;
  model: THREE.SkinnedMesh;
}

export interface iCharacter {
  _id: string;
  name: string;
  pathImg: string;
  model: THREE.Group;
}

export interface iDataCharacter {
  name: string;
  path: string;
  pathImg: string;
  textures: {
    eye: { path: string };
    skin: { path: string };
    outfit: { path: string };
  };
  isActive: boolean;
}

export interface iAnimation {
  name: string;
  type: string;
  animation: THREE.Group;
}

export interface iDataAnimation {
  name: string;
  type: string;
  path: string;
  isActive: boolean;
}

export interface iMixer {
  _id: string;
  name: string;
  mixer: THREE.AnimationMixer;
}

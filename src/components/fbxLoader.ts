import { FC, useContext } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GameContext } from "../contexts/GameContexts";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export const LoadCharacterFemale = () => {
  return new Promise<THREE.Group>((resolve, rejects) => {});
};

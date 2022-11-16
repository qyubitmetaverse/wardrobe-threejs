import * as THREE from "three";

export interface iGameContext {
  loading: number;
  setLoading: (loading: number) => void;
  animationAction: THREE.AnimationAction[];
  setAnimationAction: (animationAction: THREE.AnimationAction[]) => void;
  activeAction: THREE.AnimationAction | undefined;
  setActiveAction: (activeAction: THREE.AnimationAction | undefined) => void;
  lastAction: THREE.AnimationAction | undefined;
  setLastAction: (lastAction: THREE.AnimationAction | undefined) => void;
}

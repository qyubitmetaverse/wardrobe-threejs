import * as THREE from "three";

export const Lighting = (scene: THREE.Scene): void => {
  const pointLight = new THREE.PointLight("#A1EBFB", 4);
  pointLight.distance = 2;
  pointLight.position.set(-3, 2, -2.5);
  scene.add(pointLight);
  // scene.add(new THREE.PointLightHelper(pointLight, 0.5));

  const pLBack = new THREE.PointLight("#A1EBFB", 4);
  pLBack.distance = 2;
  pLBack.position.set(-3, 2, -5);
  scene.add(pLBack);
  // scene.add(new THREE.PointLightHelper(pLBack, 0.5));

  const pR = new THREE.PointLight("#A1EBFB", 4);
  pR.distance = 2;
  pR.position.set(3, 1.5, -6);
  scene.add(pR);
  // scene.add(new THREE.PointLightHelper(pR, 0.5));

  const pTBack = new THREE.PointLight("#A1EBFB", 4);
  pTBack.distance = 2;
  pTBack.position.set(0, 3, -6);
  scene.add(pTBack);
  // scene.add(new THREE.PointLightHelper(pTBack, 0.5));

  const pTCenter = new THREE.PointLight("#A1EBFB", 7);
  pTCenter.distance = 4.5;
  pTCenter.position.set(0, 3, -4);
  scene.add(pTCenter);
  // scene.add(new THREE.PointLightHelper(pTCenter, 0.5));

  const pTCenterForward = new THREE.PointLight("white", 7);
  pTCenterForward.distance = 2;
  pTCenterForward.position.set(2, 1, -1.5);
  scene.add(pTCenterForward);
  // scene.add(new THREE.PointLightHelper(pTCenterForward, 0.5));

  const pTCenterLeft = new THREE.PointLight("white", 7);
  pTCenterLeft.distance = 2;
  pTCenterLeft.position.set(-2, 1, -1.5);
  scene.add(pTCenterLeft);
  // scene.add(new THREE.PointLightHelper(pTCenterLeft, 0.5));

  const pTCenterLeftForward = new THREE.PointLight("white", 7);
  pTCenterLeftForward.distance = 2;
  pTCenterLeftForward.position.set(-2, 1, 0);
  scene.add(pTCenterLeftForward);
  // scene.add(new THREE.PointLightHelper(pTCenterLeftForward, 0.5));

  const pTCenterRightForward = new THREE.PointLight("white", 7);
  pTCenterRightForward.distance = 2;
  pTCenterRightForward.position.set(2, 1, 0);
  scene.add(pTCenterRightForward);
  // scene.add(new THREE.PointLightHelper(pTCenterRightForward, 0.5));

  const spR = new THREE.SpotLight(0xffffff, 1);
  spR.position.set(1, 3, 0.5);
  spR.angle = Math.PI / 4;
  spR.penumbra = 1;
  spR.decay = 1;
  spR.distance = 10;
  scene.add(spR);
  // scene.add(new THREE.SpotLightHelper(spR));
  const targetSp = new THREE.Object3D();
  targetSp.position.set(0, 0, 2);
  scene.add(targetSp);

  const sp = new THREE.SpotLight(0xffffff, 10);
  sp.position.set(0, 2, 1);
  sp.angle = Math.PI / 5;
  sp.penumbra = 1;
  sp.decay = 1;
  sp.distance = 3;
  sp.target = targetSp;
  scene.add(sp);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemiLight.position.set(0, 3, 0);
  scene.add(hemiLight);
  // scene.add(new THREE.HemisphereLightHelper(hemiLight, 1));
};

export const LightingMobile = (scene: THREE.Scene): void => {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemiLight.position.set(0, 3, 0);
  scene.add(hemiLight);
  scene.add(new THREE.HemisphereLightHelper(hemiLight, 0.2));
  const sp = new THREE.SpotLight(0xffffff, 1.5);
  sp.position.set(0, 3, 0);
  sp.angle = Math.PI / 7;
  sp.penumbra = 1;
  sp.decay = 1;
  sp.distance = 10;
  scene.add(sp);
};

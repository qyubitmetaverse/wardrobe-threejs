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
  const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 1);
  hemiLight.position.set(0, 3, -0.5);
  // hemiLight.intensity = 1000;
  scene.add(hemiLight);
  scene.add(new THREE.HemisphereLightHelper(hemiLight, 0.2));
};

export const LightingV2 = (scene: THREE.Scene): void => {
  const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
  hemiLight.position.set(0, 10, 0);
  hemiLight.intensity = 1.5;
  scene.add(hemiLight);
  scene.add(new THREE.HemisphereLightHelper(hemiLight, 0.2, "white"));

  const bulbLightR = new THREE.PointLight(0xddeeff, 1, 100, 2);
  bulbLightR.power = 400;
  bulbLightR.distance = 5;
  bulbLightR.intensity = 1;
  bulbLightR.position.set(2.5, 2.8, -3);
  scene.add(bulbLightR);
  scene.add(new THREE.PointLightHelper(bulbLightR, 0.2));

  const bulbLightC = new THREE.PointLight(0xddeeff, 1, 100, 2);
  bulbLightC.power = 400;
  bulbLightC.distance = 5;
  bulbLightC.intensity = 1;
  bulbLightC.position.set(0, 2.8, -3);
  scene.add(bulbLightC);
  scene.add(new THREE.PointLightHelper(bulbLightC, 0.2));

  const bulbLightL = new THREE.PointLight(0xddeeff, 1, 100, 2);
  bulbLightL.power = 400;
  bulbLightL.distance = 5;
  bulbLightL.intensity = 1;
  bulbLightL.position.set(-2.5, 2.8, -3);
  scene.add(bulbLightL);
  scene.add(new THREE.PointLightHelper(bulbLightL, 0.2));

  const bulbLightLC = new THREE.PointLight(0xddeeff, 1, 100, 2);
  bulbLightLC.power = 400;
  bulbLightLC.distance = 5;
  bulbLightLC.intensity = 1;
  bulbLightLC.position.set(-2.5, 2.8, -1);
  scene.add(bulbLightLC);
  scene.add(new THREE.PointLightHelper(bulbLightLC, 0.2));

  const bulbLightRC = new THREE.PointLight(0xddeeff, 1, 100, 2);
  bulbLightRC.power = 400;
  bulbLightRC.distance = 5;
  bulbLightRC.intensity = 1;
  bulbLightRC.position.set(2.5, 2.8, -1);
  scene.add(bulbLightRC);
  scene.add(new THREE.PointLightHelper(bulbLightRC, 0.2));

  const bulbLightRF = new THREE.PointLight(0xddeeff, 1, 100, 2);
  bulbLightRF.power = 400;
  bulbLightRF.distance = 5;
  bulbLightRF.intensity = 1;
  bulbLightRF.position.set(2.5, 2.8, 1);
  scene.add(bulbLightRF);
  scene.add(new THREE.PointLightHelper(bulbLightRF, 0.2));

  const bulbLightLF = new THREE.PointLight(0xddeeff, 1, 100, 2);
  bulbLightLF.power = 400;
  bulbLightLF.distance = 5;
  bulbLightLF.intensity = 1;
  bulbLightLF.position.set(-2.5, 2.8, 1);
  scene.add(bulbLightLF);
  scene.add(new THREE.PointLightHelper(bulbLightLF, 0.2));

  const bulbLightLFC = new THREE.PointLight(0xddeeff, 1, 100, 2);
  bulbLightLFC.power = 400;
  bulbLightLFC.distance = 5;
  bulbLightLFC.intensity = 1;
  bulbLightLFC.position.set(0, 2.8, 1);
  scene.add(bulbLightLFC);
  scene.add(new THREE.PointLightHelper(bulbLightLFC, 0.2));
};

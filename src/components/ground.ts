import * as THREE from "three";

export const Ground = (scene: THREE.Scene) => {
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  planeMesh.rotation.x = -Math.PI / 2;
  scene.add(planeMesh);
  const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
  const grd = grid.material as THREE.Material;
  grd.opacity = 0.2;
  grd.transparent = true;
  scene.add(grid);
};

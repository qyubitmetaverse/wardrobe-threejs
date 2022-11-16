import { FC, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { LoadCharacter, LoadRoom } from "../lib/fbxLoaders";
import { Lighting } from "./lighting";

const Room: FC = () => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scene] = useState(new THREE.Scene());
  const [camera] = useState(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const [renderer] = useState(new THREE.WebGLRenderer({ antialias: true, alpha: true }));

  const handleWindowResize = useCallback(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, [renderer]);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize, false);
    return () => {
      window.removeEventListener("resize", handleWindowResize, false);
    };
  }, [renderer, handleWindowResize]);

  useEffect(() => {
    camera.position.set(0, 1.5, 2);
    renderer.setSize(window.innerWidth, window.innerHeight);
    bodyRef.current?.appendChild(renderer.domElement);
    Lighting(scene);
    LoadRoom(scene, "/assets/env/room_test.fbx");
    LoadCharacter(scene, "/assets/characters/chara_girl_ou1_test.fbx").then((model) => {
      // mixer = new THREE.AnimationMixer(model);
      scene.add(model);
      // LoadAnimation("/assets/animations/orc_idle.fbx");
      // LoadAnimation("/assets/animations/damba_dancing.fbx");
    });
    animate();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(0, 1, 0);
    controls.update();

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    return () => {
      renderer.dispose();
    };
  }, []);

  return <div ref={bodyRef} className="w-screen h-screen"></div>;
};

export default Room;

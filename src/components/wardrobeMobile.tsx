import Image from "next/image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import ListOutfitExample from "../models/ListOutfit.example";
import * as THREE from "three";
import { LoadCharacter, LoadRoom, LoadRoomGltf } from "../lib/fbxLoaders";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Lighting, LightingMobile } from "./lighting";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OutfitItems } from "./wardrobe/OutfitItems";
import { Howl } from "howler";
import Stats from "three/examples/jsm/libs/stats.module";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";

const WardrobeMobile: FC = () => {
  const [sfxSelect] = useState(new Howl({ src: ["/sfx/select.mp3"] }));
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scene] = useState(new THREE.Scene());
  const [camera] = useState(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const [renderer] = useState(new THREE.WebGLRenderer({ antialias: true, alpha: false }));
  const [animationAction, setAnimationAction] = useState<THREE.AnimationAction[]>([]);
  const [activeAction, setActiveAction] = useState<THREE.AnimationAction | undefined>();
  const [lastAction, setLastAction] = useState<THREE.AnimationAction | undefined>();

  let mixer: THREE.AnimationMixer;
  let CharacterMesh: THREE.Object3D<THREE.Event>;
  let characterIsReady = false;

  const LoadAnimation = (path: string) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      path,
      (model) => {
        if (mixer) {
          const animationAct = mixer.clipAction((model as THREE.Object3D).animations[0]);
          setAnimationAction((act) => [...act, animationAct]);
        }
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% animation loaded");
        console.log("Character is ready");
      },
      (err) => console.log(err)
    );
  };
  const handleWindowResize = useCallback(() => {
    if (bodyRef.current) {
      camera.aspect = bodyRef.current.clientWidth / bodyRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(bodyRef.current.clientWidth, bodyRef.current.clientHeight);
    }
  }, [renderer]);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize, false);
    return () => {
      window.removeEventListener("resize", handleWindowResize, false);
    };
  }, [renderer, handleWindowResize]);

  const setAction = (toAction: THREE.AnimationAction) => {
    if (activeAction) {
      if (toAction !== activeAction) {
        activeAction.reset();
        activeAction.stop();
        setActiveAction(toAction);
      }
    } else {
      setActiveAction(toAction);
    }
  };

  useEffect(() => {
    if (animationAction.length !== 0) {
      setAction(animationAction[0]);
    }
  }, [animationAction]);

  useEffect(() => {
    if (activeAction) {
      activeAction.reset();
      activeAction.play();
    }
  }, [activeAction, lastAction]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
    const clock = new THREE.Clock();
    camera.position.set(0, 1.5, 2.3);
    camera.zoom = 1.1;
    // camera.aspect = window.innerWidth / window.innerHeight;
    if (bodyRef.current) {
      console.log("fixel ratio", window.devicePixelRatio);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.setSize(bodyRef.current.clientWidth, bodyRef.current.clientHeight);
      bodyRef.current?.appendChild(renderer.domElement);
      camera.aspect = bodyRef.current.clientWidth / bodyRef.current.clientHeight;
      camera.updateProjectionMatrix();
    }

    LightingMobile(scene);
    LoadRoom(scene, "/assets/env/room_test.fbx");
    LoadCharacter(scene, "/assets/characters/chara_girl_ou1_test.fbx").then((model) => {
      mixer = new THREE.AnimationMixer(model);
      model.position.set(-0.1, 0.46, 0);
      scene.add(model);
      LoadAnimation("/assets/animations/orc_Idle.fbx");
      animate();
    });
    const stats = Stats();
    stats.domElement.style.cssText = "position:absolute;top:4rem;left:0px;";
    document.body.appendChild(stats.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    camera.rotation.set(10, 0, 0);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = true;
    controls.minPolarAngle = controls.maxPolarAngle = 1.47079;
    controls.target.set(0, 1.3, 0);

    controls.update();
    let req: any = null;
    function animate() {
      req = requestAnimationFrame(animate);
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      stats.update();
      renderer.render(scene, camera);
    }
    return () => {
      cancelAnimationFrame(req);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-between relative">
      <div className="h-16 w-full bg-[#19191A] shadow-2xl shadow-[#19191A] flex flex-row items-center justify-end border-b border-sky-600">
        <ArrowLongLeftIcon
          onClick={() => window.close()}
          className="ml-4 w-8 h-8 cursor-pointer text-white hover:text-sky-600"
        />
        <div className="flex-1 h-full flex flex-row items-center justify-end pr-4">
          <div className="flex flex-col">
            <p className="mr-2 text-white font-semibold ">Apuystereo</p>
            <p className="mr-2 text-white font-semibold text-xs text-end">level 1</p>
          </div>
          <div className="rounded-full bg-gray-500 h-12 w-12" />
        </div>
      </div>
      <div className="flex-1 bg-black" ref={bodyRef}></div>
      <div className="w-screen h-auto flex flex-col bg-[#19191A] relative prevent-select z-10">
        <div className="w-full absolute -top-[21%] left-0 flex flex-row z-0">
          <div
            className="mr-2 p-[0.4%] px-4 py-2 bg-[#19191A] hover:bg-sky-600 text-white flex items-center justify-center"
            style={{
              clipPath: "polygon(0% 0%, 80% 0, 100% 50%, 100% 100%, 0% 100%)",
              boxSizing: "border-box",
            }}
            onClick={() => sfxSelect.play()}
          >
            Characters
          </div>
          <div
            className="mr-2 p-[0.4%] px-4 py-2 bg-sky-600 hover:bg-sky-600 text-white flex items-center justify-center"
            style={{
              clipPath: "polygon(0% 0%, 80% 0, 100% 50%, 100% 100%, 0% 100%)",
              boxSizing: "border-box",
            }}
            onClick={() => sfxSelect.play()}
          >
            Outfits
          </div>
          <div
            className="mr-2 p-[0.4%] px-4 py-2 bg-[#19191A] hover:bg-sky-600 text-white flex items-center justify-center"
            style={{
              clipPath: "polygon(0% 0%, 80% 0, 100% 50%, 100% 100%, 0% 100%)",
              boxSizing: "border-box",
            }}
            onClick={() => sfxSelect.play()}
          >
            Animations
          </div>
        </div>

        <div className="z-10 w-full h-min p-4 bg-[#19191A] grid grid-flow-col auto-cols-max overflow-x-auto scroll-smooth">
          {ListOutfitExample.data.map((i, k) => (
            <div className="mr-4" key={k}>
              <OutfitItems onClickFunc={() => null} pathImg={i.pathImg} />
            </div>
          ))}
        </div>
        <div className="w-full h-min px-2 md:px-10 py-2 text-gray-500 flex flex-row justify-between">
          <div className="bg-sky-500 rounded-xl px-2 py-1 text-white">
            <p>All</p>
          </div>
          <div className="rounded-xl px-2 py-1 border text-gray-500">
            <p>Accessories</p>
          </div>
          <div className="rounded-xl px-2 py-1 border text-gray-600">
            <p>Hair</p>
          </div>
          <div className="rounded-xl px-2 py-1 border text-gray-600">
            <p>Shirt</p>
          </div>
          <div className="rounded-xl px-2 py-1 border text-gray-600">
            <p>Pants</p>
          </div>
          <div className="rounded-xl px-2 py-1 border text-gray-600">
            <p>Shoes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardrobeMobile;

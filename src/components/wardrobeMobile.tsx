import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import { Howl } from "howler";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import { LoadCharacter } from "../lib/CharacterLoader";
import { LoadRoom, LoadSkin } from "../lib/fbxLoaders";
import ListCharacterExample from "../models/ListCharacter.example";
import ListOutfitExample from "../models/ListOutfit.example";
import { LightingMobile } from "./lighting";
import { iCharacter, iSkins } from "./wardrobe.interface";
import { OutfitItems } from "./wardrobe/OutfitItems";

const WardrobeMobile: FC = () => {
  const videoElement = useRef<HTMLVideoElement>(null);
  const [sfxSelect] = useState(new Howl({ src: ["/sfx/select.mp3"] }));
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scene] = useState(new THREE.Scene());
  const [camera] = useState(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const [renderer] = useState(new THREE.WebGLRenderer({ antialias: true, alpha: false }));
  const [tab, setTab] = useState<string>("characters");
  const [listCharacter, setListCharacter] = useState<iCharacter[]>([]);
  const [characterActive, setCharacterActive] = useState<string>("character-male");

  let mixers: THREE.AnimationMixer[] = [];
  const [Animation, SetAnimation] = useState<THREE.Group>();
  const [animationIsReady, setAnimationIsReady] = useState<boolean>(false);
  const LoadAnimation = (path: string) => {
    const fbxLoader = new FBXLoader();
    return new Promise<THREE.Group>((resolve, reject) => {
      fbxLoader.load(
        path,
        (model) => {
          resolve(model);
          SetAnimation(model);
          setAnimationIsReady(true);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% animation loaded");
        },
        (err) => console.log(err)
      );
    });
  };
  let stats: Stats = Stats();
  let req: any;
  var clock = new THREE.Clock();

  useEffect(() => {
    LoadAnimation("/assets/animations/orc_idle.fbx");
    loadAllSkin();
  }, []);

  useEffect(() => {
    //create scene
    if (animationIsReady) {
      document.body.appendChild(stats.domElement);
      window.scrollTo(0, document.body.scrollHeight);
      camera.position.set(0, 1.5, 2.3);
      camera.zoom = 1.1;
      if (bodyRef.current) {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setSize(bodyRef.current.clientWidth, bodyRef.current.clientHeight);
        bodyRef.current?.appendChild(renderer.domElement);
        camera.aspect = bodyRef.current.clientWidth / bodyRef.current.clientHeight;
        camera.updateProjectionMatrix();
      }
      LightingMobile(scene);

      if (videoElement) {
        LoadRoom(scene, "/assets/env/room_v2/room-fix.fbx", videoElement.current, true);
      }
      LoadCharacter(ListCharacterExample.data[0]).then((model1) => {
        model1.position.set(-0.2, 0.35, -0.4);
        const data: iCharacter = {
          _id: `${Math.random()}`,
          name: ListCharacterExample.data[0].name,
          pathImg: ListCharacterExample.data[0].pathImg,
          model: model1,
        };
        model1.name = "character-male";
        setListCharacter((old) => [...old, data]);
        const mixer1 = new THREE.AnimationMixer(model1);
        if (Animation) {
          const anm1 = mixer1.clipAction((Animation as THREE.Object3D).animations[0]);
          anm1.timeScale = 1;
          anm1.play();
          mixers.push(mixer1);
          scene.add(model1);
        }
        LoadCharacter(ListCharacterExample.data[1]).then((model2) => {
          model2.position.set(0, 0.44, -0.5);
          const data: iCharacter = {
            _id: `${Math.random()}`,
            name: ListCharacterExample.data[1].name,
            pathImg: ListCharacterExample.data[1].pathImg,
            model: model2,
          };
          setListCharacter((old) => [...old, data]);
          model2.name = "character-female";
          const mixer2 = new THREE.AnimationMixer(model2);
          if (Animation) {
            const anm = mixer2.clipAction((Animation as THREE.Object3D).animations[0]);
            anm.timeScale = 1;
            anm.play();
            mixers.push(mixer2);
            animate();
          }
        });
      });
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.rotation.set(10, 0, 0);
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.minPolarAngle = controls.maxPolarAngle = 1.47079;
    controls.target.set(0, 1.3, 0);
    controls.update();
    function animate() {
      const delta = clock.getDelta();
      for (const m of mixers) {
        m.update(delta);
      }
      stats.update();
      renderer.render(scene, camera);
      req = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(req);
      renderer.dispose();
    };
  }, [animationIsReady]);

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

  const changeCharacter = () => {
    setCharacterActive((c) => (c === "character-female" ? "character-male" : "character-female"));
    scene.children.map((c, idx) => {
      if (c.name.includes("character")) {
        if (characterActive === "character-female") {
          let newChara = listCharacter.find((f) => f.name.includes("character-male"));
          if (newChara) {
            scene.remove(c);
            scene.add(newChara.model);
          }
        } else {
          let newChara = listCharacter.find((f) => f.name.includes("character-female"));
          if (newChara) {
            scene.remove(c);
            scene.add(newChara.model);
          }
        }
      }
    });
  };

  const [skins, setSkins] = useState<iSkins[]>([]);
  const loadAllSkin = () => {
    ListOutfitExample.outfitFemale.map((i) =>
      LoadSkin(i.pathModel, i.pathTexture).then((model: any) => {
        model.children.map((md: any) => {
          var ns = md as THREE.SkinnedMesh;
          if (ns.name !== "metarig") {
            const newSkin: THREE.SkinnedMesh = ns;
            setSkins((old) => [
              ...old,
              {
                _id: `${i._id}${Math.random()}`,
                name: i.name,
                type: i.type,
                pathImg: i.pathImg,
                model: newSkin,
              },
            ]);
          }
        });
      })
    );
  };

  const ChangeSkin = (_id: string) => {
    const findSkin = skins.find((f) => f._id === _id);
    if (findSkin) {
      scene.children.map((c) => {
        if (c.name.includes(characterActive)) {
          c.children.map((oldSkin, idx) => {
            if (oldSkin.name.includes(findSkin.type)) {
              const oSkin = oldSkin as THREE.SkinnedMesh;
              var ns = findSkin.model;
              if (ns.name !== "metarig") {
                let newSkin: THREE.SkinnedMesh;
                newSkin = ns;
                newSkin.skeleton = oSkin.skeleton;
                c.children.push(newSkin);
                c.children.splice(idx, 1); //remove old skin
              }
            }
          });
        }
      });
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-between relative">
      <video id="video" loop muted crossOrigin="anonymous" playsInline ref={videoElement} style={{ display: "none" }}>
        <source src="/videoPortfolio.mp4" />
      </video>
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
            className={`mr-2 p-[0.4%] px-4 py-2 ${
              tab === "characters" ? "bg-sky-600" : "bg-[#19191A]"
            } hover:bg-sky-600 text-white flex items-center justify-center`}
            style={{
              clipPath: "polygon(0% 0%, 80% 0, 100% 50%, 100% 100%, 0% 100%)",
              boxSizing: "border-box",
            }}
            onClick={() => {
              sfxSelect.play();
              setTab("characters");
            }}
          >
            Characters
          </div>
          <div
            className={`mr-2 p-[0.4%] px-4 py-2 ${
              tab === "outfits" ? "bg-sky-600" : "bg-[#19191A]"
            } hover:bg-sky-600 text-white flex items-center justify-center`}
            style={{
              clipPath: "polygon(0% 0%, 80% 0, 100% 50%, 100% 100%, 0% 100%)",
              boxSizing: "border-box",
            }}
            onClick={() => {
              sfxSelect.play();
              setTab("outfits");
            }}
          >
            Outfits
          </div>
        </div>
        {tab === "characters" ? (
          <>
            <div className="z-10 w-full h-min p-4 bg-[#19191A] grid grid-flow-col auto-cols-max overflow-x-auto scroll-smooth">
              {ListCharacterExample.data.map((i, k) => (
                <div className="mr-4" key={k}>
                  <OutfitItems onClickFunc={changeCharacter} pathImg={i.pathImg} />
                </div>
              ))}
            </div>
            <div className="w-full h-min px-2 md:px-10 py-2 text-gray-500 flex flex-row justify-between">
              <div className="bg-sky-500 rounded-xl px-2 py-1 text-white">
                <p>All</p>
              </div>
              <div className="rounded-xl px-2 py-1 border text-gray-500">
                <p>Male</p>
              </div>
              <div className="rounded-xl px-2 py-1 border text-gray-600">
                <p>Female</p>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        {tab === "outfits" ? (
          <>
            <div className="z-10 w-full h-min p-4 bg-[#19191A] grid grid-flow-col auto-cols-max overflow-x-auto scroll-smooth">
              {skins.map((i, k) => (
                <div className="mr-4" key={k}>
                  <OutfitItems onClickFunc={() => ChangeSkin(i._id)} pathImg={i.pathImg} />
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
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default WardrobeMobile;

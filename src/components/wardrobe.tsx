import { FC, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { LoadCharacter, LoadRoom, LoadSkin, LoadTest } from "../lib/fbxLoaders";
import Stats from "three/examples/jsm/libs/stats.module";

//====================== start ui icon component ======================//
import { ArrowLongLeftIcon, HomeIcon, MagnifyingGlassIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import ListOutfitExample from "../models/ListOutfit.example";
import AccessoriesIcon from "./wardrobe/icons/AccessoriesIcon";
import AllCategoryIcon from "./wardrobe/icons/AllCategoryIcon";
import BodyIcon from "./wardrobe/icons/BodyIcon";
import HeadsIcon from "./wardrobe/icons/HeadsIcon";
import ShoesIcon from "./wardrobe/icons/ShoesIcon";
import TrousersIcon from "./wardrobe/icons/TrousersIcon";
//====================== end ui icon component ======================//
import { GameContext } from "../contexts/GameContexts";
import { OutfitItems } from "./wardrobe/OutfitItems";

//====================== Cannon Js Gravity ======================//
import * as CANNON from "cannon-es";
import { Lighting } from "./lighting";
import { Female, Male } from "./wardrobe/icons/CharacterIcon";

export interface iSkins {
  _id: string;
  name: string;
  type: string;
  pathImg: string;
  model: THREE.SkinnedMesh;
}
const Wardrobe: FC = () => {
  const [navActive, setNavActive] = useState<string>("all");
  const refBody = useRef<HTMLDivElement>(null);
  const [scene] = useState(new THREE.Scene());
  const [camera] = useState(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const [renderer] = useState(new THREE.WebGLRenderer({ antialias: true, alpha: true }));

  //======================= start initial game context =======================//
  const [loading, setLoading] = useState<number>(100);
  const [animationAction, setAnimationAction] = useState<THREE.AnimationAction[]>([]);
  const [activeAction, setActiveAction] = useState<THREE.AnimationAction | undefined>();
  const [lastAction, setLastAction] = useState<THREE.AnimationAction | undefined>();
  //======================= end initial game context =======================//
  let mixer: THREE.AnimationMixer;
  let CharacterMesh: THREE.Object3D<THREE.Event>;
  let CharacterBody: CANNON.Body;
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
        setL(false);
      },
      (err) => console.log(err)
    );
  };

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
    let req: any = null;
    const clock = new THREE.Clock();
    camera.position.set(0, 1.5, 2.5);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.domElement
    refBody.current?.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);
    // lights
    Lighting(scene);
    LoadRoom(scene, "/assets/env/room_test.fbx");
    LoadCharacter(scene, "/assets/characters/chara_girl_ou1_test.fbx", (xhr) => {
      setP((xhr.loaded / xhr.total) * 100);
    }).then((model) => {
      mixer = new THREE.AnimationMixer(model);
      scene.add(model);
      LoadAnimation("/assets/animations/orc_Idle.fbx");
      // LoadAnimation("/assets/animations/damba_dancing.fbx");
      animate();
    });

    const stats = Stats();
    // stats.domElement.style.cssText = "position:absolute;top:0rem;left:0px;z-index:200px";
    document.body.appendChild(stats.domElement);
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.minPolarAngle = controls.maxPolarAngle = 1.37079;
    controls.minDistance = 1;
    controls.maxDistance = 3;
    controls.target.set(0, 1, 0);
    controls.update();

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

  const [skins, setSkins] = useState<iSkins[]>([]);
  const [filterSkins, setFilterSkins] = useState<iSkins[]>([]);

  const loadAllSkin = () => {
    ListOutfitExample.data.map((i) =>
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

  const FilterSkinsByTab = (type: string): iSkins[] => {
    if (type === "all") return skins;
    const fSkins = skins.filter((f) => f.type.includes(type));
    return fSkins;
  };

  useEffect(() => {
    loadAllSkin();
  }, []);

  const ChangeSkin = (_id: string) => {
    const findSkin = skins.find((f) => f._id === _id);
    if (findSkin) {
      scene.children.map((c) => {
        if (c.name === "character-female") {
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

  const [l, setL] = useState<boolean>(true);
  const [p, setP] = useState<number>(0);

  const [characterActive, setCharacterActive] = useState<string>("female");

  return (
    <GameContext.Provider
      value={{
        loading,
        setLoading,
        animationAction,
        setAnimationAction,
        activeAction,
        setActiveAction,
        lastAction,
        setLastAction,
      }}
    >
      <div
        className={`${
          l ? `` : `hidden`
        } fixed top-0 left-0 w-screen h-screen bg-black flex items-center justify-center`}
        style={{ zIndex: 99 }}
      >
        <div className="w-[60%] h-3 border rounded-2xl relative">
          <div
            className={`h-full transition-all duration-1000 bg-blue-600 rounded-2xl top-0`}
            style={{ width: `${p}%` }}
          />
          <p className="text-center font-normal text-xs mt-1 text-white">download assets</p>
        </div>
      </div>
      <div className="h-screen w-screen relative flex flex-row items-center justify-between top-0 z-50">
        {/* {===================== unity game ======================} */}
        <div className="h-full w-full absolute z-0 overflow-hidden bg-[#36363B]" ref={refBody}>
          {/* <Unity unityProvider={unityProvider} tabIndex={1} devicePixelRatio={1} className="h-full w-full bg-[#232325]" /> */}
        </div>
        {/* {===================== end unity game ======================} */}

        {/* {===================== header ======================} */}
        <header
          className={`z-10 w-full bg-navbartop h-[8%] bg-cover bg-no-repeat p-[0.5%] absolute top-0 left-0 flex flex-row justify-between`}
          style={{ backgroundSize: "100% 100%" }}
        >
          <div className="w-[6%] h-full flex items-center justify-center">
            <ArrowLongLeftIcon
              onClick={() => window.close()}
              className="mx-auto w-8 h-8 cursor-pointer text-white hover:text-sky-600"
            />
          </div>
          <div className="w-[22%] h-full flex flex-row items-center justify-between">
            <div className="w-min h-full flex flex-row items-center">
              <div className="h-6 w-6 lg:h-9 lg:w-9 py-1 px-1 lg:px-2 flex items-center justify-center">
                <ShoppingCartIcon className="h-full cursor-pointer text-white hover:text-sky-600" />
              </div>
              <div className="h-5 border-r"></div>
              <div className="h-6 w-6 lg:h-9 lg:w-9 py-1 px-1 lg:px-2 flex items-center justify-center">
                <HomeIcon className="h-full cursor-pointer text-white hover:text-sky-600" />
              </div>
              <div className="h-5 border-r"></div>
            </div>
            <div className="flex-1 h-full flex flex-row items-center justify-end text-white pb-[1%]">
              <p className="mr-2 text-sm lg:text-lg">Apuy Stereo</p>
              <div className="h-6 w-6 lg:h-10 lg:w-10 rounded-full bg-orange-500 border border-white"></div>
            </div>
          </div>
        </header>
        {/* {===================== end header ======================} */}

        {/* {===================== inventory panel ======================} */}
        <div
          className={`z-50 [transform:perspective(1000px)_rotateY(15deg)] h-[34vw] w-[23%] ml-10 bg-inventory bg-cover bg-no-repeat relative flex flex-col justify-end px-[1%] pb-[1%] pt-[1.6%]`}
          style={{ backgroundSize: "100% 100%" }}
        >
          <div
            className="bg-categorybar bg-cover bg-center w-full h-[10%] mt-[3%] flex flex-row items-center justify-center"
            style={{ backgroundSize: "100% 100%" }}
          >
            <AllCategoryIcon
              className={`my-auto h-[50%] mr-[4%] cursor-pointer hover:fill-sky-600 ${
                navActive === `all` ? `fill-sky-500` : `fill-white`
              }`}
              onClick={() => setNavActive("all")}
            />
            <AccessoriesIcon
              className={`my-auto h-[50%] mr-[4%] cursor-pointer hover:fill-sky-600 ${
                navActive === `accessories_` ? `fill-sky-500` : `fill-white`
              }`}
              onClick={() => setNavActive("accessories_")}
            />

            <HeadsIcon
              className={`my-auto h-[50%] mr-[4%] cursor-pointer hover:fill-sky-600 ${
                navActive === `hair_` ? `fill-sky-500` : `fill-white`
              }`}
              onClick={() => setNavActive("hair_")}
            />
            <BodyIcon
              className={`my-auto h-[50%] mr-[4%] cursor-pointer hover:fill-sky-600 ${
                navActive === `tshirt_` ? `fill-sky-500` : `fill-white`
              }`}
              onClick={() => setNavActive("tshirt_")}
            />
            <TrousersIcon
              className={`my-auto h-[50%] mr-[4%] cursor-pointer hover:fill-sky-600 ${
                navActive === `pants_` ? `fill-sky-500` : `fill-white`
              }`}
              onClick={() => setNavActive("pants_")}
            />
            <ShoesIcon
              className={`my-auto h-[50%] cursor-pointer hover:fill-sky-600 ${
                navActive === `shoes_` ? `fill-sky-500` : `fill-white`
              }`}
              onClick={() => setNavActive("shoes")}
            />
          </div>
          <div className="w-full h-[8%] my-[3%] flex flex-row text-gray-400">
            <button className="bg-sky-600 p-[2%] rounded mr-[1%]">
              <MagnifyingGlassIcon className="h-full w-full" />
            </button>
            <input
              className="w-full h-full rounded-md border border-sky-600 bg-transparent focus:outline-non"
              type="text"
              name="search"
            />
          </div>
          <div
            className="w-full h-[70%] overflow-y-auto scroll-smooth bg-inventoryinner0 bg-cover p-[5%] grid grid-cols-3 gap-x-4 gap-y-3 scrolls"
            style={{ backgroundSize: "100% 100%" }}
          >
            {FilterSkinsByTab(navActive).map((i, k) => {
              return (
                <div key={k}>
                  <OutfitItems onClickFunc={() => ChangeSkin(i._id)} pathImg={i.pathImg} />
                </div>
              );
            })}
          </div>
        </div>
        {/* {===================== end inventory panel ======================} */}

        {/* {===================== information panel ======================} */}
        <div
          className={`h-[32vw] [transform:perspective(1000px)_rotateY(-15deg)] w-[22%] mr-10 z-10 relative flex flex-col`}
        >
          <div className="absolute -left-[35%] bottom-[16%] z-50 rounded p-2 text-white flex flex-row-reverse">
            <div
              className="bg-sky-600 shadow-2xl p-2 rounded-xl cursor-pointer"
              onClick={() => setCharacterActive((c) => (c === "female" ? "male" : "female"))}
            >
              {characterActive === "female" ? <Female w="40" h="40" /> : <Male w="40" h="40" />}
            </div>
            <div className="mr-2">
              {characterActive === "female" ? <Male w="20" h="20" /> : <Female w="20" h="20" />}
            </div>
          </div>
          <div
            className="flex-1 w-full bg-information bg-cover bg-no-repeat flex flex-col justify-end"
            style={{ backgroundSize: "100% 100%" }}
          >
            <div className="w-full h-[80%] flex flex-col pl-[12%]">
              <div className="w-full flex-1 text-white flex flex-row items-center mt-[10%]">
                <div className="h-[80%] w-[15%] flex justify-center items-center rounded-[20%] bg-sky-600 p-[3%]">
                  <AccessoriesIcon className="fill-white" onClick={() => null} />
                </div>
                <div className="h-full text-[50%] lg:text-[80%] flex flex-col justify-center ml-2">
                  <p>Blue Light Domination</p>
                  <p className="text-gray-500">Common 50%</p>
                </div>
              </div>
              <div className="w-full flex-1 text-white flex flex-row items-center">
                <div className="h-[80%] w-[15%] flex justify-center items-center rounded-[20%] bg-sky-600 p-[3%]">
                  <HeadsIcon className="fill-white" onClick={() => null} />
                </div>
                <div className="h-full text-[50%] lg:text-[80%] flex flex-col justify-center ml-2">
                  <p>Blue Light Domination</p>
                  <p className="text-blue-500">Common 50%</p>
                </div>
              </div>
              <div className="w-full flex-1 text-white flex flex-row items-center">
                <div className="h-[80%] w-[15%] flex justify-center items-center rounded-[20%] bg-sky-600 p-[3%]">
                  <BodyIcon className="fill-white" onClick={() => null} />
                </div>
                <div className="h-full text-[50%] lg:text-[80%] flex flex-col justify-center ml-2">
                  <p>Blue Light Domination</p>
                  <p className="text-orange-500">Common 50%</p>
                </div>
              </div>
              <div className="w-full flex-1 text-white flex flex-row items-center">
                <div className="h-[80%] w-[15%] flex justify-center items-center rounded-[20%] bg-sky-600 p-[3%]">
                  <TrousersIcon className="fill-white" onClick={() => null} />
                </div>
                <div className="h-full text-[50%] lg:text-[80%] flex flex-col justify-center ml-2">
                  <p>Blue Light Domination</p>
                  <p className="text-pink-500">Common 50%</p>
                </div>
              </div>
              <div className="w-full flex-1 text-white flex flex-row items-center mb-[10%]">
                <div className="h-[80%] w-[15%] flex justify-center items-center rounded-[20%] bg-sky-600 p-[3%]">
                  <ShoesIcon className="fill-white" onClick={() => null} />
                </div>
                <div className="h-full text-[50%] lg:text-[80%] flex flex-col justify-center ml-2">
                  <p>Blue Light Domination</p>
                  <p className="text-purple-500">Common 50%</p>
                </div>
              </div>
            </div>
          </div>
          <button
            className="w-full h-[14%] mt-[3%] bg-information-button text-white hover:text-sky-600 font-days-one text-[1.7vw] focus:outline-none"
            style={{ backgroundSize: "100% 100%" }}
          >
            Save
          </button>

          {/* {===================== end information panel ======================} */}
        </div>
      </div>
    </GameContext.Provider>
  );
};

export default Wardrobe;

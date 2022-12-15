import { FC, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { LoadRoom, LoadSkin } from "../lib/fbxLoaders";

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
import { LightingV2 } from "./lighting";
import { Female, Male } from "./wardrobe/icons/CharacterIcon";
import { iAnimation, iCharacter, iDataAnimation, iDataCharacter, iMixer, iSkins } from "./wardrobe.interface";
import { LoadCharacter } from "../lib/CharacterLoader";
import ListCharacterExample from "../models/ListCharacter.example";

const Wardrobe: FC = () => {
  const [navActive, setNavActive] = useState<string>("all");
  const refBody = useRef<HTMLDivElement>(null);
  const [scene] = useState(new THREE.Scene());
  const [camera] = useState(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const [renderer] = useState(
    new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
  );
  //======================= start initial game context =======================//
  const [loading, setLoading] = useState<number>(100);
  const [skins, setSkins] = useState<iSkins[]>([]);
  const [filterSkins, setFilterSkins] = useState<iSkins[]>([]);
  const [characterActive, setCharacterActive] = useState<string>("character-male");
  const videoElement = useRef<HTMLVideoElement>(null);
  const [Animation, SetAnimation] = useState<THREE.Group>();
  const [animationIsReady, setAnimationIsReady] = useState<boolean>(false);
  let mixers: THREE.AnimationMixer[] = [];

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

  const [listCharacter, setListCharacter] = useState<iCharacter[]>([]);
  let req: any = null;
  const clock = new THREE.Clock();
  let stats: Stats = Stats();
  useEffect(() => {
    LoadAnimation("/assets/animations/orc_idle.fbx");
  }, []);

  useEffect(() => {
    if (animationIsReady) {
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMappingExposure = 0;
      refBody.current?.appendChild(renderer.domElement);
      camera.position.set(0, 3, 1.8);
      // lights
      LightingV2(scene);

      ListCharacterExample.data.map((chara, idx) => {
        LoadCharacter(chara).then((model) => {
          model.position.set(-0.19, 0.25, 0);
          const data: iCharacter = {
            _id: `${Math.random()}`,
            name: chara.name,
            pathImg: chara.pathImg,
            model: model,
          };
          setListCharacter((old) => [...old, data]);
          model.name = chara.name;
          const mixer = new THREE.AnimationMixer(model);
          const animAct = mixer.clipAction((Animation as THREE.Object3D).animations[0]);
          animAct.timeScale = 1;
          animAct.play();
          mixers.push(mixer);
          console.log(model);

          if (chara.isActive) scene.add(model);
          if (idx + 1 === ListCharacterExample.data.length) animate();
        });
      });

      if (videoElement) {
        LoadRoom(scene, "/assets/env/room_v2/room-fix.fbx", videoElement.current);
      }
    }
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.minPolarAngle = controls.maxPolarAngle = 1.41079;
    controls.minDistance = 1;
    controls.maxDistance = 3;
    controls.target.set(0, 1, 0);
    controls.update();

    function animate() {
      const delta = clock.getDelta();
      for (const m of mixers) m.update(delta);
      stats.update();
      renderer.render(scene, camera);
      req = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(req);
    };
  }, [animationIsReady]);

  const handleWindowResize = useCallback(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, [renderer]);

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

  const FilterSkinsByTab = (type: string): iSkins[] => {
    if (type === "all") return skins;
    const fSkins = skins.filter((f) => f.type.includes(type));
    return fSkins;
  };

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

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize, false);
    return () => {
      window.removeEventListener("resize", handleWindowResize, false);
    };
  }, [renderer, handleWindowResize]);

  const ChangeChara = () => {
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

  return (
    <GameContext.Provider value={{ loading, setLoading }}>
      <video id="video" loop muted crossOrigin="anonymous" playsInline ref={videoElement} style={{ display: "none" }}>
        <source src="/videoPortfolio.mp4" />
      </video>
      {/* <video src="/video-math.mp4" className="bg-red-500" style={{ display: "none" }} loop autoPlay playsInline></video> */}
      {/* <div
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
      </div> */}
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
          <div
            className="flex-1 w-full bg-information bg-cover bg-no-repeat flex flex-col justify-end relative"
            style={{ backgroundSize: "100% 100%" }}
          >
            <div
              className="absolute bg-sky-600 w-[15%] h-[12%] -left-[19%] bottom-[0%] z-50 rounded p-2 text-white flex items-center justify-center cursor-pointer"
              onClick={ChangeChara}
            >
              {characterActive.includes("character-female") ? <Female w="40" h="40" /> : <Male w="40" h="40" />}
            </div>
            <div className="absolute w-[15%] h-[11%] -left-[35%] bottom-[5%] z-50 rounded p-2 text-white flex items-center justify-center">
              {characterActive.includes("character-female") ? <Male w="40" h="40" /> : <Female w="40" h="40" />}
            </div>
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

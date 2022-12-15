import { iDataCharacter } from "../components/wardrobe.interface";

class ListCharacterExample {
  public data: iDataCharacter[] = [
    {
      name: "character-male-chara",
      path: "/assets/characters/male/chibi_male_all_local.fbx",
      pathImg: "/images/item/hair/hair_girl_ou1.png",
      textures: {
        eye: { path: "/assets/characters/eye-1.png" },
        skin: { path: "/assets/characters/male/skin_chibi_male.png" },
        outfit: { path: "/assets/characters/male/outfit1_male.png" },
      },
      isActive: true,
    },
    {
      name: "character-female-chara",
      path: "/assets/characters/female/chibi_female_local.fbx",
      pathImg: "/images/item/accessories/acc_ou1.png",
      textures: {
        eye: { path: "/assets/characters/eye-1.png" },
        skin: { path: "/assets/characters/female/skin_chibi.png" },
        outfit: { path: "/assets/characters/female/texture_ou1_op.png" },
      },
      isActive: false,
    },
  ];
}

export default new ListCharacterExample();

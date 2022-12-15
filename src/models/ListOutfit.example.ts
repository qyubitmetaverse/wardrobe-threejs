interface iListOutfit {
  _id: string;
  name: string;
  type: string;
  pathModel: string;
  pathTexture: string;
  pathImg: string;
}

class ListOutfit {
  public outfitFemale: iListOutfit[] = [
    //outfit girl 01
    {
      _id: `${new Date().getTime()}`,
      name: "glases outfit satu",
      type: "accessories_",
      pathModel: "/assets/skins/outfit_01/accessories_acc_girl_ou1.fbx",
      pathTexture: "/assets/skins/outfit_01/texture_ou1_op.png",
      pathImg: "/images/item/accessories/acc_ou1.png",
    },
    {
      _id: `${new Date().getTime()}`,
      name: "hair outfit satu",
      type: "hair_",
      pathModel: "/assets/skins/outfit_01/hair_girl_ou1.fbx",
      pathTexture: "/assets/skins/outfit_01/texture_ou1_op.png",
      pathImg: "/images/item/hair/hair_girl_ou1.png",
    },
    {
      _id: `${new Date().getTime()}`,
      name: "tshirt outfit satu",
      type: "tshirt_",
      pathModel: "/assets/skins/outfit_01/tshirt_girl_ou1.fbx",
      pathTexture: "/assets/skins/outfit_01/texture_ou1_op.png",
      pathImg: "/images/item/tshirt/tshirt_girl_ou1.png",
    },
    {
      _id: `${new Date().getTime()}`,
      name: "pants outfit satu",
      type: "pants_",
      pathModel: "/assets/skins/outfit_01/pants_girl_ou1.fbx",
      pathTexture: "/assets/skins/outfit_01/texture_ou1_op.png",
      pathImg: "/images/item/pants/pants_girl_ou1.png",
    },
    {
      _id: `${new Date().getTime()}`,
      name: "shoes outfit satu",
      type: "shoes_",
      pathModel: "/assets/skins/outfit_01/shoes_girl_ou1.fbx",
      pathTexture: "/assets/skins/outfit_01/texture_ou1_op.png",
      pathImg: "/images/item/shoes/shoes_ou1.png",
    },
    //outfit girl 03
    {
      _id: `${new Date().getTime()}`,
      name: "masker outfit satu",
      type: "accessories_",
      pathModel: "/assets/skins/outfit_03/accessories_acc_ou3.fbx",
      pathTexture: "/assets/skins/outfit_03/Outfit3.png",
      pathImg: "/images/item/accessories/acc_ou3.png",
    },
    {
      _id: `${new Date().getTime()}`,
      name: "hair outfit satu",
      type: "hair_",
      pathModel: "/assets/skins/outfit_03/hair_girl_ou3.fbx",
      pathTexture: "/assets/skins/outfit_03/Outfit3.png",
      pathImg: "/images/item/hair/hair_girl_ou3.png",
    },
    {
      _id: `${new Date().getTime()}`,
      name: "tshirt outfit satu",
      type: "tshirt_",
      pathModel: "/assets/skins/outfit_03/tshirt_girl_ou3.fbx",
      pathTexture: "/assets/skins/outfit_03/Outfit3.png",
      pathImg: "/images/item/tshirt/tshirt_girl_ou3.png",
    },
    {
      _id: `${new Date().getTime()}`,
      name: "pants outfit satu",
      type: "pants_",
      pathModel: "/assets/skins/outfit_03/pants_girl_ou3.fbx",
      pathTexture: "/assets/skins/outfit_03/Outfit3.png",
      pathImg: "/images/item/pants/pants_girl_ou3.png",
    },
    {
      _id: `${new Date().getTime()}`,
      name: "shoes outfit satu",
      type: "shoes_",
      pathModel: "/assets/skins/outfit_03/shoes_ou3.fbx",
      pathTexture: "/assets/skins/outfit_03/Outfit3.png",
      pathImg: "/images/item/shoes/shoes_ou3.png",
    },
  ];

  public outfitMale: iListOutfit[] = [];
}

export default new ListOutfit();

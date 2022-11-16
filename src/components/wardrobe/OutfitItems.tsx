import Image from "next/image";
import { FC } from "react";

export const OutfitItems: FC<{ pathImg: string; onClickFunc: () => void }> = ({ pathImg, onClickFunc }) => {
  return (
    <div
      className="group relative aspect-square w-full cursor-pointer rounded-[15%] border-[0.25px] border-white bg-gradient-to-tr from-white/50 to-white/0 mx-auto p-[4%] focus:border-[0.5px]"
      onClick={onClickFunc}
    >
      <Image src={pathImg} height={100} width={100} alt="img" className="object-cover" />
      <div className="invisible absolute inset-0 h-full w-full rounded-[15%] bg-gradient-to-tr from-cyan-300/50 to-white/0 group-hover:visible"></div>
    </div>
  );
};

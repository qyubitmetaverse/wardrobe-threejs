import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WardrobeComponent = dynamic(() => import("../../components/wardrobe"), {
  ssr: false,
  loading: () => <div>LOADING...</div>,
});

const WardrobeMobile = dynamic(() => import("../../components/wardrobeMobile"), {
  ssr: false,
  loading: () => <div>LOADING...</div>,
});

const Play: NextPage = () => {
  const [loading, setLoading] = useState<string>("0%");
  const changeLoading = () => {
    if (parseInt(loading) <= 99) setLoading((l) => `${parseInt(l) + 10}%`);
  };

  return (
    <div className="w-screen h-screen">
      {/* <WardrobeMobile /> */}
      <WardrobeComponent />{" "}
      {/* <div className="w-[60%] h-3 border rounded-2xl relative" onClick={changeLoading}>
        <div
          className={`h-full transition-all duration-1000 bg-blue-600 rounded-2xl top-0`}
          style={{ width: loading }}
        />
        <p className="text-center font-normal text-xs mt-1">download assets/character</p>
      </div> */}
    </div>
  );
};

export default Play;

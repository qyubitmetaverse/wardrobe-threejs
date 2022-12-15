import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WardrobeMobile = dynamic(() => import("../../components/wardrobeMobile"), {
  ssr: false,
  loading: () => <div>LOADING...</div>,
});

const Mobile: NextPage = () => {
  const [loading, setLoading] = useState<string>("0%");
  const changeLoading = () => {
    if (parseInt(loading) <= 99) setLoading((l) => `${parseInt(l) + 10}%`);
  };

  return (
    <div className="w-screen h-screen">
      <WardrobeMobile />
    </div>
  );
};

export default Mobile;

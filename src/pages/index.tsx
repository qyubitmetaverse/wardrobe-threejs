import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import screenfull from "screenfull";

const WardrobeComponent = dynamic(() => import("../components/wardrobe"), {
  ssr: false,
  loading: () => <div>LOADING...</div>,
});

const Home: NextPage = () => {
  const [or, setOr] = useState<string | null>(null);
  const updateOrientation = (type: any) => {
    console.log(type);
    setOr(type);
  };
  const router = useRouter();
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      <div className={` flex items-center justify-center flex-col`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-24 h-24 rotate text-red-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
          />
        </svg>
        <div className="text-center py-2">
          <p>Anda berada dalam Mode Depelopment!!</p>
          <p>Sementara untuk perangkat mobile belum tersedia</p>
        </div>
      </div>

      <button
        onClick={(e) => {
          const d = document.documentElement as any;
          d.webkitRequestFullScreen();
          router.push("/play");
        }}
        className={`p-2 rounded-md bg-purple-500 text-white font-bold`}
      >
        Play Three Js
      </button>
    </div>
  );
};

export default Home;

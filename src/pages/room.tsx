import type { NextPage } from "next";
import dynamic from "next/dynamic";

const RoomComponent = dynamic(() => import("../components/room"), {
  ssr: false,
  loading: () => <div>LOADING...</div>,
});

const Room: NextPage = () => {
  return (
    <div className="w-screen h-screen">
      <RoomComponent />{" "}
    </div>
  );
};

export default Room;

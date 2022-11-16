import { useState, useEffect } from "react";

const getOrientation = () => window.screen.orientation.type;
const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState(getOrientation());

  const updateOrientation = (event: Event) => {
    setOrientation(getOrientation());
  };

  useEffect(() => {
    window.screen.orientation.addEventListener("change", updateOrientation);
    return () => {
      window.screen.orientation.removeEventListener("change", updateOrientation);
    };
  }, []);

  return orientation;
};

export default useScreenOrientation;

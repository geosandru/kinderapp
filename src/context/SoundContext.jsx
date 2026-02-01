import { createContext, useContext, useEffect, useRef } from "react";
import clickSound from "../assets/sounds/click.mp3";
import startSound from "../assets/sounds/start.mp3";
import stopSound from "../assets/sounds/stop.mp3";
import errorSound from "../assets/sounds/error.mp3";

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const sounds = useRef({});

  useEffect(() => {
    sounds.current = {
      click: new Audio(clickSound),
      start: new Audio(startSound),
      stop: new Audio(stopSound),
      error: new Audio(errorSound)
    };

    Object.values(sounds.current).forEach(a => {
      a.preload = "auto";
      a.volume = 0.5;
    });
  }, []);

  function play(name) {
    const s = sounds.current[name];
    if (!s) return;
    s.currentTime = 0;
    s.play();
  }

  return (
    <SoundContext.Provider value={{ play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}

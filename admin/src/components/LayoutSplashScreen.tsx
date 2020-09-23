import React, {createContext, useContext, useState, useEffect} from "react";

const SplashScreenContext = createContext({} as any);

export function SplashScreenProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  let visible = count > 0;

  useEffect(() => {
    const splashScreen = document.getElementById("splash-screen");

    // Show SplashScreen
    if (splashScreen && visible) {
      splashScreen.classList.remove("hidden");

      return () => {
        splashScreen.classList.add("hidden");
      };
    }

    // Hide SplashScreen
    let timeout: number
    if (splashScreen && !visible) {
      timeout = window.setTimeout(() => {
        splashScreen.classList.add("hidden");
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [visible]);

  return (
    <SplashScreenContext.Provider value={setCount}>
      {children}
    </SplashScreenContext.Provider>
  );
}

export function LayoutSplashScreen({ visible = true }) {
  // Everything is ready - remove splashscreen
  const setCount = useContext(SplashScreenContext);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCount((prev: number) => {
      return prev + 1;
    });

    return () => {
      setCount((prev: number) => {
        return prev - 1;
      });
    };
  }, [setCount, visible]);

  return null;
}

import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { BsFillSunFill } from "react-icons/bs";

interface Prop {
  navbar: boolean;
}

const ThemeToggle = ({ navbar }: Prop) => {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") ?? "light"
  );

  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {navbar ? (
        <button
          className="blue-button active:scale-90 duration-100 p-3 rounded-full transition"
          onClick={handleClick}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      ) : (
        <button
          className="flex md:hidden items-center gap-2 font-medium text-sm bg-white drop-shadow-[0_0px_3px_rgba(0,0,0,0.35)] p-3 rounded-full bottom-0 z-50"
          onClick={handleClick}
        >
          {theme === "light" ? (
            <>
              <FaMoon className="h-full w-4" />
            </>
          ) : (
            <>
              <BsFillSunFill className="h-full w-4" />
            </>
          )}
        </button>
      )}
    </>
  );
};

export default ThemeToggle;

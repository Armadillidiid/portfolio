import React, { useState } from "react";
import { FaBars, FaMoon } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav
      className="flex bg-white/50 max-w-min rounded-full top-5 flex-col md:flex-row justify-center p-2 fixed backdrop-blur-[8px] shadow-[0_0_3px_rgba(0,0,0,0.3)] z-10
     "
    >
      <button
        className="flex md:hidden justify-self-end self-end"
        onClick={() => setToggle((prevState) => !prevState)}
      >
        <FaBars />
      </button>
      <ul
        className={`md:flex flex-col ${
          toggle ? "flex" : "hidden"
        } md:flex-row gap-2 md:gap-16 justify-center items-center text-sm font-normal
          `}
      >
        <li>
          <button className="bg-blue-500 p-3 rounded-full text-white">
            <FaMoon />
          </button>
        </li>
        <li>About</li>
        <li>Portfolio</li>
        <li>Skills</li>
        <li>Resume</li>
        <li>
          <button className="bg-blue-500 py-2 px-3 rounded-full text-white">
            Contact
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

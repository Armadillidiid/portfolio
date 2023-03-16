import React, { useState } from "react";
import { FaBars, FaMoon } from "react-icons/fa";
const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav>
      <div className="flex flex-col md:flex-row justify-center bg-neutral-300 p-2">
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
            <button className="bg-blue-500 p-2 rounded-full text-white">
              <FaMoon />
            </button>
          </li>
          <li>About Me</li>
          <li>Portfolio</li>
          <li>Skills</li>
          <li>Resume</li>
          <li>
            <button className="bg-blue-500 py-2 px-3 rounded-full text-white">
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

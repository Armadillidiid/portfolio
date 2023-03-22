import React, { useState, useEffect } from "react";
import { FaBars, FaMoon } from "react-icons/fa";
import { Link, scrollSpy } from "react-scroll";
import ThemeToggle from "./sub-components/ThemeToggle";

const Navbar: React.FC = () => {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    scrollSpy.update();
  }, []);

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
          <ThemeToggle />
        </li>
        <li className="cursor-pointer">
          <Link to="about" spy={true} smooth={true} offset={0} duration={500}>
            About
          </Link>
        </li>
        <li className="cursor-pointer">
          <Link
            to="projects"
            spy={true}
            smooth={true}
            offset={0}
            duration={500}
          >
            Projects
          </Link>
        </li>
        <li className="cursor-pointer">
          <Link to="skills" spy={true} smooth={true} offset={0} duration={500}>
            Skills
          </Link>
        </li>
        <li>
          <button className="bg-blue-500 py-2 px-3 rounded-full text-white">
            <Link
              to="contact"
              spy={true}
              smooth={true}
              offset={0}
              duration={500}
            >
              Contact
            </Link>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

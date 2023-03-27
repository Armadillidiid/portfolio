import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import {GrClose} from "react-icons/gr";
import { Link, scrollSpy } from "react-scroll";
import ThemeToggle from "./sub-components/ThemeToggle";

const Navbar: React.FC = () => {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    scrollSpy.update();
  }, []);

  return (
    <nav
      className={`navbar ${toggle ? "rounded-3xl p-4 bg-white/20 md:bg-white  backdrop-blur w-full" : "rounded-full p-3 bg-white dark:bg-blue-500"}`}
    >
      <button
        className="flex md:hidden"
        onClick={() => setToggle((prevState) => !prevState)}
      >
        {!toggle ? <FaBars className="" /> : <GrClose className="mb-6" />}
      </button>
      <ul
        className={`md:flex flex-col ${
          toggle ? "flex w-full" : "hidden"
        } md:flex-row gap-3 dark:text-white md:gap-16 justify-center items-center text-sm 
          `}
      >
        <li className="hidden md:flex">
          <ThemeToggle navbar={true} />
        </li>
        <li className="hover:scale-105 md:hover:scale-[1.2] transition navbar-item">
          <Link to="about" spy={true} smooth={true} offset={0} duration={500}>
            About
          </Link>
        </li>
        <li className="hover:scale-105 md:hover:scale-[1.2] transition navbar-item">
          <Link
            to="projects"
            spy={true}
            smooth={true}
            offset={0}
            duration={500}
          >
            Project
          </Link>
        </li>
        <li className="hover:scale-105 md:hover:scale-[1.2] transition navbar-item">
          <Link to="skills" spy={true} smooth={true} offset={0} duration={500}>
            Skills
          </Link>
        </li>
        <li className={`w-full ${toggle ?? "dark:text-black"}`}>
          <button className={`blue-button duration-100 w-full active:scale-95 py-2 px-3 rounded-2xl md:rounded-full text-white dark:text-black md:text-white md:dark:text-white`}>
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

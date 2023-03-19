import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import SectionDescription from "./sub-components/SectionDescription";
import SectionTitle from "./sub-components/SectionTitle";

const Project = () => {
  const data = [
    {
      name: "React-Game-Store",
      image: "src/images/react-game-store.png",
      stack: ["React", "Firebase", "Tailwind"],
      previewURL: "https://armadillidiid.github.io/react-game-store/",
      codeURL: "https://github.com/Armadillidiid/react-game-store",
      description:
        "Led the redesign of our Concierge dispatching tool to assist healthcare riders, standardized components to be used across our family of Lyft Business products, assisted with interviewing and hiring committees, and co-chaired internal design mentorship program.",
    },
    {
      name: "Rumble",
      image: "src/images/rumble.png",
      stack: ["Python", "Django", "PostgreSQL"],
      previewURL: "https://rumble-eats.live/",
      codeURL: "https://github.com/Armadillidiid/food-delivery-ecommerce",
      description:
        "Led the redesign of our Concierge dispatching tool to assist healthcare riders, standardized components to be used across our family of Lyft Business products, assisted with interviewing and hiring committees, and co-chaired internal design mentorship program.",
    },
    {
      name: "CV Application(Maker)",
      image:
        "https://raw.githubusercontent.com/Armadillidiid/cv-application/main/cv-application-gif.gif",
      stack: ["React", "Tailwind", "DaisyUI"],
      previewURL: "https://armadillidiid.github.io/cv-application/",
      codeURL: "https://github.com/Armadillidiid/cv-application",
      description:
        "Led the redesign of our Concierge dispatching tool to assist healthcare riders, standardized components to be used across our family of Lyft Business products, assisted with interviewing and hiring committees, and co-chaired internal design mentorship program.",
    },
  ];

  const ProjectList = data.map((project, index) => {
    return (
      <div className="flex flex-col first:mt-24">
        <div className="grid grid-cols-12 gap-12">
          <div
            className={`col-span-6 flex flex-col gap-1 justify-evenly font-light text-lg ${
              index % 2 === 0 ? "order-first" : "order-last"
            }`}
          >
            <div className="flex flex-col gap-2">
              <span className="font-bold text-3xl mb-1">{project.name}</span>
              <ul className="flex gap-1 list-inside list-disc font-medium">
                {project.stack.map((item) => (
                  <li>{item}</li>
                ))}
              </ul>
            </div>
            <p>{project.description}</p>
            <div className="flex gap-10 mt-8 font-bold">
              <a
                href={project.previewURL}
                target={"_blank"}
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <span className="relative uppercase ButtonText">
                  Live Preview
                </span>
                <BsArrowUpRight className="stroke-1" />
              </a>
              <a
                href={project.codeURL}
                target={"_blank"}
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <span className="relative uppercase ButtonText">View Code</span>
                <BsArrowUpRight className="stroke-1" />
              </a>
            </div>
          </div>
          <a
            href={project.previewURL}
            className={`col-span-6 rounded-3xl hover:scale-[1.03] transition-transform duration-200 project-link font-medium`}
            data-text={project.name}
          >
            <img
              src={project.image}
              alt={project.name}
              className="rounded-3xl drop-shadow-[0_0_10px_rgba(0,0,0,0.6)] "
            />
          </a>
        </div>
      </div>
    );
  });

  return (
    <div className="py-24">
      <SectionTitle>Projects</SectionTitle>
      <SectionDescription>
        A small preview into <br /> my work.
      </SectionDescription>
      <div className="flex flex-col gap-24">{ProjectList}</div>
      <a
        href="https://github.com/Armadillidiid"
        className="flex justify-center items-center mt-24"
      >
        <span className="text-blue-500 text-lg font-medium">Show more</span>
      </a>
    </div>
  );
};

export default Project;

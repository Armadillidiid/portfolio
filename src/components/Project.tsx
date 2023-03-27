import { BsArrowUpRight } from "react-icons/bs";
import SectionDescription from "./sub-components/SectionDescription";
import SectionTitle from "./sub-components/SectionTitle";
import { projectData as data } from "../data/projects";

const Project: React.FC = () => {
  const ProjectList = data.map((project, index) => {
    return (
      <div key={index} className="flex flex-col first:mt-0 2xl:first:mt-24">
        <div className="grid grid-cols-12 gap-7 lg:gap-12">
          <div
            className={`col-span-12 md:col-span-6 flex flex-col gap-1 justify-evenly font-light order-last ${
              index % 2 === 0 ? "md:order-first" : "md:order-last"
            }`}
          >
            <div className="flex flex-col gap-1 md:gap-2">
              <span className="font-bold text-xl md:text-2xl mb-1 dark:text-white">
                {project.name}
              </span>
              <ul className="flex gap-1 list-inside list-disc font-medium">
                {project.stack.map((item, index) => (
                  <li key={index} className="dark:text-white">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="dark:text-white text-sm lg:text-base">{project.description}</p>
            <div className="flex gap-5 lg:gap-10 mt-4 md:mt-8 text-sm md:text-base font-bold">
              <a
                href={project.previewURL}
                target={"_blank"}
                rel="noreferrer"
                className="flex items-center gap-1 md:gap-2 dark:text-white"
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
                className="flex items-center gap-1 md:gap-2 dark:text-white"
              >
                <span className="relative uppercase ButtonText">View Code</span>
                <BsArrowUpRight className="stroke-1" />
              </a>
            </div>
          </div>
          <a
            href={project.previewURL}
            className={`col-span-12 md:col-span-6 flex items-center rounded-3xl hover:scale-[1.03] transition-transform duration-200 project-link font-medium`}
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
    <div className="py-16 md:py-24">
      <SectionTitle>Projects</SectionTitle>
      <SectionDescription>
        A brief glimpse of
        <br /> my work.
      </SectionDescription>
      <div className="flex flex-col gap-16 md:gap-24">{ProjectList}</div>
      <a
        href="https://github.com/Armadillidiid?tab=repositories"
        target={"_blank"}
        rel="noreferrer noopener"
        className="flex justify-center items-center mt-16 md:mt-24"
      >
        <span className="text-blue-500 hover:scale-110 transition text-lg font-medium">Show more</span>
      </a>
    </div>
  );
};

export default Project;

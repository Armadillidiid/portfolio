import { Fragment } from "react";
import SectionDescription from "./sub-components/SectionDescription";
import SectionTitle from "./sub-components/SectionTitle";
import { motion } from "framer-motion";
import {
  languages,
  frameworks,
  testing_frameworks,
  libraries,
  editors,
  version_control,
} from "../data/icons";

const Skill: React.FC = () => {
  const icon = (
    arr: { name: string; url: string; category: string },
    id: number,
    isFramework: boolean = false,
  ) => (
    <>
      {isFramework ? (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            bounce: 0.3,
          }}
          viewport={{ once: true }}
          key={id}
          className="flex flex-col gap-4 justify-between items-center w-1/4 max-w-[60px] md:max-w-[96px] md:w-full "
        >
          <img src={arr.url} className="w-full 2xl:w-24 rounded-xl" />
          <div className="text-center">
            <span className="font-semibold text-neutral-700 dark:text-neutral-400 max-w-full h-auto">
              {arr.name}
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            bounce: 0.3,
            delay:
              arr.category === "languages"
                ? 0.1
                : arr.category === "libraries"
                  ? 0.15
                  : arr.category === "testing_frameworks"
                    ? 0.2
                    : arr.category === "version_control"
                      ? 0.25
                      : 0.3,
          }}
          viewport={{ once: true }}
          key={id}
          className="flex flex-col gap-4 justify-between items-center w-full max-w-[60px] md:max-w-[96px] xl:w-24"
        >
          <img src={arr.url} className="w-full 2xl:w-24 rounded-xl" />
          <div className="text-center">
            <span className="font-semibold text-neutral-700 dark:text-neutral-400 max-w-full h-auto">
              {arr.name}
            </span>
          </div>
        </motion.div>
      )}
    </>
  );

  const languageList = languages.map((language, index) =>
    icon(language, index),
  );
  const frameworkList = frameworks.map((framework, index) =>
    icon(framework, index, true),
  );
  const testingFrameworkList = testing_frameworks.map((framework, index) =>
    icon(framework, index),
  );
  const librariesList = libraries.map((library, index) => icon(library, index));
  const editorsList = editors.map((editor, index) => icon(editor, index));
  const versionControlList = version_control.map((versionControl, index) =>
    icon(versionControl, index),
  );

  return (
    <div>
      <SectionTitle>Skills</SectionTitle>
      <SectionDescription>
        Everything I utilize to
        <br /> translate a concept
        <br />
        into actuality.
      </SectionDescription>
      <div className="mt-12 md:mt-24 grid grid-cols-12 gap-5 max-w-fit mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            bounce: 0.25,
          }}
          viewport={{ once: true, margin: "50px" }}
          className="col-span-12 lg:col-span-12 skill"
        >
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Frameworks</span>
            <div className="flex flex-grow flex-wrap justify-around items-center gap-8 sm:gap-12">
              {frameworkList.map((framework, index) => (
                <Fragment key={index}>{framework}</Fragment>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="col-span-12 lg:col-span-6 skill">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Languages</span>
            <div className="flex flex-grow justify-around items-center gap-8 md:gap-12">
              {languageList.map((language, index) => (
                <Fragment key={index}>{language}</Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 skill">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Libraries</span>
            <div className="flex flex-grow justify-around items-center gap-8 md:gap-12">
              {/* {librariesList} */}
              {librariesList.map((library, index) => (
                <Fragment key={index}>{library}</Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 skill w-full justify-self-center">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Testing Frameworks</span>
            <div className="flex flex-grow justify-around items-center gap-8 md:gap-12">
              {/* {testingFrameworkList} */}
              {testingFrameworkList.map((testingFramework, index) => (
                <Fragment key={index}>{testingFramework}</Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 skill justify-self-center">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Version Control</span>
            <div className="flex flex-grow justify-around items-center gap-8 md:gap-12">
              {/* {versionControlList} */}
              {versionControlList.map((versionControl, index) => (
                <Fragment key={index}>{versionControl}</Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 skill">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Code Editors</span>
            <div className="flex flex-grow justify-around items-center gap-8 md:gap-12">
              {editorsList.map((editor, index) => (
                <Fragment key={index}>{editor}</Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skill;

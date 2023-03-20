import SectionDescription from "./sub-components/SectionDescription";
import SectionTitle from "./sub-components/SectionTitle";
import {
  languages,
  frameworks,
  testing_frameworks,
  libraries,
  editors,
  version_control,
} from "../data/icons";

const Skill: React.FC = () => {
  const icon = (arr: {name: string, url: string}) => (
    <div className="flex flex-col gap-4 justify-between items-center h-full">
      <img src={arr.url} className="w-24 rounded-xl" />
      <div className="text-center">
        <span className="font-semibold text-neutral-700 max-w-full h-auto">
          {arr.name}
        </span>
      </div>
    </div>
  );

  const languageList = languages.map((language) => icon(language));
  const frameworkList = frameworks.map((framework) => icon(framework));
  const testingFrameworkList = testing_frameworks.map((framework) =>
    icon(framework)
  );
  const librariesList = libraries.map((library) => icon(library));
  const editorsList = editors.map((editor) => icon(editor));
  const versionControlList = version_control.map((versionControl) =>
    icon(versionControl)
  );

  return (
    <div>
      <SectionTitle>Skills</SectionTitle>
      <SectionDescription>
        Everything I utilize to
        <br /> turn an idea into <br />
        reality.
      </SectionDescription>
      <div className="mt-24 grid grid-cols-12 gap-5 max-w-fit mx-auto">
        <div className="lg:col-span-12 bg-white p-10 rounded-2xl border border-neutral-200/80">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Frameworks</span>
            <div className="flex flex-grow justify-around items-center gap-12">
              {frameworkList}
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 bg-white p-10 rounded-2xl border border-neutral-200/80">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Languages</span>
            <div className="flex flex-grow justify-around items-center gap-12">
              {languageList}
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 bg-white p-10 rounded-2xl border border-neutral-200/80">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Libraries</span>
            <div className="flex flex-grow justify-around items-center gap-12">
              {librariesList}
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 bg-white p-10 rounded-2xl border border-neutral-200/80">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Testing Frameworks</span>
            <div className="flex flex-grow justify-around items-center gap-12">
              {testingFrameworkList}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 bg-white p-10 rounded-2xl border border-neutral-200/80">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Version Control</span>
            <div className="flex flex-grow justify-around items-center gap-12">
              {versionControlList}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 bg-white p-10 rounded-2xl border border-neutral-200/80">
          <div className="flex flex-col gap-8">
            <span className="font-semibold text-xl">Code Editors</span>
            <div className="flex flex-grow justify-around items-center gap-12">
              {editorsList}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skill;

import SectionDescription from "./sub-components/SectionDescription";
import SectionTitle from "./sub-components/SectionTitle";

const About: React.FC = () => {
  return (
    <div className="py-24">
      <SectionTitle>About Me</SectionTitle>
      <SectionDescription>
        My background and <br /> who I am.
      </SectionDescription>
      <div className="flex flex-col gap-8 font-light dark:text-white text-lg">
        <p className="text-2xl">
          I am creative developer and Web designer based in New Delhi, India. I
          am a Civil Engineering graduate and later switched to the awesome
          world of front end web development.
        </p>
        <p>
          I believe in creating experiences that are interactive, clean and
          responsive. I enjoy using my skill-set to empower people to accomplish
          their goals.
        </p>
        <p>
          My development stack is focused on performance & accessibility with
          delightful interactions. I create blazing fast web experience using
          Jamstack with the help of Next.js
        </p>
        <div>
          <span>Services i offer include:</span>
          <ul className="list-disc list-inside">
            <li>UI/UX Design</li>
            <li>Front end web development</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;

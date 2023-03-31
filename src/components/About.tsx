import SectionDescription from "./sub-components/SectionDescription";
import SectionTitle from "./sub-components/SectionTitle";
import { Link } from "react-scroll";
import { motion } from "framer-motion";

const About: React.FC = () => {
  const variant = {
    initial: { opacity: 0, scale: 0.5 },
    whileInView: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };
  const viewport = {
    viewport: { once: true, margin: "-50px" },
  };
  return (
    <div className="py-16 md:py-24">
      <SectionTitle>About Me</SectionTitle>
      <SectionDescription>
        My background and <br /> who I am.
      </SectionDescription>
      <div className="flex flex-col gap-8 font-light dark:text-white text-base lg:text-lg">
        <p className="text-lg lg:text-2xl">
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
        <div className="flex flex-col gap-0 md:gap-20 md:flex-row justify-end bg-gradient-to-br from-[#e7505e] via-[#cb5891]  to-[#a364dc]  rounded-3xl overflow-hidden w-full mt-8 max-w-6xl mx-auto relative">
          <img
            src="/portrait.png"
            alt=""
            className="order-first self-center w-[250px] md:w-auto max-w-full max-h-[350px] md:max-h-[320px] lg:max-h-[350px] md:absolute left-0 md:bottom-8 lg:bottom-0"
          />
          <div className="flex flex-col gap-4 md:gap-6 z-10 bg-black/30 text-white rounded-3xl p-8 md:p-10 md:max-w-md lg:max-w-xl xl:max-w-2xl flex-auto m-5 mt-3 md:mt-5 lg:m-10 right-6 self-center justify-center text-center md:text-start">
            <motion.h3
              variants={variant}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
              className="text-3xl md:text-4xl font-bold"
            >
              I'm Emmanuel Isenah
            </motion.h3>
            <motion.p
              variants={variant}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
              className="text-base"
            >
              I can assist in the growth of your company by aligning your
              business objectives with your customers' needs, resulting in
              increased customer conversions and sales.
            </motion.p>
            <motion.button
              variants={variant}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -4 }}
              className="rounded-xl py-2 px-8 w-fit bg-white text-neutral-800 font-semibold self-center md:self-start"
            >
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
              >
                Let's work together
              </Link>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

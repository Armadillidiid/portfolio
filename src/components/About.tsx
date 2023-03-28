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
        <div className="flex flex-col md:flex-row bg-gradient-to-br from-[#e7505e] via-[#cb5891]  to-[#a364dc]  rounded-3xl h-[350px] overflow-hidden w-full mt-8 max-w-5xl mx-auto relative">
          <img
            src="/PXL_20230106_140646324_2__1__3-removebg-preview.png"
            alt=""
          />
          <div className="flex flex-col gap-6 bg-black/30 text-white rounded-3xl p-10 max-w-2xl flex-auto  m-10 right-6 self-center justify-center">
            <motion.h3
              variants={variant}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
              className="text-4xl font-bold"
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
              className="rounded-xl py-2 px-8 w-fit bg-white text-neutral-800 font-semibold"
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

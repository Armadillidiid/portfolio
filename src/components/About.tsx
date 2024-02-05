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
          I am creative software developer based in Port Harcourt, Nigeria. I
          started my professional journey as a Electrical Engineering graduate,
          but my curiosity and interest in the digital world led me to the
          software development field.
        </p>
        <p>
          Fast-forward to today, I enjoy creating interactive, clean, and
          responsive designs that provide an enjoyable user experience. I strive
          to make websites both aesthetically pleasing and easy to use, helping
          individuals accomplish their daily tasks/objectives.
        </p>
        <p>
          My development stack is focused on performance and accessibility using
          technologies like the MERN stack and React.js. These technologies
          enable me to build lightning-fast web applications with seamless
          interactions.
        </p>
        <div className="flex flex-col gap-0 md:gap-20 md:flex-row justify-end bg-gradient-to-br from-[#e7505e] via-[#cb5891]  to-[#a364dc]  rounded-3xl overflow-hidden w-full mt-8 max-w-6xl mx-auto relative">
          <img
            src="/portrait.webp"
            alt=""
            className="order-first self-center w-[250px] md:w-auto max-w-full max-h-[350px] md:max-h-[320px] lg:max-h-[340px] md:absolute left-0 md:left-[-30px]
            lg:left-[-20px] 2xl:left-[20px] bottom-0"
          />
          <div className="flex flex-col gap-4 md:gap-9 z-10 bg-black/30 text-white rounded-3xl p-8 md:p-10 md:max-w-md lg:max-w-xl xl:max-w-2xl flex-auto m-5 mt-1 md:mt-5 lg:m-10 right-6 self-center justify-center text-center md:text-start">
            <motion.h3
              variants={variant}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
              className="text-3xl md:text-4xl font-bold"
            >
              Need a professional website?
            </motion.h3>
            <motion.p
              variants={variant}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-50px" }}
              className="text-base"
            >
              Let me assist you in developing a website that not only appeals to
              your target population, but also engages them, and encourages
              sales.
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

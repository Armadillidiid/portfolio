import Typewriter from "typewriter-effect";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Link, scrollSpy } from "react-scroll";

const Hero: React.FC = () => {
  const animationControls = useAnimation();

  const words: string[] = [
    "craft digital solutions with code",
    "build intuitive web applications",
    "design custom web experiences",
    "bridge creativity through code",
    "bring your ideas to life",
  ];

  const variant = {
    initial: { y: "200px" },
    animate: (i: number) => ({
      opacity: 1,
      y: "0%",
      transition: {
        delay: i * 0.6,
        duration: 1,
        type: "tween",
      },
    }),
  };

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await animationControls.start({
          x: -50,
          y: -50,
          scale: 1,
          rotate: 160,
          transition: { duration: 3.5 },
        });
        await animationControls.start({
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1.15,
          rotate: -160,
          transition: { duration: 3.5 },
        });
      }
    };

    setTimeout(() => {
      sequence();
    }, 1000);
  }, [animationControls]);

  useEffect(() => {
    scrollSpy.update();
  }, []);

  return (
    <div
      className="pt-[52px] h-screen flex flex-col justify-center items-start gap-2 md:gap-5 overflow-hidden relative"
      id="hero"
    >
      <div className="mb-0 flex flex-col gap-1 md:gap-2 lg:gap-6">
        <div className="overflow-hidden">
          <motion.p
            variants={variant}
            custom={1}
            initial="initial"
            animate="animate"
            className="font-normal text-2xl md:text-4xl text-blue-500 tracking-tight"
          >
            Hi, I'm Emmanuel Isenah 👋
          </motion.p>
        </div>

        <div className="overflow-hidden">
          <motion.p
            variants={variant}
            custom={2}
            initial="initial"
            animate="animate"
            className="font-semibold text-3xl md:text-5xl dark:text-white tracking-tight"
          >
            I'm a <b className="font-black">Software Developer</b>
          </motion.p>
        </div>
        <div className="overflow-hidden pb-2">
          <motion.div
            variants={variant}
            custom={3}
            initial="initial"
            animate="animate"
            className="flex flex-col lg:flex-row font-semibold text-3xl md:text-5xl dark:text-white tracking-tight"
          >
            and I&nbsp;
            <Typewriter
              options={{
                strings: words,
                autoStart: true,
                loop: true,
                wrapperClassName: "",
                deleteSpeed: 30,
                delay: 30,
              }}
            />
          </motion.div>
        </div>
      </div>
      <div className="overflow-hidden">
        <motion.button
          variants={variant}
          custom={3.7}
          initial="initial"
          animate="animate"
          className="mt-10 py-3 px-8 bg-blue-500 text-white rounded"
        >
          <Link to="contact" spy={true} smooth={true} offset={0} duration={500}>
            About Me
          </Link>
        </motion.button>
      </div>
      <div className="overflow-hidden"></div>
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 6.25, duration: 0.5, type: "tween" },
        }}
        className="absolute bottom-20"
        width="35"
        height="100"
        viewBox="0 0 247 390"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{
          fillRule: "evenodd",
          clipRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: "1.5",
        }}
      >
        <path
          id="wheel"
          d="M123.359,79.775l0,72.843"
          className="fill-none stroke-black dark:stroke-white stroke-[20px]"
        />
        <path
          id="mouse"
          d="M236.717,123.359c0,-62.565 -50.794,-113.359 -113.358,-113.359c-62.565,0 -113.359,50.794 -113.359,113.359l0,143.237c0,62.565 50.794,113.359 113.359,113.359c62.564,0 113.358,-50.794 113.358,-113.359l0,-143.237Z"
          className="fill-none stroke-black dark:stroke-white stroke-[15px]"
        />
      </motion.svg>
      <motion.svg
        initial={{ opacity: 0 }}
        animate={animationControls}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className={
          "absolute w-[580px] h-[580px] self-center top-[18%] left-[23%] -z-10"
        }
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="rgba(91, 91, 91, 0.45)"
          strokeWidth="0.15"
          fill="none"
        />
      </motion.svg>
      <motion.svg
        initial={{ opacity: 0 }}
        animate={animationControls}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className={
          "absolute w-[440px] h-[440px] self-center top-[40%] right-[15%] -z-10"
        }
      >
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          stroke="rgba(91, 91, 91, 0.45)"
          strokeWidth={0.25}
          fill="none"
        />
      </motion.svg>
    </div>
  );
};

export default Hero;

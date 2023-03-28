import { motion } from "framer-motion";

const Manifest: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, transition: { duration: 0.4 } }}
      viewport={{ margin: "-100px", once: true }}
      className="flex pb-24 md:pb-44 justify-center items-center gradient-text"
    >
      <p className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-8xl max-w-sm sm:max-w-xl min-[850px]:max-w-2xl xl:max-w-3xl 2xl:max-w-5xl text-center tracking-tighter leading font-bold">
        Dedicated to crafting exceptional experiences which inspire positive
        change
      </p>
    </motion.div>
  );
};

export default Manifest;

interface Project {
  name: string;
  image: string;
  stack: string[];
  previewURL: string;
  codeURL: string;
  description: string;
}

const projectData: Project[] = [
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

export { projectData };

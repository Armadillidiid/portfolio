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
    image: "/images/react-game-store.png",
    stack: ["React", "Firebase", "Tailwind"],
    previewURL: "https://armadillidiid.github.io/react-game-store/",
    codeURL: "https://github.com/Armadillidiid/react-game-store",
    description:
      "GameStore is a game store (no pun intended) built with React for the frontend and Firebase for authentication and database management. It utilizes the RAWG API to fetch details of games, such as release date, images, metacritic score, and other relevant information.",
  },
  {
    name: "Rumble",
    image: "/images/rumble.png",
    stack: ["Python", "Django", "PostgreSQL"],
    previewURL: "https://rumble-eats.live/",
    codeURL: "https://github.com/Armadillidiid/food-delivery-ecommerce",
    description:
      "Rumble is a food delivery web app built with Python, Django, and PostgreSQL. It connects customers with local restaurants, and features a clean, user-friendly interface for easy navigation. Customers can track deliveries and pay directly through the app.",
  },
  {
    name: "CV Application(Maker)",
    image:
      "https://raw.githubusercontent.com/Armadillidiid/cv-application/main/cv-application-gif.gif",
    stack: ["React", "Tailwind", "DaisyUI"],
    previewURL: "https://armadillidiid.github.io/cv-application/",
    codeURL: "https://github.com/Armadillidiid/cv-application",
    description:
      "CV Maker is a React app that allows users to create and download their CV in a professional format, with real-time updates. It's built using React.js and Tailwind for the frontend, and uses libraries like html2canvas and jsPDF for CV generation and download.",
  },
];

export { projectData };

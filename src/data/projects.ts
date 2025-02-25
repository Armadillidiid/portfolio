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
    image: "/images/react-game-store.webp",
    stack: ["React", "Firebase", "Tailwind"],
    previewURL: "https://armadillidiid.github.io/react-game-store/",
    codeURL: "https://github.com/Armadillidiid/react-game-store",
    description:
      "GameStore is a game store (no pun intended) built with React for the frontend and Firebase for authentication and database management. It utilizes the RAWG API to fetch details of games, such as release date, images, metacritic score, and other relevant information.",
  },
  {
    name: "Rumble",
    image: "/images/rumble.webp",
    stack: ["Python", "Django", "PostgreSQL"],
    previewURL: "https://rumble-eat.xyz/",
    codeURL: "https://github.com/Armadillidiid/food-delivery-ecommerce",
    description:
      "Rumble is a food delivery web app built with Python, Django, and PostgreSQL. It connects customers with local restaurants, and features a clean, user-friendly interface for easy navigation. Customers can track deliveries and pay directly through the app.",
  },
  {
    name: "CV Application(Maker)",
    image: "/cv-application-gif.gif",
    stack: ["React", "Tailwind", "DaisyUI"],
    previewURL: "https://armadillidiid.github.io/cv-application/",
    codeURL: "https://github.com/Armadillidiid/cv-application",
    description:
      "CV Maker is a React app that allows users to create and download their CV in a professional format, with real-time updates. It's built using React.js and Tailwind for the frontend, and uses libraries like html2canvas and jsPDF for CV generation and download.",
  },
  {
    name: "Threadit (Reddit Clone)",
    image: "/images/threadit.webp",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    previewURL: "https://reddit-clone-zeta-woad.vercel.app/",
    codeURL: "https://github.com/Armadillidiid/reddit-clone",
    description:
      "Threadit is a Reddit clone built with Next.js, TypeScript, and PostgreSQL. It features real-time updates, and allows users to create threads, comment on posts, and upvote/downvote content.",
  },
];

export { projectData };

interface Icon {
  name: string;
  url: string;
}

const languages: Icon[] = [
  {
    name: "Typescript",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "JavaScript",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "Python",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
];

const frameworks: Icon[] = [
  {
    name: "React",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Django",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
  },
  {
    name: "Next.js",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg",
  },
  {
    name: "Astro",
    url: "/src/images/astro.svg",
  },
  {
    name: "Flask",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  },
  {
    name: "Tailwind",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
  },
];

const libraries: Icon[] = [
  {
    name: "Framer Motion",
    url: "/src/images/framer-motion.png",
  },
  {
    name: "TanStack Query",
    url: "/src/images/tanstack-query.png",
  },
  {
    name: "React Router",
    url: "/src/images/react-router.svg",
  },
];

const testing_frameworks: Icon[] = [
  {
    name: "Jest",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg",
  },
  {
    name: "Cypress",
    url: "/src/images/cypress-svgrepo-com.svg",
  },
];

const version_control: Icon[] = [
  {
    name: "Git",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
];

const editors: Icon[] = [
  {
    name: "Neovim",
    url: "/src/images/neovim.png",
  },
  {
    name: "VSCode",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },
];

export {
  languages,
  frameworks,
  libraries,
  testing_frameworks,
  version_control,
  editors,
};

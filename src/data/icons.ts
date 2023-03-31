interface Icon {
  name: string;
  url: string;
  category: string;
}

const languages: Icon[] = [
  {
    name: "Typescript",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    category: "languages",
  },
  {
    name: "JavaScript",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    category: "languages",
  },
  {
    name: "Python",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    category: "languages",
  },
];

const frameworks: Icon[] = [
  {
    name: "React",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    category: "frameworks",
  },
  {
    name: "Django",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    category: "frameworks",
  },
  {
    name: "Next.js",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg",
    category: "frameworks",
  },
  {
    name: "Astro",
    url: "/images/astro.svg",
    category: "frameworks",
  },
  {
    name: "Flask",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
    category: "frameworks",
  },
  {
    name: "Tailwind",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    category: "frameworks",
  },
];

const libraries: Icon[] = [
  {
    name: "Framer Motion",
    url: "/images/framer-motion.png",
    category: "libraries",
  },
  {
    name: "TanStack Query",
    url: "/images/tanstack-query.png",
    category: "libraries",
  },
  {
    name: "React Router",
    url: "/images/react-router.svg",
    category: "libraries",
  },
];

const testing_frameworks: Icon[] = [
  {
    name: "Jest",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg",
    category: "testing_frameworks",
  },
  {
    name: "Cypress",
    url: "/images/cypress-svgrepo-com.svg",
    category: "testing_frameworks",
  },
];

const version_control: Icon[] = [
  {
    name: "Git",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    category: "version_control",
  },
];

const editors: Icon[] = [
  {
    name: "Neovim",
    url: "/images/neovim.png",
    category: "editors",
  },
  {
    name: "VSCode",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    category: "editors",
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

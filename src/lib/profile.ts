/**
 * Edit this file to fill in your portfolio. Every app reads from here so
 * there's only one place to keep current.
 *
 * Drop your real resume PDF at /public/resume.pdf to enable the inline viewer.
 */

export type Project = {
  title: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  /** Path under /public, e.g. "/images/projects/foo.webp" */
  screenshot?: string;
};

export type SkillGroup = {
  name: string;
  items: string[];
};

export const PROFILE = {
  name: "Your Name",
  role: "Software Engineer · Designer · Tinkerer",
  /** One-paragraph intro for the About app */
  bio:
    "I build small, fast, well-crafted software. I like terminals, type systems, " +
    "and the smell of fresh CRT phosphor in the morning. This site lives on a " +
    "Mac Mini in my apartment.",
  email: "you@example.com",
  /** Public links — leave blank to hide */
  github: "https://github.com/your-handle",
  linkedin: "https://www.linkedin.com/in/your-handle",
  twitter: "",
  bluesky: "",
  website: "",
  /** Where the Resume window's download button points. Drop a PDF here. */
  resumePath: "/resume.pdf",
  /** Hostname shown on the boot screen and "My Computer" window */
  hostname: "portfolio.local",
};

export const SKILLS: SkillGroup[] = [
  {
    name: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Rust", "Go", "SQL"],
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "Tailwind", "Three.js", "WebGL", "Framer Motion"],
  },
  {
    name: "Backend & Infra",
    items: ["Node.js", "Postgres", "Redis", "Docker", "Cloudflare", "AWS"],
  },
  {
    name: "Tools",
    items: ["Git", "Vim", "tmux", "Figma", "Linear"],
  },
];

export const PROJECTS: Project[] = [
  {
    title: "RetroOS Portfolio",
    description: "This site — a Vista-flavored desktop with a real voxel sandbox and DOOM.",
    stack: ["Next.js", "TypeScript", "Three.js", "Tailwind", "Zustand"],
    github: "https://github.com/your-handle/mycoolwebsite",
    demo: "https://your-domain.example.com",
  },
  {
    title: "Project Two",
    description: "Replace this with one of your real projects.",
    stack: ["Rust", "WASM"],
    github: "https://github.com/your-handle/project-two",
  },
  {
    title: "Project Three",
    description: "Replace this with one of your real projects.",
    stack: ["React", "Node.js"],
    demo: "https://example.com",
  },
];

export const RESUME = {
  /** Inline summary text shown when no PDF is dropped at /public/resume.pdf */
  summary:
    "Generalist engineer focused on performant, beautiful product surfaces. " +
    "Comfortable across the stack with a love for the small details that " +
    "make software feel alive.",
  experience: [
    { company: "Company A", role: "Senior Engineer", period: "2023–present" },
    { company: "Company B", role: "Engineer", period: "2020–2023" },
    { company: "Freelance", role: "Various clients", period: "2018–2020" },
  ],
  education: [
    { school: "Your School", degree: "BSc Computer Science", period: "2014–2018" },
  ],
};

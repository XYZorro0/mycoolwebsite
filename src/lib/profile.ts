/**
 * Niket Gupta's portfolio data.
 *
 * Edit this file to update content — every app reads from here so there's
 * only one place to keep current. Drop your real resume PDF at
 * /public/resume.pdf to enable the inline viewer.
 */

export type Project = {
  title: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  /** Path under /public, e.g. "/images/projects/foo.webp" */
  screenshot?: string;
  /** Optional secondary line, e.g. award or course */
  meta?: string;
  /** When you worked on it */
  period?: string;
};

export type SkillGroup = {
  name: string;
  items: string[];
};

export const PROFILE = {
  name: "Niket Gupta",
  role: "Software Engineer · Graduate Student",
  bio:
    "I build AI/ML systems and the software around them — computer vision, NLP, " +
    "and the data pipelines that keep them honest. Currently a graduate student " +
    "at the University of Houston, where I work on deep-learning research and " +
    "indie engineering projects when I'm not in class.",
  email: "niketgupta1@gmail.com",
  github: "https://github.com/XYZorro0",
  linkedin: "https://www.linkedin.com/in/niketgupta1/",
  twitter: "",
  bluesky: "",
  website: "",
  /** Where the Resume window's download button points. Drop a PDF here. */
  resumePath: "/resume.pdf",
  /** Hostname shown on the boot screen, terminal prompt, and "My Computer" */
  hostname: "niket.local",
};

export const SKILLS: SkillGroup[] = [
  {
    name: "Languages",
    items: ["Python", "Java", "SQL", "JavaScript", "TypeScript", "HTML/CSS"],
  },
  {
    name: "Frameworks & Libraries",
    items: [
      "TensorFlow",
      "PyTorch",
      "React",
      "Node.js",
      "Scikit-learn",
      "MediaPipe",
      "DistilBERT (Hugging Face)",
    ],
  },
  {
    name: "Databases",
    items: ["MySQL", "PostgreSQL", "DynamoDB"],
  },
  {
    name: "Cloud & DevOps",
    items: ["AWS (EC2, S3, Lambda)", "Docker", "CI/CD", "Git", "Linux"],
  },
  {
    name: "AI / ML",
    items: [
      "CNNs",
      "NLP",
      "Transformer Models",
      "Computer Vision",
      "Data Augmentation",
      "Model Evaluation",
    ],
  },
  {
    name: "Tools",
    items: ["Jupyter", "VS Code", "Jira", "Agile / Scrum"],
  },
];

export const PROJECTS: Project[] = [
  {
    title: "Dual-Pipeline Lung Cancer Detection",
    period: "Aug 2025 – Dec 2025",
    meta: "3rd place — UH HPE Data Science Institute Showcase",
    description:
      "TensorFlow CNN that classifies lung cancer across 15 classes from CT scans and clinical tabular data. " +
      "A dual-pipeline architecture merges image and tabular signals; class imbalance handled with augmentation " +
      "(rotation, flip, zoom, brightness). Reached ~81% validation accuracy — clinical-data path beat CT scans " +
      "on visually ambiguous subtypes. Clinical pipeline normalized to 3NF with low-variance and " +
      "high-collinearity features removed.",
    stack: ["TensorFlow", "Python", "CNNs", "Computer Vision", "SQL"],
  },
  {
    title: "Multilingual Fraud Detection Analysis",
    period: "Aug 2025 – Dec 2025",
    meta: "Cybersecurity & NLP",
    description:
      "First systematic study of language diversity in the DIFrauD dataset — non-English content concentrates " +
      "in SMS messages (9.05%) with statistically significant differences between deceptive and non-deceptive " +
      "classes. Benchmarked DistilBERT, Random Forest, and LinearSVC; DistilBERT was strongest in absolute " +
      "performance but took the largest hit (-7.4%) on multilingual data. Built a langdetect + spaCy " +
      "cross-validation framework with 99.77% agreement and a reproducible methodology for security datasets.",
    stack: ["Python", "DistilBERT", "Hugging Face", "spaCy", "Scikit-learn"],
  },
  {
    title: "Zoo Management Database System",
    period: "Jan 2025 – May 2025",
    meta: "Database Systems (COSC 3380)",
    description:
      "Comprehensive MySQL database for zoo operations: managers, staff, gift-shop inventory, and ticket " +
      "booking. Normalized schema (3NF) with efficient relational design and 2 triggers automating business " +
      "logic and maintaining data integrity.",
    stack: ["MySQL", "SQL", "Triggers", "Schema design"],
  },
  {
    title: "AI-Powered Smart Mirror",
    period: "Ongoing",
    meta: "Computer Vision · Personal project",
    description:
      "Smart-mirror app using MediaPipe for hand tracking and pose detection, plus Kinect depth sensing for " +
      "person recognition and auto-wake. Multi-GPU pipeline (GTX 1070 + GTX 1060) splits real-time vision and " +
      "display rendering across cards. Roadmap: photo-to-3D garment conversion and weather-aware outfit " +
      "recommendations with local inference.",
    stack: ["Python", "MediaPipe", "Kinect", "Multi-GPU", "Computer Vision"],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  period: string;
  detail?: string;
};

export type Education = {
  school: string;
  degree: string;
  period: string;
  detail?: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  detail?: string;
};

export const RESUME = {
  /** Inline summary shown when no PDF is dropped at /public/resume.pdf */
  summary:
    "AI/ML-leaning software engineer comfortable across the stack. I like building " +
    "the boring 80% of a system as carefully as the model that powers the other 20% " +
    "— databases, pipelines, and the tooling that makes research reproducible.",
  experience: [] as Experience[],
  education: [
    {
      school: "University of Houston",
      degree: "Computer Science",
      period: "(in progress)",
      detail:
        "Coursework: Database Systems (COSC 3380), and ongoing AI/ML research with the HPE Data Science Institute.",
    },
  ] as Education[],
  certifications: [
    {
      name: "Deep Learning Fundamentals",
      issuer: "NVIDIA",
      period: "Mar 2025",
      detail:
        "Hands-on training in neural network architectures, model training, and GPU-accelerated DL workflows.",
    },
  ] as Certification[],
};

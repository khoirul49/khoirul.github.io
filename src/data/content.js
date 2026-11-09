// Semua konten portfolio ada di file ini. Edit di sini, bukan di komponen.

export const profile = {
  name: "M. Khoirul Anam, S.Kom",
  brand: "Khoirul Anam",
  role: "Full Stack Software Engineer",
  intro:
    "I build end-to-end web applications, from React and Next.js frontends to Laravel and Node.js backends, with AI features powered by the Gemini API and RAG.",
  // Isi email agar tombol surat & tautan mailto muncul di bagian Get In Touch.
  email: "akhoirul029@gmail.com",
  // Taruh file CV di public/docs/cv.pdf agar tombol Download CV berfungsi.
  cv: "/docs/cv.pdf",
};

// Teks bagian-bagian di beranda & halaman lain (edit di sini).
export const copy = {
  aboutTagline: "A brief introduction to who I am and what I do.",
  projectsTagline: "Selected work I’ve built for clients and businesses.",
  contactTagline:
    "Feel free to contact me if you have any questions or just want to say hi.",
  quote: [
    '"There are no limits to what you can accomplish',
    'except the limits you place on your own thinking."',
  ],
};

// Kredensial EmailJS untuk form kontak (public key memang dirancang terlihat di browser).
export const emailjsConfig = {
  serviceId: "service_2ealzfm",
  templateId: "template_y75pv6b",
  publicKey: "Bo8YWxjqdu7kj-Dcr",
};

export const socials = [
  {
    label: "GitHub",
    handle: "github.com/khoirul49",
    href: "https://github.com/khoirul49",
  },
  {
    label: "LinkedIn",
    handle: "linkedin.com/in/m-khoirul-anam",
    href: "https://www.linkedin.com/in/m-khoirul-anam-63b097180/",
  },
  {
    label: "Instagram",
    handle: "@anam01213",
    href: "https://www.instagram.com/anam01213",
  },
];

export const bio = [
  "I’m a Full Stack Software Engineer with a Bachelor of Computer Science (S.Kom) and nearly two years of freelance experience building end-to-end web applications with React, Next.js, Laravel, and Node.js, backed by MySQL and PostgreSQL.",
  "I’ve delivered 15+ projects (LMS, e-commerce, ERP) for SME and academic clients with a 70–80% client retention rate, and designed AI features using the Gemini API and a RAG pipeline. My earlier work in data administration and system support gives me a solid grounding in databases, reporting, and dependable operations.",
];

export const strengths = [
  {
    title: "Fast performance",
    text: "Pages that load quickly and stay smooth.",
  },
  {
    title: "Responsive design",
    text: "Layouts that work on phones, tablets, and desktops.",
  },
  {
    title: "SEO friendly",
    text: "Structure and content that search engines can read.",
  },
  {
    title: "Modern UI/UX",
    text: "Clean, consistent interfaces that are easy to use.",
  },
];

export const tools = [
  "React",
  "Next.js",
  "JavaScript",
  "Node.js",
  "Tailwind CSS",
  "Bootstrap",
  "GitHub",
  "VS Code",
  "Figma",
  "Canva",
  "Adobe Illustrator",
];

// Urutan: terlama -> terbaru (halaman About membaliknya, terbaru tampil di atas).
export const experience = [
  {
    startDate: "Aug 2014",
    endDate: "Sep 2014",
    company: "KPRI Muncul, Sukorame Branch",
    position: "Intern",
    type: "Internship",
    location: "Ngimbang, Lamongan",
    description:
      "Served members making business capital loan transactions, assisted with sales and purchase records in the General Journal, Balance Sheet, and General Ledger, entered the data into the database, and repaired software issues on faulty computers.",
    skills: ["Bookkeeping", "Data Entry", "Database", "Computer Support"],
  },
  {
    startDate: "Aug 2015",
    endDate: "Sep 2015",
    company: "PT Pos Indonesia (Persero), Jombang Post Office",
    position: "Intern",
    type: "Internship",
    location: "Jombang",
    description:
      "Checked parcels for shipping eligibility and scanned barcodes into the system, helped resolve computer network errors affecting the MySQL database, assisted with network upgrades, and built a supplementary web-based application as a backup for the Pos program.",
    skills: ["MySQL", "Networking", "Web Application", "Barcode System"],
  },
  {
    startDate: "Apr 2018",
    endDate: "Oct 2018",
    company: "PT Kebun Tebu Mas",
    position: "SRS Operator (Registration Administration)",
    type: "Finance Division",
    location: "Indonesia",
    description:
      "Entered truck driver and cutting-and-transport ticket data into the sugarcane haulage database, verified driver registration before weighing and unloading, checked weighing receipts, and prepared reports for the supervisor using Microsoft Office and a MySQL database.",
    skills: ["Microsoft Office", "MySQL", "Data Administration", "Reporting"],
  },
  {
    startDate: "Sep 2023",
    endDate: "Jul 2025",
    company: "Freelance",
    position: "Web Developer & AI Consultant",
    type: "Freelance",
    location: "Surabaya",
    description:
      "Built and delivered 15+ full stack projects (LMS, e-commerce, ERP) for SME and academic clients with a 70–80% client retention rate. Designed a multi-modal AI mental health support system using the Gemini API, a RAG pipeline, few-shot prompting, and domain-specific fine-tuning. Implemented RBAC in multi-tenant apps with Spatie Laravel Permission and tuned server performance (InnoDB, PHP-FPM).",
    skills: [
      "Laravel",
      "React",
      "Next.js",
      "Gemini API",
      "RAG",
      "RBAC",
      "MySQL",
      "PHP-FPM",
    ],
  },
];

// Pendidikan (satu blok). Contoh: { period: "2019 - 2023", school: "Nama kampus", degree: "Program studi", text: "Deskripsi.", badges: ["GPA: 3.9"] }
export const education = {
  period: "2013 - 2017",
  school: "KH. Abdul Wahab Hasbullah University, Tambak Beras, Jombang",
  degree: "Bachelor of Computer Science (S.Kom)",
  text: "Earlier education: SMAN 1 Ngimbang (2010 – 2013), SMPN 1 Ngimbang (2007 – 2010), and SDN Munungrejo II (2001 – 2007).",
  badges: [],
};

// Prestasi: { year: 2024, title: "Juara 1", subtitle: "Nama lomba", date: "Mar 2024", type: "gold" }  // type: gold | silver | bronze | finalist
export const achievements = [];

// Kategori proyek yang tampil sebagai tombol filter di halaman Projects.
export const categories = {
  1: "Web Development",
  2: "AI & Machine Learning",
  9: "Other",
};

// `slug` dipakai untuk mencari gambar di src/assets/projects/<slug>.jpg
// (gambar tambahan: <slug>-1.jpg, <slug>-2.jpg, dst. akan tampil di halaman detail).
// year: isi tahun pengerjaan (kosong = label tahun disembunyikan).
// category: 1 = Web, 2 = AI, 9 = Other. featured: true = jadi "Highlight".
// preview / code: tautan demo & GitHub (opsional). show: false = sembunyikan dari kartu, tetap ada di Archive.
export const projects = [
  {
    slug: "antrian",
    title: "Aplikasi Sistem Antrian",
    desc: ["Website profesional untuk branding perusahaan."],
    year: "",
    category: [1],
    tech: [],
    preview: "",
    code: "",
    show: true,
    featured: false,
  },
  {
    slug: "landing-page",
    title: "Landing Page",
    desc: ["Landing page high conversion."],
    year: "",
    category: [1],
    tech: [],
    preview: "",
    code: "",
    show: true,
    featured: false,
  },
  {
    slug: "dashboard-blog",
    title: "Dashboard Blog",
    desc: ["Penulisan Artikel SEO."],
    year: "",
    category: [1],
    tech: [],
    preview: "",
    code: "",
    show: true,
    featured: false,
  },
  {
    slug: "absensi",
    title: "Aplikasi Absensi",
    desc: ["Aplikasi website untuk absensi kehadiran."],
    year: "",
    category: [1],
    tech: [],
    preview: "",
    code: "",
    show: true,
    featured: true,
  },
];

// Kategori keahlian di halaman About. highlight: true = tampil hitam dengan ikon ✦.
export const skills = [
  {
    key: "web",
    title: "Web Development",
    icon: "web",
    description: "Building modern, responsive web applications",
    languages: [
      { name: "React.js", highlight: true },
      { name: "Next.js", highlight: true },
      { name: "TailwindCSS", highlight: true },
      { name: "Shadcn/UI", highlight: false },
      { name: "Redux", highlight: false },
      { name: "Zustand", highlight: false },
      { name: "TanStack Query", highlight: false },
    ],
    tools: [
      "Vercel",
      "Git",
      "GitHub",
      "Postman",
      "Claude Code",
      "Codex",
      "GitHub Copilot",
    ],
  },
  {
    key: "api",
    title: "Backend, Databases & AI",
    icon: "api",
    description: "Scalable backend services, databases, and AI features",
    languages: [
      { name: "Laravel", highlight: true },
      { name: "Node.js", highlight: true },
      { name: "NestJS", highlight: false },
      { name: "Spring Boot", highlight: false },
      { name: "Flask", highlight: false },
      { name: "MySQL", highlight: true },
      { name: "PostgreSQL", highlight: true },
      { name: "MongoDB", highlight: false },
      { name: "Prisma ORM", highlight: false },
      { name: "Hibernate", highlight: false },
      { name: "Redis", highlight: false },
      { name: "Firebase", highlight: false },
      { name: "REST API", highlight: true },
      { name: "RBAC", highlight: false },
      { name: "Gemini API", highlight: true },
      { name: "RAG Pipelines", highlight: true },
    ],
    tools: [
      "Docker",
      "CI/CD (GitHub Actions)",
      "GCP",
      "AWS",
      "Azure",
      "Linux/VPS",
      "Sentry",
    ],
  },
  {
    key: "lang",
    title: "Programming Languages",
    icon: "ai",
    description: "Languages I use to build software",
    languages: [
      { name: "TypeScript", highlight: true },
      { name: "JavaScript", highlight: true },
      { name: "PHP", highlight: true },
      { name: "Java", highlight: false },
      { name: "Python", highlight: false },
      { name: "Golang", highlight: false },
      { name: "SQL", highlight: false },
    ],
    tools: [],
  },
  {
    key: "admin",
    title: "Admin & Support",
    icon: "mobile",
    description: "Data administration, design, and system support",
    languages: [
      { name: "Microsoft Office", highlight: true },
      { name: "MySQL Database Management", highlight: true },
      { name: "Data Analysis", highlight: false },
      { name: "SEO", highlight: false },
      { name: "Graphic Design", highlight: false },
      { name: "Google AdSense", highlight: false },
      { name: "Android Software Servicing", highlight: false },
    ],
    tools: [],
  },
];

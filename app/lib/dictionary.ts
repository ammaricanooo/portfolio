export type Locale = "en" | "id";

export interface ProjectItem {
  id: string;
  title: string;
  tech: string;
  url: string;
  year: string;
  desc: {
    en: string;
    id: string;
  };
  img: string;
}

export interface ActivityItem {
  id: string;
  title: {
    en: string;
    id: string;
  };
  subtitle: {
    en: string;
    id: string;
  };
  location: string;
  year: string;
  desc: {
    en: string;
    id: string;
  };
  tag: {
    en: string;
    id: string;
  };
  image: string;
  aspectRatio?: string;
}

export const DICTIONARY = {
  en: {
    locale: "en" as Locale,
    nav: {
      home: "Home",
      about: "About",
      work: "Work",
      contact: "Contact",
      navigation: "Navigation",
      api: "API",
    },
    home: {
      role: "Software Engineer",
      heroText:
        "SOFTWARE ENGINEER ROOTED IN BOGOR, INDONESIA. EXPLORING MODERN WEB ARCHITECTURE, ROBUST BACKEND SYSTEMS, AND INTUITIVE DIGITAL EXPERIENCES. TURNING LOGIC, CLEAN CODE, AND CREATIVE PROBLEM SOLVING INTO REAL-WORLD SOLUTIONS THAT MATTER. THE JOURNEY STARTS HERE.",
      aboutText:
        "Hi, I'm Ammar. A Software Engineer based in Bogor, Indonesia. From crafting public service web platforms with Laravel and Next.js to building high-performance backend systems and interactive web applications — I believe great software isn't just about how complex your code is, but how reliably and elegantly it solves real problems for people.",
      marquee1: [
        "Full-Stack Web Development",
        "Modern Web Architecture",
        "Backend & API Engineering",
        "Clean & Scalable Code",
        "Performance Optimization",
      ],
      marquee2: [
        "Next.js",
        "Laravel",
        "TypeScript",
        "React",
        "Node.js",
        "PostgreSQL",
        "Tailwind CSS",
        "RESTful APIs",
        "Docker",
        "Git",
      ],
      circleLabel: "Motto & Philosophy",
      circleWords: ["Aim for the", "Stars, ", "One", "Line", "at", "a", "Time"],
      techLabel: "Most Favorite Tech",
      workHeading: "Selected",
      workEmphasis: "Work",
      workLabel: "(Projects / '23–'26)",
      contactHeading: "Let's Have ",
      contactEmphasis: " a Chat",
      contactBody: "Whether it's an idea or just a hello — my inbox is open.",
      contactBtn: "Get in Touch",
      basedIn: "Based in Indonesia",
    },
    about: {
      basedIn: "Based in Indonesia",
      roleBadge: "Engineer",
      heroScramble: "An Ever-Growing",
      heroTitle: "Software Engineer",
      journeyHeading: "A Journey of Progression",
      journeyParagraphs: [
        "My passion for technology sparked at age nine after watching 'Who Am I' — captivated by how lines of code typed into a screen could move and interact with the world. Growing up in Cikaret, Bogor, in a humble family, resources were limited. Working with an old, modest computer in the quiet corner of my room, I taught myself programming from the ground up, turning technical hurdles into resilience and a relentless drive to learn.",
        "That self-taught foundation met real-world responsibility during my internship at Diskominfo Kota Bogor (E-Government), where I developed web systems with Laravel to serve municipal public needs. Concurrently, through the Champion Ambassador Project (CAP) Fase II, I pushed past social anxiety, mastered emotional resilience, and cultivated leadership skills — learning to communicate complex ideas and collaborate effectively across diverse teams.",
        "Throughout my journey, I have focused on engineering dependable, user-centered software — from full-stack platforms to scalable APIs. Guided by the principle 'Bermimpilah setinggi langit, agar jika terjatuh tetap berada di antara bintang,' I continuously sharpen my craftsmanship to build systems that don't just work cleanly, but bring meaningful value to everyday life.",
      ],
      techHeading:
        "In my engineering process, I believe technology should solve real problems without unnecessary complexity. From full-stack web platforms and backend APIs to modern frontend architectures, I selectively choose modern tools that deliver reliable performance and meaningful impact.",
      techCategories: [
        {
          label: "Web & Frameworks",
          items: ["Next.js", "React", "Laravel", "Tailwind CSS", "TypeScript"],
        },
        {
          label: "Backend & Systems",
          items: ["PHP", "Node.js", "Express.js", "Python", "RESTful APIs"],
        },
        {
          label: "Database & Cloud",
          items: ["PostgreSQL", "MySQL", "Prisma", "Docker", "Nginx"],
        },
        {
          label: "DevOps & Tools",
          items: ["Git & GitHub", "Linux / Bash", "Postman", "CI/CD", "Vercel"],
        },
        {
          label: "Architecture & Practices",
          items: ["Clean Architecture", "MVC Pattern", "API Design", "Performance Optimization", "Agile Collaboration"],
        },
      ],
      activitiesHeading: "Activities & Milestones",
      activitiesSub: "Champion Ambassador Project · Bootcamps · Leadership",
      activitiesBadge: "(Activities / '24–'26)",
      interestHeading: "Personal Interest",
      interestP1:
        "Outside the terminal and coding environments, I unwind with upbeat Pop tracks and playlist rhythms that keep my focus sharp during long engineering sessions. When I need a creative reset, you'll find me rewatching high-octane action-thriller films — the very genre that first sparked my curiosity in programming years ago.",
      interestP2:
        "Staying active and balanced is just as essential. I love hitting the badminton court for a fast-paced rally with friends, reading modern software engineering trends, and exploring innovative digital products. Balancing physical activity, music, and quiet problem-solving keeps my mind grounded and creative.",
      ctaHeading: "From Clean Architecture to Scalable Web Systems — Let's Build Together.",
      ctaBtn: "Contact Me",
    },
    work: {
      heroLabel: "/03 Works",
      heroTitle: "Selected Projects",
      heroMeta: "Web Systems · Backend Architecture · Modern Interfaces",
      countLabel: "Total Projects Completed",
      countDesc: "Engineered from concept to deployment with clean architecture, security, and responsive design.",
      viewCode: "Source Code",
      liveDemo: "Live Demo",
      bottomCtaTitle: "Have a Project in Mind?",
      bottomCtaSub: "Whether you need a full-stack web platform, a robust API, or a modern digital product, let's connect.",
      bottomCtaBtn: "Get in Touch",
    },
    footer: {
      rights: "© 2026 — Ammar Abdul Malik",
      city: "Bogor, Indonesia",
    },
  },

  id: {
    locale: "id" as Locale,
    nav: {
      home: "Beranda",
      about: "Tentang",
      work: "Proyek",
      contact: "Kontak",
      navigation: "Navigasi",
      api: "API",
    },
    home: {
      role: "Software Engineer",
      heroText:
        "SOFTWARE ENGINEER ASAL BOGOR, INDONESIA. MENGEKSPLORASI ARSITEKTUR WEB MODERN, SISTEM BACKEND YANG TANGGUH, DAN PENGALAMAN DIGITAL YANG MULUS. MENGUBAH LOGIKA, KODE BERSIH, DAN SEMANGAT BELAJAR MENJADI SOLUSI NYATA YANG BERDAMPAK. PERJALANAN DIMULAI DARI SINI.",
      aboutText:
        "Halo, saya Ammar. Seorang Software Engineer asal Bogor, Indonesia. Dari merancang platform web layanan publik dengan Laravel dan Next.js hingga membangun API berkinerja tinggi serta aplikasi web interaktif — saya percaya perangkat lunak yang hebat bukan sekadar seberapa rumit baris kode yang dibuat, melainkan seberapa andal dan elegan solusinya dalam membantu sesama.",
      marquee1: [
        "Pengembangan Web Full-Stack",
        "Arsitektur Web Modern",
        "Rekayasa Backend & API",
        "Kode Bersih & Skalabel",
        "Optimasi Performa",
      ],
      marquee2: [
        "Next.js",
        "Laravel",
        "TypeScript",
        "React",
        "Node.js",
        "PostgreSQL",
        "Tailwind CSS",
        "RESTful APIs",
        "Docker",
        "Git",
      ],
      circleLabel: "Motto & Filosofi",
      circleWords: ["Bermimpilah", "Setinggi Langit, ", "Satu", "Baris", "Demi", "Satu", "Baris"],
      techLabel: "Teknologi Favorit",
      workHeading: "Karya",
      workEmphasis: "Terpilih",
      workLabel: "(Proyek / '23–'26)",
      contactHeading: "Mari",
      contactEmphasis: "Berbincang",
      contactBody: "Ada ide proyek atau sekadar ingin menyapa — pintu surel saya selalu terbuka.",
      contactBtn: "Hubungi Saya",
      basedIn: "Berbasis di Indonesia",
    },
    about: {
      basedIn: "Berbasis di Indonesia",
      roleBadge: "Engineer",
      heroScramble: "Perjalanan yang",
      heroTitle: "Terus Bertumbuh",
      journeyHeading: "Perjalanan Bertumbuh",
      journeyParagraphs: [
        "Ketertarikan saya pada dunia teknologi terpantik sejak usia sembilan tahun setelah menonton film 'Who Am I' — terpesona melihat bagaimana baris kode di layar dapat menggerakkan sistem nyata. Tumbuh besar di Cikaret, Bogor, dalam keluarga bersahaja, fasilitas sangatlah terbatas. Dengan komputer tua di sudut kamar, saya belajar pemrograman secara otodidak dari nol, mengubah keterbatasan menjadi ketangguhan dan tekad untuk terus belajar.",
        "Fondasi belajar mandiri tersebut menemukan ruang tanggung jawab nyata saat magang di Diskominfo Kota Bogor (E-Government), di mana saya mengembangkan sistem web berbasis Laravel untuk melayani kebutuhan publik. Di saat bersamaan, melalui Champion Ambassador Project (CAP) Fase II, saya belajar menembus kecemasan sosial, mematangkan emosi, serta mengasah kepemimpinan dan komunikasi lintas tim.",
        "Sepanjang perjalanan ini, fokus saya tertuju pada perancangan software yang andal dan berpusat pada pengguna — mulai dari aplikasi web full-stack hingga arsitektur backend yang skalabel. Berpegang pada prinsip 'Bermimpilah setinggi langit, sehingga jika terjatuh engkau tetap berada di antara bintang-bintang,' saya terus mengasah keahlian rekayasa perangkat lunak untuk menghasilkan karya yang memberi nilai nyata bagi kehidupan.",
      ],
      techHeading:
        "Dalam proses rekayasa perangkat lunak, saya percaya teknologi harus memecahkan masalah nyata tanpa kerumitan yang tak perlu. Dari platform web full-stack dan API backend hingga arsitektur frontend modern, saya memilih teknologi yang memberikan keandalan serta dampak nyata.",
      techCategories: [
        {
          label: "Web & Frameworks",
          items: ["Next.js", "React", "Laravel", "Tailwind CSS", "TypeScript"],
        },
        {
          label: "Backend & Sistem",
          items: ["PHP", "Node.js", "Express.js", "RESTful APIs", "Python"],
        },
        {
          label: "Database & Cloud",
          items: ["PostgreSQL", "MySQL", "Prisma", "Docker", "Nginx"],
        },
        {
          label: "DevOps & Tools",
          items: ["Git & GitHub", "Linux / Bash", "Postman", "CI/CD", "Vercel"],
        },
        {
          label: "Arsitektur & Praktik",
          items: ["Clean Architecture", "MVC Pattern", "Desain Responsif", "Desain API", "Kolaborasi Agile"],
        },
      ],
      activitiesHeading: "Kegiatan & Pengalaman",
      activitiesSub: "Champion Ambassador Project · Bootcamp · Kepemimpinan",
      activitiesBadge: "(Kegiatan / '24–'26)",
      interestHeading: "Minat Personal",
      interestP1:
        "Di luar baris perintah terminal dan kode program, saya melepas penat dengan alunan musik Pop yang menjaga fokus tetap tajam saat sesi koding panjang. Ketika butuh penyegaran ide, saya kerap menonton kembali film-film aksi-thriller — genre yang pertama kali memantik rasa penasaran saya pada dunia koding bertahun-tahun silam.",
      interestP2:
        "Menjaga tubuh tetap aktif dan seimbang juga sangat krusial bagi saya. Saya gemar bermain badminton bersama teman-teman, membaca perkembangan tren arsitektur software terbaru, dan mengeksplorasi ide-ide produk digital baru. Keseimbangan antara aktivitas fisik, musik, dan pemecahan logika membuat pikiran tetap jernih dan kreatif.",
      ctaHeading: "Dari Arsitektur Bersih Hingga Sistem Web Skalabel — Mari Berkarya Bersama.",
      ctaBtn: "Hubungi Saya",
    },
    work: {
      heroLabel: "/03 Proyek",
      heroTitle: "Karya Terpilih",
      heroMeta: "Sistem Web · Arsitektur Backend · Aplikasi Full-Stack",
      countLabel: "Total Proyek yang Diselesaikan",
      countDesc: "Dirancang dan dibangun dari konsep hingga deployment dengan arsitektur bersih, keamanan, dan responsivitas.",
      viewCode: "Kode Sumber",
      liveDemo: "Lihat Demo",
      bottomCtaTitle: "Punya Ide Proyek?",
      bottomCtaSub: "Baik platform web full-stack, backend API, maupun produk digital modern, mari diskusikan ide Anda.",
      bottomCtaBtn: "Hubungi Saya",
    },
    footer: {
      rights: "© 2026 — Ammar Abdul Malik",
      city: "Bogor, Indonesia",
    },
  },
};

export function getDictionary(lang: Locale) {
  return DICTIONARY[lang] || DICTIONARY.en;
}

export function getLocalizedPath(pathname: string, targetLang: Locale): string {
  if (!pathname) return `/${targetLang}`;
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "en" || segments[0] === "id") {
    segments[0] = targetLang;
  } else {
    segments.unshift(targetLang);
  }
  return `/${segments.join("/")}`;
}


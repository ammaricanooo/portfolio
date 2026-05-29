import { prisma } from "../app/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.branch.deleteMany();
  await prisma.education.deleteMany();
  await prisma.project.deleteMany();

  // ── Projects ─────────────────────────────────────────────────────────────
  await prisma.project.createMany({
    data: [
      {
        order: 1,
        title: "Arnime",
        tech: "Next.js, Tailwind, FireBase",
        url: "#",
        year: "2024",
        desc: "Anime streaming platform with server-side rendering, dynamic routing, and PostgreSQL-backed watchlist.",
        img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=900&auto=format&fit=crop",
      },
      {
        order: 2,
        title: "Al-Qur'an Ku",
        tech: "Next.js, Tailwind, FireBase",
        url: "#",
        year: "2024",
        desc: "Digital Qur'an reader with surah navigation, verse bookmarking, and audio recitation support.",
        img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=900&auto=format&fit=crop",
      },
      {
        order: 3,
        title: "Parqeer",
        tech: "Laravel, Tailwind, MySQL",
        url: "#",
        year: "2023",
        desc: "Real-time parking slot management system with live availability updates via WebSocket.",
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop",
      },
      {
        order: 4,
        title: "Diskominfo Company Profile",
        tech: "Laravel, Tailwind, MySQL",
        url: "#",
        year: "2023",
        desc: "Government agency company profile with headless CMS integration and accessibility compliance.",
        img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop",
      },
      {
        order: 5,
        title: "Nexure API",
        tech: "Node.js, Express.js",
        url: "#",
        year: "2023",
        desc: "RESTful API boilerplate with JWT auth, role-based access control, and auto-generated docs.",
        img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=900&auto=format&fit=crop",
      },
      {
        order: 6,
        title: "Telebot Go",
        tech: "Golang",
        url: "#",
        year: "2023",
        desc: "Telegram bot built in Go with command routing, webhook support, and automated message scheduling.",
        img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=900&auto=format&fit=crop",
      },
    ],
  });

  // ── Education ─────────────────────────────────────────────────────────────
  const sd = await prisma.education.create({
    data: {
      order: 1,
      year: "2017",
      title: "SD",
      subtitle: "Sekolah Dasar",
      desc: "Memulai fondasi belajar, mengasah logika dasar matematika, dan menumbuhkan rasa ingin tahu yang tinggi terhadap dunia teknologi komputer.",
    },
  });

  const smp = await prisma.education.create({
    data: {
      order: 2,
      year: "2020",
      title: "SMP",
      subtitle: "Sekolah Menengah Pertama",
      desc: "Memperdalam kemampuan berpikir analitis, memecahkan algoritma logika dasar, dan mulai bereksperimen dengan pemrograman web sederhana.",
    },
  });

  const smk = await prisma.education.create({
    data: {
      order: 3,
      year: "2023",
      title: "SMK",
      subtitle: "Teknik Komputer dan Jaringan",
      desc: "Mempelajari arsitektur jaringan komputer, administrasi server Linux, sistem keamanan siber, dan aktif memimpin di berbagai organisasi intra/ekstra sekolah.",
    },
  });

  await prisma.branch.createMany({
    data: [
      {
        educationId: smk.id,
        label: "OSIS",
        desc: "Mengembangkan keterampilan kepemimpinan dan manajemen organisasi melalui kepanitiaan sekolah.",
      },
      {
        educationId: smk.id,
        label: "Pramuka",
        desc: "Membentuk kemandirian, kedisiplinan lapangan, dan kerja sama tim yang tangguh dalam kepramukaan.",
      },
      {
        educationId: smk.id,
        label: "Paskibra",
        desc: "Melatih fokus tingkat tinggi, ketahanan fisik, patriotisme, serta kedisiplinan dalam baris-berbaris resmi.",
      },
      {
        educationId: smk.id,
        label: "Magang IT",
        desc: "Menjalani magang industri untuk mengonfigurasi jaringan real-world, instalasi server, dan pemeliharaan infrastruktur IT.",
      },
    ],
  });

  await prisma.education.create({
    data: {
      order: 4,
      year: "2025",
      title: "Self-Learning",
      subtitle: "Software Engineering",
      desc: "Memperkuat keahlian full-stack dengan mengerjakan proyek mandiri berskala industri, menguasai modern web framework, serta mendalami best practices arsitektur server.",
    },
  });

  console.log("✅ Seed complete!");
  console.log(`   Projects : 6`);
  console.log(`   Education: 4 milestones (SD, SMP, SMK, Self-Learning)`);
  console.log(`   Branches : 4 (OSIS, Pramuka, Paskibra, Magang IT under SMK)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

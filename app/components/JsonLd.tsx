export function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://ammaricano.my.id/#person",
    name: "Ammar Abdul Malik",
    alternateName: "ammaricano",
    url: "https://ammaricano.my.id",
    jobTitle: "Software Engineer",
    description:
      "Software Engineer based in Bogor, Indonesia specializing in full-stack web development with Next.js, Laravel, Node.js, and modern cloud infrastructure.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bogor",
      addressRegion: "West Java",
      addressCountry: "ID",
    },
    sameAs: [
      "https://linkedin.com/in/ammaricano",
      "https://github.com/ammaricanooo",
      "https://instagram.com/ammaricano",
      "https://threads.com/@ammaricano",
    ],
    knowsAbout: [
      "Full-Stack Web Development",
      "Backend Engineering",
      "System Administration",
      "Clean Architecture",
      "API Design",
      "Next.js",
      "Laravel",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Nginx",
      "Docker",
      "Cloudflare Tunnels",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Software Engineer",
      occupationLocation: {
        "@type": "Country",
        name: "Indonesia",
      },
      skills: "Next.js, Laravel, Node.js, TypeScript, PostgreSQL, Nginx, Docker",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://ammaricano.my.id/#website",
    url: "https://ammaricano.my.id",
    name: "Ammar Abdul Malik — Software Engineer",
    description:
      "Portfolio website of Ammar Abdul Malik, a Software Engineer based in Indonesia.",
    author: { "@id": "https://ammaricano.my.id/#person" },
    inLanguage: "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ammar Abdul Malik",
    url: "https://ammaricano.dev",
    jobTitle: "Software Engineer",
    description:
      "Software Engineer based in Indonesia specializing in full-stack web development, building seamless digital solutions with clean code.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bogor",
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
      "Next.js",
      "Laravel",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "System Administration",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

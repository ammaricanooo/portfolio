export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "id" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <div data-lang={lang}>{children}</div>;
}


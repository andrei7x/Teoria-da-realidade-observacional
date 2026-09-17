import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Teoria da Realidade Observacional", template: "%s | Realidade Observacional" },
  description: "Ensaio filosófico sobre consciência, avatar, metacognição, narrativa e níveis observacionais da realidade.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="cosmos" aria-hidden="true" />
        <header className="topbar">
          <Link className="brand" href="/">Realidade Observacional</Link>
          <nav>
            <Link href="/">Início</Link>
            <Link href="/reflexoes">Reflexões</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </header>
        {children}
        <footer className="footer">Teoria da Realidade Observacional · ensaio filosófico, não teoria física.</footer>
      </body>
    </html>
  );
}

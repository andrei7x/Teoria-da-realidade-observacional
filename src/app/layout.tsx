import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Teoria da Realidade Observacional", template: "%s | Realidade Observacional" },
  description: "Ensaio filosófico sobre consciência, avatar, metacognição, narrativa e níveis observacionais da realidade.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

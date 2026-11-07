import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serfinanza Action Hub",
  description: "Copiloto contextual para asesores de oficina",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}

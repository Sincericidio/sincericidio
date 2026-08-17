import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SINCERICIDIO 🔥 | No te fíes ni de tu mejor amigo",
  description: "El juego de fiesta de misiones secretas, sospechas y juicios sociales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-[#0B0E14] text-white">
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-openSans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Batteriespeicher-Rechner",
  description: "Wirtschaftlichkeitsrechner für Batteriespeicher",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${openSans.variable} h-full antialiased light`}
    >
      <body className="bg-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

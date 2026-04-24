import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { GlobalFooter } from "@/components/global-footer";

const openSans = Open_Sans({
  variable: "--font-openSans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Batteriespeicher Deutschland | Großspeicher &amp; Gewerbespeicher | MySolar PV - MySolar PV GmbH",
  description: "MySolar PV Deutschland: Schlüsselfertige Batteriespeicher für Industrie, Gewerbe &amp; Energieversorger. Planung, Bau, Marktanbindung - alles aus einer Hand.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${openSans.variable} h-full antialiased light`}
    >
      <body className="bg-white min-h-screen flex flex-col">
        {children}
        <GlobalFooter />
      </body>
    </html>
  );
}

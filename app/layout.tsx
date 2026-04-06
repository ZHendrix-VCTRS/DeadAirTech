import type { Metadata } from "next";
import { IBM_Plex_Mono, Press_Start_2P } from "next/font/google";
import { ScanLines } from "@/components/brand/scan-lines";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkiGameProvider } from "@/components/ski-game-provider";
import { HERO_TAGLINE, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: HERO_TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart.variable} ${ibmMono.variable}`}>
      <body className="flex min-h-screen flex-col font-body">
        <SkiGameProvider>
          <ScanLines />
          <SiteHeader />
          <main className="relative z-[1] mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">{children}</main>
          <SiteFooter />
        </SkiGameProvider>
      </body>
    </html>
  );
}

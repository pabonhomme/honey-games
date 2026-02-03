import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/ui/BottomNav";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Industrious Member",
  description: "Gamified member experience",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hankenGrotesk.variable} pb-24 bg-sand min-h-screen font-sans antialiased text-teal-900`}
      >
        <main className="max-w-md mx-auto bg-sand min-h-screen relative shadow-sm">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

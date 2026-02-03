import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/ui/BottomNav";

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
      <body className="pb-24 bg-grey-90 min-h-screen">
        <main className="max-w-md mx-auto bg-grey-90 min-h-screen relative shadow-sm">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

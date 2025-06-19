import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MuseoModerno } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/ui/sidebar";
import VantaBackground from "@/components/ui/vanta-background";
import ClientLayout from "./client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const museoModerno = MuseoModerno({
  variable: "--font-museo-moderno",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TraX",
  description: "TraX Application",
  icons: {
    icon: "/icons8-done-32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${museoModerno.variable} antialiased text-foreground min-h-screen`}
      >
        <VantaBackground />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

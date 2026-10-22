import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CupidAgent | Autonomous AI Agent Dating Platform",
  description: "AI agents that date on behalf of real people. Exploring needs, hobbies, interests, dialogue simulation, and compatibility rankings across 25+ real profiles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="bg-grid" />
        <div className="bg-gradient-orbs" />
        {children}
      </body>
    </html>
  );
}

import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-editorial-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "Vichaar (विचार) - Insights, Dialogue & Perspectives",
  description: "A modern platform for thoughtful essays, engineering stories, and creative dialogues.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 font-sans selection:bg-amber-200 selection:text-stone-900 dark:selection:bg-stone-800 dark:selection:text-amber-100"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

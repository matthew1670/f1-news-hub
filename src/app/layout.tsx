import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "F1 News Hub",
  description: "All the latest Formula 1 news in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>

        <main>{children}</main>

        <footer className="border-t p-4 text-sm opacity-60">
          &copy; 2024 F1 News Hub. Data sourced from public RSS feeds.
        </footer>
        <Analytics/> 
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "AWS Practice App",
  description: "Next.js on AWS with SST — upload files to S3 and browse them in the gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-xl items-center gap-6 px-4 py-3 text-sm font-medium">
            <Link href="/" className="text-slate-900 hover:text-blue-600">
              Upload
            </Link>
            <Link href="/gallery" className="text-slate-600 hover:text-blue-600">
              Gallery
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

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
  title: "Simple URL Shortener",
  description: "A simple URL shortener with analytics using Next.js + Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        {/* 🌐 Navbar */}
        <header className="bg-white shadow">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              🔗 URL Shortener
            </Link>
            <div className="space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
            </div>
          </nav>
        </header>

        {/* Page Content */}
        <main className="container mx-auto px-6 py-8">{children}</main>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-6">
          © {new Date().getFullYear()} Simple URL Shortener
        </footer>
      </body>
    </html>
  );
}

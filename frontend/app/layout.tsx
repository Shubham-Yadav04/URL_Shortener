import type { Metadata, Viewport } from "next";
import "./globals.css";
import MouseFollow from "@/components/animation/MouseFollow";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Shorten.it — Editorial Link Infrastructure & Analytics",
  description: "A fast, privacy-conscious URL shortener with real-time analytics, custom slugs, and instant QR generation.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode; 
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#faf8f5] dark:bg-[#09090b] text-[#141413] dark:text-[#f5f5f2] flex flex-col font-sans transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <MouseFollow />
            {auth}
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

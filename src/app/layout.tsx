import type { Metadata } from "next";
//import localFont from "next/font/local";
import "./globals.css";
import { inter } from "./fonts/fonts";
import { Toaster } from "react-hot-toast";
import { NextAuthProvider } from "./providers";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* min-h-screen antialiased */}
      <body className={`${inter.className} `}>
        <NextAuthProvider>
          {children}
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}

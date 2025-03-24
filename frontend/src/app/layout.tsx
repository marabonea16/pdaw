
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderProvider } from "./context/headerContext";
import Header from "./components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Portal Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <HeaderProvider>
          <Header />
          {children}
          <footer style={{ paddingBottom: '20px', paddingTop: '20px' }}
          className="bg-[#2F4F83] text-white w-full flex flex-col justify-center items-center">
            <p>&copy; 2025 University Portal. All rights reserved.</p>
          </footer>
        </HeaderProvider>
      </body>
    </html>
  );
}

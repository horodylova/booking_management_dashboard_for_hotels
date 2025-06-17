import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { initKendoLicense } from "./kendo-license-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hotel Booking Management Dashboard",
  description: "A comprehensive dashboard for hotel booking management",
};

export default function RootLayout({ children }) {
  if (typeof window !== 'undefined') {
    initKendoLicense();
  }
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

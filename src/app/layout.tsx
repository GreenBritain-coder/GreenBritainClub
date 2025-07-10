import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenBritain.Club - Premium Cannabis Products UK | London, Manchester, Birmingham",
  description: "Premium cannabis products available across all major UK cities. Join our Telegram community @GBShopXBot for exclusive deals and discreet delivery. London, Manchester, Birmingham, Leeds, Liverpool, Sheffield, Bristol, Glasgow, Edinburgh, Cardiff and more.",
  keywords: [
    "cannabis UK",
    "weed delivery London",
    "cannabis Manchester",
    "weed Birmingham",
    "cannabis Leeds",
    "weed Liverpool",
    "cannabis Sheffield",
    "weed Bristol",
    "cannabis Glasgow",
    "weed Edinburgh",
    "cannabis Cardiff",
    "weed Newcastle",
    "cannabis Nottingham",
    "weed Leicester",
    "cannabis Coventry",
    "weed Bradford",
    "cannabis Stoke",
    "weed Wolverhampton",
    "cannabis Plymouth",
    "weed Southampton",
    "cannabis Reading",
    "GreenBritain",
    "GBShopXBot",
    "Telegram cannabis",
    "UK cannabis delivery",
    "premium cannabis",
    "discreet delivery",
    "cannabis community"
  ],
  authors: [{ name: "GreenBritain.Club" }],
  creator: "GreenBritain.Club",
  publisher: "GreenBritain.Club",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://greenbritain.club'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "GreenBritain.Club - Premium Cannabis Products UK",
    description: "Premium cannabis products available across all major UK cities. Join our Telegram community for exclusive deals.",
    url: 'https://greenbritain.club',
    siteName: 'GreenBritain.Club',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "GreenBritain.Club - Premium Cannabis Products UK",
    description: "Premium cannabis products available across all major UK cities. Join our Telegram community for exclusive deals.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GreenBritain.Club" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

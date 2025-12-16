import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { APP_METADATA } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_METADATA.TITLE,
    template: '%s | XandScan',
  },
  description: APP_METADATA.DESCRIPTION,
  keywords: APP_METADATA.KEYWORDS,
  authors: [{ name: 'XandScan Team' }],
  creator: 'XandScan',
  publisher: 'XandScan',
  metadataBase: new URL(APP_METADATA.SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_METADATA.SITE_URL,
    title: APP_METADATA.TITLE,
    description: APP_METADATA.DESCRIPTION,
    siteName: 'XandScan',
    images: [
      {
        url: APP_METADATA.OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'XandScan - Xandeum pNode Explorer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_METADATA.TITLE,
    description: APP_METADATA.DESCRIPTION,
    images: [APP_METADATA.OG_IMAGE],
    creator: '@xandeum',
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

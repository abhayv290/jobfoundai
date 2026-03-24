import ClerkProvider from '@/services/clerk/components/ClerkProvider';
import './globals.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import UploadThingSSR from '@/services/uploadthing/components/UploadThingSSR';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"),
  title: "JobFoundAi",
  description: "AI-powered job search app to help you land your dream job with AI resume filtering and resume optimization based on job descriptions",
  keywords: ["job search", "AI resume", "job listings", "resume builder", "job finder"],
  authors: [{ name: "JobFoundAi" }],
  openGraph: {
    title: "JobFoundAi",
    description: "AI-powered job search app to help you land your dream job",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobFoundAi",
    description: "AI-powered job search app to help you land your dream job",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
        >
          {children}
          <Toaster />
          <UploadThingSSR />
        </body>
      </html>
    </ClerkProvider>
  );
}

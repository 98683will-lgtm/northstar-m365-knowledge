import type { Metadata } from "next";
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
  metadataBase: new URL("https://northstar-knowledge.example"),
  title: "Northstar | Microsoft 365 Knowledge Demo",
  description:
    "A permission-aware enterprise knowledge search MVP for Microsoft 365.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Northstar | Answers grounded in your Microsoft 365 knowledge",
    description:
      "Search Teams, SharePoint, Outlook, Azure DevOps, and Power BI with citations and source permissions preserved.",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}

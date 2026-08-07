import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { OrcaChatbot } from "@/components/orca-chatbot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orcait.com.au"),
  title: {
    default: "Orca IT | Managed IT Support for Australian Businesses",
    template: "%s | Orca IT",
  },
  description:
    "Simple, secure and reliable managed IT support, cyber security, cloud solutions and technology advice for Australian businesses.",
  keywords: [
    "managed IT support",
    "IT services Australia",
    "cyber security",
    "cloud solutions",
    "Orca IT",
  ],
  openGraph: {
    title: "Orca IT | Technology that works for you",
    description:
      "Simple, secure and reliable technology support for Australian businesses.",
    url: "https://orcait.com.au",
    siteName: "Orca IT",
    locale: "en_AU",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/orca-icon.png?v=5", type: "image/png", sizes: "512x512" },
      { url: "/favicon.png?v=5", type: "image/png", sizes: "64x64" },
    ],
    shortcut: [{ url: "/orca-icon.png?v=5", type: "image/png" }],
    apple: [{ url: "/apple-icon.png?v=5", sizes: "512x512", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <OrcaChatbot />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pmkmipa.web.id"),
  title: {
    default: "PMK MIPA Undana - Persekutuan Mahasiswa Kristen FST Undana",
    template: "%s | PMK MIPA Undana",
  },
  description:
    "Website resmi Persekutuan Mahasiswa Kristen (PMK) MIPA Fakultas Sains dan Teknik (FST) Universitas Nusa Cendana (Undana) Kupang. Komunitas rohani mahasiswa Kristen yang berakar, bertumbuh, dan berbuah dalam Kristus.",
  keywords: [
    "PMK MIPA",
    "PMK MIPA Undana",
    "PMK",
    "Persekutuan Mahasiswa Kristen",
    "Organisasi Kristen Undana",
    "Organisasi Undana",
    "FST Undana",
    "Fakultas Sains dan Teknik",
    "Universitas Nusa Cendana",
    "Mahasiswa Kristen Kupang",
    "KTB PMK MIPA",
    "Ibadah Mahasiswa Undana",
    "Undana Kupang",
    "Kelompok Tumbuh Bersama Undana",
  ],
  authors: [{ name: "Badan Pengurus PMK MIPA Undana", url: "https://pmkmipa.web.id" }],
  creator: "PMK MIPA FST Undana",
  publisher: "PMK MIPA FST Undana",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  verification: {
    google: "3DUU8Ld2G84JjsGHr75dQG4OGuh_rJHJ1yREGzMHwhE",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.png", sizes: "500x500", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "PMK MIPA Undana - Persekutuan Mahasiswa Kristen FST Undana",
    description:
      "Wadah persekutuan, pertumbuhan iman, dan pembinaan mahasiswa Kristen di Fakultas Sains dan Teknik Universitas Nusa Cendana Kupang.",
    url: "https://pmkmipa.web.id",
    siteName: "PMK MIPA Undana",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PMK MIPA FST Universitas Nusa Cendana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PMK MIPA Undana - Persekutuan Mahasiswa Kristen FST Undana",
    description: "Website resmi PMK MIPA FST Universitas Nusa Cendana Kupang.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://pmkmipa.web.id/#organization",
      name: "PMK MIPA FST Universitas Nusa Cendana",
      alternateName: ["PMK MIPA Undana", "Persekutuan Mahasiswa Kristen MIPA Undana"],
      url: "https://pmkmipa.web.id",
      logo: {
        "@type": "ImageObject",
        url: "https://pmkmipa.web.id/logo.png",
        caption: "Logo PMK MIPA Undana",
      },
      image: "https://pmkmipa.web.id/og-image.png",
      description:
        "Persekutuan Mahasiswa Kristen Fakultas Sains dan Teknik Universitas Nusa Cendana Kupang.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kota Kupang",
        addressRegion: "Nusa Tenggara Timur",
        addressCountry: "ID",
      },
      parentOrganization: {
        "@type": "CollegeOrUniversity",
        name: "Universitas Nusa Cendana",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://pmkmipa.web.id/#website",
      url: "https://pmkmipa.web.id",
      name: "PMK MIPA Undana",
      description: "Persekutuan Mahasiswa Kristen FST Universitas Nusa Cendana",
      publisher: {
        "@id": "https://pmkmipa.web.id/#organization",
      },
      inLanguage: "id-ID",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}

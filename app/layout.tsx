import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import { Footer } from "@/components/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dienggo | Sewa Villa, Cabin & Paket Wisata Dieng Premium",
    template: "%s | Dienggo"
  },
  description: "Cari dan pesan villa terbaik, cabin eksklusif, dan paket jeep tour di Dataran Tinggi Dieng. Pengalaman menginap tak terlupakan dengan harga terbaik.",
  keywords: ["villa dieng", "sewa villa dieng", "penginapan dieng", "homestay dieng", "cabin dieng", "jeep tour dieng", "wisata dieng", "dieng plateau", "tiket wisata dieng"],
  authors: [{ name: "Dienggo" }],
  creator: "Dienggo",
  publisher: "Dienggo",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://dienggo.id", // Change to actual URL if different
    title: "Dienggo | Sewa Villa & Paket Wisata Dieng",
    description: "Layanan sewa villa, cabin premium, dan tour jeep di kawasan wisata Dieng.",
    siteName: "Dienggo",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="light" style={{ colorScheme: 'light' }}>
      <body className={`${jakarta.variable} font-sans antialiased bg-white text-slate-900`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

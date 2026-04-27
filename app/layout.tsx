import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import { Footer } from "@/components/Footer";
import "./globals.css";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

  // Maintenance Mode Check
  try {
    const headerList = await headers();
    // In Next.js, we can't easily get the pathname in layout without middleware headers, 
    // but we can check if we are on the maintenance page by checking the 'referer' or other hints,
    // or better, just allow the redirect to happen and Next.js will handle the cycle if any.
    // However, RootLayout is also used by /maintenance, so we must be careful.
    
    // Check maintenance status from DB
    const result = await db.select().from(settings).where(eq(settings.id, 1));
    const isMaintenance = result[0]?.isMaintenanceMode;

    if (isMaintenance) {
      // Check current pathname from our custom header
      const pathname = headerList.get("x-pathname") || "";
      
      // Exclude maintenance, login, and admin paths from redirect
      const isExcluded = 
        pathname.startsWith('/maintenance') || 
        pathname.startsWith('/login') || 
        pathname.startsWith('/admin') ||
        pathname.startsWith('/api');

      if (!isExcluded) {
        // Check if user is admin
        const session = await getServerSession(authOptions);
        const isAdmin = session?.user?.role === "admin";

        if (!isAdmin) {
          redirect('/maintenance');
        }
      }
    }
  } catch (error) {
    console.error("Maintenance check error:", error);
  }

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

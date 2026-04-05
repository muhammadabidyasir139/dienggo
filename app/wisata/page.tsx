import { WisataProps } from "@/components/WisataCard";
import { Navbar } from "@/components/Navbar";
import { SearchBarWisata } from "@/components/SearchBarWisata";
import { WisataClientWrapper } from "./WisataClientWrapper";
import fs from "fs/promises";
import path from "path";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wisata Dieng | Destinasi Liburan Populer di Dieng Plateu",
  description: "Jelajahi tempat wisata terbaik di Dieng: Kawah Sikidang, Candi Arjuna, Telaga Warna, dan Golden Sunrise Sikunir. Dapatkan informasi tiket dan rute terlengkap.",
  keywords: ["wisata dieng", "destinasi dieng", "kawah sikidang", "candi arjuna", "telaga warna", "sikunir sunrise"],
};

async function getWisata(): Promise<WisataProps[]> {
    const filePath = path.join(process.cwd(), "data", "wisata.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(jsonData);
}

export default async function WisataListingPage() {
    const t = await getTranslations("Wisata");
    const wisataData = await getWisata();

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[40vh] w-full bg-slate-900 flex flex-col justify-end">
                <Image
                    src="https://images.unsplash.com/photo-1601235316315-dcfaaf532130?auto=format&fit=crop&q=80&w=1920"
                    alt="Wisata Dieng"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pb-12 w-full h-full pt-16">
                    <p className="text-accent font-bold tracking-widest uppercase text-xs mb-2">{t("breadcrumb")}</p>
                    <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                        {t("hero_title")}
                    </h1>
                    <p className="mt-3 text-sm font-medium text-white flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                        <span className="text-accent drop-shadow-sm font-bold">⭐ 9.2</span> {t("reviews_text")}
                    </p>

                    <SearchBarWisata />
                </div>
            </section>

            {/* Pass data to Client Wrapper to handle Filter State */}
            <WisataClientWrapper data={wisataData} />
        </main>
    );
}

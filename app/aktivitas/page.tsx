import { Navbar } from "@/components/Navbar";
import { AktivitasCard, AktivitasProps } from "@/components/AktivitasCard";
import Image from "next/image";
import fs from "fs/promises";
import path from "path";

interface AktivitasData extends AktivitasProps {
    konten: string;
    foto_galeri?: string[];
}

async function getAktivitas(): Promise<AktivitasData[]> {
    const filePath = path.join(process.cwd(), "data", "aktivitas.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(jsonData);
}

export default async function AktivitasListingPage() {
    const aktivitasData = await getAktivitas();

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[40vh] w-full bg-slate-900">
                <Image
                    src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1920"
                    alt="Aktivitas Dieng"
                    fill
                    priority
                    className="object-cover brightness-[0.4]"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <p className="text-accent font-bold tracking-widest uppercase text-xs mb-3">
                        Dieng / Aktivitas
                    </p>
                    <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                        Aktivitas & Berita
                    </h1>
                    <p className="mt-4 text-sm font-medium text-white/80 md:text-lg max-w-2xl">
                        Info terkini seputar kegiatan, wisata, kuliner, dan budaya di Dataran Tinggi Dieng.
                    </p>
                </div>
            </section>

            {/* Main Content - Grid */}
            <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground mb-8">Semua Artikel</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {aktivitasData.map((item) => (
                        <AktivitasCard key={item.id} {...item} />
                    ))}
                </div>
            </section>
        </main>
    );
}

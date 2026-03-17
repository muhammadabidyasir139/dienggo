import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Wifi, Flame, Droplet, Coffee, Car } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { formatCurrency } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";

const facilityIcons: Record<string, React.ReactNode> = {
    "Perapian": <Flame size={16} className="text-primary dark:text-accent" />,
    "WiFi": <Wifi size={16} className="text-primary dark:text-accent" />,
    "Air Hangat": <Droplet size={16} className="text-primary dark:text-accent" />,
    "Dapur Mini": <Coffee size={16} className="text-primary dark:text-accent" />,
    "Parkir": <Car size={16} className="text-primary dark:text-accent" />
};

async function getCabinBySlug(slug: string) {
    const filePath = path.join(process.cwd(), "data", "cabins.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const cabins = JSON.parse(jsonData);
    return cabins.find((c: { slug: string;[key: string]: unknown }) => c.slug === slug) || null;
}

export default async function CabinDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const cabin = await getCabinBySlug(slug);

    if (!cabin) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-32 md:pb-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <BentoGrid>

                    {/* GALERI - Foto Utama Cabin */}
                    <BentoCard colSpan={2} rowSpan={2} className="relative overflow-hidden p-0 h-[400px] md:h-auto group">
                        <Image
                            src={cabin.foto_utama}
                            alt={cabin.nama}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </BentoCard>

                    {/* GALERI - Foto Kecil 1 */}
                    <BentoCard colSpan={1} className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block">
                        <Image
                            src={cabin.galeri[0]}
                            alt={`${cabin.nama} gallery 1`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </BentoCard>

                    {/* GALERI - Foto Kecil 2 */}
                    <BentoCard colSpan={1} className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block">
                        <Image
                            src={cabin.galeri[1] || cabin.galeri[0]}
                            alt={`${cabin.nama} gallery 2`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </BentoCard>

                    {/* INFO UTAMA */}
                    <BentoCard colSpan={2} className="flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">{cabin.nama}</h1>
                                <div className="flex items-center gap-2 text-neutral-500 font-medium">
                                    <span className="flex items-center gap-1 text-sm bg-accent/20 text-accent-content dark:text-accent px-2 py-0.5 rounded-full font-bold">
                                        ⭐ {cabin.rating}
                                    </span>
                                    <span>({cabin.ulasan} ulasan)</span>
                                </div>
                            </div>
                            <div className="text-left md:text-right bg-primary/5 dark:bg-slate-800 p-4 rounded-2xl">
                                <p className="text-sm text-neutral-500 font-medium mb-1">Mulai dari</p>
                                <p className="text-2xl font-black text-primary dark:text-accent">
                                    {formatCurrency(cabin.harga)}
                                    <span className="text-base font-normal text-neutral-500"> /malam</span>
                                </p>
                            </div>
                        </div>
                    </BentoCard>

                    {/* FASILITAS */}
                    <BentoCard colSpan={1} className="flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent p-2 rounded-lg">🌲</span>
                            Fasilitas Cabin
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {cabin.fasilitas_utama.map((fas: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {facilityIcons[fas] || <span className="h-2 w-2 rounded-full bg-primary" />}
                                    {fas}
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* LOKASI & DESKRIPSI */}
                    <BentoCard colSpan={2}>
                        <h3 className="text-lg font-bold mb-3">Tentang Cabin Ini</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                            {cabin.deskripsi}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-neutral-100 dark:border-slate-800">
                            <div className="bg-primary/10 dark:bg-slate-800 p-3 rounded-full">
                                <MapPin className="text-primary dark:text-accent" size={24} />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <p className="font-bold text-foreground">Lokasi Cabin</p>
                                <p className="text-sm text-neutral-500">{cabin.lokasi}</p>
                            </div>
                            <a
                                href={cabin.koordinat}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-slate-800 text-primary dark:text-white font-bold rounded-xl border border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700 transition text-center"
                            >
                                Lihat Peta
                            </a>
                        </div>
                    </BentoCard>

                    {/* BOOKING CTA */}
                    <BentoCard colSpan={1} className="flex flex-col justify-center bg-gradient-to-br from-primary to-slate-800 text-white border-0">
                        <h3 className="text-xl font-bold mb-2">Ingin menginap di sini?</h3>
                        <p className="text-white/80 text-sm mb-6">Pesan sekarang untuk mendapatkan pengalaman menginap terbaik.</p>

                        <Link
                            href={`/booking/${cabin.slug}?type=cabin`}
                            className="w-full bg-accent text-neutral-900 font-black py-4 rounded-xl text-center hover:scale-[1.02] transition-transform shadow-xl"
                        >
                            Pesan Cabin Ini
                        </Link>
                    </BentoCard>

                </BentoGrid>
            </div>

            <div className="fixed bottom-0 left-0 w-full md:hidden bg-white dark:bg-slate-900 border-t border-neutral-200 dark:border-slate-800 p-4 flex items-center justify-between z-50">
                <div>
                    <p className="text-xs font-semibold text-neutral-500">Mulai dari</p>
                    <p className="text-xl font-black text-primary dark:text-accent">{formatCurrency(cabin.harga)}</p>
                </div>
                <Link
                    href={`/booking/${cabin.slug}?type=cabin`}
                    className="bg-[#1a90ec] text-white font-bold px-8 py-3 rounded-xl transition-all hover:bg-[#1a90ec]/90"
                >
                    Pesan
                </Link>
            </div>
        </main>
    );
}

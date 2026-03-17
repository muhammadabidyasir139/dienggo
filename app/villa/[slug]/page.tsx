import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Wifi, Tv, Droplet, Wind, Coffee, Flame, Car, ConciergeBell } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { formatCurrency } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";

// Icon mapping helper (extended)
const facilityIcons: Record<string, React.ReactNode> = {
    "WiFi": <Wifi size={16} className="text-primary dark:text-accent" />,
    "TV": <Tv size={16} className="text-primary dark:text-accent" />,
    "Air Hangat": <Droplet size={16} className="text-primary dark:text-accent" />,
    "AC": <Wind size={16} className="text-primary dark:text-accent" />,
    "Dapur": <Coffee size={16} className="text-primary dark:text-accent" />,
    "Api Unggun": <Flame size={16} className="text-primary dark:text-accent" />,
    "Parkir": <Car size={16} className="text-primary dark:text-accent" />,
    "Resepsionis 24 Jam": <ConciergeBell size={16} className="text-primary dark:text-accent" />
};

async function getVillaBySlug(slug: string) {
    const filePath = path.join(process.cwd(), "data", "villas.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const villas = JSON.parse(jsonData);
    return villas.find((v: { slug: string;[key: string]: unknown }) => v.slug === slug) || null;
}

export default async function VillaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const villa = await getVillaBySlug(slug);

    if (!villa) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-32 md:pb-24">
            <Navbar />
            {/* Top Navigation Bar / Breadcrumb could go here */}

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <BentoGrid>

                    {/* GALERI - Foto Utama (Besar) */}
                    <BentoCard colSpan={2} rowSpan={2} className="relative overflow-hidden p-0 h-[400px] md:h-auto group">
                        <Image
                            src={villa.foto_utama}
                            alt={villa.nama}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </BentoCard>

                    {/* GALERI - Foto Kecil 1 */}
                    <BentoCard colSpan={1} className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block">
                        <Image
                            src={villa.galeri[0]}
                            alt={`${villa.nama} gallery 1`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </BentoCard>

                    {/* GALERI - Foto Kecil 2 */}
                    <BentoCard colSpan={1} className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block">
                        <Image
                            src={villa.galeri[1] || villa.galeri[0]}
                            alt={`${villa.nama} gallery 2`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {villa.galeri.length > 2 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                                <span className="text-white font-bold text-xl">+{villa.galeri.length - 2} Foto</span>
                            </div>
                        )}
                    </BentoCard>

                    {/* INFO UTAMA */}
                    <BentoCard colSpan={2} className="flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">{villa.nama}</h1>
                                <div className="flex items-center gap-2 text-neutral-500 font-medium">
                                    <span className="flex items-center gap-1 text-sm bg-accent/20 text-accent-content dark:text-accent px-2 py-0.5 rounded-full font-bold">
                                        ⭐ {villa.rating}
                                    </span>
                                    <span>({villa.ulasan} ulasan)</span>
                                </div>
                            </div>
                            <div className="text-left md:text-right bg-primary/5 dark:bg-slate-800 p-4 rounded-2xl">
                                <p className="text-sm text-neutral-500 font-medium mb-1">Mulai dari</p>
                                <p className="text-2xl font-black text-primary dark:text-accent">
                                    {formatCurrency(villa.harga)}
                                    <span className="text-base font-normal text-neutral-500"> /malam</span>
                                </p>
                            </div>
                        </div>
                    </BentoCard>

                    {/* FASILITAS */}
                    <BentoCard colSpan={1} className="flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent p-2 rounded-lg">✨</span>
                            Fasilitas Utama
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {villa.fasilitas_utama.map((fas: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {facilityIcons[fas] || <span className="h-2 w-2 rounded-full bg-primary" />}
                                    {fas}
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* LOKASI & DESKRIPSI (Merged in layout visually) */}
                    <BentoCard colSpan={2}>
                        <h3 className="text-lg font-bold mb-3">Tentang Villa Ini</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                            {villa.deskripsi}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-neutral-100 dark:border-slate-800">
                            <div className="bg-primary/10 dark:bg-slate-800 p-3 rounded-full">
                                <MapPin className="text-primary dark:text-accent" size={24} />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <p className="font-bold text-foreground">Lokasi Akomodasi</p>
                                <p className="text-sm text-neutral-500">{villa.lokasi}</p>
                            </div>
                            <a
                                href={villa.koordinat}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-slate-800 text-primary dark:text-white font-bold rounded-xl border border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700 transition text-center"
                            >
                                Lihat Peta
                            </a>
                        </div>
                    </BentoCard>

                    {/* BOOKING CTA (Desktop) */}
                    <BentoCard colSpan={1} className="flex flex-col justify-center bg-primary-light dark:bg-slate-800 border border-primary/10">
                        <h3 className="text-xl font-bold mb-2 text-foreground">Ingin menginap di sini?</h3>
                        <p className="text-neutral-500 text-sm mb-6">Tentukan tanggal check-in dan check-out untuk melihat ketersediaan kamar.</p>

                        <Link
                            href={`/booking/${villa.slug}?type=villa`}
                            className="w-full bg-primary text-white font-black py-4 rounded-xl text-center hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                        >
                            Lanjutkan Pemesanan
                        </Link>
                        <a
                            href={`https://wa.me/628123456789?text=Halo Admin, saya tertarik untuk memesan Villa ${villa.nama}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 w-full bg-white dark:bg-slate-700 text-primary dark:text-white border border-primary/20 font-bold py-3 rounded-xl text-center hover:bg-neutral-50 dark:hover:bg-slate-600 transition-colors"
                        >
                            Hubungi Admin
                        </a>
                    </BentoCard>

                </BentoGrid>
            </div>

            {/* Sticky Booking Bar for Mobile */}
            <div className="fixed bottom-0 left-0 w-full md:hidden bg-white dark:bg-slate-900 border-t border-neutral-200 dark:border-slate-800 p-4 flex items-center justify-between z-50">
                <div>
                    <p className="text-xs font-semibold text-neutral-500">Total Harga</p>
                    <p className="text-xl font-black text-primary dark:text-accent">{formatCurrency(villa.harga)}</p>
                </div>
                <Link
                    href={`/booking/${villa.slug}?type=villa`}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-xl transition-all hover:bg-primary/90"
                >
                    Pesan
                </Link>
            </div>
        </main>
    );
}

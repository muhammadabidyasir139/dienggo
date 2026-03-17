import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Headset, Globe2, Sparkles, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { TourTimeline } from "@/components/TourTimeline";
import { VideoSlider } from "@/components/VideoSlider";
import { formatCurrency } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";

async function getWisataBySlug(slug: string) {
    const filePath = path.join(process.cwd(), "data", "wisata.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const wisata = JSON.parse(jsonData);
    return wisata.find((w: { slug: string;[key: string]: unknown }) => w.slug === slug) || null;
}

export default async function WisataDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const wisata = await getWisataBySlug(slug);

    if (!wisata) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-32 md:pb-24">
            <Navbar />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <BentoGrid>

                    {/* GALERI - Foto Utama */}
                    <BentoCard colSpan={2} rowSpan={2} className="relative overflow-hidden p-0 h-[400px] md:h-auto group">
                        <Image
                            src={wisata.foto_utama}
                            alt={wisata.nama}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </BentoCard>

                    {/* GALERI - Foto Kecil 1 */}
                    <BentoCard colSpan={1} className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block">
                        <Image
                            src={wisata.galeri[0]}
                            alt={`${wisata.nama} gallery 1`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </BentoCard>

                    {/* GALERI - Foto Kecil 2 */}
                    <BentoCard colSpan={1} className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block">
                        <Image
                            src={wisata.galeri[1] || wisata.galeri[0]}
                            alt={`${wisata.nama} gallery 2`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </BentoCard>

                    {/* INFO UTAMA & HIGHLIGHTS */}
                    <BentoCard colSpan={3} className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">{wisata.nama}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                <span className="flex items-center gap-1.5 text-primary dark:text-accent font-bold">
                                    ⭐ {wisata.rating} ({wisata.ulasan})
                                </span>
                                <span className="flex items-center gap-1.5"><Clock size={16} /> Durasi: {wisata.durasi_wisata || wisata.durasi}</span>
                                <span className="flex items-center gap-1.5"><Globe2 size={16} /> Bahasa: {wisata.bahasa}</span>
                                <span className="flex items-center gap-1.5"><Headset size={16} /> {wisata.kontak}</span>
                            </div>
                        </div>

                        {/* Lokasi Action */}
                        <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 bg-neutral-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-neutral-100 dark:border-slate-800 shrink-0 min-w-[280px]">
                            <div className="flex items-start gap-3 mb-2">
                                <MapPin className="text-primary dark:text-accent shrink-0 mt-0.5" size={20} />
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium leading-snug">{wisata.lokasi}</p>
                            </div>
                            <a
                                href={wisata.koordinat}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-4 py-2 bg-white dark:bg-slate-800 text-primary dark:text-white font-bold rounded-xl border border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700 text-center text-sm"
                            >
                                Buka di Peta
                            </a>
                        </div>
                    </BentoCard>

                    {/* Kolom Kiri: Narasi, Video, Timeline */}
                    <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">

                        <BentoCard>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent p-2 rounded-lg"><Sparkles size={20} /></span>
                                Pengalaman yang menunggumu
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {wisata.narasi?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                                        <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </BentoCard>

                        <BentoCard>
                            <h3 className="text-xl font-bold mb-4">Cuplikan Keseruan</h3>
                            <VideoSlider videos={wisata.video_reels} />
                        </BentoCard>

                        <BentoCard>
                            <h3 className="text-xl font-bold mb-6">Rundown Perjalanan</h3>
                            <TourTimeline items={wisata.rundown} />
                        </BentoCard>

                    </div>

                    {/* Kolom Kanan: Sticky Booking Area */}
                    <div className="md:col-span-1 hidden md:block">
                        <div className="sticky top-24 flex flex-col gap-4">
                            <BentoCard className="flex flex-col items-center text-center bg-gradient-to-b from-primary/5 to-transparent dark:from-slate-800/50">
                                <p className="text-neutral-500 font-medium mb-1">Mulai dari</p>
                                <h2 className="text-4xl font-black text-primary dark:text-accent mb-6">
                                    {wisata.harga === 0 ? "Gratis" : formatCurrency(wisata.harga)}
                                </h2>

                                <Link
                                    href={`/booking/${wisata.slug}?type=wisata`}
                                    className="w-full bg-primary text-white dark:bg-accent dark:text-neutral-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    Pesan Tiket / Tour
                                </Link>

                                <a
                                    href={`https://wa.me/628123456789?text=Halo Admin, saya tertarik untuk memesan Tiket/Tour ${wisata.nama}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 w-full bg-white dark:bg-slate-800 text-primary dark:text-white border border-primary/20 font-bold py-3 rounded-xl text-center hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Hubungi Admin
                                </a>

                                <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
                                    Konfirmasi instan. Bebas reschedule maks. H-1 sebelum keberangkatan.
                                </p>
                            </BentoCard>
                        </div>
                    </div>

                </BentoGrid>
            </div>

            {/* Sticky Booking Bar for Mobile */}
            <div className="fixed bottom-0 left-0 w-full md:hidden bg-white dark:bg-slate-900 border-t border-neutral-200 dark:border-slate-800 p-4 flex items-center justify-between z-50">
                <div>
                    <p className="text-xs font-semibold text-neutral-500">Mulai dari</p>
                    <p className="text-xl font-black text-primary dark:text-accent">
                        {wisata.harga === 0 ? "Gratis" : formatCurrency(wisata.harga)}
                    </p>
                </div>
                <Link
                    href={`/booking/${wisata.slug}?type=wisata`}
                    className="bg-primary dark:bg-accent text-white dark:text-neutral-900 font-bold px-8 py-3 rounded-xl"
                >
                    Pesan Tiket
                </Link>
            </div>
        </main>
    );
}

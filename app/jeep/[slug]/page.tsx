import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Users, CheckCircle2, ShieldAlert } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { formatCurrency } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";

async function getJeepBySlug(slug: string) {
    const filePath = path.join(process.cwd(), "data", "jeeps.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const jeeps = JSON.parse(jsonData);
    return jeeps.find((j: { slug: string;[key: string]: unknown }) => j.slug === slug) || null;
}

export default async function JeepDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const jeep = await getJeepBySlug(slug);

    if (!jeep) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-32 md:pb-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <BentoGrid>

                    {/* GALERI - Foto Utama Jeep */}
                    <BentoCard colSpan={2} rowSpan={2} className="relative overflow-hidden p-0 h-[400px] md:h-auto group">
                        <Image
                            src={jeep.foto_utama}
                            alt={jeep.nama}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </BentoCard>

                    {/* GALERI - Foto Kecil 1 */}
                    <BentoCard colSpan={1} className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block">
                        <Image
                            src={jeep.galeri[0]}
                            alt={`${jeep.nama} gallery 1`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </BentoCard>

                    {/* GALERI - Foto Kecil 2 */}
                    <BentoCard colSpan={1} className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block">
                        <Image
                            src={jeep.galeri[1] || jeep.galeri[0]}
                            alt={`${jeep.nama} gallery 2`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </BentoCard>

                    {/* NAMA PAKET & INFO UTAMA */}
                    <BentoCard colSpan={1} className="flex flex-col justify-center">
                        <h1 className="text-2xl font-black tracking-tight text-foreground mb-4 leading-snug">{jeep.nama}</h1>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-medium">
                                <Clock size={18} className="text-primary dark:text-accent" />
                                <span>Durasi: {jeep.durasi}</span>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-medium">
                                <Users size={18} className="text-primary dark:text-accent" />
                                <span>Maksimum {jeep.maks_orang} Orang</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* LIST DESTINASI */}
                    <BentoCard colSpan={1} className="flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent p-2 rounded-lg"><MapPin size={16} /></span>
                            Destinasi Wisata
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {jeep.destinasi.map((dest: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                                    {dest}
                                </li>
                            ))}
                        </ul>
                    </BentoCard>

                    {/* ISI PAKET & KEBIJAKAN (Merged in row for Desktop) */}
                    <BentoCard colSpan={1} className="flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent p-2 rounded-lg"><CheckCircle2 size={16} /></span>
                            Isi Paket
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {jeep.isi_paket.map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    <span className="text-green-500">✓</span> {item}
                                </li>
                            ))}
                        </ul>
                    </BentoCard>

                    <BentoCard colSpan={2} className="flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                            <span className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg"><ShieldAlert size={16} /></span>
                            Kebijakan & Syarat Ketentuan
                        </h3>
                        <ul className="flex flex-col gap-3 bg-rose-50/50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                            {jeep.kebijakan.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                    <span className="text-rose-500 shrink-0">•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </BentoCard>

                    {/* STICKY BOTTOM SECTION FOR DESKTOP IN BentoGrid */}
                    <BentoCard colSpan={1} className="flex flex-col justify-center bg-gradient-to-br from-primary to-slate-800 text-white border-0 hidden md:flex">
                        <h3 className="text-lg font-medium text-white/80 mb-1">Total Biaya Jeep</h3>
                        <p className="text-3xl font-black text-accent mb-6">
                            {formatCurrency(jeep.harga)}
                            <span className="text-sm font-normal text-white/70"> /jeep</span>
                        </p>

                        <p className="text-sm text-white/90 mb-4">Tentukan tanggal mainmu dan pesan sekarang!</p>
                        <div className="flex bg-white/10 rounded-xl p-3 mb-4 items-center justify-between cursor-pointer hover:bg-white/20 transition-colors">
                            <span className="text-sm font-medium">Pilih Tanggal</span>
                            <span className="text-xs bg-white text-primary px-2 py-1 rounded-md font-bold">Ubah</span>
                        </div>

                        <Link
                            href={`/booking/${jeep.slug}?type=jeep`}
                            className="w-full bg-accent text-neutral-900 font-black py-4 rounded-xl text-center hover:scale-[1.02] transition-transform shadow-xl"
                        >
                            Pesan Sekarang
                        </Link>
                    </BentoCard>

                </BentoGrid>
            </div>

            {/* Sticky Booking Bar for Mobile */}
            <div className="fixed bottom-0 left-0 w-full md:hidden bg-white dark:bg-slate-900 border-t border-neutral-200 dark:border-slate-800 p-4 flex flex-col gap-3 z-50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-neutral-500">Harga per jeep</p>
                        <p className="text-xl font-black text-primary dark:text-accent">{formatCurrency(jeep.harga)}</p>
                    </div>
                    <Link
                        href={`/booking/${jeep.slug}?type=jeep`}
                        className="bg-[#1a90ec] text-white font-bold px-8 py-3 rounded-xl transition-all hover:bg-[#1a90ec]/90"
                    >
                        Pesan
                    </Link>
                </div>
            </div>
        </main>
    );
}

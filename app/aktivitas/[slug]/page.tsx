import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import fs from "fs/promises";
import path from "path";

interface AktivitasItem {
    id: string;
    slug: string;
    judul: string;
    ringkasan: string;
    konten: string;
    kategori: string;
    tanggal: string;
    penulis: string;
    foto_utama: string;
}

function formatTanggal(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

async function getAllAktivitas(): Promise<AktivitasItem[]> {
    const filePath = path.join(process.cwd(), "data", "aktivitas.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(jsonData);
}

export default async function AktivitasDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const allAktivitas = await getAllAktivitas();
    const artikel = allAktivitas.find((a) => a.slug === slug);

    if (!artikel) return notFound();

    // Sidebar: latest articles excluding current
    const latestArticles = allAktivitas
        .filter((a) => a.slug !== slug)
        .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
        .slice(0, 5);

    const paragraphs = artikel.konten.split("\n\n");

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            {/* Hero Image */}
            <div className="relative h-[45vh] w-full bg-slate-900">
                <Image
                    src={artikel.foto_utama}
                    alt={artikel.judul}
                    fill
                    priority
                    className="object-cover brightness-[0.5]"
                />
                <div className="absolute inset-0 flex flex-col items-end justify-end px-4 sm:px-6 lg:px-8 pb-10 max-w-7xl mx-auto w-full">
                    <div className="w-full">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white mb-3">
                            <Tag size={11} />
                            {artikel.kategori}
                        </span>
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg max-w-3xl">
                            {artikel.judul}
                        </h1>
                        <div className="flex items-center gap-4 mt-4 text-white/70 text-sm">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {formatTanggal(artikel.tanggal)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <User size={14} />
                                {artikel.penulis}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content + Sidebar */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
                <Link
                    href="/aktivitas"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-8"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Aktivitas
                </Link>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Article Content */}
                    <article className="flex-1 min-w-0">
                        <div className="prose prose-neutral max-w-none">
                            {paragraphs.map((p, i) => (
                                <p
                                    key={i}
                                    className="text-slate-900 font-medium leading-relaxed text-base mb-5"
                                >
                                    {p}
                                </p>
                            ))}
                        </div>

                        {/* Share / CTA */}
                        <div className="mt-10 pt-6 border-t border-neutral-200">
                            <p className="text-sm text-neutral-500">
                                Ditulis oleh <span className="font-bold text-foreground">{artikel.penulis}</span> · {formatTanggal(artikel.tanggal)}
                            </p>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="sticky top-20 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-primary rounded-full"></span>
                                Berita Terbaru
                            </h3>

                            <div className="flex flex-col gap-4">
                                {latestArticles.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/aktivitas/${item.slug}`}
                                        className="group flex gap-3 items-start"
                                    >
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                                            <Image
                                                src={item.foto_utama}
                                                alt={item.judul}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                                {item.judul}
                                            </p>
                                            <p className="text-xs text-neutral-400 mt-1">
                                                {formatTanggal(item.tanggal)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

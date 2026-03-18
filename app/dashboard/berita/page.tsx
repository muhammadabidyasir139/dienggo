import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import data from "@/data/aktivitas.json";

export default function BeritaDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-foreground">Berita Dieng</h1>
                <p className="text-neutral-500 mt-2">Dapatkan info terbaru seputar festival, kuliner, dan destinasi wisata di Dieng.</p>
            </div>

            {/* Grid Berita */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map((berita) => (
                    <article key={berita.id} className="group bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative aspect-video overflow-hidden">
                            <Image
                                src={berita.foto_utama}
                                alt={berita.judul}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    {berita.kategori}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-center gap-4 text-xs font-medium text-neutral-400 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-primary" />
                                    <span>{new Date(berita.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                                </div>
                                <div className="flex items-center gap-1.5 border-l border-neutral-100 pl-4">
                                    <User size={14} className="text-primary" />
                                    <span>{berita.penulis}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                                {berita.judul}
                            </h3>
                            <p className="text-sm text-neutral-500 mb-6 line-clamp-2 leading-relaxed">
                                {berita.ringkasan}
                            </p>

                            <Link
                                href={`/aktivitas/${berita.slug}`}
                                className="flex items-center gap-2 text-sm font-black text-primary group/btn w-fit"
                            >
                                Baca Selengkapnya
                                <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";

export interface AktivitasProps {
    id: string;
    slug: string;
    judul: string;
    ringkasan: string;
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

export function AktivitasCard({ slug, judul, ringkasan, kategori, tanggal, foto_utama }: AktivitasProps) {
    return (
        <Link
            href={`/aktivitas/${slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-neutral-100 transition-all hover:shadow-xl cursor-pointer"
        >
            <div className="relative h-52 w-full overflow-hidden bg-neutral-100">
                <Image
                    src={foto_utama}
                    alt={judul}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-primary shadow-sm flex items-center gap-1.5">
                        <Tag size={11} />
                        {kategori}
                    </span>
                </div>
            </div>

            <div className="flex flex-col p-5 grow">
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                    <Calendar size={12} />
                    <span>{formatTanggal(tanggal)}</span>
                </div>

                <h3 className="text-base font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">
                    {judul}
                </h3>

                <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed">
                    {ringkasan}
                </p>

                <div className="mt-auto pt-4">
                    <span className="text-xs font-bold text-primary group-hover:underline">
                        Baca Selengkapnya →
                    </span>
                </div>
            </div>
        </Link>
    );
}

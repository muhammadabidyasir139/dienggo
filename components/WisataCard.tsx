import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface WisataProps {
    id: string;
    slug: string;
    nama: string;
    harga: number;
    rating: number;
    ulasan: string;
    lokasi: string;
    foto_utama: string;
}

export function WisataCard({ slug, nama, harga, rating, ulasan, lokasi, foto_utama }: WisataProps) {
    return (
        <Link href={`/wisata/${slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl border border-neutral-100">
            <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                <Image
                    src={foto_utama}
                    alt={nama}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-md px-2 py-1 text-xs font-bold text-white shadow-sm">
                    <Star size={12} className="fill-accent text-accent" />
                    {rating} <span className="text-white/80 font-normal">({ulasan})</span>
                </div>
            </div>

            <div className="flex flex-col p-4 grow">
                <h3 className="text-base font-bold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">{nama}</h3>

                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{lokasi}</span>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between border-t border-neutral-100 ">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Harga tiket mulai</span>
                        <span className="text-sm font-black text-primary ">
                            {harga === 0 ? "Gratis" : formatCurrency(harga)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

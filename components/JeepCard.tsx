import Image from "next/image";
import Link from "next/link";
import { Users, Clock, Map } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface JeepProps {
    id: string;
    slug: string;
    nama: string;
    harga: number;
    maks_orang: number;
    durasi: string;
    destinasi_count: number;
    foto_utama: string;
}

export function JeepCard({ slug, nama, harga, maks_orang, durasi, destinasi_count, foto_utama }: JeepProps) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-neutral-100 transition-all hover:shadow-xl">
            <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                <Image
                    src={foto_utama}
                    alt={nama}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute left-3 top-3 flex items-center gap-1 xl:gap-2">
                    <div className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-neutral-800 shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                        <Users size={12} className="text-primary" /> Maks {maks_orang} Org
                    </div>
                </div>
            </div>

            <div className="flex flex-col p-5 grow">
                <h3 className="text-lg font-bold text-foreground line-clamp-2 md:line-clamp-1 mb-3">{nama}</h3>

                <div className="mb-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Clock size={16} className="text-primary dark:text-accent" />
                        <span>Durasi: {durasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Map size={16} className="text-primary dark:text-accent" />
                        <span>{destinasi_count} Destinasi Wisata</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-slate-800 flex items-end justify-between">
                    <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Mulai dari</p>
                        <p className="text-lg font-bold text-foreground">
                            {formatCurrency(harga)}
                            <span className="text-sm font-normal text-neutral-500">/jeep</span>
                        </p>
                    </div>
                </div>

                <Link
                    href={`/jeep/${slug}`}
                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#1a90ec] py-2.5 font-bold text-white transition-colors hover:bg-[#1a90ec]/90"
                >
                    Lihat Paket
                </Link>
            </div>
        </div>
    );
}

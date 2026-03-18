import Image from "next/image";
import Link from "next/link";
import { Users, Clock, Map } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface JeepProps {
    id: string;
    slug: string;
    nama: string;
    harga: number;
    maksOrang: number;
    durasi: string;
    destinasiCount: number;
    fotoUtama: string;
}

export function JeepCard({ slug, nama, harga, maksOrang, durasi, destinasiCount, fotoUtama }: JeepProps) {
    return (
        <Link href={`/jeep/${slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-neutral-100 transition-all hover:shadow-xl cursor-pointer">
            <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                <Image
                    src={fotoUtama}
                    alt={nama}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute left-3 top-3 flex items-center gap-1 xl:gap-2">
                    <div className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-neutral-800 shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                        <Users size={12} className="text-primary" /> Maks {maksOrang} Org
                    </div>
                </div>
            </div>

            <div className="flex flex-col p-5 grow">
                <h3 className="text-lg font-bold text-foreground line-clamp-2 md:line-clamp-1 mb-3">{nama}</h3>

                <div className="mb-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 ">
                        <Clock size={16} className="text-primary " />
                        <span>Durasi: {durasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 ">
                        <Map size={16} className="text-primary " />
                        <span>{destinasiCount} Destinasi Wisata</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-neutral-100  flex items-end justify-between">
                    <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Mulai dari</p>
                        <p className="text-lg font-bold text-foreground">
                            {formatCurrency(harga)}
                            <span className="text-sm font-normal text-neutral-500">/jeep</span>
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary/90">
                    Lihat Paket
                </div>
            </div>
        </Link>
    );
}

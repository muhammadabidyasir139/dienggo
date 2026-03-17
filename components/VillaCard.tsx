import Image from "next/image";
import Link from "next/link";
import { Star, Wifi, Tv, Droplet, Wind } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Assuming a simplified structure for demonstration
export interface VillaProps {
    id: string;
    slug: string;
    nama: string;
    harga: number;
    rating: number;
    ulasan: number;
    lokasi: string;
    foto_utama: string;
    fasilitas_utama: string[];
}

// Icon mapping helper
const facilityIcons: Record<string, React.ReactNode> = {
    "WiFi": <Wifi size={14} className="text-primary dark:text-accent" />,
    "TV": <Tv size={14} className="text-primary dark:text-accent" />,
    "Air Hangat": <Droplet size={14} className="text-primary dark:text-accent" />,
    "AC": <Wind size={14} className="text-primary dark:text-accent" />
};

export function VillaCard({ slug, nama, harga, rating, ulasan, lokasi, foto_utama, fasilitas_utama }: VillaProps) {
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
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-neutral-800 shadow-sm backdrop-blur-sm">
                    <Star size={12} className="fill-accent text-accent" />
                    {rating} <span className="text-neutral-500 font-normal">({ulasan})</span>
                </div>
            </div>

            <div className="flex flex-col p-5 grow">
                <h3 className="text-lg font-bold text-foreground line-clamp-1">{nama}</h3>
                <p className="text-sm text-neutral-500 mb-3">{lokasi}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                    {fasilitas_utama.slice(0, 3).map((fas, i) => (
                        <div key={i} className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-slate-800 dark:text-neutral-300">
                            {facilityIcons[fas] || <span className="h-2 w-2 rounded-full bg-primary" />}
                            {fas}
                        </div>
                    ))}
                    {fasilitas_utama.length > 3 && (
                        <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-slate-800 dark:text-neutral-300">
                            +{fasilitas_utama.length - 3}
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-slate-800 flex items-end justify-between">
                    <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Mulai dari</p>
                        <p className="text-lg font-bold text-foreground">
                            {formatCurrency(harga)}
                            <span className="text-sm font-normal text-neutral-500">/malam</span>
                        </p>
                    </div>
                </div>

                <Link
                    href={`/villa/${slug}`}
                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#1a90ec] py-2.5 font-bold text-white transition-colors hover:bg-[#1a90ec]/90"
                >
                    Pilih Villa
                </Link>
            </div>
        </div>
    );
}

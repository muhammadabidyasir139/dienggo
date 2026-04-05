import Image from "next/image";
import Link from "next/link";
import { Star, Flame, Wifi, Droplet, Coffee } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface CabinProps {
    id: string;
    slug: string;
    nama: string;
    harga: number;
    rating: number;
    ulasan: number;
    lokasi: string;
    fotoUtama: string;
    fasilitasUtama: string[];
}

const facilityIcons: Record<string, React.ReactNode> = {
    "Perapian": <Flame size={14} className="text-primary " />,
    "WiFi": <Wifi size={14} className="text-primary " />,
    "Air Hangat": <Droplet size={14} className="text-primary " />,
    "Dapur Mini": <Coffee size={14} className="text-primary " />
};

export function CabinCard({ slug, nama, harga, rating, ulasan, lokasi, fotoUtama, fasilitasUtama }: CabinProps) {
    return (
        <Link href={`/hotel-cabin/${slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-neutral-100 transition-all hover:shadow-xl cursor-pointer">
            <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                <Image
                    src={fotoUtama}
                    alt={nama}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

            </div>

            <div className="flex flex-col p-5 grow">
                <h3 className="text-lg font-bold text-foreground line-clamp-1">{nama}</h3>
                <p className="text-sm text-neutral-500 mb-3">{lokasi}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                    {fasilitasUtama.slice(0, 3).map((fas: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600  ">
                            {facilityIcons[fas] || <span className="h-2 w-2 rounded-full bg-primary" />}
                            {fas}
                        </div>
                    ))}
                    {fasilitasUtama.length > 3 && (
                        <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600  ">
                            +{fasilitasUtama.length - 3}
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-neutral-100  flex items-end justify-between">
                    <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Mulai dari</p>
                        <p className="text-lg font-bold text-foreground">
                            {formatCurrency(harga)}
                            <span className="text-sm font-normal text-neutral-500">/malam</span>
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary/90">
                    Pilih Cabin
                </div>
            </div>
        </Link>
    );
}

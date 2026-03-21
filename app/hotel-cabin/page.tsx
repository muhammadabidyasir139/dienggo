import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { PromoBanner } from "@/components/PromoBanner";
import { CabinCard, CabinProps } from "@/components/CabinCard";
import { GridSkeleton } from "@/components/CardSkeleton";
import { Suspense } from "react";
import Image from "next/image";
import { getCabins } from "@/app/admin/actions/cabin";
import { getFacilities } from "@/app/admin/actions/facility";
import { getTranslations } from "next-intl/server";

export default async function CabinListingPage() {
    const t = await getTranslations("Cabin");
    const [cabinsResponse, facilitiesRaw] = await Promise.all([
        getCabins(),
        getFacilities()
    ]);
    
    // Create a facility map based on IDs
    const facilityMap = facilitiesRaw.reduce((acc: any, f: any) => {
        acc[f.id] = f.name;
        return acc;
    }, {});
    
    // Transform data to match CabinProps
    const cabins = cabinsResponse.map(v => ({
        id: v.id,
        slug: v.slug,
        nama: v.nama,
        harga: v.harga,
        rating: Number(v.rating) || 0,
        ulasan: v.ulasan || 0,
        lokasi: v.lokasi || "",
        fasilitasUtama: ((v.fasilitasUtama as string[]) || []).map(id => facilityMap[id] || id),
        fotoUtama: v.fotoUtama || "",
    }));

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[50vh] w-full bg-slate-900 overflow-hidden">
                <Image
                    src="/asset/cabin-hotel-new.jpg"
                    alt="Cabin Hero"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16 md:pt-20">
                    <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg max-w-4xl">
                        {t("hero_title")}
                    </h1>
                    <p className="mt-4 text-sm font-medium text-white/90 md:text-lg lg:text-xl drop-shadow-md">
                        {t("hero_subtitle")}
                    </p>

                    <div className="w-full flex justify-center mt-6 md:mt-10">
                        <SearchBar className="!relative !left-auto !bottom-auto !transform-none !w-full !max-w-4xl !z-40" />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-[200px] sm:mt-[220px] md:mt-32">
                <div className="relative w-full overflow-hidden rounded-2xl h-[450px] sm:h-[400px] md:h-[350px] lg:h-[450px] shadow-lg border border-slate-200">
                    <Image
                        src="/asset/cabin-poster.jpeg"
                        alt="Promo Cabin Poster"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg max-w-3xl leading-tight">
                            Temukan cabin yang nyaman untuk liburan kamu di dienggo
                        </h3>
                        <p className="mt-4 text-base sm:text-xl md:text-2xl font-bold text-amber-300 drop-shadow-md">
                            - harga istimewa untuk kamu✨
                        </p>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">{t("favorite_cabins")}</h2>
                    <Suspense fallback={<GridSkeleton />}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {cabins.map((cabin) => (
                                <CabinCard key={cabin.id} {...cabin} />
                            ))}
                        </div>
                    </Suspense>
                </div>
            </section>
        </main>
    );
}

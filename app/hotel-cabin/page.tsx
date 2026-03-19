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
            <section className="relative h-[50vh] w-full bg-slate-900">
                <Image
                    src="/asset/cabin-hotel-new.jpg"
                    alt="Cabin Hero"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                        {t("hero_title")}
                    </h1>
                    <p className="mt-4 text-sm font-medium text-white/90 md:text-lg">
                        {t("hero_subtitle")}
                    </p>
                </div>

                {/* Floating Search Bar */}
                <SearchBar />
            </section>

            {/* Main Content */}
            <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 md:mt-32">
                <PromoBanner text={t("promo_banner")} />

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

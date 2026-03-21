import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { PromoBanner } from "@/components/PromoBanner";
import { VillaCard, VillaProps } from "@/components/VillaCard";
import { GridSkeleton } from "@/components/CardSkeleton";
import { Suspense } from "react";
import Image from "next/image";
import { getVillas } from "@/app/admin/actions/villa";
import { getFacilities } from "@/app/admin/actions/facility";
import { getTranslations } from "next-intl/server";

export default async function VillaListingPage() {
  const t = await getTranslations("Villa");
  const [villasResponse, facilitiesRaw] = await Promise.all([
    getVillas(),
    getFacilities(),
  ]);

  const facilityMap = facilitiesRaw.reduce((acc: any, f: any) => {
    acc[f.id] = f.name;
    return acc;
  }, {});

  // Transform data to match VillaProps if needed (though they should match now)
  const villas = villasResponse.map((v) => ({
    id: v.id,
    slug: v.slug,
    nama: v.nama,
    harga: v.harga,
    rating: Number(v.rating) || 0,
    ulasan: v.ulasan || 0,
    lokasi: v.lokasi || "",
    fasilitasUtama: ((v.fasilitasUtama as string[]) || []).map(
      (id) => facilityMap[id] || id,
    ),
    fotoUtama: v.fotoUtama || "",
  }));

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full bg-slate-900 overflow-hidden">
        <Image
          src="/asset/Villa Ira Dieng.jpg"
          alt="Villa Hero"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg max-w-4xl">
            {t("hero_title")}
          </h1>
          <p className="mt-4 text-sm font-medium text-white/90 md:text-lg lg:text-xl drop-shadow-md">
            {t("hero_subtitle")}
          </p>
        </div>

        {/* Floating Search Bar */}
        <SearchBar className="z-40" />
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-[200px] sm:mt-[220px] md:mt-32">
        <div className="relative w-full overflow-hidden rounded-2xl h-[450px] sm:h-[400px] md:h-[350px] lg:h-[450px] shadow-lg border border-slate-200">
          <Image
            src="/asset/villa-poste.jpeg"
            alt="Promo Villa Poster"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg max-w-3xl leading-tight">
              Cari villa termurah di dieng
            </h3>
            <p className="mt-4 text-base sm:text-xl md:text-2xl font-bold text-amber-300 drop-shadow-md">
              - harga istimewa untuk kamu✨
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {t("favorite_villas")}
          </h2>
          <Suspense fallback={<GridSkeleton />}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {villas.map((villa) => (
                <VillaCard key={villa.id} {...villa} />
              ))}
            </div>
          </Suspense>
        </div>
      </section>
    </main>
  );
}

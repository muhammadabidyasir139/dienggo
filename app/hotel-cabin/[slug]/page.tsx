import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Wifi, Flame, Droplet, Coffee, Car } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { BentoGallery } from "@/components/BentoGallery";
import { BookingButton } from "@/components/BookingButton";
import { formatCurrency } from "@/lib/utils";
import { getCabinBySlug as fetchCabinBySlug } from "@/app/admin/actions/cabin";

const facilityIcons: Record<string, React.ReactNode> = {
  Perapian: <Flame size={16} className="text-primary" />,
  WiFi: <Wifi size={16} className="text-primary" />,
  "Air Hangat": <Droplet size={16} className="text-primary" />,
  "Dapur Mini": <Coffee size={16} className="text-primary" />,
  Parkir: <Car size={16} className="text-primary" />,
};

import { getFacilities } from "@/app/admin/actions/facility";
import { getTranslations } from "next-intl/server";

async function getCabinBySlug(slug: string) {
  const cabin = await fetchCabinBySlug(slug);
  if (!cabin) return null;

  // Fetch facilities to map IDs to names
  const facilitiesRaw = await getFacilities();
  const facilityMap = facilitiesRaw.reduce((acc: any, f: any) => {
    acc[f.id] = f.name;
    return acc;
  }, {});

  // Transform to match template expectation (names instead of IDs)
  return {
    ...cabin,
    fasilitasUtama: ((cabin.fasilitasUtama as string[]) || []).map(
      (id) => facilityMap[id] || id,
    ),
  };
}

export default async function CabinDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Common");
  const { slug } = await params;
  const cabin = await getCabinBySlug(slug);

  if (!cabin) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-32 md:pb-24">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BentoGrid>
          <BentoGallery
            images={
              [cabin.fotoUtama, ...((cabin.galeri as string[]) || [])].filter(
                Boolean,
              ) as string[]
            }
            title={cabin.nama}
          />

          {/* INFO UTAMA */}
          <BentoCard colSpan={2} className="flex flex-col justify-center">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
                  {cabin.nama}
                </h1>
                <div className="flex items-center gap-2 text-neutral-500 font-medium">
                  <span className="flex items-center gap-1 text-sm bg-accent/20 text-accent-content px-2 py-0.5 rounded-full font-bold">
                    ⭐ {cabin.rating}
                  </span>
                  <span>({cabin.ulasan} {t("reviews")})</span>
                </div>
              </div>
              <div className="text-left md:text-right bg-primary/5 p-4 rounded-2xl">
                <p className="text-sm text-neutral-500 font-medium mb-1">
                  {t("starting_from")}
                </p>
                <p className="text-2xl font-black text-primary">
                  {formatCurrency(cabin.harga)}
                  <span className="text-base font-normal text-neutral-500">
                    {" "}
                    {t("per_night")}
                  </span>
                </p>
              </div>
            </div>
          </BentoCard>

          {/* FASILITAS */}
          <BentoCard colSpan={1} className="flex flex-col">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-primary/10 text-primary p-2 rounded-lg">
                🌲
              </span>
              {t("main_facilities")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {((cabin.fasilitasUtama as string[]) || []).map(
                (fas: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-700"
                  >
                    {facilityIcons[fas] || (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                    {fas}
                  </div>
                ),
              )}
            </div>
          </BentoCard>

          {/* LOKASI & DESKRIPSI */}
          <BentoCard colSpan={2}>
            <h3 className="text-lg font-bold mb-3">{t("about_cabin")}</h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              {cabin.deskripsi || t("no_description")}
            </p>

            {/* View Map Embed */}
            {(cabin.koordinat || cabin.lokasi) && (
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 border border-neutral-100 shadow-sm">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    cabin.koordinat && cabin.koordinat.includes("q=")
                      ? cabin.koordinat.split("q=")[1].split("&")[0]
                      : cabin.koordinat || cabin.lokasi || ""
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="text-primary" size={24} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-foreground">{t("accommodation_location")}</p>
                <p className="text-sm text-neutral-500">
                  {cabin.lokasi || t("location_not_set")}
                </p>
              </div>
              <a
                href={cabin.koordinat || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-white text-primary font-bold rounded-xl border border-neutral-200 hover:bg-neutral-50 transition text-center"
              >
                {t("view_map")}
              </a>
            </div>
          </BentoCard>

          {/* BOOKING CTA */}
          <BentoCard
            colSpan={1}
            className="flex flex-col justify-center bg-primary-light border border-primary/10"
          >
            <h3 className="text-xl font-bold mb-2 text-foreground">
              {t("want_to_stay")}
            </h3>
            <p className="text-neutral-500 text-sm mb-6">
              {t("select_dates")}
            </p>

            <BookingButton
              slug={cabin.slug}
              type="cabin"
              className="w-full bg-primary text-white font-black py-4 rounded-xl text-center hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 cursor-pointer"
            >
              {t("book_cabin")}
            </BookingButton>
            <a
              href={`https://wa.me/628123456789?text=Halo Admin, saya tertarik untuk memesan Cabin ${cabin.nama}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full bg-white text-primary border border-primary/20 font-bold py-3 rounded-xl text-center hover:bg-neutral-50 transition-colors"
            >
              {t("contact_admin")}
            </a>
          </BentoCard>
        </BentoGrid>
      </div>

      <div className="fixed bottom-0 left-0 w-full md:hidden bg-white border-t border-neutral-200 p-4 flex items-center justify-between z-50">
        <div>
          <p className="text-xs font-semibold text-neutral-500">{t("starting_from")}</p>
          <p className="text-xl font-black text-primary">
            {formatCurrency(cabin.harga)}
          </p>
        </div>
        <BookingButton
          slug={cabin.slug}
          type="cabin"
          className="bg-primary text-white font-bold px-8 py-3 rounded-xl transition-all hover:bg-primary/90 cursor-pointer"
        >
          {t("book")}
        </BookingButton>
      </div>
    </main>
  );
}

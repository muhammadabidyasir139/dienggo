import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Wifi,
  Tv,
  Droplet,
  Wind,
  Coffee,
  Flame,
  Car,
  ConciergeBell,
  Bed,
  Utensils,
  Refrigerator,
  Wine,
  Egg,
  Sofa,
  Users,
  Layers,
  Thermometer,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { BentoGallery } from "@/components/BentoGallery";
import { BookingButton } from "@/components/BookingButton";
import { formatCurrency } from "@/lib/utils";
import { getVillaBySlug as fetchVillaBySlug } from "@/app/admin/actions/villa";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const villa = await fetchVillaBySlug(slug);

  if (!villa) return { title: "Villa Not Found" };

  return {
    title: `${villa.nama} Dieng | Sewa Villa Exclusive`,
    description: `Pesan ${villa.nama} di Dieng. ${villa.deskripsi?.slice(0, 150)}... Fasilitas lengkap, lokasi strategis di ${villa.lokasi}.`,
    openGraph: {
      title: `${villa.nama} - Penginapan Dieng`,
      description: `Menginap di ${villa.nama}, pilihan tepat untuk liburan di Dieng plateau.`,
      images: [villa.fotoUtama || ""],
    },
  };
}

// Icon mapping helper (extended)
const facilityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={16} className="text-primary" />,
  "Free Wifi": <Wifi size={16} className="text-primary" />,
  TV: <Tv size={16} className="text-primary" />,
  "Smart TV": <Tv size={16} className="text-primary" />,
  "Air Hangat": <Droplet size={16} className="text-primary" />,
  AC: <Wind size={16} className="text-primary" />,
  Dapur: <Coffee size={16} className="text-primary" />,
  "Api Unggun": <Flame size={16} className="text-primary" />,
  Parkir: <Car size={16} className="text-primary" />,
  "Resepsionis 24 Jam": <ConciergeBell size={16} className="text-primary" />,
  "Kamar Tidur": <Bed size={16} className="text-primary" />,
  "Kamar Mezzanine": <Layers size={16} className="text-primary" />,
  "Meja makan": <Utensils size={16} className="text-primary" />,
  Kulkas: <Refrigerator size={16} className="text-primary" />,
  "Piring & Gelas": <Wine size={16} className="text-primary" />,
  Sarapan: <Egg size={16} className="text-primary" />,
  "Kopi, Teh, Gula": <Coffee size={16} className="text-primary" />,
  "Ruang Santai": <Sofa size={16} className="text-primary" />,
  "Ruang Tamu": <Users size={16} className="text-primary" />,
};

import { getFacilities } from "@/app/admin/actions/facility";
import { getTranslations } from "next-intl/server";

async function getVillaBySlug(slug: string) {
  const villa = await fetchVillaBySlug(slug);
  if (!villa) return null;

  // Fetch facilities to map IDs to names
  const facilitiesRaw = await getFacilities();
  const facilityMap = facilitiesRaw.reduce((acc: any, f: any) => {
    acc[f.id] = f.name;
    return acc;
  }, {});

  // Transform to match template expectation (names instead of IDs)
  return {
    ...villa,
    fasilitasUtama: ((villa.fasilitasUtama as string[]) || []).map(
      (id) => facilityMap[id] || id,
    ),
  };
}

export default async function VillaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Common");
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);

  if (!villa) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-32 md:pb-24">
      <Navbar />
      {/* Top Navigation Bar / Breadcrumb could go here */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BentoGrid>
          <BentoGallery
            images={
              [villa.fotoUtama, ...((villa.galeri as string[]) || [])].filter(
                Boolean,
              ) as string[]
            }
            title={villa.nama}
          />

          {/* INFO UTAMA */}
          <BentoCard colSpan={2} className="flex flex-col justify-center">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
                  {villa.nama}
                </h1>
                <div className="flex items-center gap-2 text-neutral-500 font-medium">
                  <span className="flex items-center gap-1 text-sm bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">
                    ⭐ {villa.rating}
                  </span>
                  <span>({villa.ulasan} {t("reviews")})</span>
                </div>
              </div>
              <div className="text-left md:text-right bg-primary/5 p-4 rounded-2xl">
                <p className="text-sm text-neutral-500 font-medium mb-1">
                  {t("starting_from")}
                </p>
                <p className="text-2xl font-black text-primary">
                  {formatCurrency(villa.harga)}
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
                ✨
              </span>
              {t("main_facilities")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {((villa.fasilitasUtama as string[]) || []).map(
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

          {/* LOKASI & DESKRIPSI (Merged in layout visually) */}
          <BentoCard colSpan={2}>
            <h3 className="text-lg font-bold mb-3">{t("about_villa")}</h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              {villa.deskripsi || t("no_description")}
            </p>

            {/* View Map Embed */}
            {(villa.koordinat || villa.lokasi) && (
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 border border-neutral-100 shadow-sm">
                {(() => {
                  let src = "";
                  if (villa.koordinat?.includes("src=\"")) {
                    const match = villa.koordinat.match(/src="([^"]+)"/);
                    src = match ? match[1] : "";
                  } else if (villa.koordinat?.startsWith("http")) {
                    src = villa.koordinat;
                  } else {
                    src = villa.lokasi || "";
                  }

                  if (!src) return null;

                  return (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={src.includes("google.com/maps/embed") ? src : `https://maps.google.com/maps?q=${encodeURIComponent(
                        src.includes("q=") ? src.split("q=")[1].split("&")[0] : src
                      )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  );
                })()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="text-primary" size={24} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-foreground">{t("accommodation_location")}</p>
                <p className="text-sm text-neutral-500">
                  {villa.lokasi || t("location_not_set")}
                </p>
              </div>
              <a
                href={(() => {
                  if (villa.koordinat?.includes("src=\"")) {
                    const match = villa.koordinat.match(/src="([^"]+)"/);
                    return match ? match[1] : "#";
                  }
                  return villa.koordinat || "#";
                })()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-white text-primary font-bold rounded-xl border border-neutral-200 hover:bg-neutral-50 transition text-center"
              >
                {t("view_map")}
              </a>
            </div>
          </BentoCard>

          {/* BOOKING CTA (Desktop) */}
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
              slug={villa.slug}
              type="villa"
              className="w-full bg-primary text-white font-black py-4 rounded-xl text-center hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 cursor-pointer"
            >
              {t("continue_booking")}
            </BookingButton>
            <a
              href={`https://wa.me/628123456789?text=Halo Admin, saya tertarik untuk memesan Villa ${villa.nama}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full bg-white text-primary border border-primary/20 font-bold py-3 rounded-xl text-center hover:bg-neutral-50 transition-colors"
            >
              {t("contact_admin")}
            </a>
          </BentoCard>
        </BentoGrid>
      </div>

      {/* Sticky Booking Bar for Mobile */}
      <div className="fixed bottom-0 left-0 w-full md:hidden bg-white border-t border-neutral-200 p-4 flex items-center justify-between z-50">
        <div>
          <p className="text-xs font-semibold text-neutral-500">{t("starting_from")}</p>
          <p className="text-xl font-black text-primary">
            {formatCurrency(villa.harga)}
          </p>
        </div>
        <BookingButton
          slug={villa.slug}
          type="villa"
          className="bg-primary text-white font-bold px-8 py-3 rounded-xl transition-all hover:bg-primary/90 cursor-pointer"
        >
          {t("book")}
        </BookingButton>
      </div>
    </main>
  );
}

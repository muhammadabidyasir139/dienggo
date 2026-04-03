import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Headset,
  Globe2,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { TourTimeline } from "@/components/TourTimeline";
import { VideoSlider } from "@/components/VideoSlider";
import { BookingButton } from "@/components/BookingButton";
import { formatCurrency } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";
import { getTranslations } from "next-intl/server";

async function getWisataBySlug(slug: string) {
  const filePath = path.join(process.cwd(), "data", "wisata.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const wisata = JSON.parse(jsonData);
  return (
    wisata.find(
      (w: { slug: string; [key: string]: unknown }) => w.slug === slug,
    ) || null
  );
}

export default async function WisataDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Common");
  const tWisata = await getTranslations("Wisata");
  const { slug } = await params;
  const wisata = await getWisataBySlug(slug);

  if (!wisata) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-32 md:pb-24">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BentoGrid>
          {/* GALERI - Foto Utama */}
          <BentoCard
            colSpan={2}
            rowSpan={2}
            className="relative overflow-hidden p-0 h-[400px] md:h-auto group"
          >
            <Image
              src={wisata.foto_utama}
              alt={wisata.nama}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </BentoCard>

          {/* GALERI - Foto Kecil 1 */}
          <BentoCard
            colSpan={1}
            className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block"
          >
            <Image
              src={wisata.galeri[0]}
              alt={`${wisata.nama} gallery 1`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </BentoCard>

          {/* GALERI - Foto Kecil 2 */}
          <BentoCard
            colSpan={1}
            className="relative overflow-hidden p-0 h-[200px] md:h-auto group hidden md:block"
          >
            <Image
              src={wisata.galeri[1] || wisata.galeri[0]}
              alt={`${wisata.nama} gallery 2`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </BentoCard>

          {/* INFO UTAMA & HIGHLIGHTS */}
          <BentoCard
            colSpan={3}
            className="flex flex-col md:flex-row gap-8 items-start justify-between"
          >
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
                {wisata.nama}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-600">
                <span className="flex items-center gap-1.5 text-primary font-bold">
                  ⭐ {wisata.rating} ({wisata.ulasan})
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> {t("duration")}:{" "}
                  {wisata.durasi_wisata || wisata.durasi}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe2 size={16} /> {tWisata("language")}: {wisata.bahasa}
                </span>
                <span className="flex items-center gap-1.5">
                  <Headset size={16} /> {wisata.kontak}
                </span>
              </div>
            </div>

            {/* Lokasi Action */}
            <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 shrink-0 min-w-[280px]">
              <div className="flex items-start gap-3 mb-2">
                <MapPin className="text-primary shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-neutral-600 font-medium leading-snug">
                  {wisata.lokasi}
                </p>
              </div>
              <a
                href={wisata.koordinat}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 bg-white text-primary font-bold rounded-xl border border-neutral-200 hover:bg-neutral-50 text-center text-sm"
              >
                {tWisata("open_in_map")}
              </a>
            </div>
          </BentoCard>

          {/* Kolom Kiri: Narasi, Video, Timeline */}
          <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
            <BentoCard>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Sparkles size={20} />
                </span>
                {tWisata("experience_awaits")}
              </h3>
              <ul className="flex flex-col gap-3 mb-6">
                {wisata.narasi?.map((item: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-neutral-700"
                  >
                    <CheckCircle
                      className="text-green-500 shrink-0 mt-0.5"
                      size={18}
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              {/* View Map Embed */}
              {(wisata.koordinat || wisata.lokasi) && (
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      wisata.koordinat && wisata.koordinat.includes("q=")
                        ? wisata.koordinat.split("q=")[1].split("&")[0]
                        : wisata.koordinat || wisata.lokasi || ""
                    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              )}
            </BentoCard>

            <BentoCard>
              <h3 className="text-xl font-bold mb-4">{tWisata("fun_snippets")}</h3>
              <VideoSlider videos={wisata.video_reels} />
            </BentoCard>

            <BentoCard>
              <h3 className="text-xl font-bold mb-6">{tWisata("tour_rundown")}</h3>
              <TourTimeline items={wisata.rundown} />
            </BentoCard>
          </div>

          {/* Kolom Kanan: Sticky Booking Area */}
          <div className="md:col-span-1 hidden md:block">
            <div className="sticky top-24 flex flex-col gap-4">
              <BentoCard className="flex flex-col items-center text-center bg-gradient-to-b from-primary/5 to-transparent">
                <p className="text-neutral-500 font-medium mb-1">{t("starting_from")}</p>
                <h2 className="text-4xl font-black text-primary mb-6">
                  {wisata.harga === 0 ? tWisata("free") : formatCurrency(wisata.harga)}
                </h2>

                <BookingButton
                  slug={wisata.slug}
                  type="wisata"
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  {t("book_ticket")}
                </BookingButton>

                <a
                  href={`https://wa.me/628123456789?text=Halo Admin, saya tertarik untuk memesan Tiket/Tour ${wisata.nama}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full bg-white text-primary border border-primary/20 font-bold py-3 rounded-xl text-center hover:bg-neutral-50 transition-colors"
                >
                  {t("contact_admin")}
                </a>

                <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
                  Konfirmasi instan. Bebas reschedule maks. H-1 sebelum
                  keberangkatan.
                </p>
              </BentoCard>
            </div>
          </div>
        </BentoGrid>
      </div>

      {/* Sticky Booking Bar for Mobile */}
      <div className="fixed bottom-0 left-0 w-full md:hidden bg-white border-t border-neutral-200 p-4 flex items-center justify-between z-50">
        <div>
          <p className="text-xs font-semibold text-neutral-500">{t("starting_from")}</p>
          <p className="text-xl font-black text-primary">
            {wisata.harga === 0 ? tWisata("free") : formatCurrency(wisata.harga)}
          </p>
        </div>
        <BookingButton
          slug={wisata.slug}
          type="wisata"
          className="bg-primary text-white font-bold px-8 py-3 rounded-xl"
        >
          {t("book_ticket_short")}
        </BookingButton>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Users, CheckCircle2, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { BentoGallery } from "@/components/BentoGallery";
import { BookingButton } from "@/components/BookingButton";
import { formatCurrency } from "@/lib/utils";
import { getJeepBySlug } from "@/app/admin/actions/jeep";
import { getTranslations } from "next-intl/server";

export default async function JeepDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Common");
  const { slug } = await params;
  const jeep: any = await getJeepBySlug(slug);

  if (!jeep) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-32 md:pb-24">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BentoGrid>
          <BentoGallery
            images={
              [jeep.fotoUtama, ...((jeep.galeri as string[]) || [])].filter(
                Boolean,
              ) as string[]
            }
            title={jeep.nama}
          />

          {/* NAMA PAKET & INFO UTAMA */}
          <BentoCard colSpan={1} className="flex flex-col justify-center">
            <h1 className="text-2xl font-black tracking-tight text-foreground mb-4 leading-snug">
              {jeep.nama}
            </h1>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-neutral-600 font-medium">
                <Clock size={18} className="text-primary" />
                <span>{t("duration")}: {jeep.durasi}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 font-medium">
                <Users size={18} className="text-primary" />
                <span>{t("max_people", { count: jeep.maksOrang || 0 })}</span>
              </div>
            </div>
          </BentoCard>

          {/* LIST DESTINASI */}
          <BentoCard colSpan={1} className="flex flex-col">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-primary/10 text-primary p-2 rounded-lg">
                <MapPin size={16} />
              </span>
              {t("tourist_destinations")}
            </h3>
            <ul className="flex flex-col gap-3">
              {((jeep.destinasi as string[]) || []).map((item: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm font-medium text-neutral-700"
                >
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </BentoCard>

          {/* ISI PAKET & KEBIJAKAN (Merged in row for Desktop) */}
          <BentoCard colSpan={1} className="flex flex-col">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-primary/10 text-primary p-2 rounded-lg">
                <CheckCircle2 size={16} />
              </span>
              {t("package_includes")}
            </h3>
            <ul className="flex flex-col gap-3">
              {((jeep.isiPaket as string[]) || []).map(
                (item: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-neutral-600"
                  >
                    <span className="text-green-500">✓</span> {item}
                  </li>
                ),
              )}
            </ul>
          </BentoCard>

          <BentoCard colSpan={2} className="flex flex-col">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-600">
              <span className="bg-rose-100 p-2 rounded-lg">
                <ShieldAlert size={16} />
              </span>
              {t("policies")}
            </h3>
            <ul className="flex flex-col gap-3 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
              {((jeep.kebijakan as string[]) || []).map(
                (item: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-neutral-700"
                  >
                    <span className="text-rose-500 shrink-0">•</span> {item}
                  </li>
                ),
              )}
            </ul>
          </BentoCard>

          {/* STICKY BOTTOM SECTION FOR DESKTOP IN BentoGrid */}
          <BentoCard
            colSpan={1}
            className="flex flex-col justify-center bg-primary-light border border-primary/10 hidden md:flex"
          >
            <h3 className="text-lg font-medium text-neutral-500 mb-1">
              {t("total_jeep_cost")}
            </h3>
            <p className="text-3xl font-black text-primary mb-6">
              {formatCurrency(jeep.harga)}
              <span className="text-sm font-normal text-neutral-400">
                {" "}
                {t("per_jeep")}
              </span>
            </p>

            <p className="text-sm text-neutral-600 mb-4">
              {t("determine_date")}
            </p>
            <div className="flex bg-white rounded-xl p-3 mb-4 items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors border border-neutral-200">
              <span className="text-sm font-medium text-foreground">
                {t("select_date")}
              </span>
              <span className="text-xs bg-primary text-white px-2 py-1 rounded-md font-bold">
                {t("change")}
              </span>
            </div>

            <BookingButton
              slug={jeep.slug}
              type="jeep"
              className="w-full bg-primary text-white font-black py-4 rounded-xl text-center hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 cursor-pointer"
            >
              {t("book_now")}
            </BookingButton>
            <a
              href={`https://wa.me/628123456789?text=Halo Admin, saya tertarik untuk memesan Paket Jeep ${jeep.nama}`}
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
      <div className="fixed bottom-0 left-0 w-full md:hidden bg-white border-t border-neutral-200 p-4 flex flex-col gap-3 z-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500">
              {t("total_jeep_cost")}
            </p>
            <p className="text-xl font-black text-primary">
              {formatCurrency(jeep.harga)}
            </p>
          </div>
          <BookingButton
            slug={jeep.slug}
            type="jeep"
            className="bg-primary text-white font-bold px-8 py-3 rounded-xl transition-all hover:bg-primary/90 cursor-pointer"
          >
            {t("book")}
          </BookingButton>
        </div>
      </div>
    </main>
  );
}

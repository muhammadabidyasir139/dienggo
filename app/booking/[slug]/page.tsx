import { Navbar } from "@/components/Navbar";
import { BookingForm } from "@/components/BookingForm";
import { getVillaBySlug } from "@/app/admin/actions/villa";
import { getCabinBySlug } from "@/app/admin/actions/cabin";
import { getJeepBySlug } from "@/app/admin/actions/jeep";
import { getAktivitasBySlug } from "@/app/admin/actions/wisata";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getBookingItem(slug: string, type: string) {
  try {
    let item = null;
    if (type === "villa") {
      item = await getVillaBySlug(slug);
    } else if (type === "hotel-cabin" || type === "cabin") {
      item = await getCabinBySlug(slug);
    } else if (type === "jeep") {
      item = await getJeepBySlug(slug);
    } else if (type === "wisata" || type === "aktivitas") {
      item = await getAktivitasBySlug(slug);
    }

    if (item) {
      // map camelCase to snake_case for BookingForm compatibility and ensure types match
      const anyItem = item as any;
      return {
        ...anyItem,
        harga: Number(anyItem.harga) || 0,
        foto_utama: anyItem.fotoUtama || anyItem.foto_utama || "",
      };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;
  const { type = "villa" } = await searchParams;

  if (!session) {
    redirect(`/login?callbackUrl=/booking/${slug}?type=${type}`);
  }

  const item = await getBookingItem(slug, type);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-primary-light pb-20">
      <Navbar />
      <div className="pt-24 md:pt-32 pb-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black mb-8 text-foreground">
          Selesaikan Pemesanan Anda
        </h1>
        <BookingForm item={item} type={type} />
      </div>
    </main>
  );
}

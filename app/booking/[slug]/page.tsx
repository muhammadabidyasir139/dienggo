import { Navbar } from "@/components/Navbar";
import { BookingForm } from "@/components/BookingForm";
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";

async function getBookingItem(slug: string, type: string) {
    try {
        const fileName = type === "hotel-cabin" ? "cabins.json" : type === "wisata" ? "wisata.json" : `${type}s.json`;
        const filePath = path.join(process.cwd(), "data", fileName);
        const jsonData = await fs.readFile(filePath, "utf-8");
        const items = JSON.parse(jsonData);
        return items.find((item: { slug: string; [key: string]: unknown }) => item.slug === slug) || null;
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
    const { slug } = await params;
    const { type = "villa" } = await searchParams;

    const item = await getBookingItem(slug, type);

    if (!item) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-primary-light pb-20">
            <Navbar />
            <div className="pt-24 md:pt-32 pb-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-black mb-8 text-foreground">Selesaikan Pemesanan Anda</h1>
                <BookingForm item={item} type={type} />
            </div>
        </main>
    );
}

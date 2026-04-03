import { getOrderDetailById } from "@/app/actions/orders";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Mail, Phone, Home, CreditCard, MessageSquare, Receipt, Users, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idID } from "date-fns/locale";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import BookingDetailClient from "@/components/admin/BookingDetailClient";

export default async function AdminBookingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const booking = await getOrderDetailById(id);

    if (!booking) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
                <Link href="/admin/booking" className="hover:text-primary flex items-center gap-1 transition-colors">
                    <ArrowLeft size={14} /> Pesanan
                </Link>
                <span>/</span>
                <span className="text-slate-900 font-bold">Detail Booking {booking.kodeBooking}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        Detail Pesanan
                        <div className="scale-125 ml-2">
                            <StatusBadge status={booking.status} />
                        </div>
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Dipesan pada {format(new Date(booking.createdAt), "d MMMM yyyy HH:mm", { locale: idID })}
                    </p>
                </div>
            </div>

            <BookingDetailClient booking={booking} />

        </div>
    );
}

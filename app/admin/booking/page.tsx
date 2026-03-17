import { getBookings } from "@/app/admin/actions/booking";
import BookingTableClient from "./BookingTableClient";

export default async function BookingPage() {
    const bookings = await getBookings();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pesanan (Booking)</h2>
                    <p className="text-slate-500">
                        Kelola data pesanan masuk dari pelanggan untuk seluruh layanan Dienggo.
                    </p>
                </div>
            </div>

            <BookingTableClient data={bookings} />
        </div>
    );
}

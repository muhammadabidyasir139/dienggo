import StatsCard from "@/components/admin/StatsCard";
import { Home, Tent, Car, Map, Banknote } from "lucide-react";
import { db } from "@/db";
import { villas, cabins, jeeps, wisata, bookings } from "@/db/schema";
import { count, sum } from "drizzle-orm";
import { getDashboardData } from "@/app/admin/actions/dashboard";
import DashboardChart from "@/components/admin/DashboardChart";
import RecentBookings from "@/components/admin/RecentBookings";

export default async function AdminDashboard() {
    // Query total counts from Drizzle
    const [
        villaCount,
        cabinCount,
        jeepCount,
        wisataCount,
        bookingTotal,
        { latestBookings, revenueData },
    ] = await Promise.all([
        db.select({ value: count() }).from(villas),
        db.select({ value: count() }).from(cabins),
        db.select({ value: count() }).from(jeeps),
        db.select({ value: count() }).from(wisata),
        db.select({ value: sum(bookings.total) }).from(bookings),
        getDashboardData(),
    ]);

    const rp = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(bookingTotal[0]?.value || 0));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                <p className="text-slate-500">Ringkasan data Dienggo hari ini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Pendapatan" value={rp} icon={Banknote} />
                <StatsCard title="Total Villa" value={villaCount[0].value} icon={Home} />
                <StatsCard title="Total Cabin" value={cabinCount[0].value} icon={Tent} />
                <StatsCard title="Total Jeep" value={jeepCount[0].value} icon={Car} />
                <StatsCard title="Total Wisata" value={wisataCount[0].value} icon={Map} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
                    <DashboardChart data={revenueData} />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Booking Terbaru</h3>
                    <RecentBookings bookings={latestBookings as any} />
                </div>
            </div>
        </div>
    );
}

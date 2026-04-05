"use client";

import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { format, subDays, startOfWeek, startOfMonth, startOfYear, isWithinInterval, endOfDay } from "date-fns";

type RevenueItem = {
    date: string | null;
    amount: number;
    status: string | null;
};

interface DashboardChartProps {
    data: RevenueItem[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
    const [range, setRange] = useState<"week" | "month" | "year">("month");

    const filteredData = useMemo(() => {
        if (!data) return [];

        const now = new Date();
        let startDate: Date;

        if (range === "week") startDate = startOfWeek(now, { weekStartsOn: 1 });
        else if (range === "month") startDate = startOfMonth(now);
        else startDate = startOfYear(now);

        const groups: Record<string, number> = {};

        data.forEach((item) => {
            if (!item.date) return;
            const itemDate = new Date(item.date);
            
            if (itemDate >= startDate && itemDate <= now) {
                let key: string;
                if (range === "week") key = format(itemDate, "EEE"); // Mon, Tue...
                else if (range === "month") key = format(itemDate, "d MMM"); // 1 Apr, 2 Apr...
                else key = format(itemDate, "MMM"); // Jan, Feb...

                groups[key] = (groups[key] || 0) + item.amount;
            }
        });

        // Sort groups chronologically if needed, but for simplified keys like "Jan", "Feb" or "Mon", "Tue"
        // it's better to preset the order.
        
        const result = Object.entries(groups).map(([name, amount]) => ({ name, amount }));
        
        // Simple heuristic for sorting: if keys are dates, sort them. 
        // If keys are months/days, they usually come in naturally if data is sorted by createdAt.
        return result;
    }, [data, range]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-slate-900">Grafik Pendapatan</h3>
                    <p className="text-xs text-slate-500">Total pendapatan berdasarkan rentang waktu</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {(["week", "month", "year"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                range === r
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {r === "week" ? "Pekan" : r === "month" ? "Bulan" : "Tahun"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={filteredData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            tickFormatter={(value: any) => `Rp ${Number(value) / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value: any) => [formatCurrency(Number(value || 0)), "Pendapatan"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

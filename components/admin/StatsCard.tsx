import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                {trend && (
                    <p
                        className={`text-xs mt-2 font-medium flex items-center gap-1 ${trend.isPositive ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% dari bulan lalu
                    </p>
                )}
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
                <Icon className="w-6 h-6 text-slate-700" />
            </div>
        </div>
    );
}

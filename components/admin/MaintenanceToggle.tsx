"use client";

import { useState, useTransition } from "react";
import { updateMaintenanceMode } from "@/app/admin/actions/settings";

export default function MaintenanceToggle({ initialValue }: { initialValue: boolean }) {
    const [isMaintenance, setIsMaintenance] = useState(initialValue);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        const newValue = !isMaintenance;
        setIsMaintenance(newValue);
        
        startTransition(async () => {
            const result = await updateMaintenanceMode(newValue);
            if (!result.success) {
                // Revert if failed
                setIsMaintenance(!newValue);
                alert("Gagal memperbarui pengaturan");
            }
        });
    };

    return (
        <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${isMaintenance ? "text-amber-600" : "text-slate-500"}`}>
                {isMaintenance ? "Aktif" : "Nonaktif"}
            </span>
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                    isMaintenance ? "bg-amber-500" : "bg-slate-200"
                } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isMaintenance ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );
}

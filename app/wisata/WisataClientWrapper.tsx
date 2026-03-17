"use client";

import { useState } from "react";
import { FilterTabs } from "@/components/FilterTabs";
import { PromoBanner } from "@/components/PromoBanner";
import { WisataCard, WisataProps } from "@/components/WisataCard";

export function WisataClientWrapper({ data }: { data: WisataProps[] }) {
    const [activeTab, setActiveTab] = useState("explore");

    // In a real app we'd filter data based on activeTab.
    // For now, we display all data.
    const filteredData = data;

    return (
        <>
            <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <PromoBanner text="Paket Hemat Dieng 3 Destinasi — Mulai 99K!" />
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Pilihan Tempat Wisata Terbaik</h2>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
                        {filteredData.map((wisata) => (
                            <WisataCard key={wisata.id} {...wisata} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

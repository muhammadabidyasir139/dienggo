"use client";

import { Compass, Sparkles, Zap } from "lucide-react";

interface FilterTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
    const tabs = [
        { id: "explore", label: "Explore", icon: Compass },
        { id: "atraksi", label: "Atraksi", icon: Sparkles },
        { id: "aktivitas", label: "Aktivitas", icon: Zap },
    ];

    return (
        <div className="relative z-10 mx-auto w-max max-w-[90%] -translate-y-1/2">
            <div className="flex items-center gap-1 rounded-full bg-white p-1.5 shadow-xl dark:bg-slate-900 overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${isActive
                                    ? "bg-primary text-white dark:bg-accent dark:text-neutral-900"
                                    : "text-primary hover:bg-neutral-100 dark:text-accent dark:hover:bg-slate-800"
                                }`}
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

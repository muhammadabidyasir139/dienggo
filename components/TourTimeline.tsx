"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface RundownItem {
    waktu: string;
    judul: string;
    deskripsi: string;
}

export function TourTimeline({ items }: { items: RundownItem[] }) {
    return (
        <div className="relative border-l-2 border-neutral-200  ml-3">
            {items.map((item, index) => (
                <TimelineItem key={index} item={item} isLast={index === items.length - 1} />
            ))}
        </div>
    );
}

function TimelineItem({ item, isLast }: { item: RundownItem; isLast: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`relative pl-8 ${isLast ? '' : 'mb-8'}`}>
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white bg-primary  " />

            <button
                className="group flex w-full items-center justify-between text-left"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <span className="text-sm font-bold text-primary ">{item.waktu}</span>
                    <h4 className="text-base font-semibold text-foreground mt-0.5">{item.judul}</h4>
                </div>
                <div className={`p-1.5 rounded-full bg-neutral-100  transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={16} className="text-neutral-500" />
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="mt-3 text-sm text-neutral-600  leading-relaxed">
                            {item.deskripsi}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

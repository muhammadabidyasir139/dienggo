"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";

interface Option {
    id: string;
    name: string;
}

interface MultiSelectProps {
    label: string;
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    helpText?: string;
}

export default function MultiSelect({
    label,
    options,
    selected,
    onChange,
    placeholder = "Pilih fasilitas...",
    helpText,
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (id: string) => {
        const isSelected = selected.includes(id);
        if (isSelected) {
            onChange(selected.filter((s) => s !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    const removeOption = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onChange(selected.filter((s) => s !== id));
    };

    const selectedOptions = options.filter((opt) => selected.includes(opt.id));

    return (
        <div className="space-y-1.5" ref={containerRef}>
            <label className="block text-sm font-medium text-slate-700">
                {label}
            </label>

            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`min-h-[42px] w-full px-3 py-1.5 bg-white border rounded-lg cursor-pointer focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all flex flex-wrap gap-1.5 items-center ${
                        isOpen ? "ring-2 ring-amber-500 border-amber-500" : "border-slate-300"
                    }`}
                >
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((opt) => (
                            <span
                                key={opt.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-md"
                            >
                                {opt.name}
                                <button
                                    onClick={(e) => removeOption(e, opt.id)}
                                    className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="text-slate-400 text-sm">{placeholder}</span>
                    )}
                    
                    <div className="ml-auto pointer-events-none">
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1">
                        {options.length > 0 ? (
                            options.map((opt) => (
                                <div
                                    key={opt.id}
                                    onClick={() => toggleOption(opt.id)}
                                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                                >
                                    <span className={`text-sm ${selected.includes(opt.id) ? "text-amber-600 font-medium" : "text-slate-700"}`}>
                                        {opt.name}
                                    </span>
                                    {selected.includes(opt.id) && (
                                        <Check className="w-4 h-4 text-amber-500" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-slate-500 italic">
                                Tidak ada pilihan
                            </div>
                        )}
                    </div>
                )}
            </div>

            {helpText && <p className="text-sm text-slate-500">{helpText}</p>}
        </div>
    );
}

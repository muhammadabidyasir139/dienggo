"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface BookedDatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: string;
    itemType: "villa" | "cabin";
    itemName: string;
    initialDates: string[];
    onSave: (dates: string[]) => Promise<void>;
}

export default function BookedDatesModal({
    isOpen,
    onClose,
    itemId,
    itemType,
    itemName,
    initialDates,
    onSave,
}: BookedDatesModalProps) {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedDates(initialDates.map(d => new Date(d)));
        }
    }, [isOpen, initialDates]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formattedDates = selectedDates.map(d => format(d, "yyyy-MM-dd"));
            await onSave(formattedDates);
            onClose();
        } catch (error) {
            console.error("Failed to save dates:", error);
            alert("Gagal menyimpan tanggal booked.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Kelola Tanggal Booked</h3>
                        <p className="text-sm text-slate-500">{itemName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center">
                    <p className="text-sm text-slate-600 mb-4 text-center">
                        Pilih tanggal-tanggal di mana {itemType} ini sudah dipesan atau tidak tersedia.
                    </p>
                    
                    <div className="border border-slate-200 rounded-xl p-2 bg-white shadow-sm">
                        <DayPicker
                            mode="multiple"
                            selected={selectedDates}
                            onSelect={(dates) => setSelectedDates(dates as Date[])}
                            locale={id}
                            disabled={{ before: new Date() }}
                            className="!m-0"
                            classNames={{
                                day_selected: "bg-amber-500 text-white hover:bg-amber-600",
                                day_today: "font-bold text-amber-600",
                            }}
                        />
                    </div>

                    {selectedDates.length > 0 && (
                        <div className="w-full mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-slate-700">Tanggal Terpilih ({selectedDates.length})</h4>
                                <button 
                                    onClick={() => setSelectedDates([])}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                    Hapus Semua
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-100">
                                {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-sm">
                                        <CalendarIcon size={12} className="text-amber-500" />
                                        {format(date, "dd MMM yyyy", { locale: id })}
                                        <button 
                                            onClick={() => setSelectedDates(prev => prev.filter(d => d.getTime() !== date.getTime()))}
                                            className="ml-1 text-slate-400 hover:text-red-500"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-70"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}

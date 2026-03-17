"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteDialog({
    isOpen,
    title,
    description,
    isDeleting,
    onConfirm,
    onCancel,
}: DeleteDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 pb-0 flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        <p className="mt-2 text-sm text-slate-500">{description}</p>
                    </div>
                </div>

                <div className="p-6 flex flex-col-reverse sm:flex-row gap-3 justify-end bg-slate-50 mt-6 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            "Ya, Hapus"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

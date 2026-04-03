"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div 
            className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 transform ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            } ${
                type === "success" 
                    ? "bg-green-50 border-green-200 text-green-800" 
                    : "bg-red-50 border-red-200 text-red-800"
            }`}
        >
            {type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
                <XCircle className="w-5 h-5 text-red-500" />
            )}
            <p className="text-sm font-medium">{message}</p>
            <button 
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-2 p-0.5 hover:bg-black/5 rounded-full transition-colors"
            >
                <X className="w-4 h-4 opacity-50" />
            </button>
        </div>
    );
}

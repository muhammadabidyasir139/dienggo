"use client";

import { useState, useRef, useEffect } from "react";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function SearchBar() {
    const [showCheckIn, setShowCheckIn] = useState(false);
    const [showCheckOut, setShowCheckOut] = useState(false);
    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();

    const checkInRef = useRef<HTMLDivElement>(null);
    const checkOutRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (checkInRef.current && !checkInRef.current.contains(event.target as Node)) {
                setShowCheckIn(false);
            }
            if (checkOutRef.current && !checkOutRef.current.contains(event.target as Node)) {
                setShowCheckOut(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCheckInSelect = (date: Date | undefined) => {
        if (!date) return;
        setCheckIn(date);
        setShowCheckIn(false);
        // Validation: If check-in is after check-out, reset check-out
        if (checkOut && isAfter(startOfDay(date), startOfDay(checkOut))) {
            setCheckOut(undefined);
            setShowCheckOut(true); // Automatically open checkout picker
        } else if (!checkOut) {
            setShowCheckOut(true); // Automatically open checkout picker if not set
        }
    };

    const handleCheckOutSelect = (date: Date | undefined) => {
        if (!date) return;
        // Validation: Check-out cannot be before check-in
        if (checkIn && isBefore(startOfDay(date), startOfDay(checkIn))) {
            alert("Tanggal check-out tidak boleh sebelum tanggal check-in");
            return;
        }
        setCheckOut(date);
        setShowCheckOut(false);
    };

    return (
        <div className="absolute z-[100] left-1/2 bottom-0 w-[90%] max-w-4xl -translate-x-1/2 translate-y-1/2 rounded-2xl bg-white p-2 text-neutral-900 shadow-2xl md:p-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:gap-4">

                {/* Check In */}
                <div
                    ref={checkInRef}
                    onClick={() => { setShowCheckIn(!showCheckIn); setShowCheckOut(false); }}
                    className={`relative flex flex-col justify-center rounded-xl border border-transparent p-3 transition-all duration-300 cursor-pointer hover:bg-sky-50 :bg-sky-900/20 ${showCheckIn ? "bg-sky-50 " : ""}`}
                >
                    <span className="text-xs font-bold text-neutral-500">Check-in</span>
                    <div className="flex items-center gap-2 text-sm font-semibold truncate mt-1">
                        <CalendarIcon size={16} className="text-primary " />
                        {checkIn ? format(checkIn, "d MMM yyyy") : "Pilih Tanggal"}
                    </div>
                    {showCheckIn && (
                        <div
                            className="absolute top-[110%] left-0 z-[101] rounded-xl bg-white p-4 shadow-xl text-neutral-800 border"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DayPicker
                                mode="single"
                                selected={checkIn}
                                onSelect={handleCheckInSelect}
                                disabled={{ before: startOfDay(new Date()) }}
                            />
                        </div>
                    )}
                </div>

                {/* Check Out */}
                <div
                    ref={checkOutRef}
                    onClick={() => { setShowCheckOut(!showCheckOut); setShowCheckIn(false); }}
                    className={`relative flex flex-col justify-center rounded-xl border border-transparent p-3 transition-all duration-300 cursor-pointer hover:bg-sky-50 :bg-sky-900/20 ${showCheckOut ? "bg-sky-50 " : ""}`}
                >
                    <span className="text-xs font-bold text-neutral-500">Check-out</span>
                    <div className="flex items-center gap-2 text-sm font-semibold truncate mt-1">
                        <CalendarIcon size={16} className="text-primary " />
                        {checkOut ? format(checkOut, "d MMM yyyy") : "Pilih Tanggal"}
                    </div>
                    {showCheckOut && (
                        <div
                            className="absolute top-[110%] left-0 z-[101] rounded-xl bg-white p-4 shadow-xl text-neutral-800 border"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DayPicker
                                mode="single"
                                selected={checkOut}
                                onSelect={handleCheckOutSelect}
                                disabled={checkIn ? { before: startOfDay(checkIn) } : { before: startOfDay(new Date()) }}
                            />
                        </div>
                    )}
                </div>

                {/* Button */}
                <div className="flex items-center">
                    <button className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-[#1a90ec] px-6 py-4 font-bold text-white transition-transform hover:scale-[1.02]">
                        <Search size={20} />
                        Cari Villa
                    </button>
                </div>

            </div>
        </div>
    );
}

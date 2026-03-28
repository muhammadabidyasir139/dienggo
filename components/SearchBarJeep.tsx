"use client";

import { useState, useRef, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function SearchBarJeep({ className }: { className?: string }) {
  const tHero = useTranslations("Hero");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined,
  );
  const [destination, setDestination] = useState(searchParams.get("q") || "");
  const dateRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (destination) {
      params.set("q", destination);
    } else {
      params.delete("q");
    }

    if (date) {
      params.set("date", format(date, "yyyy-MM-dd"));
    } else {
      params.delete("date");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDate(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`absolute z-[100] left-1/2 w-[90%] max-w-4xl -translate-x-1/2 rounded-2xl bg-white p-2 text-foreground shadow-2xl md:p-4 ${className || "-bottom-8 md:-bottom-10"}`}
    >
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:gap-4">
        {/* Destination */}
        <div className="relative flex flex-col justify-center rounded-xl border border-transparent p-3 transition-colors hover:bg-neutral-50">
          <span className="text-xs font-bold text-neutral-500">
            {tCommon("destination")}
          </span>
          <div className="flex items-center gap-2 mt-1 border-b border-neutral-200 pb-1">
            <MapPin size={16} className="text-primary" />
            <input
              type="text"
              placeholder={
                tCommon("destination_placeholder") || "Cth: Kawah Sikidang"
              }
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder-neutral-400"
            />
          </div>
        </div>

        {/* Date */}
        <div
          ref={dateRef}
          onClick={() => setShowDate(!showDate)}
          className={`relative flex flex-col justify-center rounded-xl border border-transparent p-3 transition-all duration-300 cursor-pointer hover:bg-sky-50 :bg-sky-900/20 ${showDate ? "bg-sky-50 " : ""}`}
        >
          <span className="text-xs font-bold text-neutral-500 text-left">
            {tCommon("date")}
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold truncate mt-1">
            <CalendarIcon size={16} className="text-primary" />
            {date ? format(date, "d MMM yyyy") : tCommon("select_date")}
          </div>
          {showDate && (
            <div
              className="absolute top-[110%] left-0 z-50 rounded-xl bg-white p-4 shadow-xl border text-neutral-800"
              onClick={(e) => e.stopPropagation()}
            >
              <DayPicker
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setShowDate(false);
                }}
                disabled={{ before: startOfDay(new Date()) }}
              />
            </div>
          )}
        </div>

        {/* Button */}
        <div className="flex items-center">
          <button
            onClick={handleSearch}
            className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-white transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Search size={20} />
            {tHero("search_button")} Jeep
          </button>
        </div>
      </div>
    </div>
  );
}

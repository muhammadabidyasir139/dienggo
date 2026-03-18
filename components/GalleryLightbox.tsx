"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryLightboxProps {
    images: string[];
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
}

export function GalleryLightbox({ images, initialIndex = 0, isOpen, onClose }: GalleryLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Update current index if initialIndex changes when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            document.body.style.overflow = 'hidden'; // Prevent scrolling when open
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialIndex]);

    const handlePrevious = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, handlePrevious, handleNext]);

    // Touch swipe handling
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrevious();
        }
    };

    if (!isOpen || !images || images.length === 0) return null;

    return (
        <div 
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all z-10"
            >
                <X size={24} />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1.5 bg-black/40 text-white text-sm font-medium rounded-full z-10">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Navigation Buttons (Desktop) */}
            {images.length > 1 && (
                <>
                    <button 
                        onClick={handlePrevious}
                        className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all hidden md:block z-10"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button 
                        onClick={handleNext}
                        className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all hidden md:block z-10"
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}

            {/* Main Image Container */}
            <div 
                className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center p-4 md:p-12"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="relative w-full h-full">
                    <Image
                        src={images[currentIndex]}
                        alt={`Gallery image ${currentIndex + 1}`}
                        fill
                        className="object-contain select-none"
                        sizes="100vw"
                        priority
                        draggable={false}
                    />
                </div>
            </div>

            {/* Thumbnails (Desktop) */}
            {images.length > 1 && (
                <div 
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 rounded-2xl max-w-[90vw] overflow-x-auto hidden md:flex"
                    onClick={(e) => e.stopPropagation()}
                >
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-all ${
                                currentIndex === idx ? 'ring-2 ring-white scale-110 opacity-100' : 'opacity-50 hover:opacity-100'
                            }`}
                        >
                            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryLightbox } from "./GalleryLightbox";
import { ImageIcon } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    title?: string;
}

export function ImageGallery({ images, title = "Galeri" }: ImageGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const openLightbox = (index: number) => {
        setInitialIndex(index);
        setLightboxOpen(true);
    };

    // If only 1 image, just show it without the grid layout
    if (images.length === 1) {
        return (
            <>
                <div 
                    className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(0)}
                >
                    <Image 
                        src={images[0]} 
                        alt={`${title} image`} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                            <ImageIcon className="text-slate-700" size={24} />
                        </div>
                    </div>
                </div>
                <GalleryLightbox 
                    images={images} 
                    isOpen={lightboxOpen} 
                    onClose={() => setLightboxOpen(false)} 
                    initialIndex={0} 
                />
            </>
        );
    }

    // For multiple images, show a grid
    const displayImages = images.slice(0, 4);
    const remainingCount = images.length - 4;

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {displayImages.map((img, idx) => {
                    const isLastDisplay = idx === 3 && remainingCount > 0;
                    
                    return (
                        <div 
                            key={idx} 
                            className={`relative rounded-2xl overflow-hidden cursor-pointer group ${
                                idx === 0 ? 'col-span-2 row-span-2 h-[250px] md:h-[400px]' : 'h-[120px] md:h-[192px]'
                            }`}
                            onClick={() => openLightbox(idx)}
                        >
                            <Image 
                                src={img} 
                                alt={`${title} image ${idx + 1}`} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            
                            {/* Overlay for the last image if there are more */}
                            {isLastDisplay && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-white font-bold text-xl md:text-2xl">+{remainingCount}</span>
                                </div>
                            )}

                            {/* Hover effect for other images */}
                            {!isLastDisplay && (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            )}
                        </div>
                    );
                })}
            </div>

            <GalleryLightbox 
                images={images} 
                isOpen={lightboxOpen} 
                onClose={() => setLightboxOpen(false)} 
                initialIndex={initialIndex} 
            />
        </>
    );
}

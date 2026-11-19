import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryItem } from '../types/site';
import { LuxuryImage } from './LuxuryImage';

interface GalleryLightboxProps {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
}

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
}: GalleryLightboxProps) {
  const isOpen = activeIndex !== null && items[activeIndex] !== undefined;

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % items.length);
      }
      if (e.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + items.length) % items.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, activeIndex, items.length, onClose, onChangeIndex]);

  if (!isOpen || activeIndex === null) return null;

  const current = items[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#382D28]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery preview: ${current.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[960px] bg-[#F8F3EE] rounded-[12px] overflow-hidden border border-[#E8D5CA]/50 shadow-2xl animate-luxury-fade">
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-[#FFFFFF] border-b border-[#E8D5CA]">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#A58A78]">
              {current.category} ·{' '}
              <span className="tabular-nums">
                {activeIndex + 1} / {items.length}
              </span>
            </p>
            <h3 className="font-serif text-[22px] text-[#382D28] leading-snug">
              {current.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery lightbox"
            className="w-10 h-10 rounded-full border border-[#E8D5CA] flex items-center justify-center text-[#5A4A42] hover:bg-[#F2E8DF] hover:text-[#382D28] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.7} />
          </button>
        </div>

        <div className="relative bg-[#F2E8DF] flex items-center justify-center">
          <div className="w-full max-h-[65vh] aspect-[4/3] sm:aspect-[16/10]">
            <LuxuryImage
              src={current.image}
              alt={current.imageAlt}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  onChangeIndex((activeIndex - 1 + items.length) % items.length)
                }
                aria-label="Previous gallery image"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#382D28] border border-[#E8D5CA] flex items-center justify-center shadow-md transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.7} />
              </button>

              <button
                type="button"
                onClick={() => onChangeIndex((activeIndex + 1) % items.length)}
                aria-label="Next gallery image"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#382D28] border border-[#E8D5CA] flex items-center justify-center shadow-md transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.7} />
              </button>
            </>
          )}
        </div>

        <div className="px-5 sm:px-7 py-4 bg-[#FFFFFF] border-t border-[#E8D5CA] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-[14px] text-[#5A4A42]">{current.caption}</p>
          {current.isPlaceholder && (
            <span className="text-[12px] text-[#A58A78] shrink-0">
              Editorial preview — original studio photography coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

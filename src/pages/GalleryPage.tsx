import React, { useMemo, useState } from 'react';
import { Expand } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import type { GalleryCategory } from '../types/site';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { LuxuryImage } from '../components/LuxuryImage';

const GALLERY_CATEGORIES: GalleryCategory[] = [
  'All',
  'Lashes',
  'Brows',
  'Facials & Skin',
  'Permanent Makeup',
  'Salon Environment',
];

export function GalleryPage() {
  const { gallery, websiteContent, openBookingModal } = useSite();
  const [selectedCategory, setSelectedCategory] =
    useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems = useMemo(() => {
    const active = gallery.filter((item) => item.visible);
    if (selectedCategory === 'All') return active;
    return active.filter((item) => item.category === selectedCategory);
  }, [gallery, selectedCategory]);

  return (
    <div className="bg-[#F8F3EE]">
      <section className="bg-[#F2E8DF] border-b border-[#E8D5CA]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 sm:py-20 text-center">
          <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
            Portfolio &amp; Studio
          </p>
          <h1 className="mt-3 font-serif text-[42px] sm:text-[54px] leading-[1.08] text-[#382D28]">
            {websiteContent.galleryHeading}
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto my-5" aria-hidden="true" />
          <p className="text-[15px] leading-relaxed text-[#5A4A42] max-w-2xl mx-auto">
            Curated editorial photography representing our beauty and aesthetic
            disciplines. Original client and studio photographs supplied by
            Richaa will replace placeholder previews once approved.
          </p>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 sm:py-20">
        <div
          className="flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filter gallery by category"
        >
          {GALLERY_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setSelectedCategory(category);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 text-[13px] rounded-[4px] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#382D28] text-[#F8F3EE] border-[#382D28]'
                    : 'bg-[#FFFFFF] text-[#5A4A42] border-[#E8D5CA] hover:border-[#C5A27E]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              aria-label={`Inspect ${item.title} in lightbox`}
              className="group bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] overflow-hidden text-left transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(56,45,40,0.08)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A27E]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.itemType === 'before_after' && item.beforeImage ? (
                  <div className="grid grid-cols-2 w-full h-full">
                    <div className="relative overflow-hidden border-r border-white">
                      <LuxuryImage
                        src={item.beforeImage}
                        alt={`Before — ${item.title}`}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2.5 left-2.5 bg-[#382D28]/80 text-white text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-[2px]">
                        Before
                      </span>
                    </div>
                    <div className="relative overflow-hidden">
                      <LuxuryImage
                        src={item.image}
                        alt={`After — ${item.title}`}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2.5 right-2.5 bg-[#C5A27E] text-white text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-[2px]">
                        After
                      </span>
                    </div>
                  </div>
                ) : (
                  <LuxuryImage
                    src={item.image}
                    alt={item.imageAlt}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#FFFFFF]/85 text-[#382D28] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Expand className="w-4 h-4" strokeWidth={1.6} />
                </div>
              </div>
              <div className="p-5">
                <p className="text-[11px] tracking-[0.16em] uppercase text-[#A58A78]">
                  {item.category}
                  {item.isPlaceholder ? ' · Editorial Preview' : ''}
                </p>
                <h2 className="mt-1 font-serif text-[23px] text-[#382D28]">
                  {item.title}
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#5A4A42]">
                  {item.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={() => openBookingModal()}
            className="px-8 py-3.5 text-[14px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer"
          >
            Book Your Next Treatment
          </button>
        </div>
      </section>

      <GalleryLightbox
        items={visibleItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}

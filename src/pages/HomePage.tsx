import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { BRAND_IMAGES } from '../data/initialData';
import type { ServiceCategory } from '../types/site';
import {
  PRICING_CATEGORIES,
  buildWhatsAppUrl,
  filterServicesByCategory,
  groupServicesForPricing,
} from '../utils/siteLogic';
import { BotanicalMarginAccent } from '../components/BrandMark';
import { ContactForm } from '../components/ContactForm';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { LuxuryImage } from '../components/LuxuryImage';
import { ServiceCard } from '../components/ServiceCard';

const WHY_CHOOSE_ITEMS = [
  {
    icon: Award,
    title: '5+ Years of Experience',
    description:
      'Over five years of dedicated hands-on expertise across bespoke beauty and aesthetic treatments.',
  },
  {
    icon: Sparkles,
    title: 'Personalised Beauty Treatments',
    description:
      'Every appointment begins with careful consultation so treatments are tailored to your natural features.',
  },
  {
    icon: ShieldCheck,
    title: 'Professional Care',
    description:
      'Unhurried precision, meticulous hygiene standards and thoughtful aftercare guidance at every visit.',
  },
  {
    icon: HeartHandshake,
    title: 'Client-Focused Experience',
    description:
      'A calm, welcoming sanctuary dedicated to quality, natural confidence and making you feel your most beautiful.',
  },
];

export function HomePage() {
  const {
    navigate,
    services,
    gallery,
    reviews,
    businessConfig,
    websiteContent,
    openBookingModal,
  } = useSite();

  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All');
  const [activePricingTab, setActivePricingTab] = useState<ServiceCategory>('Lashes');
  const [galleryOffset, setGalleryOffset] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleServices = useMemo(() => {
    const filtered = filterServicesByCategory(services, activeCategory);
    if (activeCategory !== 'All') return filtered;
    const picked: typeof filtered = [];
    const seenCategories = new Set<string>();
    for (const srv of filtered) {
      if (!seenCategories.has(srv.category)) {
        picked.push(srv);
        seenCategories.add(srv.category);
      }
      if (picked.length === 6) break;
    }
    return picked;
  }, [services, activeCategory]);

  const featuredShowcase = useMemo(() => {
    const active = services.filter((s) => s.active);
    const preferredSlugs = [
      'eyelash-extensions',
      'brow-lamination',
      'bespoke-facials',
    ];
    const picked = preferredSlugs
      .map((slug) => active.find((s) => s.slug === slug))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    return picked.length > 0 ? picked : active.slice(0, 3);
  }, [services]);

  const visibleGallery = useMemo(
    () => gallery.filter((item) => item.visible),
    [gallery]
  );

  const publishedReviews = useMemo(
    () => reviews.filter((r) => r.published),
    [reviews]
  );

  const pricingGroups = useMemo(
    () => groupServicesForPricing(services),
    [services]
  );

  const activePricingGroup =
    pricingGroups.find((g) => g.category === activePricingTab) ??
    pricingGroups[0];

  const whatsAppUrl = buildWhatsAppUrl(
    businessConfig.whatsappDigits,
    businessConfig.whatsappPrefill
  );

  const maxOffset = Math.max(0, visibleGallery.length - 3);
  const displayedGallerySlice = visibleGallery.slice(
    galleryOffset,
    galleryOffset + 3
  );

  return (
    <div className="bg-[#F8F3EE]">
      {/* SECTION A – SPLIT-SCREEN HERO */}
      <section className="relative bg-[#F8F3EE] overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 px-6 sm:px-10 lg:pl-10 lg:pr-12 py-14 sm:py-20 lg:py-24 flex flex-col justify-center animate-luxury-fade">
            <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
              {websiteContent.heroLabel}
            </p>
            <h1 className="mt-4 font-serif text-[44px] sm:text-[54px] lg:text-[60px] leading-[1.06] text-[#382D28] font-normal">
              {websiteContent.heroHeading}
            </h1>
            <div className="w-12 h-[1px] bg-[#C5A27E] my-6" aria-hidden="true" />
            <p className="text-[15px] sm:text-[16px] leading-[1.7] text-[#5A4A42] max-w-[42ch]">
              {websiteContent.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-[14px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => navigate({ page: 'services' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-medium tracking-[0.02em] text-[#382D28] bg-transparent border border-[#C5A27E]/70 hover:bg-[#F2E8DF] rounded-[4px] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explore Treatments</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] lg:min-h-[580px] px-4 sm:px-6 lg:px-0 pb-10 lg:pb-0">
            <div className="w-full h-full rounded-[12px] lg:rounded-none lg:rounded-bl-[16px] overflow-hidden shadow-[0_18px_48px_rgba(56,45,40,0.08)] lg:shadow-none">
              <LuxuryImage
                src={BRAND_IMAGES.heroSalon}
                alt="Sunlit luxury beauty and aesthetics treatment suite at Richaa's Beauty & Aesthetic"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B – ABOUT RICHAA */}
      <section className="relative bg-[#F2E8DF] border-y border-[#E8D5CA]/70 overflow-hidden">
        <BotanicalMarginAccent className="hidden xl:block absolute right-4 bottom-2 w-44 h-64 pointer-events-none select-none" />
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-[12px] overflow-hidden border border-[#E8D5CA] aspect-[4/5] max-w-[440px] mx-auto lg:mx-0 shadow-[0_14px_36px_rgba(56,45,40,0.07)]">
                <LuxuryImage
                  src={BRAND_IMAGES.specialistPortrait}
                  alt="Editorial specialist portrait placeholder for Richaa's Beauty & Aesthetic"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover object-top"
                  placeholderCaption="Editorial Portrait Placeholder"
                />
              </div>
            </div>

            <div className="lg:col-span-7 lg:pr-10">
              <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
                {websiteContent.aboutLabel}
              </p>
              <h2 className="mt-3 font-serif text-[36px] sm:text-[44px] leading-[1.12] text-[#382D28]">
                {websiteContent.aboutHeading}
              </h2>
              <div className="w-12 h-[1px] bg-[#C5A27E] my-5" aria-hidden="true" />
              <p className="text-[15px] sm:text-[16px] leading-[1.75] text-[#5A4A42] max-w-[58ch]">
                {websiteContent.aboutIntro}
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-[#5A4A42] max-w-[58ch]">
                {websiteContent.aboutExtended}
              </p>

              {/* Editorial Key Highlights (Clean unboxed typography with subtle dividers) */}
              <div className="mt-8 pt-6 border-t border-[#E8D5CA] grid grid-cols-2 sm:grid-cols-4 gap-5">
                <div>
                  <p className="font-serif text-[28px] text-[#382D28] leading-none tabular-nums">
                    {websiteContent.experienceHighlight}
                  </p>
                  <p className="mt-1.5 text-[12px] text-[#A58A78]">
                    Industry Experience
                  </p>
                </div>
                <div>
                  <p className="font-serif text-[22px] text-[#382D28] leading-tight">
                    Bespoke
                  </p>
                  <p className="mt-1 text-[12px] text-[#A58A78]">
                    Personalised Treatments
                  </p>
                </div>
                <div>
                  <p className="font-serif text-[22px] text-[#382D28] leading-tight">
                    Dedicated
                  </p>
                  <p className="mt-1 text-[12px] text-[#A58A78]">
                    Professional Expertise
                  </p>
                </div>
                <div>
                  <p className="font-serif text-[22px] text-[#382D28] leading-tight">
                    Refined
                  </p>
                  <p className="mt-1 text-[12px] text-[#A58A78]">
                    Quality-Focused Care
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => navigate({ page: 'about' })}
                  className="inline-flex items-center gap-2.5 px-7 py-3 text-[14px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C – SERVICES */}
      <section className="bg-[#F8F3EE] py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
              Our Services
            </p>
            <h2 className="mt-2.5 font-serif text-[36px] sm:text-[46px] leading-[1.12] text-[#382D28]">
              {websiteContent.servicesHeading}
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto my-5" aria-hidden="true" />
            <p className="text-[15px] text-[#5A4A42] leading-relaxed">
              Explore our curated menu of ten specialised beauty and aesthetic
              treatments crafted to honour your natural elegance.
            </p>
          </div>

          {/* Interactive Category Filter Bar */}
          <div
            className="mt-9 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Filter treatments by category"
          >
            {(['All', ...PRICING_CATEGORIES] as Array<ServiceCategory | 'All'>).map(
              (cat) => {
                const selected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-[13px] rounded-[4px] transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                      selected
                        ? 'bg-[#382D28] text-[#F8F3EE] border-[#382D28]'
                        : 'bg-[#FFFFFF] text-[#5A4A42] border-[#E8D5CA] hover:border-[#C5A27E] hover:text-[#382D28]'
                    }`}
                  >
                    {cat === 'All' ? 'Featured Selection' : cat}
                  </button>
                );
              }
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {visibleServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => navigate({ page: 'services' })}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 text-[14px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer"
            >
              <span>View All 10 Treatments</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION D – WHY CHOOSE US */}
      <section className="bg-[#FFFFFF] border-y border-[#E8D5CA]/80 py-16 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
              Why Choose Us
            </p>
            <h2 className="mt-2.5 font-serif text-[34px] sm:text-[42px] leading-[1.14] text-[#382D28]">
              {websiteContent.whyChooseHeading}
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto mt-5" aria-hidden="true" />
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-[#F8F3EE] border border-[#E8D5CA] rounded-[12px] p-7 text-center transition-transform duration-300 hover:-translate-y-0.5 hover:border-[#C5A27E]"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#E8D5CA] flex items-center justify-center mx-auto text-[#C5A27E]">
                    <Icon className="w-5 h-5" strokeWidth={1.4} />
                  </div>
                  <h3 className="mt-5 font-serif text-[23px] leading-snug text-[#382D28]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-[#5A4A42]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION E – FEATURED TREATMENTS & BEFORE/AFTER SHOWCASE STRUCTURE */}
      <section className="bg-[#F8F3EE] py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
                Signature Showcase
              </p>
              <h2 className="mt-2.5 font-serif text-[34px] sm:text-[44px] leading-[1.12] text-[#382D28]">
                Featured Treatments &amp; Results
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5A4A42]">
                A refined look at our signature beauty and skin rituals. Original
                client before-and-after photography will be showcased here once
                supplied by Richaa with client permission.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors self-start md:self-auto whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-7">
            {featuredShowcase.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] overflow-hidden flex flex-col"
              >
                {/* Transparent Before / After Editorial Layout Frame */}
                <div className="grid grid-cols-2 gap-[1px] bg-[#E8D5CA]">
                  <div className="bg-[#F2E8DF] aspect-[4/3] flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-[10px] tracking-[0.18em] uppercase text-[#A58A78]">
                      Before
                    </span>
                    <p className="mt-1.5 font-serif text-[17px] text-[#382D28]">
                      Original Photo Pending
                    </p>
                    <p className="mt-1 text-[11px] text-[#5A4A42] leading-snug">
                      Client results are never fabricated
                    </p>
                  </div>
                  <div className="relative aspect-[4/3]">
                    <LuxuryImage
                      src={item.image}
                      alt={item.imageAlt}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 right-2.5 bg-[#382D28]/75 text-[#F8F3EE] text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-[3px]">
                      Editorial Preview
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-[#A58A78]">
                    {item.category}
                  </p>
                  <h3 className="mt-1 font-serif text-[24px] text-[#382D28]">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#5A4A42] flex-1">
                    {item.shortDescription}
                  </p>
                  <div className="mt-5 pt-4 border-t border-[#E8D5CA]/70 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        navigate({ page: 'service-detail', slug: item.slug })
                      }
                      className="text-[13px] font-medium text-[#5A4A42] hover:text-[#382D28] transition-colors cursor-pointer"
                    >
                      Treatment Guide →
                    </button>
                    <button
                      type="button"
                      onClick={() => openBookingModal(item.name)}
                      className="text-[13px] font-medium text-[#A58A78] hover:text-[#382D28] transition-colors cursor-pointer"
                    >
                      Book Treatment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F – GALLERY SHOWCASE (Echoing House of She Horizontal Band) */}
      <section className="bg-[#F2E8DF] border-y border-[#E8D5CA]/80 py-16 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-4">
              <p className="text-[11px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
                Our Gallery
              </p>
              <h2 className="mt-2 font-serif text-[36px] sm:text-[40px] leading-[1.12] text-[#382D28]">
                {websiteContent.galleryHeading}
              </h2>
              <div className="w-10 h-[1px] bg-[#C5A27E] my-5" aria-hidden="true" />
              <p className="text-[14px] leading-relaxed text-[#5A4A42]">
                A glimpse of our serene treatment environment, lash artistry,
                brow contours and skin rituals. Click any image to view in
                detail.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate({ page: 'gallery' })}
                  className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer"
                >
                  <span>View Gallery</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="relative flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setGalleryOffset((prev) => Math.max(0, prev - 1))
                  }
                  disabled={galleryOffset === 0}
                  aria-label="Previous gallery photos"
                  className="hidden sm:inline-flex w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E8D5CA] items-center justify-center text-[#382D28] hover:border-[#C5A27E] disabled:opacity-40 transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.7} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                  {displayedGallerySlice.map((item, idx) => {
                    const realIndex = galleryOffset + idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLightboxIndex(realIndex)}
                        aria-label={`Open ${item.title} in gallery lightbox`}
                        className="group relative aspect-[4/3] rounded-[10px] overflow-hidden border border-[#E8D5CA] bg-[#FFFFFF] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A27E]"
                      >
                        <LuxuryImage
                          src={item.image}
                          alt={item.imageAlt}
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#382D28]/75 via-[#382D28]/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity">
                          <p className="text-[12px] font-medium text-[#FFFFFF] leading-tight">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-[#F2E8DF]/90">
                            {item.category}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setGalleryOffset((prev) => Math.min(maxOffset, prev + 1))
                  }
                  disabled={galleryOffset >= maxOffset}
                  aria-label="Next gallery photos"
                  className="hidden sm:inline-flex w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E8D5CA] items-center justify-center text-[#382D28] hover:border-[#C5A27E] disabled:opacity-40 transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={1.7} />
                </button>
              </div>

              {maxOffset > 0 && (
                <div className="mt-5 flex items-center justify-center gap-2">
                  {Array.from({ length: maxOffset + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGalleryOffset(idx)}
                      aria-label={`Show gallery slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        galleryOffset === idx
                          ? 'w-5 bg-[#382D28]'
                          : 'w-2 bg-[#C5A27E]/50 hover:bg-[#C5A27E]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION G – CLIENT REVIEWS (Zero Fabricated Reviews) */}
      <section className="bg-[#FFFFFF] py-16 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
              Client Testimonials
            </p>
            <h2 className="mt-2.5 font-serif text-[34px] sm:text-[42px] leading-[1.14] text-[#382D28]">
              {websiteContent.reviewsHeading}
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto mt-5" aria-hidden="true" />
          </div>

          {publishedReviews.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedReviews.slice(0, 3).map((review) => (
                <blockquote
                  key={review.id}
                  className="bg-[#F8F3EE] border border-[#E8D5CA] rounded-[12px] p-7 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="flex items-center gap-1 text-[#C5A27E]"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-4 h-4 fill-[#C5A27E]"
                          strokeWidth={1.4}
                        />
                      ))}
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed text-[#5A4A42]">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                  <footer className="mt-6 pt-4 border-t border-[#E8D5CA]/80 text-[13px]">
                    <p className="font-medium text-[#382D28]">
                      {review.clientName}
                    </p>
                    <p className="text-[#A58A78] text-[12px]">
                      {review.treatment} · {review.verifiedSource}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <div className="mt-10 max-w-2xl mx-auto bg-[#F8F3EE] border border-[#E8D5CA] rounded-[12px] p-8 sm:p-10 text-center">
              <p className="font-serif text-[26px] text-[#382D28]">
                Verified Client Reviews Coming Soon
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[#5A4A42]">
                We publish only genuine, verified reviews shared by real clients
                with their permission. Verified testimonials and direct links to
                our review platform will appear here once supplied by Richaa.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate({ page: 'reviews' })}
                  className="px-6 py-2.5 text-[13px] font-medium text-[#382D28] bg-[#FFFFFF] border border-[#E8D5CA] hover:border-[#C5A27E] rounded-[4px] transition-colors cursor-pointer"
                >
                  Visit Reviews Page
                </button>
                {businessConfig.reviewPlatformConfigured &&
                  businessConfig.reviewPlatformUrl && (
                    <a
                      href={businessConfig.reviewPlatformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 text-[13px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors"
                    >
                      Read on {businessConfig.reviewPlatformName}
                    </a>
                  )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION H – PRICING PREVIEW */}
      <section className="bg-[#F8F3EE] border-t border-[#E8D5CA]/80 py-16 sm:py-20">
        <div className="max-w-[1040px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
              Treatment Menu
            </p>
            <h2 className="mt-2.5 font-serif text-[34px] sm:text-[42px] leading-[1.14] text-[#382D28]">
              {websiteContent.pricingHeading}
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto my-5" aria-hidden="true" />
            <p className="text-[14px] text-[#5A4A42]">
              Transparent pricing curated directly from Richaa&apos;s official
              treatment list.
            </p>
          </div>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Pricing categories"
          >
            {PRICING_CATEGORIES.map((category) => {
              const isSelected = activePricingTab === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActivePricingTab(category)}
                  className={`px-4 py-2 text-[13px] rounded-[4px] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#C5A27E] text-white border-[#C5A27E]'
                      : 'bg-[#FFFFFF] text-[#5A4A42] border-[#E8D5CA] hover:border-[#C5A27E]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mt-8 bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] divide-y divide-[#E8D5CA]/70">
            {activePricingGroup?.items.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="font-serif text-[23px] text-[#382D28]">
                    {item.name}
                  </h3>
                  <p className="text-[13px] text-[#5A4A42] mt-0.5 max-w-xl">
                    {item.shortDescription}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                  <span className="text-[13px] italic text-[#A58A78] tabular-nums">
                    {item.displayPrice}
                  </span>
                  <button
                    type="button"
                    onClick={() => openBookingModal(item.name)}
                    className="text-[13px] font-medium text-[#382D28] underline underline-offset-4 hover:text-[#A58A78] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Book / Enquire
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => navigate({ page: 'pricing' })}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#382D28] hover:text-[#A58A78] transition-colors cursor-pointer"
            >
              <span>View Full Treatment &amp; Pricing Guide</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION I – BOOKING CTA BAND */}
      <section className="bg-[#F2E8DF] border-y border-[#E8D5CA] py-16 sm:py-20">
        <div className="max-w-[920px] mx-auto px-6 sm:px-10 text-center">
          <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
            Online Appointments
          </p>
          <h2 className="mt-3 font-serif text-[36px] sm:text-[46px] leading-[1.12] text-[#382D28]">
            {websiteContent.bookingHeading}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#5A4A42] max-w-xl mx-auto">
            Ready to experience personalised beauty and aesthetic care? Book
            directly through our booking platform or speak with Richaa on
            WhatsApp for tailored advice before your visit.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 text-[14px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors whitespace-nowrap cursor-pointer"
            >
              <Calendar className="w-4 h-4" strokeWidth={1.6} />
              <span>Book Appointment</span>
            </button>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-[14px] font-medium text-[#382D28] bg-[#FFFFFF] border border-[#E8D5CA] hover:border-[#C5A27E] rounded-[4px] transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#C5A27E]" strokeWidth={1.6} />
              <span>{businessConfig.whatsappCta}</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION J – CONTACT PREVIEW */}
      <section className="bg-[#F8F3EE] py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
                  Contact Richaa
                </p>
                <h2 className="mt-2.5 font-serif text-[36px] sm:text-[42px] leading-[1.12] text-[#382D28]">
                  {websiteContent.contactHeading}
                </h2>
                <div className="w-12 h-[1px] bg-[#C5A27E] my-5" aria-hidden="true" />
                <p className="text-[15px] leading-relaxed text-[#5A4A42]">
                  Whether you are booking your first aesthetic treatment or have
                  a question about lash and brow care, we welcome your message.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <a
                  href={businessConfig.phoneHref}
                  className="flex items-start gap-4 p-4 bg-[#FFFFFF] border border-[#E8D5CA] rounded-[8px] hover:border-[#C5A27E] transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#C5A27E] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.12em] text-[#A58A78]">
                      Telephone
                    </p>
                    <p className="text-[15px] font-medium text-[#382D28] tabular-nums">
                      {businessConfig.phoneDisplay}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${businessConfig.email}`}
                  className="flex items-start gap-4 p-4 bg-[#FFFFFF] border border-[#E8D5CA] rounded-[8px] hover:border-[#C5A27E] transition-colors"
                >
                  <Mail className="w-5 h-5 text-[#C5A27E] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.12em] text-[#A58A78]">
                      Email
                    </p>
                    <p className="text-[15px] font-medium text-[#382D28] break-all">
                      {businessConfig.email}
                    </p>
                  </div>
                </a>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-[#FFFFFF] border border-[#E8D5CA] rounded-[8px] hover:border-[#C5A27E] transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-[#C5A27E] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.12em] text-[#A58A78]">
                      WhatsApp Direct
                    </p>
                    <p className="text-[15px] font-medium text-[#382D28]">
                      {businessConfig.whatsappCta} ({businessConfig.phoneDisplay})
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 bg-[#F2E8DF]/70 border border-[#E8D5CA] rounded-[8px]">
                  <MapPin className="w-5 h-5 text-[#A58A78] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.12em] text-[#A58A78]">
                      Studio Location
                    </p>
                    <p className="text-[14px] text-[#5A4A42] leading-relaxed">
                      {businessConfig.addressText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <GalleryLightbox
        items={visibleGallery}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}

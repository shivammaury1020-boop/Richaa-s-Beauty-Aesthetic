import React from 'react';
import {
  ArrowRight,
  Award,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { BRAND_IMAGES } from '../data/initialData';
import { BotanicalMarginAccent } from '../components/BrandMark';
import { LuxuryImage } from '../components/LuxuryImage';

const PHILOSOPHY_PILLARS = [
  {
    icon: Award,
    title: '5+ Years of Experience',
    body: 'Over five years in the beauty industry shaping refined skills across lash artistry, brow styling, skincare and aesthetic treatments.',
  },
  {
    icon: Sparkles,
    title: 'Personalised Approach',
    body: 'No two clients share the same features or skin needs. Every appointment begins with attentive consultation to tailor the treatment around you.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality & Precision',
    body: 'Meticulous hygiene, calm unhurried technique and thoughtful aftercare advice designed to protect your natural lashes, brows and skin.',
  },
  {
    icon: HeartHandshake,
    title: 'Confidence-First Care',
    body: 'Dedicated to understated elegance and making every client leave feeling comfortable, valued and naturally confident.',
  },
];

export function AboutPage() {
  const { navigate, websiteContent, businessConfig, openBookingModal } =
    useSite();

  return (
    <div className="bg-[#F8F3EE]">
      {/* Page Hero */}
      <section className="relative bg-[#F2E8DF] border-b border-[#E8D5CA] overflow-hidden">
        <BotanicalMarginAccent className="hidden lg:block absolute right-6 top-6 w-40 h-56 pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 sm:py-20">
          <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
            {websiteContent.aboutLabel}
          </p>
          <h1 className="mt-3 font-serif text-[42px] sm:text-[54px] leading-[1.08] text-[#382D28] max-w-2xl">
            {websiteContent.aboutHeading}
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A27E] my-5" aria-hidden="true" />
          <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#5A4A42] max-w-2xl">
            {businessConfig.tagline}
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="rounded-[12px] overflow-hidden border border-[#E8D5CA] aspect-[3/4] max-w-[440px] mx-auto lg:mx-0">
              <LuxuryImage
                src={BRAND_IMAGES.specialistPortrait}
                alt="Editorial portrait placeholder representing Richaa's Beauty & Aesthetic"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover object-top"
                priority
                placeholderCaption="Replaceable Portrait — Original Photo Coming Soon"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
              About Richaa&apos;s Beauty &amp; Aesthetic
            </p>
            <h2 className="font-serif text-[34px] sm:text-[42px] leading-[1.12] text-[#382D28]">
              Thoughtful Beauty &amp; Aesthetics Tailored Around You
            </h2>
            <p className="text-[15px] sm:text-[16px] leading-[1.8] text-[#5A4A42]">
              {websiteContent.aboutIntro}
            </p>
            <p className="text-[15px] sm:text-[16px] leading-[1.8] text-[#5A4A42]">
              {websiteContent.aboutExtended}
            </p>

            <div className="p-6 bg-[#FFFFFF] border border-[#E8D5CA] rounded-[10px]">
              <p className="text-[12px] tracking-[0.16em] uppercase text-[#A58A78] font-medium">
                Verified Profile Note
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#5A4A42]">
                Additional biography notes, verified qualifications and studio
                photographs will be published here directly upon confirmation
                from Richaa. We never publish unverified accreditations or
                invented credentials.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3.5">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => navigate({ page: 'services' })}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium text-[#382D28] bg-[#FFFFFF] border border-[#E8D5CA] hover:border-[#C5A27E] rounded-[4px] transition-colors cursor-pointer"
              >
                <span>Explore Treatments</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="bg-[#FFFFFF] border-t border-[#E8D5CA] py-16 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
              Our Ethos
            </p>
            <h2 className="mt-2.5 font-serif text-[34px] sm:text-[42px] text-[#382D28]">
              Our Commitment to Every Client
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto mt-5" aria-hidden="true" />
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PHILOSOPHY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-[#F8F3EE] border border-[#E8D5CA] rounded-[12px] p-7"
                >
                  <div className="w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#E8D5CA] flex items-center justify-center text-[#C5A27E]">
                    <Icon className="w-5 h-5" strokeWidth={1.4} />
                  </div>
                  <h3 className="mt-5 font-serif text-[23px] text-[#382D28]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-[#5A4A42]">
                    {pillar.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

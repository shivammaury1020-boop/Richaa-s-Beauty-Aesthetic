import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import type { ServiceCategory } from '../types/site';
import {
  PRICING_CATEGORIES,
  filterServicesByCategory,
} from '../utils/siteLogic';
import { ServiceCard } from '../components/ServiceCard';

interface ServicesPageProps {
  initialCategory?: ServiceCategory;
}

export function ServicesPage({ initialCategory }: ServicesPageProps) {
  const { services, websiteContent, openBookingModal, navigate } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | 'All'
  >(initialCategory ?? 'All');

  useEffect(() => {
    setSelectedCategory(initialCategory ?? 'All');
  }, [initialCategory]);

  const filteredServices = useMemo(
    () => filterServicesByCategory(services, selectedCategory),
    [services, selectedCategory]
  );

  return (
    <div className="bg-[#F8F3EE]">
      {/* Page Header */}
      <section className="bg-[#F2E8DF] border-b border-[#E8D5CA]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 sm:py-20 text-center">
          <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
            Our Treatments
          </p>
          <h1 className="mt-3 font-serif text-[42px] sm:text-[54px] leading-[1.08] text-[#382D28]">
            {websiteContent.servicesHeading}
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto my-5" aria-hidden="true" />
          <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#5A4A42] max-w-2xl mx-auto">
            From delicate lash and brow artistry to restorative facials,
            microneedling, skin rejuvenation, waxing and permanent makeup—every
            treatment is personalised with care.
          </p>
        </div>
      </section>

      {/* Filter & Full Grid */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 sm:py-20">
        <div
          className="flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filter treatments by category"
        >
          {(['All', ...PRICING_CATEGORIES] as Array<ServiceCategory | 'All'>).map(
            (category) => {
              const active = selectedCategory === category;
              const count = filterServicesByCategory(services, category).length;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 text-[13px] rounded-[4px] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#382D28] text-[#F8F3EE] border-[#382D28]'
                      : 'bg-[#FFFFFF] text-[#5A4A42] border-[#E8D5CA] hover:border-[#C5A27E] hover:text-[#382D28]'
                  }`}
                >
                  {category === 'All' ? `All Treatments (${count})` : `${category} (${count})`}
                </button>
              );
            }
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Consultation Callout */}
        <div className="mt-16 bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A58A78]">
              Not Sure Where to Begin?
            </p>
            <h2 className="mt-1.5 font-serif text-[30px] text-[#382D28]">
              Personalised Treatment Advice
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#5A4A42]">
              Send an enquiry or book a consultation and Richaa will guide you
              toward the treatments best suited to your goals.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'pricing' })}
              className="px-6 py-3 text-[13px] font-medium text-[#382D28] bg-[#F8F3EE] border border-[#E8D5CA] hover:border-[#C5A27E] rounded-[4px] transition-colors cursor-pointer whitespace-nowrap"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

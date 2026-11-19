import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import type { TreatmentService } from '../types/site';
import { routeToPath } from '../utils/siteLogic';
import { LuxuryImage } from './LuxuryImage';
import { ServiceIcon } from './ServiceIcon';

interface ServiceCardProps {
  service: TreatmentService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { navigate, openBookingModal } = useSite();

  return (
    <article className="group flex flex-col bg-[#F2E8DF]/75 border border-[#E8D5CA] rounded-[12px] overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(56,45,40,0.07)]">
      <a
        href={routeToPath({ page: 'service-detail', slug: service.slug })}
        onClick={(e) => {
          e.preventDefault();
          navigate({ page: 'service-detail', slug: service.slug });
        }}
        className="block relative aspect-[4/3] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C5A27E]"
        aria-label={`View details for ${service.name}`}
      >
        <LuxuryImage
          src={service.image}
          alt={service.imageAlt}
          containerClassName="w-full h-full"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </a>

      <div className="relative px-6 pt-8 pb-6 flex-1 flex flex-col items-center text-center">
        {/* Signature overlapping circular medallion from reference */}
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#E8D5CA] flex items-center justify-center text-[#5A4A42] shadow-[0_4px_12px_rgba(56,45,40,0.06)]"
          aria-hidden="true"
        >
          <ServiceIcon icon={service.icon} className="w-5 h-5" />
        </div>

        <p className="text-[11px] tracking-[0.18em] uppercase text-[#A58A78] mb-1.5">
          {service.category}
        </p>

        <h3 className="font-serif text-[25px] leading-snug text-[#382D28] font-medium">
          <a
            href={routeToPath({ page: 'service-detail', slug: service.slug })}
            onClick={(e) => {
              e.preventDefault();
              navigate({ page: 'service-detail', slug: service.slug });
            }}
            className="hover:text-[#A58A78] transition-colors"
          >
            {service.name}
          </a>
        </h3>

        <p className="mt-2.5 text-[14px] leading-relaxed text-[#5A4A42] flex-1">
          {service.shortDescription}
        </p>

        <div className="mt-6 pt-4 w-full border-t border-[#E8D5CA]/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              navigate({ page: 'service-detail', slug: service.slug })
            }
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5A4A42] hover:text-[#382D28] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1.5"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
          </button>

          <button
            type="button"
            onClick={() => openBookingModal(service.name)}
            className="px-4 py-2 text-[12px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}

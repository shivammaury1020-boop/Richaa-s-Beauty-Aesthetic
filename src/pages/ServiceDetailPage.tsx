import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  MessageCircle,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { buildWhatsAppUrl, formatServicePrice } from '../utils/siteLogic';
import { LuxuryImage } from '../components/LuxuryImage';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceIcon } from '../components/ServiceIcon';

interface ServiceDetailPageProps {
  slug: string;
}

export function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
  const { services, navigate, openBookingModal, businessConfig } = useSite();
  const service = services.find((s) => s.slug === slug && s.active);

  if (!service) {
    return (
      <div className="bg-[#F8F3EE] min-h-[60vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-md text-center bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] p-10">
          <h1 className="font-serif text-[32px] text-[#382D28]">
            Treatment Not Found
          </h1>
          <p className="mt-3 text-[14px] text-[#5A4A42]">
            The treatment you were looking for may have been updated. Explore
            our full beauty and aesthetics menu below.
          </p>
          <button
            type="button"
            onClick={() => navigate({ page: 'services' })}
            className="mt-6 px-6 py-3 text-[13px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer"
          >
            Back to All Services
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = formatServicePrice(service.priceLabel);
  const whatsAppUrl = buildWhatsAppUrl(
    businessConfig.whatsappDigits,
    businessConfig.whatsappPrefill,
    service.name
  );

  const related = services
    .filter((s) => s.active && s.id !== service.id)
    .sort((a, b) =>
      a.category === service.category ? -1 : b.category === service.category ? 1 : 0
    )
    .slice(0, 3);

  return (
    <div className="bg-[#F8F3EE]">
      {/* Breadcrumb + Top Split */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-8 pb-16 sm:pb-20">
        <button
          type="button"
          onClick={() => navigate({ page: 'services' })}
          className="inline-flex items-center gap-2 text-[13px] text-[#5A4A42] hover:text-[#382D28] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.6} />
          <span>Back to All Treatments</span>
        </button>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-6">
            <div className="rounded-[12px] overflow-hidden border border-[#E8D5CA] aspect-[4/3] shadow-[0_14px_36px_rgba(56,45,40,0.07)]">
              <LuxuryImage
                src={service.image}
                alt={service.imageAlt}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.18em] uppercase text-[#A58A78]">
              <ServiceIcon icon={service.icon} className="w-4 h-4 text-[#C5A27E]" />
              <span>{service.category}</span>
            </div>

            <h1 className="font-serif text-[40px] sm:text-[50px] leading-[1.08] text-[#382D28]">
              {service.name}
            </h1>

            <div className="w-12 h-[1px] bg-[#C5A27E]" aria-hidden="true" />

            <p className="text-[15px] sm:text-[16px] leading-[1.8] text-[#5A4A42]">
              {service.fullDescription}
            </p>

            {/* Contiguous Pricing & Booking Block */}
            <div className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[10px] p-6 space-y-5">
              <div className="space-y-2 pb-4 border-b border-[#E8D5CA]/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[12px] tracking-[0.16em] uppercase text-[#A58A78]">
                    Treatment Price
                    {service.durationLabel ? ` · ${service.durationLabel}` : ''}
                  </span>
                  <div className="flex items-baseline gap-2.5 tabular-nums">
                    {service.promoPriceLabel ? (
                      <>
                        <span className="text-[16px] font-medium text-[#382D28]">
                          {service.promoPriceLabel}
                        </span>
                        {service.priceLabel && (
                          <span className="text-[13px] line-through text-[#A58A78]">
                            {service.priceLabel}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[15px] font-medium text-[#382D28]">
                        {displayPrice}
                      </span>
                    )}
                  </div>
                </div>
                {service.pricingNotes && (
                  <p className="text-[12px] text-[#6B5A50]">
                    {service.pricingNotes}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => openBookingModal(service.name)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" strokeWidth={1.6} />
                  <span>Book Appointment</span>
                </button>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[13px] font-medium text-[#382D28] bg-[#F8F3EE] border border-[#E8D5CA] hover:border-[#C5A27E] rounded-[4px] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A27E]" strokeWidth={1.6} />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits, Experience & Aftercare */}
      <section className="bg-[#FFFFFF] border-y border-[#E8D5CA] py-14 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[#F8F3EE] border border-[#E8D5CA] rounded-[12px] p-7">
            <h2 className="font-serif text-[26px] text-[#382D28]">
              Key Benefits
            </h2>
            <ul className="mt-5 space-y-3.5">
              {service.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-[#5A4A42]"
                >
                  <Check
                    className="w-4 h-4 text-[#C5A27E] mt-1 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#F8F3EE] border border-[#E8D5CA] rounded-[12px] p-7">
            <h2 className="font-serif text-[26px] text-[#382D28]">
              What to Expect
            </h2>
            <ol className="mt-5 space-y-3.5">
              {service.treatmentSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-[#5A4A42]"
                >
                  <span className="font-serif text-[16px] text-[#C5A27E] font-semibold tabular-nums shrink-0 w-5">
                    0{index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-[#F8F3EE] border border-[#E8D5CA] rounded-[12px] p-7">
            <h2 className="font-serif text-[26px] text-[#382D28]">
              Care &amp; Preparation
            </h2>
            <ul className="mt-5 space-y-3.5">
              {service.aftercareNotes.map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-[#5A4A42]"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#C5A27E] mt-2 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related Treatments */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4 mb-9">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A58A78]">
              Continue Exploring
            </p>
            <h2 className="mt-1 font-serif text-[32px] sm:text-[38px] text-[#382D28]">
              Complementary Treatments
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate({ page: 'services' })}
            className="text-[13px] font-medium text-[#382D28] hover:text-[#A58A78] underline underline-offset-4 transition-colors cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {related.map((item) => (
            <ServiceCard key={item.id} service={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

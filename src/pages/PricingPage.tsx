import React, { useMemo } from 'react';
import { ArrowRight, Calendar, MessageCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import {
  buildWhatsAppUrl,
  groupServicesForPricing,
} from '../utils/siteLogic';

export function PricingPage() {
  const { services, websiteContent, businessConfig, openBookingModal, navigate } =
    useSite();

  const grouped = useMemo(() => groupServicesForPricing(services), [services]);
  const whatsAppUrl = buildWhatsAppUrl(
    businessConfig.whatsappDigits,
    businessConfig.whatsappPrefill
  );

  return (
    <div className="bg-[#F8F3EE]">
      <section className="bg-[#F2E8DF] border-b border-[#E8D5CA]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 sm:py-20 text-center">
          <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
            Official Treatment Menu
          </p>
          <h1 className="mt-3 font-serif text-[42px] sm:text-[54px] leading-[1.08] text-[#382D28]">
            {websiteContent.pricingHeading}
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto my-5" aria-hidden="true" />
          <p className="text-[15px] leading-relaxed text-[#5A4A42] max-w-2xl mx-auto">
            All prices are published directly from Richaa&apos;s verified price
            list. Where official prices are still being finalised, please
            enquire directly via WhatsApp or the booking platform.
          </p>
        </div>
      </section>

      <section className="max-w-[1040px] mx-auto px-6 sm:px-10 py-14 sm:py-20 space-y-10">
        {grouped.map((group) => (
          <div
            key={group.category}
            className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] overflow-hidden"
          >
            <div className="px-6 sm:px-8 py-5 bg-[#F2E8DF]/65 border-b border-[#E8D5CA] flex items-center justify-between">
              <h2 className="font-serif text-[28px] sm:text-[32px] text-[#382D28]">
                {group.category}
              </h2>
              <span className="text-[12px] tracking-[0.14em] uppercase text-[#A58A78] tabular-nums">
                {group.items.length}{' '}
                {group.items.length === 1 ? 'Treatment' : 'Treatments'}
              </span>
            </div>

            <div className="divide-y divide-[#E8D5CA]/70">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="px-6 sm:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="max-w-xl">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <button
                        type="button"
                        onClick={() =>
                          navigate({ page: 'service-detail', slug: item.slug })
                        }
                        className="text-left font-serif text-[23px] text-[#382D28] hover:text-[#A58A78] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </button>
                      {item.durationLabel && (
                        <span className="text-[12px] tracking-[0.06em] uppercase text-[#A58A78]">
                          {item.durationLabel}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[14px] text-[#5A4A42] leading-relaxed">
                      {item.shortDescription}
                    </p>
                    {item.pricingNotes && (
                      <p className="mt-1.5 text-[12px] text-[#A58A78]">
                        {item.pricingNotes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 shrink-0">
                    <div className="text-left md:text-right tabular-nums">
                      {item.promoPriceLabel ? (
                        <div className="flex flex-col md:items-end">
                          <span className="text-[15px] font-medium text-[#382D28]">
                            {item.promoPriceLabel}
                          </span>
                          {item.priceLabel && (
                            <span className="text-[12px] line-through text-[#A58A78]">
                              {item.priceLabel}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span
                          className={`text-[14px] ${
                            item.priceLabel
                              ? 'font-medium text-[#382D28]'
                              : 'italic text-[#A58A78]'
                          }`}
                        >
                          {item.displayPrice}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openBookingModal(item.name)}
                      className="px-4 py-2 text-[12px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Book / Enquire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Direct Pricing Enquiry Callout */}
        <div className="bg-[#F2E8DF] border border-[#E8D5CA] rounded-[12px] p-8 sm:p-10 text-center space-y-4">
          <h2 className="font-serif text-[32px] text-[#382D28]">
            Need a Personalised Treatment Quote?
          </h2>
          <p className="text-[14px] leading-relaxed text-[#5A4A42] max-w-xl mx-auto">
            Message Richaa directly on WhatsApp or open our booking platform for
            tailored recommendations and current availability.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" strokeWidth={1.6} />
              <span>Book Appointment</span>
            </button>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-medium text-[#382D28] bg-[#FFFFFF] border border-[#E8D5CA] hover:border-[#C5A27E] rounded-[4px] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#C5A27E]" strokeWidth={1.6} />
              <span>{businessConfig.whatsappCta}</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.6} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

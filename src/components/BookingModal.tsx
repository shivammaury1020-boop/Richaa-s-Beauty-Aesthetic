import React, { useEffect, useState } from 'react';
import {
  Calendar,
  ExternalLink,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { buildWhatsAppUrl, resolveBookingDestination } from '../utils/siteLogic';
import { BotanicalEmblem } from './BrandMark';

export function BookingModal() {
  const { bookingModal, closeBookingModal, businessConfig, navigate } = useSite();
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    if (!bookingModal.open) {
      setShowEmbed(false);
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBookingModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bookingModal.open, closeBookingModal]);

  if (!bookingModal.open) return null;

  const destination = resolveBookingDestination(businessConfig);
  const whatsAppUrl = buildWhatsAppUrl(
    businessConfig.whatsappDigits,
    businessConfig.whatsappPrefill,
    bookingModal.treatmentName
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#382D28]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBookingModal();
      }}
    >
      <div className="relative w-full max-w-[600px] bg-[#F8F3EE] border border-[#E8D5CA] rounded-[12px] shadow-2xl overflow-hidden animate-luxury-fade">
        <div className="flex items-start justify-between px-6 sm:px-8 pt-6 pb-5 border-b border-[#E8D5CA] bg-[#FFFFFF]">
          <div>
            <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#A58A78]">
              <BotanicalEmblem className="w-5 h-4" />
              <span>Appointment Booking</span>
            </div>
            <h2
              id="booking-modal-title"
              className="mt-1.5 font-serif text-[28px] sm:text-[32px] leading-tight text-[#382D28]"
            >
              {bookingModal.treatmentName
                ? `Book ${bookingModal.treatmentName}`
                : 'Book Your Appointment'}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeBookingModal}
            aria-label="Close booking dialog"
            className="w-10 h-10 rounded-full border border-[#E8D5CA] flex items-center justify-center text-[#5A4A42] hover:bg-[#F2E8DF] hover:text-[#382D28] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" strokeWidth={1.7} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {destination.isConfigured && destination.url ? (
            <>
              <p className="text-[14px] leading-relaxed text-[#5A4A42]">
                Appointments for{' '}
                <strong className="font-medium text-[#382D28]">
                  {businessConfig.brandName}
                </strong>{' '}
                are scheduled directly through our live booking platform so you
                can view real-time availability.
              </p>

              {businessConfig.allowBookingEmbed && showEmbed ? (
                <div className="rounded-[8px] overflow-hidden border border-[#E8D5CA] bg-white">
                  <iframe
                    src={destination.url}
                    title="Online Appointment Booking Widget"
                    className="w-full h-[380px] border-0"
                  />
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={destination.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" strokeWidth={1.6} />
                  <span>Open Booking Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.6} />
                </a>

                {businessConfig.allowBookingEmbed && (
                  <button
                    type="button"
                    onClick={() => setShowEmbed((prev) => !prev)}
                    className="px-5 py-3.5 text-[13px] font-medium text-[#382D28] bg-[#FFFFFF] border border-[#E8D5CA] hover:bg-[#F2E8DF] rounded-[4px] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {showEmbed ? 'Hide Embedded View' : 'Load Embedded Widget'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[8px] p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase text-[#A58A78] font-medium">
                <Calendar className="w-4 h-4 text-[#C5A27E]" strokeWidth={1.6} />
                <span>Existing Booking System Integration Ready</span>
              </div>
              <p className="text-[14px] leading-relaxed text-[#5A4A42]">
                All booking buttons across this website connect directly to
                Richaa&apos;s existing online booking system. The live booking
                URL is currently awaiting owner confirmation.
              </p>
              <p className="text-[13px] text-[#A58A78]">
                In the meantime, you can request your preferred treatment time
                directly via WhatsApp, telephone, or our enquiry form below.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-[12px] tracking-[0.14em] uppercase text-[#A58A78]">
              Direct Booking Assistance
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.6} />
                <span>{businessConfig.whatsappCta} on WhatsApp</span>
              </a>
              <a
                href={businessConfig.phoneHref}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-medium text-[#382D28] bg-[#FFFFFF] border border-[#E8D5CA] hover:bg-[#F2E8DF] rounded-[4px] transition-colors whitespace-nowrap tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#A58A78]" strokeWidth={1.6} />
                <span>Call {businessConfig.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8D5CA]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px]">
            <span className="text-[#5A4A42]">
              Prefer to send an online enquiry?
            </span>
            <button
              type="button"
              onClick={() => {
                const treatment = bookingModal.treatmentName;
                closeBookingModal();
                navigate({ page: 'contact', preselectedTreatment: treatment });
              }}
              className="font-medium text-[#382D28] underline underline-offset-4 hover:text-[#A58A78] transition-colors cursor-pointer"
            >
              Go to Contact Form →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

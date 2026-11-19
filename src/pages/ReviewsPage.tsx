import React, { useMemo } from 'react';
import { ExternalLink, MessageCircle, ShieldCheck, Star } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { buildWhatsAppUrl } from '../utils/siteLogic';

export function ReviewsPage() {
  const { reviews, websiteContent, businessConfig, openBookingModal } =
    useSite();

  const publishedReviews = useMemo(
    () => reviews.filter((r) => r.published),
    [reviews]
  );

  const whatsAppUrl = buildWhatsAppUrl(
    businessConfig.whatsappDigits,
    businessConfig.whatsappPrefill
  );

  return (
    <div className="bg-[#F8F3EE]">
      <section className="bg-[#F2E8DF] border-b border-[#E8D5CA]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 sm:py-20 text-center">
          <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
            Client Feedback
          </p>
          <h1 className="mt-3 font-serif text-[42px] sm:text-[54px] leading-[1.08] text-[#382D28]">
            {websiteContent.reviewsHeading}
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto my-5" aria-hidden="true" />
          <p className="text-[15px] leading-relaxed text-[#5A4A42] max-w-2xl mx-auto">
            Authentic experiences shared by clients of Richaa&apos;s Beauty
            &amp; Aesthetic. We publish only verified client reviews with
            explicit client permission.
          </p>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 sm:px-10 py-14 sm:py-20">
        {publishedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedReviews.map((review) => (
              <blockquote
                key={review.id}
                className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] p-7 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="flex items-center gap-1 text-[#C5A27E]"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#C5A27E]"
                        strokeWidth={1.4}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-[14px] leading-relaxed text-[#5A4A42]">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <footer className="mt-6 pt-4 border-t border-[#E8D5CA]/70">
                  <p className="text-[14px] font-medium text-[#382D28]">
                    {review.clientName}
                  </p>
                  <p className="text-[12px] text-[#A58A78]">
                    {review.treatment} · {review.verifiedSource} ·{' '}
                    {review.dateLabel}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] p-8 sm:p-12 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#F2E8DF] border border-[#E8D5CA] flex items-center justify-center mx-auto text-[#C5A27E]">
              <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-[32px] text-[#382D28]">
              Verified Reviews Awaiting Publication
            </h2>
            <p className="text-[15px] leading-relaxed text-[#5A4A42]">
              In keeping with our commitment to complete transparency, this
              website does not display fabricated ratings or placeholder
              testimonials. Real client reviews and verified star ratings will
              be published here once supplied by Richaa with client consent.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              {businessConfig.reviewPlatformConfigured &&
              businessConfig.reviewPlatformUrl ? (
                <a
                  href={businessConfig.reviewPlatformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors"
                >
                  <span>View on {businessConfig.reviewPlatformName}</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.6} />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="px-7 py-3 text-[13px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer"
                >
                  Book Your Visit
                </button>
              )}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium text-[#382D28] bg-[#F8F3EE] border border-[#E8D5CA] hover:border-[#C5A27E] rounded-[4px] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A27E]" strokeWidth={1.6} />
                <span>{businessConfig.whatsappCta}</span>
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

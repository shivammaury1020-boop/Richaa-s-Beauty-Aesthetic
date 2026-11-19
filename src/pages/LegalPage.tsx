import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface LegalPageProps {
  mode: 'privacy' | 'terms';
}

export function LegalPage({ mode }: LegalPageProps) {
  const { businessConfig, navigate } = useSite();
  const isPrivacy = mode === 'privacy';

  return (
    <div className="bg-[#F8F3EE]">
      <section className="bg-[#F2E8DF] border-b border-[#E8D5CA]">
        <div className="max-w-[920px] mx-auto px-6 sm:px-10 py-14 sm:py-16">
          <button
            type="button"
            onClick={() => navigate({ page: 'home' })}
            className="inline-flex items-center gap-2 text-[13px] text-[#5A4A42] hover:text-[#382D28] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.6} />
            <span>Back to Home</span>
          </button>
          <p className="mt-6 text-[11px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
            Legal Information
          </p>
          <h1 className="mt-2 font-serif text-[40px] sm:text-[50px] leading-[1.08] text-[#382D28]">
            {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
          </h1>
          <p className="mt-3 text-[13px] text-[#A58A78]">
            {businessConfig.brandName} · United Kingdom
          </p>
        </div>
      </section>

      <section className="max-w-[920px] mx-auto px-6 sm:px-10 py-14 sm:py-16">
        <div className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] p-7 sm:p-10 space-y-8 text-[15px] leading-[1.8] text-[#5A4A42]">
          {isPrivacy ? (
            <>
              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  1. Introduction
                </h2>
                <p>
                  {businessConfig.brandName} respects your privacy and is
                  committed to protecting your personal data in accordance with
                  the UK General Data Protection Regulation (UK GDPR) and the
                  Data Protection Act 2018. This policy explains how we handle
                  personal information submitted through this website or via
                  direct enquiries.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  2. Information We Collect
                </h2>
                <p>
                  When you submit a contact enquiry, call, email or message us
                  via WhatsApp, we may collect your name, email address,
                  telephone number, treatment preferences and any details you
                  choose to share so we can respond to your enquiry.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  3. Online Booking &amp; Third-Party Services
                </h2>
                <p>
                  Appointment bookings are processed via our designated external
                  booking platform once connected. When you follow a booking
                  link or contact us via WhatsApp, your data is also subject to
                  the privacy policy of that third-party platform.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  4. How We Use &amp; Store Your Information
                </h2>
                <p>
                  We use your contact details solely to respond to treatment
                  enquiries, coordinate consultations and provide requested
                  client care. We never sell or rent client data to third
                  parties.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  5. Your Data Rights &amp; Contact
                </h2>
                <p>
                  You have the right to request access to, correction of, or
                  deletion of your personal data at any time. To make a request,
                  please email{' '}
                  <a
                    href={`mailto:${businessConfig.email}`}
                    className="text-[#382D28] underline underline-offset-4"
                  >
                    {businessConfig.email}
                  </a>{' '}
                  or call{' '}
                  <a
                    href={businessConfig.phoneHref}
                    className="text-[#382D28] underline underline-offset-4 tabular-nums"
                  >
                    {businessConfig.phoneDisplay}
                  </a>
                  .
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  1. Website Use &amp; Information
                </h2>
                <p>
                  This website provides general information about the beauty and
                  aesthetic treatments offered by {businessConfig.brandName}.
                  Treatment suitability is always confirmed individually during
                  your consultation.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  2. Appointments &amp; Bookings
                </h2>
                <p>
                  Appointments are arranged through our external booking system
                  or confirmed directly with {businessConfig.brandName}. Specific
                  deposit, rescheduling and cancellation terms will be published
                  here once finalised by the business owner.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  3. Consultations &amp; Patch Testing
                </h2>
                <p>
                  Certain lash, brow, tinting, aesthetic and permanent makeup
                  treatments may require a consultation or patch test prior to
                  your appointment for your comfort and safety. Please confirm
                  requirements when booking.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  4. Pricing Transparency
                </h2>
                <p>
                  Official treatment pricing is updated directly from
                  Richaa&apos;s confirmed price list. Where pricing is marked as
                  coming soon, exact figures will be confirmed prior to booking.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-[26px] text-[#382D28] mb-2">
                  5. Contact
                </h2>
                <p>
                  For any questions regarding these terms, please contact{' '}
                  {businessConfig.brandName} at{' '}
                  <a
                    href={`mailto:${businessConfig.email}`}
                    className="text-[#382D28] underline underline-offset-4"
                  >
                    {businessConfig.email}
                  </a>{' '}
                  or{' '}
                  <a
                    href={businessConfig.phoneHref}
                    className="text-[#382D28] underline underline-offset-4 tabular-nums"
                  >
                    {businessConfig.phoneDisplay}
                  </a>
                  .
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

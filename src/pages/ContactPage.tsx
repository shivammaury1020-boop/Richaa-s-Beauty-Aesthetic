import React from 'react';
import {
  Clock,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { buildWhatsAppUrl } from '../utils/siteLogic';
import { ContactForm } from '../components/ContactForm';

interface ContactPageProps {
  preselectedTreatment?: string;
}

export function ContactPage({ preselectedTreatment }: ContactPageProps) {
  const { businessConfig, websiteContent } = useSite();
  const whatsAppUrl = buildWhatsAppUrl(
    businessConfig.whatsappDigits,
    businessConfig.whatsappPrefill,
    preselectedTreatment
  );

  return (
    <div className="bg-[#F8F3EE]">
      <section className="bg-[#F2E8DF] border-b border-[#E8D5CA]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 sm:py-20 text-center">
          <p className="text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#A58A78] font-medium">
            Get In Touch
          </p>
          <h1 className="mt-3 font-serif text-[42px] sm:text-[54px] leading-[1.08] text-[#382D28]">
            {websiteContent.contactHeading}
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A27E] mx-auto my-5" aria-hidden="true" />
          <p className="text-[15px] leading-relaxed text-[#5A4A42] max-w-2xl mx-auto">
            Reach out to {businessConfig.brandName} by telephone, email,
            WhatsApp or the enquiry form below.
          </p>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Verified Contact Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] p-6 sm:p-7 space-y-5">
              <h2 className="font-serif text-[28px] text-[#382D28]">
                Direct Contact Details
              </h2>

              <div className="space-y-4">
                <a
                  href={businessConfig.phoneHref}
                  className="flex items-start gap-3.5 p-3.5 rounded-[8px] bg-[#F8F3EE] border border-[#E8D5CA]/80 hover:border-[#C5A27E] transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#C5A27E] mt-0.5 shrink-0" strokeWidth={1.6} />
                  <div>
                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#A58A78]">
                      Click to Call
                    </p>
                    <p className="text-[15px] font-medium text-[#382D28] tabular-nums">
                      {businessConfig.phoneDisplay}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${businessConfig.email}`}
                  className="flex items-start gap-3.5 p-3.5 rounded-[8px] bg-[#F8F3EE] border border-[#E8D5CA]/80 hover:border-[#C5A27E] transition-colors"
                >
                  <Mail className="w-5 h-5 text-[#C5A27E] mt-0.5 shrink-0" strokeWidth={1.6} />
                  <div>
                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#A58A78]">
                      Email Us
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
                  className="flex items-start gap-3.5 p-3.5 rounded-[8px] bg-[#C5A27E] text-white hover:bg-[#B28E68] transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mt-0.5 shrink-0" strokeWidth={1.6} />
                  <div>
                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#F8F3EE]/90">
                      WhatsApp Direct
                    </p>
                    <p className="text-[15px] font-medium">
                      {businessConfig.whatsappCta} · {businessConfig.phoneDisplay}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 p-3.5 rounded-[8px] bg-[#F8F3EE]/70 border border-[#E8D5CA]/80">
                  <Clock className="w-5 h-5 text-[#A58A78] mt-0.5 shrink-0" strokeWidth={1.6} />
                  <div>
                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#A58A78]">
                      Opening Hours
                    </p>
                    <p className="text-[14px] text-[#5A4A42]">
                      {businessConfig.openingHoursText}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-[8px] bg-[#F8F3EE]/70 border border-[#E8D5CA]/80">
                  <Instagram className="w-5 h-5 text-[#A58A78] mt-0.5 shrink-0" strokeWidth={1.6} />
                  <div>
                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#A58A78]">
                      Instagram
                    </p>
                    {businessConfig.instagramConfigured &&
                    businessConfig.instagramUrl ? (
                      <a
                        href={businessConfig.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] font-medium text-[#382D28] hover:text-[#A58A78] underline underline-offset-4"
                      >
                        {businessConfig.instagramHandle}
                      </a>
                    ) : (
                      <p className="text-[14px] text-[#5A4A42]">
                        {businessConfig.instagramHandle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Google Maps Confirmation Placeholder */}
            <div className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] p-6 sm:p-7 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C5A27E] mt-0.5 shrink-0" strokeWidth={1.6} />
                <div>
                  <h3 className="font-serif text-[23px] text-[#382D28]">
                    Studio Location
                  </h3>
                  <p className="mt-1 text-[14px] text-[#5A4A42] leading-relaxed">
                    {businessConfig.addressText}
                  </p>
                </div>
              </div>

              <div className="rounded-[8px] border border-dashed border-[#C5A27E]/70 bg-[#F2E8DF]/60 p-6 text-center">
                <p className="text-[12px] tracking-[0.16em] uppercase text-[#A58A78] font-medium">
                  Google Maps Integration Ready
                </p>
                <p className="mt-1.5 text-[13px] text-[#5A4A42] leading-relaxed">
                  {businessConfig.addressConfirmed
                    ? `Verified Studio Address: ${businessConfig.addressText}`
                    : 'Interactive directions and Google Maps will activate immediately once Richaa confirms the final studio address.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <ContactForm preselectedTreatment={preselectedTreatment} />
          </div>
        </div>
      </section>
    </div>
  );
}

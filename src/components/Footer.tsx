import React from 'react';
import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import type { AppRoute } from '../types/site';
import { buildWhatsAppUrl, routeToPath } from '../utils/siteLogic';
import { BrandMark } from './BrandMark';

export function Footer() {
  const { navigate, services, businessConfig } = useSite();

  const whatsAppHref = buildWhatsAppUrl(
    businessConfig.whatsappDigits,
    businessConfig.whatsappPrefill
  );

  const featuredTreatments = services.filter((s) => s.active).slice(0, 6);

  const handleNav = (e: React.MouseEvent, target: AppRoute) => {
    e.preventDefault();
    navigate(target);
  };

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E8D5CA]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-0">
          {/* Brand Column */}
          <div className="lg:col-span-4 lg:pr-10 lg:border-r lg:border-[#E8D5CA]">
            <a
              href="/"
              onClick={(e) => handleNav(e, { page: 'home' })}
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A27E] rounded-sm"
            >
              <BrandMark logoUrl={businessConfig.logoUrl} />
            </a>
            <p className="mt-4 text-[14px] leading-relaxed text-[#5A4A42] max-w-sm">
              {businessConfig.businessDescription || businessConfig.tagline}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {businessConfig.instagramConfigured && businessConfig.instagramUrl ? (
                <a
                  href={businessConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Richaa's Beauty & Aesthetic on Instagram"
                  className="w-10 h-10 rounded-full border border-[#E8D5CA] flex items-center justify-center text-[#5A4A42] hover:border-[#C5A27E] hover:text-[#382D28] transition-colors"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.6} />
                </a>
              ) : (
                <a
                  href="/contact"
                  onClick={(e) => handleNav(e, { page: 'contact' })}
                  aria-label="Instagram link awaiting confirmation — view contact details"
                  title="Instagram link awaiting owner confirmation"
                  className="w-10 h-10 rounded-full border border-[#E8D5CA] flex items-center justify-center text-[#5A4A42] hover:border-[#C5A27E] hover:text-[#382D28] transition-colors"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.6} />
                </a>
              )}
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Richaa on WhatsApp"
                className="w-10 h-10 rounded-full border border-[#E8D5CA] flex items-center justify-center text-[#5A4A42] hover:border-[#C5A27E] hover:text-[#382D28] transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.6} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:px-8 lg:border-r lg:border-[#E8D5CA]">
            <h2 className="font-sans text-[13px] font-semibold tracking-[0.06em] uppercase text-[#382D28] mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2.5 text-[14px] text-[#5A4A42]">
              {(
                [
                  ['Home', { page: 'home' }],
                  ['About Us', { page: 'about' }],
                  ['Services', { page: 'services' }],
                  ['Gallery', { page: 'gallery' }],
                  ['Pricing', { page: 'pricing' }],
                  ['Reviews', { page: 'reviews' }],
                  ['Contact', { page: 'contact' }],
                ] as Array<[string, AppRoute]>
              ).map(([label, target]) => (
                <li key={label}>
                  <a
                    href={routeToPath(target)}
                    onClick={(e) => handleNav(e, target)}
                    className="hover:text-[#382D28] hover:underline underline-offset-4 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div className="lg:col-span-3 lg:px-8 lg:border-r lg:border-[#E8D5CA]">
            <h2 className="font-sans text-[13px] font-semibold tracking-[0.06em] uppercase text-[#382D28] mb-4">
              Treatments
            </h2>
            <ul className="space-y-2.5 text-[14px] text-[#5A4A42]">
              {featuredTreatments.map((srv) => (
                <li key={srv.id}>
                  <a
                    href={routeToPath({ page: 'service-detail', slug: srv.slug })}
                    onClick={(e) =>
                      handleNav(e, { page: 'service-detail', slug: srv.slug })
                    }
                    className="hover:text-[#382D28] hover:underline underline-offset-4 transition-colors"
                  >
                    {srv.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/services"
                  onClick={(e) => handleNav(e, { page: 'services' })}
                  className="text-[#A58A78] hover:text-[#382D28] font-medium transition-colors"
                >
                  View All Treatments →
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 lg:pl-8">
            <h2 className="font-sans text-[13px] font-semibold tracking-[0.06em] uppercase text-[#382D28] mb-4">
              Contact Us
            </h2>
            <ul className="space-y-3.5 text-[14px] text-[#5A4A42]">
              <li>
                <a
                  href={businessConfig.phoneHref}
                  className="inline-flex items-start gap-2.5 hover:text-[#382D28] transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-[#A58A78] shrink-0" strokeWidth={1.6} />
                  <span className="tabular-nums">{businessConfig.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${businessConfig.email}`}
                  className="inline-flex items-start gap-2.5 hover:text-[#382D28] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-[#A58A78] shrink-0" strokeWidth={1.6} />
                  <span>{businessConfig.email}</span>
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-[#A58A78] shrink-0" strokeWidth={1.6} />
                <span className="text-[13px] leading-relaxed">
                  {businessConfig.addressText}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#E8D5CA]/80 bg-[#F8F3EE]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#A58A78]">
          <p>
            © {new Date().getFullYear()} {businessConfig.brandName}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a
              href="/privacy-policy"
              onClick={(e) => handleNav(e, { page: 'privacy-policy' })}
              className="hover:text-[#382D28] transition-colors"
            >
              Privacy Policy
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/terms-and-conditions"
              onClick={(e) => handleNav(e, { page: 'terms-and-conditions' })}
              className="hover:text-[#382D28] transition-colors"
            >
              Terms &amp; Conditions
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/admin"
              onClick={(e) => handleNav(e, { page: 'admin' })}
              className="hover:text-[#382D28] transition-colors"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

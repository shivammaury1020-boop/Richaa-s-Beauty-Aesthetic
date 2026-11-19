import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { buildWhatsAppUrl } from '../utils/siteLogic';

export function WhatsAppFloatingButton() {
  const { businessConfig } = useSite();
  const href = buildWhatsAppUrl(
    businessConfig.whatsappDigits,
    businessConfig.whatsappPrefill
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${businessConfig.whatsappCta} on WhatsApp`}
      className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#382D28]/95 hover:bg-[#382D28] text-[#F8F3EE] shadow-[0_8px_24px_rgba(56,45,40,0.2)] border border-[#C5A27E]/45 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A27E]"
    >
      <MessageCircle className="w-4 h-4 text-[#C5A27E]" strokeWidth={1.8} />
      <span className="hidden md:inline text-[12px] font-medium tracking-[0.02em] whitespace-nowrap">
        {businessConfig.whatsappCta}
      </span>
    </a>
  );
}

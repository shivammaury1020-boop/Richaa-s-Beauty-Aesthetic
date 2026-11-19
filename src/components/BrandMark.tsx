import React from 'react';

interface BrandMarkProps {
  compact?: boolean;
  align?: 'left' | 'center';
  size?: 'sm' | 'md';
  logoUrl?: string;
}

export function BotanicalEmblem({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 25C18 17 21.5 9.5 29.5 5.5C28 13.5 24 19 18 21.5"
        stroke="#C5A27E"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 25C18 18.5 14 12.5 7 9.5C8.5 16 12.5 20 18 22"
        stroke="#A58A78"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 25V7.5"
        stroke="#C5A27E"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M18 7.5C15.5 5 15.8 2.5 18 1.5C20.2 2.5 20.5 5 18 7.5Z"
        stroke="#C5A27E"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandMark({
  compact = false,
  align = 'left',
  size = 'md',
  logoUrl,
}: BrandMarkProps) {
  const customLogo = logoUrl?.trim();

  if (compact) {
    if (customLogo) {
      return (
        <span className="inline-flex items-center gap-2 whitespace-nowrap shrink-0">
          <img
            src={customLogo}
            alt="Richaa's Beauty & Aesthetic"
            className="h-9 sm:h-11 w-auto max-w-[180px] object-contain"
          />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap shrink-0">
        <BotanicalEmblem className="w-5 h-4 sm:w-6 sm:h-5 shrink-0" />
        <span className="font-serif text-[17px] sm:text-[22px] font-medium tracking-[0.01em] text-[#382D28] leading-none">
          Richaa&apos;s Beauty &amp; Aesthetic
        </span>
      </span>
    );
  }

  if (customLogo) {
    return (
      <div
        className={`inline-flex flex-col ${
          align === 'center' ? 'items-center text-center' : 'items-start text-left'
        }`}
      >
        <img
          src={customLogo}
          alt="Richaa's Beauty & Aesthetic"
          className={
            size === 'sm'
              ? 'h-10 w-auto max-w-[160px] object-contain'
              : 'h-14 w-auto max-w-[220px] object-contain'
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex flex-col ${
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      }`}
    >
      <BotanicalEmblem
        className={size === 'sm' ? 'w-6 h-5 mb-1' : 'w-8 h-6 mb-1.5'}
      />
      <span
        className={`font-serif font-medium tracking-[0.01em] text-[#382D28] leading-tight ${
          size === 'sm' ? 'text-[21px]' : 'text-[26px]'
        }`}
      >
        Richaa&apos;s
      </span>
      <span className="text-[10px] tracking-[0.26em] uppercase text-[#A58A78] mt-0.5 font-medium">
        Beauty &amp; Aesthetic
      </span>
    </div>
  );
}

export function BotanicalMarginAccent({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M42 252C68 190 96 124 146 28"
        stroke="#C5A27E"
        strokeOpacity="0.45"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M65 204C36 184 22 156 26 128C48 144 62 168 65 204Z"
        stroke="#C5A27E"
        strokeOpacity="0.42"
        strokeWidth="1.15"
      />
      <path
        d="M84 162C116 154 144 136 164 110C134 114 106 130 84 162Z"
        stroke="#C5A27E"
        strokeOpacity="0.42"
        strokeWidth="1.15"
      />
      <path
        d="M99 128C74 104 66 78 74 52C92 70 102 96 99 128Z"
        stroke="#C5A27E"
        strokeOpacity="0.42"
        strokeWidth="1.15"
      />
      <path
        d="M119 88C144 82 164 68 176 48C152 50 132 64 119 88Z"
        stroke="#C5A27E"
        strokeOpacity="0.42"
        strokeWidth="1.15"
      />
      <path
        d="M138 48C124 30 124 16 136 6C146 16 146 32 138 48Z"
        stroke="#C5A27E"
        strokeOpacity="0.42"
        strokeWidth="1.15"
      />
    </svg>
  );
}

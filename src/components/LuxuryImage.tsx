import React, { useState } from 'react';
import { BotanicalEmblem } from './BrandMark';

interface LuxuryImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  placeholderCaption?: string;
}

export function LuxuryImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  priority = false,
  placeholderCaption,
}: LuxuryImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#EFE6DC] ${containerClassName}`}
    >
      {!failed ? (
        <>
          {!loaded && (
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#F2E8DF] via-[#EFE3D7] to-[#E8D5CA] animate-pulse"
              aria-hidden="true"
            />
          )}
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`${className} transition-opacity duration-500 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      ) : (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F8F3EE] to-[#E8D5CA]">
          <BotanicalEmblem className="w-9 h-7 mb-2.5 opacity-80" />
          <p className="font-serif text-base text-[#382D28]">{alt}</p>
          <p className="text-xs text-[#A58A78] mt-1">
            Richaa&apos;s Beauty &amp; Aesthetic
          </p>
        </div>
      )}

      {placeholderCaption && !failed && (
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <span className="inline-block bg-[#382D28]/75 backdrop-blur-xs text-[#F8F3EE] text-[11px] px-2.5 py-1 rounded">
            {placeholderCaption}
          </span>
        </div>
      )}
    </div>
  );
}

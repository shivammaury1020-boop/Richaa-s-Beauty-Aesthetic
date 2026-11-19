import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import type { AppRoute } from '../types/site';
import { routeToPath } from '../utils/siteLogic';
import { BrandMark } from './BrandMark';

interface NavLinkItem {
  label: string;
  route: AppRoute;
  matchPages: AppRoute['page'][];
}

const NAV_ITEMS: NavLinkItem[] = [
  { label: 'Home', route: { page: 'home' }, matchPages: ['home'] },
  { label: 'About', route: { page: 'about' }, matchPages: ['about'] },
  {
    label: 'Services',
    route: { page: 'services' },
    matchPages: ['services', 'service-detail'],
  },
  { label: 'Gallery', route: { page: 'gallery' }, matchPages: ['gallery'] },
  { label: 'Pricing', route: { page: 'pricing' }, matchPages: ['pricing'] },
  { label: 'Reviews', route: { page: 'reviews' }, matchPages: ['reviews'] },
  { label: 'Contact', route: { page: 'contact' }, matchPages: ['contact'] },
];

export function Header() {
  const { route, navigate, openBookingModal, businessConfig } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [route]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, target: AppRoute) => {
    e.preventDefault();
    navigate(target);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8D5CA]/80">
      <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 lg:px-10 h-[68px] sm:h-[82px] flex items-center justify-between gap-2 sm:gap-6">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, { page: 'home' })}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A27E] rounded-sm shrink-0"
          aria-label={`${businessConfig.brandName} Home`}
        >
          <BrandMark compact logoUrl={businessConfig.logoUrl} />
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.matchPages.includes(route.page);
            return (
              <a
                key={item.label}
                href={routeToPath(item.route)}
                onClick={(e) => handleLinkClick(e, item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1.5 text-[14px] tracking-[0.01em] whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A27E] rounded-sm ${
                  isActive
                    ? 'text-[#382D28] font-medium'
                    : 'text-[#5A4A42] hover:text-[#382D28]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#382D28] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openBookingModal()}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-[13px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C5A27E]"
          >
            Book Appointment
          </button>

          <button
            type="button"
            onClick={() => openBookingModal()}
            className="sm:hidden inline-flex items-center justify-center px-3 py-2 text-[11px] font-medium text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-[4px] border border-[#E8D5CA] text-[#382D28] hover:bg-[#F8F3EE] transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.6} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>

      {/* Smooth Mobile Navigation Menu */}
      <div
        id="mobile-navigation-drawer"
        className={`lg:hidden overflow-hidden transition-all duration-300 border-t border-[#E8D5CA]/70 bg-[#F8F3EE] ${
          mobileMenuOpen ? 'max-h-[540px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none border-t-0'
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="px-6 py-6 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.matchPages.includes(route.page);
            return (
              <a
                key={item.label}
                href={routeToPath(item.route)}
                onClick={(e) => handleLinkClick(e, item.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-3 px-2 text-[16px] border-b border-[#E8D5CA]/50 transition-colors ${
                  isActive
                    ? 'text-[#382D28] font-medium'
                    : 'text-[#5A4A42] hover:text-[#382D28]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <div className="pt-5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full py-3.5 px-5 text-center text-[14px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] rounded-[4px] transition-colors cursor-pointer"
            >
              Book Appointment
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

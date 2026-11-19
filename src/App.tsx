import React from 'react';
import { BookingModal } from './components/BookingModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { SiteProvider, useSite } from './context/SiteContext';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ContactPage } from './pages/ContactPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { PricingPage } from './pages/PricingPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ServicesPage } from './pages/ServicesPage';

function AppRouter() {
  const { route } = useSite();

  if (route.page === 'admin') {
    return <AdminDashboardPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EE] text-[#382D28]">
      <Header />

      <main className="flex-1">
        {route.page === 'home' && <HomePage />}
        {route.page === 'about' && <AboutPage />}
        {route.page === 'services' && (
          <ServicesPage initialCategory={route.category} />
        )}
        {route.page === 'service-detail' && (
          <ServiceDetailPage slug={route.slug} />
        )}
        {route.page === 'gallery' && <GalleryPage />}
        {route.page === 'pricing' && <PricingPage />}
        {route.page === 'reviews' && <ReviewsPage />}
        {route.page === 'contact' && (
          <ContactPage preselectedTreatment={route.preselectedTreatment} />
        )}
        {route.page === 'privacy-policy' && <LegalPage mode="privacy" />}
        {route.page === 'terms-and-conditions' && <LegalPage mode="terms" />}
      </main>

      <Footer />
      <BookingModal />
      <WhatsAppFloatingButton />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteProvider>
        <AppRouter />
      </SiteProvider>
    </ErrorBoundary>
  );
}

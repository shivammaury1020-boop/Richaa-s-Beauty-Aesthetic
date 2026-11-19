export type ServiceCategory =
  | 'Lashes'
  | 'Brows'
  | 'Facials'
  | 'Aesthetics'
  | 'Waxing'
  | 'Permanent Makeup';

export type AdminServiceCategory =
  | 'Eyelash Extensions'
  | 'Lash Lifts'
  | 'Brow Lamination'
  | 'Threading'
  | 'Tinting'
  | 'Body Waxing'
  | 'Facials'
  | 'Microneedling'
  | 'Skin Rejuvenation'
  | 'Permanent Makeup';

export type ServiceIconKey =
  | 'sparkles'
  | 'eye'
  | 'feather'
  | 'scissors'
  | 'droplet'
  | 'flower'
  | 'sun'
  | 'heart';

export interface TreatmentService {
  id: string;
  slug: string;
  name: string;
  /** Public pricing category (Lashes, Brows, Facials, Aesthetics, Waxing, Permanent Makeup) */
  category: ServiceCategory;
  /** Granular 10-category admin classification */
  serviceGroup: AdminServiceCategory;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  treatmentSteps: string[];
  aftercareNotes: string[];
  image: string;
  imageAlt: string;
  icon: ServiceIconKey;
  /** Null/empty displays "Price information coming soon." on the public website */
  priceLabel: string | null;
  promoPriceLabel?: string | null;
  durationLabel?: string | null;
  pricingNotes?: string | null;
  featured: boolean;
  active: boolean;
  sortOrder?: number;
}

export type GalleryCategory =
  | 'All'
  | 'Lashes'
  | 'Brows'
  | 'Facials & Skin'
  | 'Salon Environment'
  | 'Permanent Makeup';

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  caption: string;
  itemType: 'standard' | 'before_after';
  image: string;
  beforeImage?: string;
  imageAlt: string;
  isPlaceholder: boolean;
  visible: boolean;
}

export interface ClientReview {
  id: string;
  clientName: string;
  treatment: string;
  rating: number;
  comment: string;
  dateLabel: string;
  verifiedSource: string;
  published: boolean;
}

export type EnquiryStatus = 'New' | 'Read' | 'Resolved';

export interface ContactEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  treatmentInterest: string;
  message: string;
  createdAt: string;
  status: EnquiryStatus;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type AppointmentSource = 'manual' | 'external_link' | 'synced_api';

export interface Appointment {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId?: string;
  serviceName: string;
  /** YYYY-MM-DD */
  appointmentDate: string;
  /** HH:mm */
  appointmentTime: string;
  status: AppointmentStatus;
  source: AppointmentSource;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredTreatments: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotification {
  id: string;
  type: 'enquiry' | 'booking' | 'status_change' | 'system';
  title: string;
  body: string;
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

export type BookingIntegrationMode =
  | 'external_link'
  | 'embedded_widget'
  | 'api_ready';

export interface BusinessConfig {
  brandName: string;
  tagline: string;
  businessDescription: string;
  logoUrl: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappDigits: string;
  whatsappCta: string;
  whatsappPrefill: string;
  email: string;
  addressConfirmed: boolean;
  addressText: string;
  openingHoursConfirmed: boolean;
  openingHoursText: string;
  bookingUrlConfigured: boolean;
  bookingUrl: string;
  bookingProviderLabel: string;
  bookingIntegrationMode: BookingIntegrationMode;
  allowBookingEmbed: boolean;
  instagramConfigured: boolean;
  instagramHandle: string;
  instagramUrl: string;
  reviewPlatformConfigured: boolean;
  reviewPlatformName: string;
  reviewPlatformUrl: string;
  emailNotificationsEnabled: boolean;
  notificationEmail: string;
}

export interface WebsiteContent {
  heroLabel: string;
  heroHeading: string;
  heroDescription: string;
  aboutLabel: string;
  aboutHeading: string;
  aboutIntro: string;
  aboutExtended: string;
  experienceHighlight: string;
  servicesHeading: string;
  whyChooseHeading: string;
  galleryHeading: string;
  reviewsHeading: string;
  pricingHeading: string;
  bookingHeading: string;
  contactHeading: string;
}

export type AppRoute =
  | { page: 'home' }
  | { page: 'about' }
  | { page: 'services'; category?: ServiceCategory }
  | { page: 'service-detail'; slug: string }
  | { page: 'gallery' }
  | { page: 'pricing' }
  | { page: 'reviews' }
  | { page: 'contact'; preselectedTreatment?: string }
  | { page: 'privacy-policy' }
  | { page: 'terms-and-conditions' }
  | { page: 'admin' };

import type {
  AdminServiceCategory,
  AppRoute,
  Appointment,
  AppointmentStatus,
  BusinessConfig,
  ContactEnquiry,
  ServiceCategory,
  TreatmentService,
} from '../types/site';

export const PRICE_COMING_SOON = 'Price information coming soon.';

export const PRICING_CATEGORIES: ServiceCategory[] = [
  'Lashes',
  'Brows',
  'Facials',
  'Aesthetics',
  'Waxing',
  'Permanent Makeup',
];

export const ADMIN_SERVICE_CATEGORIES: AdminServiceCategory[] = [
  'Eyelash Extensions',
  'Lash Lifts',
  'Brow Lamination',
  'Threading',
  'Tinting',
  'Body Waxing',
  'Facials',
  'Microneedling',
  'Skin Rejuvenation',
  'Permanent Makeup',
];

export interface ContactFormInput {
  fullName: string;
  email: string;
  phone: string;
  treatmentInterest: string;
  message: string;
  consent: boolean;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

export interface DashboardMetrics {
  totalAppointments: number;
  todaysAppointments: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalEnquiries: number;
  unreadEnquiries: number;
}

export interface AppointmentFilterOptions {
  date?: string;
  status?: AppointmentStatus | 'all';
  search?: string;
}

export function formatServicePrice(priceLabel: string | null | undefined): string {
  const trimmed = (priceLabel ?? '').trim();
  return trimmed.length > 0 ? trimmed : PRICE_COMING_SOON;
}

export function mapServiceGroupToPricingCategory(
  group: AdminServiceCategory
): ServiceCategory {
  switch (group) {
    case 'Eyelash Extensions':
    case 'Lash Lifts':
      return 'Lashes';
    case 'Brow Lamination':
    case 'Threading':
    case 'Tinting':
      return 'Brows';
    case 'Body Waxing':
      return 'Waxing';
    case 'Facials':
      return 'Facials';
    case 'Microneedling':
    case 'Skin Rejuvenation':
      return 'Aesthetics';
    case 'Permanent Makeup':
      return 'Permanent Makeup';
  }
}

export function slugifyTreatmentName(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return base.length >= 2 ? base : `treatment-${Date.now()}`;
}

export function getTodayIsoDate(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeDashboardMetrics(
  appointments: Appointment[],
  enquiries: ContactEnquiry[],
  todayIso: string = getTodayIsoDate()
): DashboardMetrics {
  return {
    totalAppointments: appointments.length,
    todaysAppointments: appointments.filter(
      (a) => a.appointmentDate === todayIso && a.status !== 'cancelled'
    ).length,
    pendingBookings: appointments.filter((a) => a.status === 'pending').length,
    confirmedBookings: appointments.filter((a) => a.status === 'confirmed').length,
    completedAppointments: appointments.filter((a) => a.status === 'completed').length,
    cancelledAppointments: appointments.filter((a) => a.status === 'cancelled').length,
    totalEnquiries: enquiries.length,
    unreadEnquiries: enquiries.filter((e) => e.status === 'New').length,
  };
}

export function filterAppointments(
  appointments: Appointment[],
  options: AppointmentFilterOptions
): Appointment[] {
  const query = (options.search ?? '').trim().toLowerCase();
  const dateFilter = (options.date ?? '').trim();
  const statusFilter = options.status ?? 'all';

  return appointments
    .filter((appt) => {
      if (dateFilter && appt.appointmentDate !== dateFilter) return false;
      if (statusFilter !== 'all' && appt.status !== statusFilter) return false;
      if (query) {
        const haystack = `${appt.customerName} ${appt.customerPhone} ${appt.serviceName} ${appt.internalNotes}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) =>
      `${a.appointmentDate} ${a.appointmentTime}`.localeCompare(
        `${b.appointmentDate} ${b.appointmentTime}`
      )
    );
}

export function validateAppointmentInput(input: {
  customerName: string;
  customerPhone: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}): string | null {
  if (input.customerName.trim().length < 2) {
    return 'Please enter the client full name.';
  }
  if (input.customerPhone.replace(/[\s\-()]/g, '').length < 6) {
    return 'Please enter a valid client phone number.';
  }
  if (input.serviceName.trim().length < 2) {
    return 'Please select a treatment service.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.appointmentDate.trim())) {
    return 'Please choose a valid appointment date.';
  }
  if (input.appointmentTime.trim().length < 3) {
    return 'Please choose an appointment time.';
  }
  return null;
}

export function buildWhatsAppUrl(
  whatsappDigits: string,
  prefillMessage: string,
  treatmentName?: string
): string {
  const cleanDigits = whatsappDigits.replace(/[^\d]/g, '');
  const message = treatmentName
    ? `Hi Richaa, I'd like to enquire about ${treatmentName} at Richaa's Beauty & Aesthetic.`
    : prefillMessage;
  return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
}

export function isValidExternalHttpUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function resolveBookingDestination(config: BusinessConfig): {
  isConfigured: boolean;
  url: string | null;
  fallbackWhatsAppUrl: string;
} {
  const configured =
    config.bookingUrlConfigured && isValidExternalHttpUrl(config.bookingUrl);
  return {
    isConfigured: configured,
    url: configured ? config.bookingUrl.trim() : null,
    fallbackWhatsAppUrl: buildWhatsAppUrl(
      config.whatsappDigits,
      config.whatsappPrefill
    ),
  };
}

export function filterServicesByCategory(
  services: TreatmentService[],
  category: ServiceCategory | 'All'
): TreatmentService[] {
  const activeOnly = services.filter((s) => s.active);
  if (category === 'All') return activeOnly;
  return activeOnly.filter((s) => s.category === category);
}

export function groupServicesForPricing(
  services: TreatmentService[]
): Array<{ category: ServiceCategory; items: Array<TreatmentService & { displayPrice: string }> }> {
  const activeServices = services.filter((s) => s.active);
  return PRICING_CATEGORIES.map((category) => ({
    category,
    items: activeServices
      .filter((s) => s.category === category)
      .map((s) => ({
        ...s,
        displayPrice: formatServicePrice(s.priceLabel),
      })),
  }));
}

export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};

  if (input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const cleanPhone = input.phone.replace(/[\s\-()]/g, '');
  if (cleanPhone.length > 0 && !/^\+?\d{9,15}$/.test(cleanPhone)) {
    errors.phone = 'Please enter a valid UK or international telephone number.';
  }

  if (input.message.trim().length < 10) {
    errors.message = 'Please share a brief message (at least 10 characters) so we can assist you.';
  }

  if (!input.consent) {
    errors.consent = 'Please confirm you are happy for us to respond to your enquiry.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function createEnquiryRecord(
  input: ContactFormInput,
  now: Date = new Date()
): ContactEnquiry {
  return {
    id: `enq-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim() || 'Not provided',
    treatmentInterest: input.treatmentInterest.trim() || 'General Enquiry',
    message: input.message.trim(),
    createdAt: now.toISOString(),
    status: 'New',
  };
}

export function routeToPath(route: AppRoute): string {
  switch (route.page) {
    case 'home':
      return '/';
    case 'about':
      return '/about';
    case 'services':
      return route.category
        ? `/services?category=${encodeURIComponent(route.category)}`
        : '/services';
    case 'service-detail':
      return `/services/${encodeURIComponent(route.slug)}`;
    case 'gallery':
      return '/gallery';
    case 'pricing':
      return '/pricing';
    case 'reviews':
      return '/reviews';
    case 'contact':
      return route.preselectedTreatment
        ? `/contact?treatment=${encodeURIComponent(route.preselectedTreatment)}`
        : '/contact';
    case 'privacy-policy':
      return '/privacy-policy';
    case 'terms-and-conditions':
      return '/terms-and-conditions';
    case 'admin':
      return '/admin';
  }
}

export function pathToRoute(pathname: string, search: string = ''): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(search);

  if (normalized === '/' || normalized === '') {
    return { page: 'home' };
  }
  if (normalized === '/about') {
    return { page: 'about' };
  }
  if (normalized === '/services') {
    const cat = params.get('category') as ServiceCategory | null;
    if (cat && PRICING_CATEGORIES.includes(cat)) {
      return { page: 'services', category: cat };
    }
    return { page: 'services' };
  }
  if (normalized.startsWith('/services/')) {
    const slug = decodeURIComponent(normalized.slice('/services/'.length));
    if (slug) {
      return { page: 'service-detail', slug };
    }
    return { page: 'services' };
  }
  if (normalized === '/gallery') {
    return { page: 'gallery' };
  }
  if (normalized === '/pricing') {
    return { page: 'pricing' };
  }
  if (normalized === '/reviews') {
    return { page: 'reviews' };
  }
  if (normalized === '/contact') {
    const treatment = params.get('treatment') ?? undefined;
    return { page: 'contact', preselectedTreatment: treatment };
  }
  if (normalized === '/privacy-policy') {
    return { page: 'privacy-policy' };
  }
  if (normalized === '/terms-and-conditions') {
    return { page: 'terms-and-conditions' };
  }
  if (normalized === '/admin' || normalized.startsWith('/admin/')) {
    return { page: 'admin' };
  }
  return { page: 'home' };
}

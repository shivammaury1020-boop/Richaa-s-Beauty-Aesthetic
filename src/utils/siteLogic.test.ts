import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRICE_COMING_SOON,
  buildWhatsAppUrl,
  computeDashboardMetrics,
  createEnquiryRecord,
  filterAppointments,
  filterServicesByCategory,
  formatServicePrice,
  groupServicesForPricing,
  mapServiceGroupToPricingCategory,
  pathToRoute,
  resolveBookingDestination,
  routeToPath,
  slugifyTreatmentName,
  validateAppointmentInput,
  validateContactForm,
} from './siteLogic';
import type {
  Appointment,
  BusinessConfig,
  ContactEnquiry,
  TreatmentService,
} from '../types/site';

const sampleServices: TreatmentService[] = [
  {
    id: '1',
    slug: 'eyelash-extensions',
    name: 'Eyelash Extensions',
    category: 'Lashes',
    serviceGroup: 'Eyelash Extensions',
    shortDescription: 'Bespoke lash sets.',
    fullDescription: 'Detailed lash description.',
    benefits: ['Custom curl'],
    treatmentSteps: ['Consultation'],
    aftercareNotes: ['Keep dry 24h'],
    image: '/img/lashes.jpg',
    imageAlt: 'Eyelash Extensions',
    icon: 'eye',
    priceLabel: null,
    featured: true,
    active: true,
  },
  {
    id: '2',
    slug: 'brow-lamination',
    name: 'Brow Lamination',
    category: 'Brows',
    serviceGroup: 'Brow Lamination',
    shortDescription: 'Lifted, feathered brows.',
    fullDescription: 'Detailed brow lamination.',
    benefits: ['Fuller shape'],
    treatmentSteps: ['Mapping'],
    aftercareNotes: ['Brush daily'],
    image: '/img/brows.jpg',
    imageAlt: 'Brow Lamination',
    icon: 'feather',
    priceLabel: '£45',
    featured: true,
    active: true,
  },
  {
    id: '3',
    slug: 'hidden-treatment',
    name: 'Archived Treatment',
    category: 'Facials',
    serviceGroup: 'Facials',
    shortDescription: 'Inactive',
    fullDescription: 'Inactive',
    benefits: [],
    treatmentSteps: [],
    aftercareNotes: [],
    image: '/img/facial.jpg',
    imageAlt: 'Archived',
    icon: 'flower',
    priceLabel: null,
    featured: false,
    active: false,
  },
];

const baseConfig: BusinessConfig = {
  brandName: "Richaa's Beauty & Aesthetic",
  tagline: 'Enhancing Your Natural Beauty, One Treatment at a Time.',
  businessDescription: 'Over 5 years of experience in bespoke beauty.',
  logoUrl: '',
  phoneDisplay: '+44 7405 517720',
  phoneHref: 'tel:+447405517720',
  whatsappDigits: '+447405517720',
  whatsappCta: 'Chat With Us',
  whatsappPrefill: "Hi Richaa, I'd like to enquire about your beauty treatments.",
  email: 'richaajingar2424@gmail.com',
  addressConfirmed: false,
  addressText: 'Studio address awaiting final confirmation from the owner.',
  openingHoursConfirmed: false,
  openingHoursText: 'Opening hours awaiting confirmation.',
  bookingUrlConfigured: false,
  bookingUrl: '',
  bookingProviderLabel: 'External Booking System (Awaiting Owner Link)',
  bookingIntegrationMode: 'external_link',
  allowBookingEmbed: false,
  instagramConfigured: false,
  instagramHandle: '@richaasbeautyandaesthetic (Pending Confirmation)',
  instagramUrl: '',
  reviewPlatformConfigured: false,
  reviewPlatformName: 'Verified Review Platform',
  reviewPlatformUrl: '',
  emailNotificationsEnabled: false,
  notificationEmail: 'richaajingar2424@gmail.com',
};

test('formatServicePrice never invents prices and defaults to coming soon copy', () => {
  assert.equal(formatServicePrice(null), PRICE_COMING_SOON);
  assert.equal(formatServicePrice('   '), PRICE_COMING_SOON);
  assert.equal(formatServicePrice('£55'), '£55');
});

test('buildWhatsAppUrl formats UK number and encodes prefill message', () => {
  const url = buildWhatsAppUrl(
    '+447405517720',
    "Hi Richaa, I'd like to enquire about your beauty treatments."
  );
  assert.equal(
    url,
    "https://wa.me/447405517720?text=Hi%20Richaa%2C%20I'd%20like%20to%20enquire%20about%20your%20beauty%20treatments."
  );
});

test('validateContactForm rejects invalid submissions and accepts complete enquiries', () => {
  const invalid = validateContactForm({
    fullName: 'A',
    email: 'not-an-email',
    phone: '123',
    treatmentInterest: 'Lash Lifts',
    message: 'Short',
    consent: false,
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.message);
  assert.ok(invalid.errors.consent);

  const valid = validateContactForm({
    fullName: 'Amara Patel',
    email: 'amara@example.co.uk',
    phone: '+44 7700 900123',
    treatmentInterest: 'Bespoke Facials',
    message: 'I would love to ask about availability for a bespoke facial next week.',
    consent: true,
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('filterServicesByCategory excludes inactive services and groups pricing categories', () => {
  assert.equal(filterServicesByCategory(sampleServices, 'All').length, 2);
  assert.equal(filterServicesByCategory(sampleServices, 'Lashes').length, 1);

  const grouped = groupServicesForPricing(sampleServices);
  assert.equal(grouped.length, 6);
  const lashesGroup = grouped.find((g) => g.category === 'Lashes');
  assert.equal(lashesGroup?.items[0].displayPrice, PRICE_COMING_SOON);
  const browsGroup = grouped.find((g) => g.category === 'Brows');
  assert.equal(browsGroup?.items[0].displayPrice, '£45');
});

test('resolveBookingDestination handles placeholder vs configured booking URL', () => {
  const unconfigured = resolveBookingDestination(baseConfig);
  assert.equal(unconfigured.isConfigured, false);
  assert.equal(unconfigured.url, null);

  const configured = resolveBookingDestination({
    ...baseConfig,
    bookingUrlConfigured: true,
    bookingUrl: 'https://www.fresha.com/a/richaas-beauty-aesthetic',
  });
  assert.equal(configured.isConfigured, true);
  assert.equal(configured.url, 'https://www.fresha.com/a/richaas-beauty-aesthetic');
});

test('computeDashboardMetrics accurately aggregates appointments and enquiries', () => {
  const appointments: Appointment[] = [
    {
      id: 'a1',
      customerName: 'Priya Sharma',
      customerPhone: '+44 7700 900001',
      serviceName: 'Brow Lamination',
      appointmentDate: '2026-11-19',
      appointmentTime: '10:30',
      status: 'pending',
      source: 'manual',
      internalNotes: '',
      createdAt: '2026-11-18T10:00:00Z',
      updatedAt: '2026-11-18T10:00:00Z',
    },
    {
      id: 'a2',
      customerName: 'Chloe Bennett',
      customerPhone: '+44 7700 900002',
      serviceName: 'Bespoke Facials',
      appointmentDate: '2026-11-19',
      appointmentTime: '14:00',
      status: 'confirmed',
      source: 'manual',
      internalNotes: 'Sensitive skin',
      createdAt: '2026-11-18T11:00:00Z',
      updatedAt: '2026-11-18T11:00:00Z',
    },
    {
      id: 'a3',
      customerName: 'Hannah Clarke',
      customerPhone: '+44 7700 900003',
      serviceName: 'Lash Lifts',
      appointmentDate: '2026-11-19',
      appointmentTime: '16:00',
      status: 'cancelled',
      source: 'manual',
      internalNotes: '',
      createdAt: '2026-11-18T12:00:00Z',
      updatedAt: '2026-11-18T12:00:00Z',
    },
    {
      id: 'a4',
      customerName: 'Nadia Khan',
      customerPhone: '+44 7700 900004',
      serviceName: 'Microneedling',
      appointmentDate: '2026-11-18',
      appointmentTime: '11:00',
      status: 'completed',
      source: 'manual',
      internalNotes: '',
      createdAt: '2026-11-17T10:00:00Z',
      updatedAt: '2026-11-18T12:00:00Z',
    },
  ];
  const enquiries: ContactEnquiry[] = [
    createEnquiryRecord({
      fullName: 'Amara Patel',
      email: 'amara@example.co.uk',
      phone: '+44 7700 900123',
      treatmentInterest: 'Bespoke Facials',
      message: 'Enquiring about availability next Tuesday afternoon.',
      consent: true,
    }),
  ];

  const metrics = computeDashboardMetrics(appointments, enquiries, '2026-11-19');
  assert.equal(metrics.totalAppointments, 4);
  assert.equal(metrics.todaysAppointments, 2); // excludes cancelled
  assert.equal(metrics.pendingBookings, 1);
  assert.equal(metrics.confirmedBookings, 1);
  assert.equal(metrics.completedAppointments, 1);
  assert.equal(metrics.cancelledAppointments, 1);
  assert.equal(metrics.totalEnquiries, 1);
  assert.equal(metrics.unreadEnquiries, 1);

  const filtered = filterAppointments(appointments, {
    date: '2026-11-19',
    status: 'confirmed',
    search: 'chloe',
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'a2');
});

test('category mapping, slugification, and appointment validation work cleanly', () => {
  assert.equal(mapServiceGroupToPricingCategory('Threading'), 'Brows');
  assert.equal(mapServiceGroupToPricingCategory('Microneedling'), 'Aesthetics');
  assert.equal(mapServiceGroupToPricingCategory('Lash Lifts'), 'Lashes');
  assert.equal(slugifyTreatmentName('Luxury Hydro Facial!'), 'luxury-hydro-facial');

  assert.ok(
    validateAppointmentInput({
      customerName: 'A',
      customerPhone: '123',
      serviceName: '',
      appointmentDate: 'bad',
      appointmentTime: '',
    })
  );
  assert.equal(
    validateAppointmentInput({
      customerName: 'Sophia Ward',
      customerPhone: '+44 7700 900444',
      serviceName: 'Brow Lamination',
      appointmentDate: '2026-11-25',
      appointmentTime: '11:30',
    }),
    null
  );
});

test('routing round-trips public and admin paths cleanly', () => {
  assert.deepEqual(pathToRoute('/'), { page: 'home' });
  assert.deepEqual(pathToRoute('/services/brow-lamination'), {
    page: 'service-detail',
    slug: 'brow-lamination',
  });
  assert.equal(
    routeToPath({ page: 'service-detail', slug: 'brow-lamination' }),
    '/services/brow-lamination'
  );
  assert.deepEqual(pathToRoute('/admin'), { page: 'admin' });
  assert.deepEqual(pathToRoute('/admin/appointments'), { page: 'admin' });
});

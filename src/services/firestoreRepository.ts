import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  INITIAL_BUSINESS_CONFIG,
  INITIAL_GALLERY,
  INITIAL_SERVICES,
} from '../data/initialData';
import { OperationType, db, handleFirestoreError } from '../lib/firebase';
import type {
  AdminNotification,
  Appointment,
  AppointmentStatus,
  BusinessConfig,
  ClientReview,
  ContactEnquiry,
  Customer,
  EnquiryStatus,
  GalleryItem,
  TreatmentService,
} from '../types/site';
import {
  ADMIN_SERVICE_CATEGORIES,
  mapServiceGroupToPricingCategory,
  slugifyTreatmentName,
} from '../utils/siteLogic';

const SETTINGS_DOC_ID = 'main';

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return new Date().toISOString();
}

function makeDocId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

function cleanOptionalString(val: string | null | undefined, maxLen: number): string | undefined {
  if (typeof val !== 'string') return undefined;
  const trimmed = val.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLen);
}

function buildServicePayload(
  service: Omit<TreatmentService, 'id'>,
  isCreate: boolean
): DocumentData {
  const slug = slugifyTreatmentName(service.slug || service.name);
  const payload: DocumentData = {
    slug,
    name: service.name.trim().slice(0, 120),
    category: service.category,
    serviceGroup: service.serviceGroup,
    shortDescription: service.shortDescription.trim().slice(0, 500),
    fullDescription: service.fullDescription.trim().slice(0, 2500),
    benefits: (service.benefits ?? []).filter(Boolean).slice(0, 20),
    treatmentSteps: (service.treatmentSteps ?? []).filter(Boolean).slice(0, 20),
    aftercareNotes: (service.aftercareNotes ?? []).filter(Boolean).slice(0, 20),
    image: service.image.slice(0, 200000),
    imageAlt: (service.imageAlt || service.name).trim().slice(0, 240),
    icon: service.icon || 'sparkles',
    featured: Boolean(service.featured),
    active: Boolean(service.active),
    sortOrder: typeof service.sortOrder === 'number' ? service.sortOrder : 50,
    updatedAt: serverTimestamp(),
  };

  // Optional strings: omit when empty/null so Firestore isOptString passes strictly
  const priceLabel = cleanOptionalString(service.priceLabel, 80);
  if (priceLabel !== undefined) payload.priceLabel = priceLabel;
  else payload.priceLabel = '';

  const promoPriceLabel = cleanOptionalString(service.promoPriceLabel, 80);
  if (promoPriceLabel !== undefined) payload.promoPriceLabel = promoPriceLabel;
  else payload.promoPriceLabel = '';

  const durationLabel = cleanOptionalString(service.durationLabel, 60);
  if (durationLabel !== undefined) payload.durationLabel = durationLabel;
  else payload.durationLabel = '';

  const pricingNotes = cleanOptionalString(service.pricingNotes, 300);
  if (pricingNotes !== undefined) payload.pricingNotes = pricingNotes;
  else payload.pricingNotes = '';

  if (isCreate) {
    payload.createdAt = serverTimestamp();
  }
  return payload;
}

function mapDocToService(id: string, data: DocumentData): TreatmentService {
  return {
    id,
    slug: String(data.slug || id),
    name: String(data.name || ''),
    category: data.category || 'Lashes',
    serviceGroup: data.serviceGroup || 'Eyelash Extensions',
    shortDescription: String(data.shortDescription || ''),
    fullDescription: String(data.fullDescription || ''),
    benefits: Array.isArray(data.benefits) ? data.benefits.map(String) : [],
    treatmentSteps: Array.isArray(data.treatmentSteps)
      ? data.treatmentSteps.map(String)
      : [],
    aftercareNotes: Array.isArray(data.aftercareNotes)
      ? data.aftercareNotes.map(String)
      : [],
    image: String(data.image || ''),
    imageAlt: String(data.imageAlt || data.name || ''),
    icon: data.icon || 'sparkles',
    priceLabel:
      typeof data.priceLabel === 'string' && data.priceLabel.trim().length > 0
        ? data.priceLabel.trim()
        : null,
    promoPriceLabel:
      typeof data.promoPriceLabel === 'string' &&
      data.promoPriceLabel.trim().length > 0
        ? data.promoPriceLabel.trim()
        : null,
    durationLabel:
      typeof data.durationLabel === 'string' &&
      data.durationLabel.trim().length > 0
        ? data.durationLabel.trim()
        : null,
    pricingNotes:
      typeof data.pricingNotes === 'string' &&
      data.pricingNotes.trim().length > 0
        ? data.pricingNotes.trim()
        : null,
    featured: Boolean(data.featured),
    active: data.active !== false,
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 50,
  };
}

function mapDocToGallery(id: string, data: DocumentData): GalleryItem {
  return {
    id,
    title: String(data.title || ''),
    category: data.category || 'Salon Environment',
    caption: String(data.caption || ''),
    itemType: data.itemType === 'before_after' ? 'before_after' : 'standard',
    image: String(data.image || ''),
    beforeImage:
      typeof data.beforeImage === 'string' && data.beforeImage.length > 0
        ? data.beforeImage
        : undefined,
    imageAlt: String(data.imageAlt || data.title || ''),
    isPlaceholder: Boolean(data.isPlaceholder),
    visible: data.visible !== false,
  };
}

function mapDocToBusinessConfig(data: DocumentData): BusinessConfig {
  return {
    brandName: String(data.brandName || INITIAL_BUSINESS_CONFIG.brandName),
    tagline: String(data.tagline ?? INITIAL_BUSINESS_CONFIG.tagline),
    businessDescription: String(
      data.businessDescription ?? INITIAL_BUSINESS_CONFIG.businessDescription
    ),
    logoUrl: String(data.logoUrl ?? ''),
    phoneDisplay: String(
      data.phoneDisplay || INITIAL_BUSINESS_CONFIG.phoneDisplay
    ),
    phoneHref: String(data.phoneHref || INITIAL_BUSINESS_CONFIG.phoneHref),
    whatsappDigits: String(
      data.whatsappDigits || INITIAL_BUSINESS_CONFIG.whatsappDigits
    ),
    whatsappCta: String(data.whatsappCta || INITIAL_BUSINESS_CONFIG.whatsappCta),
    whatsappPrefill: String(
      data.whatsappPrefill || INITIAL_BUSINESS_CONFIG.whatsappPrefill
    ),
    email: String(data.email || INITIAL_BUSINESS_CONFIG.email),
    addressConfirmed: Boolean(data.addressConfirmed),
    addressText: String(
      data.addressText ?? INITIAL_BUSINESS_CONFIG.addressText
    ),
    openingHoursConfirmed: Boolean(data.openingHoursConfirmed),
    openingHoursText: String(
      data.openingHoursText ?? INITIAL_BUSINESS_CONFIG.openingHoursText
    ),
    bookingUrlConfigured: Boolean(data.bookingUrlConfigured),
    bookingUrl: String(data.bookingUrl ?? ''),
    bookingProviderLabel: String(
      data.bookingProviderLabel ?? INITIAL_BUSINESS_CONFIG.bookingProviderLabel
    ),
    bookingIntegrationMode:
      data.bookingIntegrationMode === 'embedded_widget' ||
      data.bookingIntegrationMode === 'api_ready'
        ? data.bookingIntegrationMode
        : 'external_link',
    allowBookingEmbed: Boolean(data.allowBookingEmbed),
    instagramConfigured: Boolean(data.instagramConfigured),
    instagramHandle: String(
      data.instagramHandle ?? INITIAL_BUSINESS_CONFIG.instagramHandle
    ),
    instagramUrl: String(data.instagramUrl ?? ''),
    reviewPlatformConfigured: Boolean(data.reviewPlatformConfigured),
    reviewPlatformName: String(
      data.reviewPlatformName ?? INITIAL_BUSINESS_CONFIG.reviewPlatformName
    ),
    reviewPlatformUrl: String(data.reviewPlatformUrl ?? ''),
    emailNotificationsEnabled: Boolean(data.emailNotificationsEnabled),
    notificationEmail: String(
      data.notificationEmail ?? INITIAL_BUSINESS_CONFIG.notificationEmail
    ),
  };
}

function mapDocToAppointment(id: string, data: DocumentData): Appointment {
  return {
    id,
    customerId:
      typeof data.customerId === 'string' && data.customerId
        ? data.customerId
        : undefined,
    customerName: String(data.customerName || ''),
    customerPhone: String(data.customerPhone || ''),
    customerEmail:
      typeof data.customerEmail === 'string' ? data.customerEmail : '',
    serviceId:
      typeof data.serviceId === 'string' && data.serviceId
        ? data.serviceId
        : undefined,
    serviceName: String(data.serviceName || ''),
    appointmentDate: String(data.appointmentDate || ''),
    appointmentTime: String(data.appointmentTime || ''),
    status: (data.status as AppointmentStatus) || 'pending',
    source:
      data.source === 'external_link' || data.source === 'synced_api'
        ? data.source
        : 'manual',
    internalNotes: String(data.internalNotes || ''),
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  };
}

function mapDocToCustomer(id: string, data: DocumentData): Customer {
  return {
    id,
    fullName: String(data.fullName || ''),
    email: String(data.email || ''),
    phone: String(data.phone || ''),
    preferredTreatments: String(data.preferredTreatments || ''),
    notes: String(data.notes || ''),
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  };
}

function mapDocToEnquiry(id: string, data: DocumentData): ContactEnquiry {
  const status: EnquiryStatus =
    data.status === 'Read' || data.status === 'Resolved' ? data.status : 'New';
  return {
    id,
    fullName: String(data.fullName || ''),
    email: String(data.email || ''),
    phone: String(data.phone || ''),
    treatmentInterest: String(data.treatmentInterest || 'General Enquiry'),
    message: String(data.message || ''),
    createdAt: timestampToIso(data.createdAt),
    status,
  };
}

function mapDocToReview(id: string, data: DocumentData): ClientReview {
  return {
    id,
    clientName: String(data.clientName || ''),
    treatment: String(data.treatment || ''),
    rating: typeof data.rating === 'number' ? data.rating : 5,
    comment: String(data.comment || ''),
    dateLabel: String(data.dateLabel || ''),
    verifiedSource: String(data.verifiedSource || ''),
    published: Boolean(data.published),
  };
}

function mapDocToNotification(id: string, data: DocumentData): AdminNotification {
  return {
    id,
    type:
      data.type === 'enquiry' ||
      data.type === 'booking' ||
      data.type === 'status_change'
        ? data.type
        : 'system',
    title: String(data.title || ''),
    body: String(data.body || ''),
    read: Boolean(data.read),
    relatedId:
      typeof data.relatedId === 'string' && data.relatedId
        ? data.relatedId
        : undefined,
    createdAt: timestampToIso(data.createdAt),
  };
}

// ============================================================================
// Admin Authorization & Initial Seeding
// ============================================================================

export async function checkAdminDocumentExists(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function ensureAdminProfileDocument(params: {
  uid: string;
  email: string;
  displayName?: string | null;
}): Promise<void> {
  const ref = doc(db, 'admins', params.uid);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: params.uid,
        email: params.email.slice(0, 200),
        displayName: (params.displayName || 'Salon Admin').slice(0, 120),
        role: 'owner',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch {
    // Non-fatal if bootstrapped owner already passes rules via email claim
  }
}

export async function seedInitialCatalogIfEmpty(): Promise<void> {
  try {
    const [settingsSnap, servicesSnap, gallerySnap] = await Promise.all([
      getDoc(doc(db, 'business_settings', SETTINGS_DOC_ID)),
      getDocs(collection(db, 'services')),
      getDocs(collection(db, 'gallery_images')),
    ]);

    const batch = writeBatch(db);
    let hasWrites = false;

    if (!settingsSnap.exists()) {
      batch.set(doc(db, 'business_settings', SETTINGS_DOC_ID), {
        ...INITIAL_BUSINESS_CONFIG,
        updatedAt: serverTimestamp(),
      });
      hasWrites = true;
    }

    if (servicesSnap.empty) {
      for (const srv of INITIAL_SERVICES) {
        const { id, ...rest } = srv;
        batch.set(doc(db, 'services', id), buildServicePayload(rest, true));
      }
      for (let i = 0; i < ADMIN_SERVICE_CATEGORIES.length; i += 1) {
        const name = ADMIN_SERVICE_CATEGORIES[i];
        const catId = `cat-${slugifyTreatmentName(name)}`;
        batch.set(doc(db, 'service_categories', catId), {
          name,
          pricingGroup: mapServiceGroupToPricingCategory(name),
          sortOrder: i + 1,
          active: true,
          updatedAt: serverTimestamp(),
        });
      }
      hasWrites = true;
    }

    if (gallerySnap.empty) {
      for (const item of INITIAL_GALLERY) {
        const payload: DocumentData = {
          title: item.title,
          category: item.category,
          caption: item.caption,
          itemType: item.itemType,
          image: item.image,
          imageAlt: item.imageAlt,
          isPlaceholder: item.isPlaceholder,
          visible: item.visible,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        batch.set(doc(db, 'gallery_images', item.id), payload);
      }
      hasWrites = true;
    }

    if (hasWrites) {
      await batch.commit();
    }
  } catch (error) {
    console.error('Initial catalog seed skipped or failed:', error);
  }
}

// ============================================================================
// Real-Time Listeners (Public & Admin)
// ============================================================================

export function subscribeBusinessSettings(
  onData: (config: BusinessConfig) => void
): Unsubscribe {
  const ref = doc(db, 'business_settings', SETTINGS_DOC_ID);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(mapDocToBusinessConfig(snap.data()));
      }
    },
    (error) => {
      console.error('business_settings listener error:', error.message);
    }
  );
}

export function subscribeServices(
  includeInactive: boolean,
  onData: (services: TreatmentService[], fromFirestore: boolean) => void
): Unsubscribe {
  const q = includeInactive
    ? query(collection(db, 'services'))
    : query(collection(db, 'services'), where('active', '==', true));

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty && !includeInactive) {
        onData(INITIAL_SERVICES, false);
        return;
      }
      const list = snap.docs
        .map((d) => mapDocToService(d.id, d.data()))
        .sort((a, b) => (a.sortOrder ?? 50) - (b.sortOrder ?? 50));
      onData(list, true);
    },
    (error) => {
      console.error('services listener error:', error.message);
    }
  );
}

export function subscribeGallery(
  includeHidden: boolean,
  onData: (items: GalleryItem[], fromFirestore: boolean) => void
): Unsubscribe {
  const q = includeHidden
    ? query(collection(db, 'gallery_images'))
    : query(collection(db, 'gallery_images'), where('visible', '==', true));

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty && !includeHidden) {
        onData(INITIAL_GALLERY, false);
        return;
      }
      const list = snap.docs.map((d) => mapDocToGallery(d.id, d.data()));
      onData(list, true);
    },
    (error) => {
      console.error('gallery_images listener error:', error.message);
    }
  );
}

export function subscribeReviews(
  includeUnpublished: boolean,
  onData: (reviews: ClientReview[]) => void
): Unsubscribe {
  const q = includeUnpublished
    ? query(collection(db, 'reviews'))
    : query(collection(db, 'reviews'), where('published', '==', true));

  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapDocToReview(d.id, d.data())));
    },
    (error) => {
      console.error('reviews listener error:', error.message);
    }
  );
}

export function subscribeAdminAppointments(
  onData: (appointments: Appointment[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'appointments'),
    orderBy('appointmentDate', 'desc')
  );
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapDocToAppointment(d.id, d.data())));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'appointments');
    }
  );
}

export function subscribeAdminCustomers(
  onData: (customers: Customer[]) => void
): Unsubscribe {
  const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapDocToCustomer(d.id, d.data())));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'customers');
    }
  );
}

export function subscribeAdminEnquiries(
  onData: (enquiries: ContactEnquiry[]) => void
): Unsubscribe {
  const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapDocToEnquiry(d.id, d.data())));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'enquiries');
    }
  );
}

export function subscribeAdminNotifications(
  onData: (notifications: AdminNotification[]) => void
): Unsubscribe {
  const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => mapDocToNotification(d.id, d.data())));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
    }
  );
}

// ============================================================================
// Public Write: Contact Form Enquiry
// ============================================================================

export async function createPublicEnquiry(input: {
  fullName: string;
  email: string;
  phone: string;
  treatmentInterest: string;
  message: string;
}): Promise<ContactEnquiry> {
  const id = makeDocId('enq');
  const path = `enquiries/${id}`;
  const fullName = input.fullName.trim().slice(0, 120);
  const email = input.email.trim().slice(0, 200);
  const phone = (input.phone.trim() || 'Not provided').slice(0, 40);
  const treatmentInterest = (
    input.treatmentInterest.trim() || 'General Enquiry'
  ).slice(0, 140);
  const message = input.message.trim().slice(0, 2500);

  try {
    await setDoc(doc(db, 'enquiries', id), {
      fullName,
      email,
      phone,
      treatmentInterest,
      message,
      status: 'New',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  return {
    id,
    fullName,
    email,
    phone,
    treatmentInterest,
    message,
    status: 'New',
    createdAt: new Date().toISOString(),
  };
}

// ============================================================================
// Admin CRUD: Services & Pricing
// ============================================================================

export async function createServiceDoc(
  service: Omit<TreatmentService, 'id'>
): Promise<string> {
  const id = makeDocId('srv');
  const path = `services/${id}`;
  try {
    await setDoc(doc(db, 'services', id), buildServicePayload(service, true));
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateServiceDoc(
  id: string,
  fullMergedService: TreatmentService
): Promise<void> {
  const path = `services/${id}`;
  const ref = doc(db, 'services', id);
  const { id: _ignored, ...rest } = fullMergedService;
  try {
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      await setDoc(ref, buildServicePayload(rest, true));
    } else {
      await updateDoc(ref, buildServicePayload(rest, false));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteServiceDoc(id: string): Promise<void> {
  const path = `services/${id}`;
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// Admin CRUD: Gallery
// ============================================================================

export async function createGalleryDoc(
  item: Omit<GalleryItem, 'id'>
): Promise<string> {
  const id = makeDocId('gal');
  const path = `gallery_images/${id}`;
  const payload: DocumentData = {
    title: item.title.trim().slice(0, 140),
    category: item.category,
    caption: item.caption.trim().slice(0, 500),
    itemType: item.itemType,
    image: item.image.slice(0, 200000),
    imageAlt: (item.imageAlt || item.title).trim().slice(0, 240),
    isPlaceholder: Boolean(item.isPlaceholder),
    visible: Boolean(item.visible),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (item.beforeImage && item.beforeImage.trim().length > 0) {
    payload.beforeImage = item.beforeImage.slice(0, 200000);
  }
  try {
    await setDoc(doc(db, 'gallery_images', id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateGalleryDoc(
  id: string,
  fullMergedItem: GalleryItem
): Promise<void> {
  const path = `gallery_images/${id}`;
  const ref = doc(db, 'gallery_images', id);
  const payload: DocumentData = {
    title: fullMergedItem.title.trim().slice(0, 140),
    category: fullMergedItem.category,
    caption: fullMergedItem.caption.trim().slice(0, 500),
    itemType: fullMergedItem.itemType,
    image: fullMergedItem.image.slice(0, 200000),
    imageAlt: (fullMergedItem.imageAlt || fullMergedItem.title)
      .trim()
      .slice(0, 240),
    isPlaceholder: Boolean(fullMergedItem.isPlaceholder),
    visible: Boolean(fullMergedItem.visible),
    updatedAt: serverTimestamp(),
  };
  if (fullMergedItem.beforeImage && fullMergedItem.beforeImage.trim().length > 0) {
    payload.beforeImage = fullMergedItem.beforeImage.slice(0, 200000);
  }
  try {
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
    } else {
      await updateDoc(ref, payload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteGalleryDoc(id: string): Promise<void> {
  const path = `gallery_images/${id}`;
  try {
    await deleteDoc(doc(db, 'gallery_images', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// Admin CRUD: Appointments & Notifications
// ============================================================================

export async function createNotificationDoc(input: {
  type: AdminNotification['type'];
  title: string;
  body: string;
  relatedId?: string;
}): Promise<void> {
  const id = makeDocId('ntf');
  const path = `notifications/${id}`;
  const payload: DocumentData = {
    type: input.type,
    title: input.title.trim().slice(0, 160),
    body: input.body.trim().slice(0, 500),
    read: false,
    createdAt: serverTimestamp(),
  };
  if (input.relatedId && input.relatedId.trim().length > 0) {
    payload.relatedId = input.relatedId.trim().slice(0, 128);
  }
  try {
    await setDoc(doc(db, 'notifications', id), payload);
  } catch (error) {
    console.error(`Notification write skipped (${path}):`, error);
  }
}

export async function markNotificationReadDoc(id: string): Promise<void> {
  const path = `notifications/${id}`;
  try {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteNotificationDoc(id: string): Promise<void> {
  const path = `notifications/${id}`;
  try {
    await deleteDoc(doc(db, 'notifications', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createAppointmentDoc(
  input: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const id = makeDocId('apt');
  const path = `appointments/${id}`;
  const payload: DocumentData = {
    customerName: input.customerName.trim().slice(0, 120),
    customerPhone: input.customerPhone.trim().slice(0, 40),
    customerEmail: (input.customerEmail ?? '').trim().slice(0, 200),
    serviceName: input.serviceName.trim().slice(0, 140),
    appointmentDate: input.appointmentDate.trim(),
    appointmentTime: input.appointmentTime.trim().slice(0, 20),
    status: input.status,
    source: input.source,
    internalNotes: (input.internalNotes ?? '').trim().slice(0, 2000),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (input.customerId && input.customerId.trim().length > 0) {
    payload.customerId = input.customerId.trim().slice(0, 128);
  }
  if (input.serviceId && input.serviceId.trim().length > 0) {
    payload.serviceId = input.serviceId.trim().slice(0, 128);
  }

  try {
    await setDoc(doc(db, 'appointments', id), payload);
    void createNotificationDoc({
      type: 'booking',
      title: `New appointment: ${payload.customerName}`,
      body: `${payload.serviceName} on ${payload.appointmentDate} at ${payload.appointmentTime}`,
      relatedId: id,
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateAppointmentDoc(
  id: string,
  fullMerged: Appointment,
  previousStatus?: AppointmentStatus
): Promise<void> {
  const path = `appointments/${id}`;
  const payload: DocumentData = {
    customerName: fullMerged.customerName.trim().slice(0, 120),
    customerPhone: fullMerged.customerPhone.trim().slice(0, 40),
    customerEmail: (fullMerged.customerEmail ?? '').trim().slice(0, 200),
    serviceName: fullMerged.serviceName.trim().slice(0, 140),
    appointmentDate: fullMerged.appointmentDate.trim(),
    appointmentTime: fullMerged.appointmentTime.trim().slice(0, 20),
    status: fullMerged.status,
    source: fullMerged.source,
    internalNotes: (fullMerged.internalNotes ?? '').trim().slice(0, 2000),
    updatedAt: serverTimestamp(),
  };
  if (fullMerged.customerId && fullMerged.customerId.trim().length > 0) {
    payload.customerId = fullMerged.customerId.trim().slice(0, 128);
  }
  if (fullMerged.serviceId && fullMerged.serviceId.trim().length > 0) {
    payload.serviceId = fullMerged.serviceId.trim().slice(0, 128);
  }

  try {
    await updateDoc(doc(db, 'appointments', id), payload);
    if (previousStatus && previousStatus !== fullMerged.status) {
      void createNotificationDoc({
        type: 'status_change',
        title: `Appointment ${fullMerged.status}: ${fullMerged.customerName}`,
        body: `${fullMerged.serviceName} (${fullMerged.appointmentDate} at ${fullMerged.appointmentTime}) marked as ${fullMerged.status}.`,
        relatedId: id,
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAppointmentDoc(id: string): Promise<void> {
  const path = `appointments/${id}`;
  try {
    await deleteDoc(doc(db, 'appointments', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// Admin CRUD: Customers
// ============================================================================

export async function createCustomerDoc(
  input: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const id = makeDocId('cus');
  const path = `customers/${id}`;
  try {
    await setDoc(doc(db, 'customers', id), {
      fullName: input.fullName.trim().slice(0, 120),
      email: input.email.trim().slice(0, 200),
      phone: input.phone.trim().slice(0, 40),
      preferredTreatments: input.preferredTreatments.trim().slice(0, 300),
      notes: input.notes.trim().slice(0, 2000),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCustomerDoc(
  id: string,
  fullMerged: Customer
): Promise<void> {
  const path = `customers/${id}`;
  try {
    await updateDoc(doc(db, 'customers', id), {
      fullName: fullMerged.fullName.trim().slice(0, 120),
      email: fullMerged.email.trim().slice(0, 200),
      phone: fullMerged.phone.trim().slice(0, 40),
      preferredTreatments: fullMerged.preferredTreatments.trim().slice(0, 300),
      notes: fullMerged.notes.trim().slice(0, 2000),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCustomerDoc(id: string): Promise<void> {
  const path = `customers/${id}`;
  try {
    await deleteDoc(doc(db, 'customers', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// Admin CRUD: Enquiries
// ============================================================================

export async function updateEnquiryStatusDoc(
  id: string,
  status: EnquiryStatus
): Promise<void> {
  const path = `enquiries/${id}`;
  try {
    await updateDoc(doc(db, 'enquiries', id), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteEnquiryDoc(id: string): Promise<void> {
  const path = `enquiries/${id}`;
  try {
    await deleteDoc(doc(db, 'enquiries', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// Admin CRUD: Business Settings & Verified Reviews
// ============================================================================

export async function saveBusinessSettingsDoc(
  config: BusinessConfig
): Promise<void> {
  const path = `business_settings/${SETTINGS_DOC_ID}`;
  const cleanPhoneDigits = config.phoneDisplay.replace(/[^\d+]/g, '');
  const phoneHref = cleanPhoneDigits
    ? `tel:${cleanPhoneDigits}`
    : config.phoneHref || 'tel:+447405517720';

  const payload: DocumentData = {
    brandName: config.brandName.trim().slice(0, 140),
    tagline: config.tagline.trim().slice(0, 300),
    businessDescription: config.businessDescription.trim().slice(0, 1200),
    logoUrl: (config.logoUrl ?? '').trim().slice(0, 200000),
    phoneDisplay: config.phoneDisplay.trim().slice(0, 40),
    phoneHref: phoneHref.slice(0, 50),
    whatsappDigits: config.whatsappDigits.trim().slice(0, 30),
    whatsappCta: config.whatsappCta.trim().slice(0, 60),
    whatsappPrefill: config.whatsappPrefill.trim().slice(0, 300),
    email: config.email.trim().slice(0, 200),
    addressConfirmed: Boolean(config.addressConfirmed),
    addressText: config.addressText.trim().slice(0, 300),
    openingHoursConfirmed: Boolean(config.openingHoursConfirmed),
    openingHoursText: config.openingHoursText.trim().slice(0, 300),
    bookingUrlConfigured: Boolean(config.bookingUrlConfigured),
    bookingUrl: config.bookingUrl.trim().slice(0, 500),
    bookingProviderLabel: config.bookingProviderLabel.trim().slice(0, 140),
    bookingIntegrationMode: config.bookingIntegrationMode,
    allowBookingEmbed: Boolean(config.allowBookingEmbed),
    instagramConfigured: Boolean(config.instagramConfigured),
    instagramHandle: config.instagramHandle.trim().slice(0, 120),
    instagramUrl: config.instagramUrl.trim().slice(0, 300),
    reviewPlatformConfigured: Boolean(config.reviewPlatformConfigured),
    reviewPlatformName: config.reviewPlatformName.trim().slice(0, 120),
    reviewPlatformUrl: config.reviewPlatformUrl.trim().slice(0, 300),
    emailNotificationsEnabled: Boolean(config.emailNotificationsEnabled),
    notificationEmail: config.notificationEmail.trim().slice(0, 200),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'business_settings', SETTINGS_DOC_ID), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createReviewDoc(
  review: Omit<ClientReview, 'id'>
): Promise<string> {
  const id = makeDocId('rev');
  const path = `reviews/${id}`;
  try {
    await setDoc(doc(db, 'reviews', id), {
      clientName: review.clientName.trim().slice(0, 100),
      treatment: review.treatment.trim().slice(0, 120),
      rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
      comment: review.comment.trim().slice(0, 1500),
      dateLabel: review.dateLabel.trim().slice(0, 60),
      verifiedSource: review.verifiedSource.trim().slice(0, 80),
      published: Boolean(review.published),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateReviewDoc(
  id: string,
  fullMerged: ClientReview
): Promise<void> {
  const path = `reviews/${id}`;
  try {
    await updateDoc(doc(db, 'reviews', id), {
      clientName: fullMerged.clientName.trim().slice(0, 100),
      treatment: fullMerged.treatment.trim().slice(0, 120),
      rating: Math.min(5, Math.max(1, Number(fullMerged.rating) || 5)),
      comment: fullMerged.comment.trim().slice(0, 1500),
      dateLabel: fullMerged.dateLabel.trim().slice(0, 60),
      verifiedSource: fullMerged.verifiedSource.trim().slice(0, 80),
      published: Boolean(fullMerged.published),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteReviewDoc(id: string): Promise<void> {
  const path = `reviews/${id}`;
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

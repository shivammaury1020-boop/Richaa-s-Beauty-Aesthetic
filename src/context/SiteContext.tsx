import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  INITIAL_BUSINESS_CONFIG,
  INITIAL_ENQUIRIES,
  INITIAL_GALLERY,
  INITIAL_REVIEWS,
  INITIAL_SERVICES,
  INITIAL_WEBSITE_CONTENT,
} from '../data/initialData';
import {
  BOOTSTRAPPED_ADMIN_EMAILS,
  auth,
  googleProvider,
} from '../lib/firebase';
import {
  checkAdminDocumentExists,
  createAppointmentDoc,
  createCustomerDoc,
  createGalleryDoc,
  createPublicEnquiry,
  createReviewDoc,
  createServiceDoc,
  deleteAppointmentDoc,
  deleteCustomerDoc,
  deleteEnquiryDoc,
  deleteGalleryDoc,
  deleteNotificationDoc,
  deleteReviewDoc,
  deleteServiceDoc,
  ensureAdminProfileDocument,
  markNotificationReadDoc,
  saveBusinessSettingsDoc,
  seedInitialCatalogIfEmpty,
  subscribeAdminAppointments,
  subscribeAdminCustomers,
  subscribeAdminEnquiries,
  subscribeAdminNotifications,
  subscribeBusinessSettings,
  subscribeGallery,
  subscribeReviews,
  subscribeServices,
  updateAppointmentDoc,
  updateCustomerDoc,
  updateEnquiryStatusDoc,
  updateGalleryDoc,
  updateReviewDoc,
  updateServiceDoc,
} from '../services/firestoreRepository';
import type {
  AdminNotification,
  AppRoute,
  Appointment,
  BusinessConfig,
  ClientReview,
  ContactEnquiry,
  Customer,
  EnquiryStatus,
  GalleryItem,
  TreatmentService,
  WebsiteContent,
} from '../types/site';
import {
  ContactFormInput,
  pathToRoute,
  routeToPath,
} from '../utils/siteLogic';

interface BookingModalState {
  open: boolean;
  treatmentName?: string;
}

export interface AdminAuthState {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  checkingAdmin: boolean;
  unauthorizedEmail: string | null;
}

interface SiteContextValue {
  route: AppRoute;
  navigate: (nextRoute: AppRoute) => void;
  services: TreatmentService[];
  gallery: GalleryItem[];
  reviews: ClientReview[];
  enquiries: ContactEnquiry[];
  appointments: Appointment[];
  customers: Customer[];
  notifications: AdminNotification[];
  businessConfig: BusinessConfig;
  websiteContent: WebsiteContent;
  bookingModal: BookingModalState;
  openBookingModal: (treatmentName?: string) => void;
  closeBookingModal: () => void;
  // Auth
  adminAuth: AdminAuthState;
  signInAdminWithGoogle: () => Promise<void>;
  signInAdminWithEmail: (email: string, password: string) => Promise<void>;
  requestAdminPasswordReset: (email: string) => Promise<void>;
  signOutAdmin: () => Promise<void>;
  // Public enquiry submission
  submitEnquiry: (input: ContactFormInput) => Promise<ContactEnquiry>;
  // Admin CRUD: Enquiries
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  // Admin CRUD: Appointments
  createAppointment: (
    input: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
  updateAppointment: (
    id: string,
    patch: Partial<Appointment>
  ) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  // Admin CRUD: Services & Pricing
  createService: (service: Omit<TreatmentService, 'id'>) => Promise<string>;
  updateService: (
    id: string,
    patch: Partial<TreatmentService>
  ) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  // Admin CRUD: Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<string>;
  updateGalleryItem: (id: string, patch: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  // Admin CRUD: Customers
  createCustomer: (
    input: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
  updateCustomer: (id: string, patch: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  // Admin CRUD: Business Settings & Reviews & Notifications
  updateBusinessConfig: (patch: Partial<BusinessConfig>) => Promise<void>;
  updateWebsiteContent: (patch: Partial<WebsiteContent>) => void;
  addVerifiedReview: (review: Omit<ClientReview, 'id'>) => Promise<string>;
  toggleReviewPublished: (id: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const SiteContext = createContext<SiteContextValue | null>(null);

function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return { page: 'home' };
  return pathToRoute(window.location.pathname, window.location.search);
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<AppRoute>(getInitialRoute);
  const [services, setServices] = useState<TreatmentService[]>(INITIAL_SERVICES);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [reviews, setReviews] = useState<ClientReview[]>(INITIAL_REVIEWS);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(INITIAL_ENQUIRIES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(
    INITIAL_BUSINESS_CONFIG
  );
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(
    INITIAL_WEBSITE_CONTENT
  );
  const [bookingModal, setBookingModal] = useState<BookingModalState>({
    open: false,
  });

  const [adminAuth, setAdminAuth] = useState<AdminAuthState>({
    user: null,
    authReady: false,
    isAdmin: false,
    checkingAdmin: true,
    unauthorizedEmail: null,
  });

  const navigate = useCallback((nextRoute: AppRoute) => {
    setRoute(nextRoute);
    const targetPath = routeToPath(nextRoute);
    if (typeof window !== 'undefined') {
      if (window.location.pathname + window.location.search !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(pathToRoute(window.location.pathname, window.location.search));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const pageTitles: Record<AppRoute['page'], string> = {
      home: `${businessConfig.brandName} | Luxury Beauty & Aesthetics Salon`,
      about: `About Us | ${businessConfig.brandName}`,
      services: `Treatments & Services | ${businessConfig.brandName}`,
      'service-detail': `Treatment Details | ${businessConfig.brandName}`,
      gallery: `Gallery | ${businessConfig.brandName}`,
      pricing: `Pricing | ${businessConfig.brandName}`,
      reviews: `Client Reviews | ${businessConfig.brandName}`,
      contact: `Contact Us | ${businessConfig.brandName}`,
      'privacy-policy': `Privacy Policy | ${businessConfig.brandName}`,
      'terms-and-conditions': `Terms & Conditions | ${businessConfig.brandName}`,
      admin: `Admin Dashboard | ${businessConfig.brandName}`,
    };
    document.title = pageTitles[route.page];
  }, [route, businessConfig.brandName]);

  // Firebase Auth listener & admin verification
  useEffect(() => {
    let active = true;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!active) return;
      if (!user) {
        setAdminAuth({
          user: null,
          authReady: true,
          isAdmin: false,
          checkingAdmin: false,
          unauthorizedEmail: null,
        });
        setAppointments([]);
        setCustomers([]);
        setEnquiries([]);
        setNotifications([]);
        return;
      }

      setAdminAuth((prev) => ({
        ...prev,
        user,
        checkingAdmin: true,
        unauthorizedEmail: null,
      }));

      const normalizedEmail = (user.email ?? '').toLowerCase();
      const isBootstrapped =
        user.emailVerified &&
        BOOTSTRAPPED_ADMIN_EMAILS.includes(normalizedEmail);

      let authorized = isBootstrapped;
      if (!authorized && user.emailVerified) {
        authorized = await checkAdminDocumentExists(user.uid);
      }

      if (!active) return;

      if (authorized) {
        if (isBootstrapped && user.email) {
          void ensureAdminProfileDocument({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        }
        void seedInitialCatalogIfEmpty();
        setAdminAuth({
          user,
          authReady: true,
          isAdmin: true,
          checkingAdmin: false,
          unauthorizedEmail: null,
        });
      } else {
        setAdminAuth({
          user,
          authReady: true,
          isAdmin: false,
          checkingAdmin: false,
          unauthorizedEmail: user.email || 'Unverified account',
        });
      }
    });

    return () => {
      active = false;
      unsub();
    };
  }, []);

  // Public + Admin-aware catalog subscriptions
  useEffect(() => {
    const isAdmin = adminAuth.authReady && adminAuth.isAdmin;

    const unsubSettings = subscribeBusinessSettings((cfg) => {
      setBusinessConfig(cfg);
    });
    const unsubServices = subscribeServices(isAdmin, (list) => {
      if (list.length > 0 || !isAdmin) {
        setServices(list);
      }
    });
    const unsubGallery = subscribeGallery(isAdmin, (list) => {
      if (list.length > 0 || !isAdmin) {
        setGallery(list);
      }
    });
    const unsubReviews = subscribeReviews(isAdmin, (list) => {
      setReviews(list);
    });

    return () => {
      unsubSettings();
      unsubServices();
      unsubGallery();
      unsubReviews();
    };
  }, [adminAuth.authReady, adminAuth.isAdmin]);

  // Strictly Admin-Only Private PII Subscriptions
  useEffect(() => {
    if (!adminAuth.authReady || !adminAuth.isAdmin) {
      return;
    }

    const unsubAppointments = subscribeAdminAppointments(setAppointments);
    const unsubCustomers = subscribeAdminCustomers(setCustomers);
    const unsubEnquiries = subscribeAdminEnquiries(setEnquiries);
    const unsubNotifications = subscribeAdminNotifications(setNotifications);

    return () => {
      unsubAppointments();
      unsubCustomers();
      unsubEnquiries();
      unsubNotifications();
    };
  }, [adminAuth.authReady, adminAuth.isAdmin]);

  // Auth Actions
  const signInAdminWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signInAdminWithEmail = useCallback(
    async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    },
    []
  );

  const requestAdminPasswordReset = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const signOutAdmin = useCallback(async () => {
    await signOut(auth);
  }, []);

  // Booking Modal
  const openBookingModal = useCallback((treatmentName?: string) => {
    setBookingModal({ open: true, treatmentName });
  }, []);

  const closeBookingModal = useCallback(() => {
    setBookingModal({ open: false });
  }, []);

  // Public Enquiry Submission
  const submitEnquiry = useCallback(async (input: ContactFormInput) => {
    return await createPublicEnquiry({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      treatmentInterest: input.treatmentInterest,
      message: input.message,
    });
  }, []);

  // Admin Enquiries CRUD
  const updateEnquiryStatus = useCallback(
    async (id: string, status: EnquiryStatus) => {
      await updateEnquiryStatusDoc(id, status);
    },
    []
  );

  const deleteEnquiry = useCallback(async (id: string) => {
    await deleteEnquiryDoc(id);
  }, []);

  // Admin Appointments CRUD
  const createAppointment = useCallback(
    async (input: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await createAppointmentDoc(input);
    },
    []
  );

  const updateAppointment = useCallback(
    async (id: string, patch: Partial<Appointment>) => {
      const existing = appointments.find((a) => a.id === id);
      if (!existing) return;
      const merged: Appointment = { ...existing, ...patch };
      await updateAppointmentDoc(id, merged, existing.status);
    },
    [appointments]
  );

  const deleteAppointment = useCallback(async (id: string) => {
    await deleteAppointmentDoc(id);
  }, []);

  // Admin Services & Pricing CRUD
  const createService = useCallback(
    async (service: Omit<TreatmentService, 'id'>) => {
      return await createServiceDoc(service);
    },
    []
  );

  const updateService = useCallback(
    async (id: string, patch: Partial<TreatmentService>) => {
      const existing = services.find((s) => s.id === id);
      if (!existing) return;
      const merged: TreatmentService = { ...existing, ...patch };
      await updateServiceDoc(id, merged);
    },
    [services]
  );

  const deleteService = useCallback(async (id: string) => {
    await deleteServiceDoc(id);
  }, []);

  // Admin Gallery CRUD
  const addGalleryItem = useCallback(async (item: Omit<GalleryItem, 'id'>) => {
    return await createGalleryDoc(item);
  }, []);

  const updateGalleryItem = useCallback(
    async (id: string, patch: Partial<GalleryItem>) => {
      const existing = gallery.find((g) => g.id === id);
      if (!existing) return;
      const merged: GalleryItem = { ...existing, ...patch };
      await updateGalleryDoc(id, merged);
    },
    [gallery]
  );

  const deleteGalleryItem = useCallback(async (id: string) => {
    await deleteGalleryDoc(id);
  }, []);

  // Admin Customers CRUD
  const createCustomer = useCallback(
    async (input: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await createCustomerDoc(input);
    },
    []
  );

  const updateCustomer = useCallback(
    async (id: string, patch: Partial<Customer>) => {
      const existing = customers.find((c) => c.id === id);
      if (!existing) return;
      const merged: Customer = { ...existing, ...patch };
      await updateCustomerDoc(id, merged);
    },
    [customers]
  );

  const deleteCustomer = useCallback(async (id: string) => {
    await deleteCustomerDoc(id);
  }, []);

  // Admin Business Settings & Reviews & Notifications
  const updateBusinessConfig = useCallback(
    async (patch: Partial<BusinessConfig>) => {
      const merged: BusinessConfig = { ...businessConfig, ...patch };
      setBusinessConfig(merged);
      await saveBusinessSettingsDoc(merged);
    },
    [businessConfig]
  );

  const updateWebsiteContent = useCallback((patch: Partial<WebsiteContent>) => {
    setWebsiteContent((prev) => ({ ...prev, ...patch }));
  }, []);

  const addVerifiedReview = useCallback(
    async (review: Omit<ClientReview, 'id'>) => {
      return await createReviewDoc(review);
    },
    []
  );

  const toggleReviewPublished = useCallback(
    async (id: string) => {
      const existing = reviews.find((r) => r.id === id);
      if (!existing) return;
      await updateReviewDoc(id, { ...existing, published: !existing.published });
    },
    [reviews]
  );

  const deleteReview = useCallback(async (id: string) => {
    await deleteReviewDoc(id);
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    await markNotificationReadDoc(id);
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    await deleteNotificationDoc(id);
  }, []);

  return (
    <SiteContext.Provider
      value={{
        route,
        navigate,
        services,
        gallery,
        reviews,
        enquiries,
        appointments,
        customers,
        notifications,
        businessConfig,
        websiteContent,
        bookingModal,
        openBookingModal,
        closeBookingModal,
        adminAuth,
        signInAdminWithGoogle,
        signInAdminWithEmail,
        requestAdminPasswordReset,
        signOutAdmin,
        submitEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        createService,
        updateService,
        deleteService,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        updateBusinessConfig,
        updateWebsiteContent,
        addVerifiedReview,
        toggleReviewPublished,
        deleteReview,
        markNotificationRead,
        deleteNotification,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite must be used inside SiteProvider');
  }
  return ctx;
}

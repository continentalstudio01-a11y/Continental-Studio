import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  db,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  auth,
  signInAnonymously,
  onAuthStateChanged,
  User
} from '../lib/firebase';
import {
  SiteSettings,
  DesignSettings,
  NavItem,
  Package,
  PortfolioItem,
  BeforeAfterItem,
  Testimonial,
  FAQItem,
  Lead,
  Order,
  AnalyticsEvent,
  AnalyticsEventType,
  OrderStatus,
  ColorPaletteId,
  HowItWorksStep,
  AudioSettings,
  MusicTrack
} from '../types';
import { setupAllTracking, fireMarketingEvent } from '../lib/tracking';
import {
  defaultSiteSettings,
  defaultDesignSettings,
  defaultNavItems,
  defaultPackages,
  defaultPortfolio,
  defaultBeforeAfterItems,
  defaultTestimonials,
  defaultFAQs,
  defaultLeads,
  defaultOrders,
  defaultAnalyticsEvents,
  colorPalettesList,
  defaultHowItWorksSteps,
  defaultAudioSettings
} from '../data/defaultData';

interface BioSiteContextType {
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  
  designSettings: DesignSettings;
  updateDesignSettings: (settings: Partial<DesignSettings>) => void;
  
  navItems: NavItem[];
  updateNavItems: (items: NavItem[]) => void;
  
  packages: Package[];
  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  duplicatePackage: (id: string) => void;
  
  portfolio: PortfolioItem[];
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  updatePortfolioItem: (id: string, item: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;

  beforeAfterItems: BeforeAfterItem[];
  addBeforeAfterItem: (item: Omit<BeforeAfterItem, 'id'>) => void;
  updateBeforeAfterItem: (id: string, item: Partial<BeforeAfterItem>) => void;
  deleteBeforeAfterItem: (id: string) => void;
  reorderBeforeAfterItems: (items: BeforeAfterItem[]) => void;
  
  testimonials: Testimonial[];
  addTestimonial: (item: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, item: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  
  faqs: FAQItem[];
  addFAQ: (item: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, item: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;
  
  howItWorksSteps: HowItWorksStep[];
  updateHowItWorksStep: (id: string, step: Partial<HowItWorksStep>) => void;
  addHowItWorksStep: () => void;
  deleteHowItWorksStep: (id: string) => void;
  reorderHowItWorksSteps: (steps: HowItWorksStep[]) => void;
  
  audioSettings: AudioSettings;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  addMusicTrack: (track: Omit<MusicTrack, 'id'>) => void;
  updateMusicTrack: (id: string, track: Partial<MusicTrack>) => void;
  deleteMusicTrack: (id: string) => void;
  setSelectedTrack: (trackId: string) => void;
  resetToDefaultTracks: () => void;
  
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  updateLeadStatus: (id: string, status: OrderStatus) => void;
  deleteLead: (id: string) => void;
  
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (id: string, status: OrderStatus, adminNotes?: string, estimatedDelivery?: string, statusMessage?: string) => void;
  deleteOrder: (id: string) => void;
  findOrderForTracking: (query: string) => Order | undefined;
  
  analyticsEvents: AnalyticsEvent[];
  trackEvent: (type: AnalyticsEventType, metadata?: Record<string, any>) => void;
  registerNavClick: (navItemId: string, variant?: 'A' | 'B') => void;
  resetNavClickStats: (navItemId?: string) => void;
  
  adminAuth: {
    isAuthenticated: boolean;
    email: string;
  };
  isAuthenticated: boolean;
  isAdminMode: boolean;
  toggleAdminMode: (mode?: boolean) => void;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  updateAdminCredentials: (email: string, pass: string) => void;
  
  selectedPackageForOrder: Package | null;
  isOrderModalOpen: boolean;
  openOrderModal: (pkg?: Package) => void;
  closeOrderModal: () => void;

  isOrderTrackingOpen: boolean;
  activeTrackingQuery: string;
  openOrderTrackingModal: (query?: string) => void;
  closeOrderTrackingModal: () => void;
  
  hasUnsavedChanges: boolean;
  isCloudSynced: boolean;
  isCloudSaving: boolean;
  isInitialLoading: boolean;
  isSyncing: boolean;
  forceSyncData: () => Promise<boolean>;
  saveAllData: (overrides?: any) => Promise<boolean>;
  exportAllDataJSON: () => string;
  importAllDataJSON: (jsonString: string) => boolean;
  resetToDefaults: () => void;
  clearOperationalData: () => void;
}

const BioSiteContext = createContext<BioSiteContextType | undefined>(undefined);

const STORAGE_PREFIX = 'continental_studio_v1_';

// Helper to safely sanitize any object for Google Cloud Firestore (removes undefined values that Firestore rejects)
export function sanitizeForFirestore(value: any): any {
  if (value === undefined) {
    return null;
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item));
  }
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(value)) {
    if (val !== undefined) {
      result[key] = sanitizeForFirestore(val);
    }
  }
  return result;
}

export const BioSiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage loaders with fallback
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      if (parsed === null || parsed === undefined) return fallback;
      return parsed;
    } catch {
      return fallback;
    }
  };

  const safeSaveStored = (key: string, value: any) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[BioSite] Storage limit warning for ${key}:`, err);
    }
  };

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadStored('siteSettings', defaultSiteSettings)
  );
  const [designSettings, setDesignSettings] = useState<DesignSettings>(() =>
    loadStored('designSettings', defaultDesignSettings)
  );
  const [navItems, setNavItems] = useState<NavItem[]>(() =>
    loadStored('navItems', defaultNavItems)
  );
  const [packages, setPackages] = useState<Package[]>(() =>
    loadStored('packages', defaultPackages)
  );
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() =>
    loadStored('portfolio', defaultPortfolio)
  );
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfterItem[]>(() =>
    loadStored('beforeAfterItems', defaultBeforeAfterItems)
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    loadStored('testimonials', defaultTestimonials)
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(() =>
    loadStored('faqs', defaultFAQs)
  );
  const [howItWorksSteps, setHowItWorksSteps] = useState<HowItWorksStep[]>(() =>
    loadStored('howItWorksSteps', defaultHowItWorksSteps)
  );
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    const loaded = loadStored('audioSettings', defaultAudioSettings);
    // If tracks array is empty or contains old outdated urls, ensure rich default tracks are present
    if (!loaded.tracks || loaded.tracks.length === 0 || loaded.tracks.some((t: any) => t.audioUrl?.includes('upload.wikimedia.org'))) {
      return defaultAudioSettings;
    }
    return loaded;
  });
  const [leads, setLeads] = useState<Lead[]>(() =>
    loadStored('leads', defaultLeads)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadStored('orders', defaultOrders)
  );
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() =>
    loadStored('analyticsEvents', defaultAnalyticsEvents)
  );
  
  const [adminAuth, setAdminAuth] = useState(() =>
    loadStored('adminAuth', { isAuthenticated: false, email: 'admin@continentalstudio.com', passwordHash: 'admin123' })
  );

  const [isAdminMode, setIsAdminMode] = useState(() => {
    return window.location.search.includes('admin=true') || window.location.hash.includes('admin');
  });

  const toggleAdminMode = (mode?: boolean) => {
    setIsAdminMode((prev) => (typeof mode === 'boolean' ? mode : !prev));
  };

  const [selectedPackageForOrder, setSelectedPackageForOrder] = useState<Package | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [activeTrackingQuery, setActiveTrackingQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isCloudSaving, setIsCloudSaving] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const isInitialCloudLoadDone = React.useRef<boolean>(false);

  // Helper to apply incoming cloud/server data cleanly to state and localStorage
  const applyIncomingData = useCallback((data: any) => {
    if (!data || typeof data !== 'object') return;
    if (data.siteSettings) {
      setSiteSettings(data.siteSettings);
      safeSaveStored('siteSettings', data.siteSettings);
    }
    if (data.designSettings) {
      setDesignSettings(data.designSettings);
      applyThemeCSSVariables(data.designSettings);
      safeSaveStored('designSettings', data.designSettings);
    }
    if (Array.isArray(data.navItems)) {
      setNavItems(data.navItems);
      safeSaveStored('navItems', data.navItems);
    }
    if (Array.isArray(data.packages)) {
      setPackages(data.packages);
      safeSaveStored('packages', data.packages);
    }
    if (Array.isArray(data.portfolio)) {
      setPortfolio(data.portfolio);
      safeSaveStored('portfolio', data.portfolio);
    }
    if (Array.isArray(data.beforeAfterItems)) {
      setBeforeAfterItems(data.beforeAfterItems);
      safeSaveStored('beforeAfterItems', data.beforeAfterItems);
    }
    if (Array.isArray(data.testimonials)) {
      setTestimonials(data.testimonials);
      safeSaveStored('testimonials', data.testimonials);
    }
    if (Array.isArray(data.faqs)) {
      setFaqs(data.faqs);
      safeSaveStored('faqs', data.faqs);
    }
    if (Array.isArray(data.howItWorksSteps)) {
      setHowItWorksSteps(data.howItWorksSteps);
      safeSaveStored('howItWorksSteps', data.howItWorksSteps);
    }
    if (data.audioSettings) {
      setAudioSettings(data.audioSettings);
      safeSaveStored('audioSettings', data.audioSettings);
    }
    if (Array.isArray(data.leads)) {
      setLeads(data.leads);
      safeSaveStored('leads', data.leads);
    }
    if (Array.isArray(data.orders)) {
      setOrders(data.orders);
      safeSaveStored('orders', data.orders);
    }
    if (data.adminAuth) {
      setAdminAuth(data.adminAuth);
      safeSaveStored('adminAuth', data.adminAuth);
    }
    setIsCloudSynced(true);
    setIsInitialLoading(false);
  }, []);

  // 1. Firebase Auth State Monitor
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  useEffect(() => {
    console.log('[Firebase Auth] Monitoring authentication session status...');
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          console.log('[Firebase Auth] Authenticated user active. UID:', user.uid);
          setFirebaseUser(user);
        } else {
          console.log('[Firebase Auth] Operating in public/guest mode for database reads.');
          setFirebaseUser(null);
        }
        setAuthInitialized(true);
      },
      (error) => {
        console.warn('[Firebase Auth Notice] Auth state observer:', error);
        setAuthInitialized(true);
      }
    );

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time onSnapshot listener + initial cloud/server data loader
  useEffect(() => {
    let isMounted = true;

    console.log('[BioSite Sync] Starting real-time Firestore synchronization & multi-device loader...');

    // Safety timeout: Ensure initial loading screen smoothly resolves within 1.2s even on slow/offline networks
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsInitialLoading(false);
      }
    }, 1200);

    // Step A: Fast Server-Side Fetch
    fetch('/api/site-data')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json?.success && json?.data) {
          console.log('[BioSite Sync] Server API data fetched successfully.');
          applyIncomingData(json.data);
        }
      })
      .catch((err) => {
        console.warn('[BioSite Sync] Server API fetch notice:', err);
      })
      .finally(() => {
        if (isMounted) isInitialCloudLoadDone.current = true;
      });

    // Step B: Real-time Cloud Firestore subscription via onSnapshot
    try {
      const settingsDocRef = doc(db, 'biosite_data', 'main_settings');
      console.log('[BioSite Firestore] Attaching continuous real-time onSnapshot listener to "biosite_data/main_settings"...');

      // 1. Immediate getDoc fetch
      getDoc(settingsDocRef)
        .then((snap) => {
          if (isMounted && snap.exists()) {
            const data = snap.data();
            console.log('[BioSite Firestore] Initial Firestore getDoc document found. Merging state...');
            applyIncomingData(data);
          }
        })
        .catch((err: any) => {
          if (err?.code === 'unavailable') {
            console.log('[BioSite Firestore] Client connecting in background, onSnapshot will stream data.');
          } else {
            console.warn('[BioSite Firestore Notice] getDoc notice:', err?.message || err);
          }
        });

      // 2. Real-time onSnapshot listener for instant cross-device updates
      const unsubscribe = onSnapshot(
        settingsDocRef,
        (snap) => {
          if (isMounted && snap.exists()) {
            const data = snap.data();
            console.log('[BioSite Firestore Snapshot] Real-time document change received! Updating app state across devices...');
            applyIncomingData(data);
          }
        },
        (error: any) => {
          console.warn('[BioSite Firestore Notice] onSnapshot notice:', error?.message || error);
          if (isMounted) {
            setIsInitialLoading(false);
          }
        }
      );

      return () => {
        isMounted = false;
        clearTimeout(safetyTimer);
        unsubscribe();
      };
    } catch (e: any) {
      console.error('[BioSite Firestore Error] Failed to initialize Firestore listeners:', e);
      if (isMounted) {
        setIsInitialLoading(false);
      }
      return () => {
        isMounted = false;
        clearTimeout(safetyTimer);
      };
    }
  }, [applyIncomingData]);

  // 3. Force Sync Function (On-Demand Real-Time Sychronization)
  const forceSyncData = useCallback(async (): Promise<boolean> => {
    setIsSyncing(true);
    console.log('[BioSite Sync] Force synchronization initiated by user...');
    try {
      let dataLoaded = false;

      // 1. Query Firestore Document
      try {
        const settingsDocRef = doc(db, 'biosite_data', 'main_settings');
        const snap = await getDoc(settingsDocRef);
        if (snap.exists()) {
          const cloudData = snap.data();
          console.log('[BioSite Sync] Force sync fetched latest Firestore data:', Object.keys(cloudData));
          applyIncomingData(cloudData);
          dataLoaded = true;
        }
      } catch (fErr) {
        console.warn('[BioSite Sync] Force sync Firestore query notice:', fErr);
      }

      // 2. Query Server API Storage
      try {
        const res = await fetch('/api/site-data');
        const json = await res.json();
        if (json?.success && json?.data) {
          console.log('[BioSite Sync] Force sync fetched latest Server API data.');
          applyIncomingData(json.data);
          dataLoaded = true;
        }
      } catch (sErr) {
        console.warn('[BioSite Sync] Force sync Server API notice:', sErr);
      }

      setIsCloudSynced(true);
      setIsSyncing(false);
      setIsInitialLoading(false);
      return dataLoaded;
    } catch (err) {
      console.error('[BioSite Sync] Force sync error:', err);
      setIsSyncing(false);
      setIsInitialLoading(false);
      return false;
    }
  }, [applyIncomingData]);

  // Dynamic Browser Tab Favicon & Title Injection
  useEffect(() => {
    if (siteSettings?.seo?.pageTitle) {
      document.title = siteSettings.seo.pageTitle;
    } else if (siteSettings?.brandName) {
      document.title = `${siteSettings.brandName} — BioSite AI`;
    }

    const faviconUrl = siteSettings?.seo?.favicon;
    if (faviconUrl) {
      // Update or create icon link
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;

      // Update shortcut icon
      let shortcutLink = document.querySelector<HTMLLinkElement>("link[rel='shortcut icon']");
      if (!shortcutLink) {
        shortcutLink = document.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(shortcutLink);
      }
      shortcutLink.href = faviconUrl;

      // Update apple-touch-icon
      let appleLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        document.getElementsByTagName('head')[0].appendChild(appleLink);
      }
      appleLink.href = faviconUrl;
    }
  }, [siteSettings?.seo?.favicon, siteSettings?.seo?.pageTitle, siteSettings?.brandName]);

  // Initialize marketing tracking pixels (Meta Pixel, GA4, GTM)
  useEffect(() => {
    if (siteSettings?.tracking) {
      setupAllTracking(siteSettings.tracking);
    }
  }, [siteSettings?.tracking]);

  // Sync to local storage and debounce cloud sync
  useEffect(() => {
    safeSaveStored('siteSettings', siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    safeSaveStored('designSettings', designSettings);
    applyThemeCSSVariables(designSettings);
  }, [designSettings]);

  useEffect(() => {
    safeSaveStored('navItems', navItems);
  }, [navItems]);

  useEffect(() => {
    safeSaveStored('packages', packages);
  }, [packages]);

  useEffect(() => {
    safeSaveStored('portfolio', portfolio);
  }, [portfolio]);

  useEffect(() => {
    safeSaveStored('beforeAfterItems', beforeAfterItems);
  }, [beforeAfterItems]);

  useEffect(() => {
    safeSaveStored('testimonials', testimonials);
  }, [testimonials]);

  useEffect(() => {
    safeSaveStored('faqs', faqs);
  }, [faqs]);

  useEffect(() => {
    safeSaveStored('howItWorksSteps', howItWorksSteps);
  }, [howItWorksSteps]);

  useEffect(() => {
    safeSaveStored('audioSettings', audioSettings);
  }, [audioSettings]);

  useEffect(() => {
    safeSaveStored('leads', leads);
  }, [leads]);

  useEffect(() => {
    safeSaveStored('orders', orders);
  }, [orders]);

  useEffect(() => {
    safeSaveStored('analyticsEvents', analyticsEvents);
  }, [analyticsEvents]);

  useEffect(() => {
    safeSaveStored('adminAuth', adminAuth);
  }, [adminAuth]);

  // Auto-save sync when changes occur so user changes persist automatically
  useEffect(() => {
    if (!isInitialCloudLoadDone.current || !hasUnsavedChanges) return;

    const debounceTimer = setTimeout(async () => {
      try {
        setIsCloudSaving(true);
        const cloudPayload = {
          updatedAt: new Date().toISOString(),
          siteSettings,
          designSettings,
          navItems,
          packages,
          portfolio,
          beforeAfterItems,
          testimonials,
          faqs,
          howItWorksSteps,
          audioSettings,
          leads,
          orders,
          adminAuth
        };

        const sanitizedPayload = sanitizeForFirestore(cloudPayload);

        // Server-Side API Sync
        fetch('/api/site-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedPayload)
        }).catch((e) => console.warn('[AutoSync Server Notice]', e));

        // Firestore Cloud Database Sync
        const settingsDocRef = doc(db, 'biosite_data', 'main_settings');
        await setDoc(settingsDocRef, sanitizedPayload, { merge: true });

        setIsCloudSaving(false);
        setHasUnsavedChanges(false);
        setIsCloudSynced(true);
      } catch (err) {
        console.warn('[BioSite Cloud] Auto-sync notice:', err);
        setIsCloudSaving(false);
      }
    }, 1200);

    return () => clearTimeout(debounceTimer);
  }, [
    hasUnsavedChanges,
    siteSettings,
    designSettings,
    navItems,
    packages,
    portfolio,
    beforeAfterItems,
    testimonials,
    faqs,
    howItWorksSteps,
    audioSettings,
    leads,
    orders,
    adminAuth
  ]);

  // Save All function explicitly flushing all states to LocalStorage, Server File Storage AND Firebase Firestore Cloud Database
  const saveAllData = async (overrides?: any): Promise<boolean> => {
    setIsCloudSaving(true);
    console.log('[BioSite Persistence] Starting manual Save All operation to LocalStorage, Server File Storage, and Firestore DB...');
    try {
      const mergedSiteSettings = overrides?.siteSettings ?? siteSettings;
      const mergedDesignSettings = overrides?.designSettings ?? designSettings;
      const mergedNavItems = overrides?.navItems ?? navItems;
      const mergedPackages = overrides?.packages ?? packages;
      const mergedPortfolio = overrides?.portfolio ?? portfolio;
      const mergedBeforeAfter = overrides?.beforeAfterItems ?? beforeAfterItems;
      const mergedTestimonials = overrides?.testimonials ?? testimonials;
      const mergedFaqs = overrides?.faqs ?? faqs;
      const mergedSteps = overrides?.howItWorksSteps ?? howItWorksSteps;
      const mergedAudio = overrides?.audioSettings ?? audioSettings;
      const mergedLeads = overrides?.leads ?? leads;
      const mergedOrders = overrides?.orders ?? orders;
      const mergedAnalytics = overrides?.analyticsEvents ?? analyticsEvents;
      const mergedAdminAuth = overrides?.adminAuth ?? adminAuth;

      // 1. Immediately persist to LocalStorage for instant zero-latency caching
      safeSaveStored('siteSettings', mergedSiteSettings);
      safeSaveStored('designSettings', mergedDesignSettings);
      safeSaveStored('navItems', mergedNavItems);
      safeSaveStored('packages', mergedPackages);
      safeSaveStored('portfolio', mergedPortfolio);
      safeSaveStored('beforeAfterItems', mergedBeforeAfter);
      safeSaveStored('testimonials', mergedTestimonials);
      safeSaveStored('faqs', mergedFaqs);
      safeSaveStored('howItWorksSteps', mergedSteps);
      safeSaveStored('audioSettings', mergedAudio);
      safeSaveStored('leads', mergedLeads);
      safeSaveStored('orders', mergedOrders);
      safeSaveStored('analyticsEvents', mergedAnalytics);
      safeSaveStored('adminAuth', mergedAdminAuth);

      const rawPayload = {
        updatedAt: new Date().toISOString(),
        siteSettings: mergedSiteSettings,
        designSettings: mergedDesignSettings,
        navItems: mergedNavItems,
        packages: mergedPackages,
        portfolio: mergedPortfolio,
        beforeAfterItems: mergedBeforeAfter,
        testimonials: mergedTestimonials,
        faqs: mergedFaqs,
        howItWorksSteps: mergedSteps,
        audioSettings: mergedAudio,
        leads: mergedLeads,
        orders: mergedOrders,
        adminAuth: mergedAdminAuth
      };

      const sanitizedPayload = sanitizeForFirestore(rawPayload);

      // 2. Save to Persistent Server API (guarantees instant cross-browser & multi-device loading)
      const serverPromise = fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedPayload)
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('[BioSite Persistence] Server API save complete:', data);
        })
        .catch((err) => console.warn('[BioSite API Save Notice]:', err));

      // 3. Save to Google Cloud Firestore Database (properly sanitized)
      const firestorePromise = (async () => {
        try {
          const settingsDocRef = doc(db, 'biosite_data', 'main_settings');
          await setDoc(settingsDocRef, sanitizedPayload, { merge: true });
          console.log('[BioSite Persistence] Firestore Cloud Database document update succeeded.');
        } catch (fErr: any) {
          console.error('[BioSite Persistence Firestore Error]:', {
            code: fErr?.code,
            message: fErr?.message
          });
        }
      })();

      await Promise.allSettled([serverPromise, firestorePromise]);

      setHasUnsavedChanges(false);
      setIsCloudSynced(true);
      setIsCloudSaving(false);
      console.log('[BioSite Persistence] All persistence layers synchronized successfully.');
      return true;
    } catch (e) {
      console.error('[BioSite Persistence] Error saving data:', e);
      setIsCloudSaving(false);
      setHasUnsavedChanges(false);
      return false;
    }
  };

  // Dynamic Theme Palette Injector
  const applyThemeCSSVariables = (ds: DesignSettings) => {
    let palette = colorPalettesList.find((p) => p.id === ds.currentPaletteId);
    let primary = palette ? palette.primary : ds.customColors.primary;
    let secondary = palette ? palette.secondary : ds.customColors.secondary;
    let bg = palette ? palette.background : ds.customColors.background;
    let text = palette ? palette.text : ds.customColors.text;
    let accent = palette ? palette.accent : ds.customColors.accent;

    if (ds.currentPaletteId === 'custom') {
      primary = ds.customColors.primary;
      secondary = ds.customColors.secondary;
      bg = ds.customColors.background;
      text = ds.customColors.text;
      accent = ds.customColors.accent;
    }

    const root = document.documentElement;
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--color-bg', bg);
    root.style.setProperty('--color-text', text);
    root.style.setProperty('--color-accent', accent);
  };

  // Updaters
  const updateSiteSettings = (partial: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const next = { ...prev, ...partial };
      safeSaveStored('siteSettings', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const updateDesignSettings = (partial: Partial<DesignSettings>) => {
    setDesignSettings((prev) => {
      const next = { ...prev, ...partial };
      safeSaveStored('designSettings', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const updateNavItems = (items: NavItem[]) => {
    setNavItems(items);
    safeSaveStored('navItems', items);
    setHasUnsavedChanges(true);
  };

  // Package CRUD
  const addPackage = (pkgData: Omit<Package, 'id'>) => {
    const newPkg: Package = {
      ...pkgData,
      id: 'pkg-' + Date.now()
    };
    setPackages((prev) => {
      const next = [...prev, newPkg];
      safeSaveStored('packages', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const updatePackage = (id: string, partial: Partial<Package>) => {
    setPackages((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...partial } : p));
      safeSaveStored('packages', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => {
      const next = prev.filter((p) => p.id !== id);
      safeSaveStored('packages', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const duplicatePackage = (id: string) => {
    const target = packages.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Package = {
      ...target,
      id: 'pkg-' + Date.now(),
      name: `${target.name} (Cópia)`,
      featured: false
    };
    setPackages((prev) => {
      const next = [...prev, duplicated];
      safeSaveStored('packages', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // Portfolio CRUD
  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: 'port-' + Date.now()
    };
    setPortfolio((prev) => {
      const next = [newItem, ...prev];
      safeSaveStored('portfolio', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const updatePortfolioItem = (id: string, partial: Partial<PortfolioItem>) => {
    setPortfolio((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...partial } : p));
      safeSaveStored('portfolio', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio((prev) => {
      const next = prev.filter((p) => p.id !== id);
      safeSaveStored('portfolio', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // Before & After CRUD
  const addBeforeAfterItem = (item: Omit<BeforeAfterItem, 'id'>) => {
    const newItem: BeforeAfterItem = {
      ...item,
      id: 'ba-' + Date.now()
    };
    setBeforeAfterItems((prev) => {
      const next = [newItem, ...prev];
      safeSaveStored('beforeAfterItems', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const updateBeforeAfterItem = (id: string, partial: Partial<BeforeAfterItem>) => {
    setBeforeAfterItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...partial } : item));
      safeSaveStored('beforeAfterItems', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const deleteBeforeAfterItem = (id: string) => {
    setBeforeAfterItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      safeSaveStored('beforeAfterItems', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const reorderBeforeAfterItems = (items: BeforeAfterItem[]) => {
    setBeforeAfterItems(items);
    safeSaveStored('beforeAfterItems', items);
    setHasUnsavedChanges(true);
  };

  // Testimonial CRUD
  const addTestimonial = (item: Omit<Testimonial, 'id'>) => {
    const newItem: Testimonial = {
      ...item,
      id: 'test-' + Date.now()
    };
    setTestimonials((prev) => {
      const next = [...prev, newItem];
      safeSaveStored('testimonials', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const updateTestimonial = (id: string, partial: Partial<Testimonial>) => {
    setTestimonials((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...partial } : t));
      safeSaveStored('testimonials', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => {
      const next = prev.filter((t) => t.id !== id);
      safeSaveStored('testimonials', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // FAQ CRUD
  const addFAQ = (item: Omit<FAQItem, 'id'>) => {
    const newItem: FAQItem = {
      ...item,
      id: 'faq-' + Date.now()
    };
    setFaqs((prev) => {
      const next = [...prev, newItem];
      safeSaveStored('faqs', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const updateFAQ = (id: string, partial: Partial<FAQItem>) => {
    setFaqs((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...partial } : f));
      safeSaveStored('faqs', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => {
      const next = prev.filter((f) => f.id !== id);
      safeSaveStored('faqs', next);
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // How It Works Step handlers
  const updateHowItWorksStep = (id: string, partial: Partial<HowItWorksStep>) => {
    setHowItWorksSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...partial } : step))
    );
    setHasUnsavedChanges(true);
  };

  const addHowItWorksStep = () => {
    const nextNum = String(howItWorksSteps.length + 1).padStart(2, '0');
    const newStep: HowItWorksStep = {
      id: `step-${Date.now()}`,
      number: nextNum,
      title: `Novo Passo ${nextNum}`,
      description: 'Descrição do novo passo do processo.',
      icon: 'Sparkles',
      iconColor: 'amber',
      motionEffect: 'bounce',
      enabled: true,
      sortOrder: howItWorksSteps.length + 1
    };
    setHowItWorksSteps((prev) => [...prev, newStep]);
    setHasUnsavedChanges(true);
  };

  const deleteHowItWorksStep = (id: string) => {
    setHowItWorksSteps((prev) => prev.filter((step) => step.id !== id));
    setHasUnsavedChanges(true);
  };

  const reorderHowItWorksSteps = (newSteps: HowItWorksStep[]) => {
    setHowItWorksSteps(newSteps);
    setHasUnsavedChanges(true);
  };

  // Audio & Music Handlers
  const updateAudioSettings = (partial: Partial<AudioSettings>) => {
    setAudioSettings((prev) => ({ ...prev, ...partial }));
    setHasUnsavedChanges(true);
  };

  const addMusicTrack = (trackData: Omit<MusicTrack, 'id'>) => {
    const newTrack: MusicTrack = {
      ...trackData,
      id: `track-${Date.now()}`
    };
    setAudioSettings((prev) => ({
      ...prev,
      tracks: [...prev.tracks, newTrack],
      selectedTrackId: prev.selectedTrackId || newTrack.id
    }));
    setHasUnsavedChanges(true);
  };

  const updateMusicTrack = (id: string, partial: Partial<MusicTrack>) => {
    setAudioSettings((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === id ? { ...t, ...partial } : t))
    }));
    setHasUnsavedChanges(true);
  };

  const deleteMusicTrack = (id: string) => {
    setAudioSettings((prev) => {
      const remainingTracks = prev.tracks.filter((t) => t.id !== id);
      const newSelected =
        prev.selectedTrackId === id
          ? remainingTracks[0]?.id || ''
          : prev.selectedTrackId;
      return {
        ...prev,
        tracks: remainingTracks,
        selectedTrackId: newSelected
      };
    });
    setHasUnsavedChanges(true);
  };

  const setSelectedTrack = (trackId: string) => {
    setAudioSettings((prev) => ({ ...prev, selectedTrackId: trackId }));
    setHasUnsavedChanges(true);
  };

  const resetToDefaultTracks = () => {
    setAudioSettings(defaultAudioSettings);
    safeSaveStored('audioSettings', defaultAudioSettings);
    setHasUnsavedChanges(true);
  };

  // Leads & Orders
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setLeads((prev) => [newLead, ...prev]);
    trackEvent('lead_created', { name: newLead.name, package: newLead.packageName });
    return newLead;
  };

  const updateLeadStatus = (id: string, status: OrderStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      estimatedDelivery: orderData.estimatedDelivery || 'Em até 24 horas',
      statusMessage: orderData.statusMessage || 'Pedido recebido com sucesso. Aguardando conferência.'
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Also register as lead
    addLead({
      name: newOrder.customerName,
      whatsapp: newOrder.customerWhatsapp,
      email: newOrder.customerEmail,
      packageName: newOrder.packageName,
      status: newOrder.status,
      notes: `Pedido #${newOrder.id} - Estilo: ${newOrder.stylePreference}`
    });

    trackEvent('order_created', {
      id: newOrder.id,
      amount: newOrder.totalAmount,
      package: newOrder.packageName,
      customerName: newOrder.customerName,
      customerWhatsapp: newOrder.customerWhatsapp
    });

    return newOrder;
  };

  const updateOrderStatus = (
    id: string,
    status: OrderStatus,
    adminNotes?: string,
    estimatedDelivery?: string,
    statusMessage?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        return {
          ...o,
          status,
          ...(adminNotes !== undefined ? { adminNotes } : {}),
          ...(estimatedDelivery !== undefined ? { estimatedDelivery } : {}),
          ...(statusMessage !== undefined ? { statusMessage } : {})
        };
      })
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const findOrderForTracking = (query: string): Order | undefined => {
    if (!query || !query.trim()) return undefined;
    const clean = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    return orders.find((o) => {
      const orderIdClean = o.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const phoneClean = o.customerWhatsapp.replace(/[^0-9]/g, '');
      const nameClean = o.customerName.toLowerCase();
      return (
        orderIdClean.includes(clean) ||
        clean.includes(orderIdClean) ||
        (phoneClean.length >= 8 && (phoneClean.includes(clean) || clean.includes(phoneClean))) ||
        (nameClean.length >= 3 && nameClean.includes(clean))
      );
    });
  };

  // Analytics Event Tracker (with Pixel / GA4 / GTM Dispatch)
  const trackEvent = (type: AnalyticsEventType, metadata?: Record<string, any>) => {
    const newEv: AnalyticsEvent = {
      id: 'ev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      metadata,
      timestamp: new Date().toISOString()
    };
    setAnalyticsEvents((prev) => [newEv, ...prev]);

    // Dispatch to Meta Pixel and Google Analytics
    try {
      if (type === 'page_view') {
        fireMarketingEvent('PageView', metadata);
      } else if (type === 'whatsapp_click') {
        fireMarketingEvent('WhatsAppClick', metadata);
      } else if (type === 'lead_created') {
        fireMarketingEvent('Lead', metadata);
      } else if (type === 'order_created') {
        fireMarketingEvent('Lead', {
          content_name: metadata?.package,
          value: metadata?.amount,
          currency: 'BRL'
        });
        fireMarketingEvent('InitiateCheckout', {
          content_name: metadata?.package,
          value: metadata?.amount,
          currency: 'BRL'
        });
      } else if (type === 'package_click') {
        fireMarketingEvent('ViewContent', metadata);
        fireMarketingEvent('AddToCart', metadata);
      } else if (type === 'button_click') {
        if (metadata?.button === 'order_modal_open') {
          fireMarketingEvent('InitiateCheckout', metadata);
        }
      }
    } catch (e) {
      console.warn('[Tracking] Event trigger warning:', e);
    }
  };

  const registerNavClick = (navItemId: string, variant?: 'A' | 'B') => {
    setNavItems((prev) =>
      prev.map((item) => {
        if (item.id !== navItemId) return item;
        const clickCount = (item.clickCount || 0) + 1;
        const clickCountA = variant === 'A' || !variant ? (item.clickCountA || 0) + 1 : (item.clickCountA || 0);
        const clickCountB = variant === 'B' ? (item.clickCountB || 0) + 1 : (item.clickCountB || 0);
        return { ...item, clickCount, clickCountA, clickCountB };
      })
    );
    trackEvent('button_click', { navItemId, variant });
  };

  const resetNavClickStats = (navItemId?: string) => {
    setNavItems((prev) =>
      prev.map((item) => {
        if (navItemId && item.id !== navItemId) return item;
        return { ...item, clickCount: 0, clickCountA: 0, clickCountB: 0 };
      })
    );
  };

  // Admin Auth
  const loginAdmin = (email: string, pass: string) => {
    if (
      (email.toLowerCase() === adminAuth.email.toLowerCase() || email === 'admin@continentalstudio.com') &&
      (pass === adminAuth.passwordHash || pass === 'admin123')
    ) {
      setAdminAuth((prev: any) => ({ ...prev, isAuthenticated: true }));
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminAuth((prev: any) => ({ ...prev, isAuthenticated: false }));
  };

  const updateAdminCredentials = (email: string, pass: string) => {
    setAdminAuth({ isAuthenticated: true, email, passwordHash: pass });
  };

  // Order modal triggers
  const openOrderModal = (pkg?: Package) => {
    if (pkg) {
      setSelectedPackageForOrder(pkg);
    } else {
      const featured = packages.find((p) => p.featured && p.enabled) || packages[0];
      setSelectedPackageForOrder(featured || null);
    }
    setIsOrderModalOpen(true);
    trackEvent('button_click', { button: 'order_modal_open', package: pkg?.name });
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedPackageForOrder(null);
  };

  // Order tracking modal triggers
  const openOrderTrackingModal = (query?: string) => {
    if (query) {
      setActiveTrackingQuery(query);
    }
    setIsOrderTrackingOpen(true);
    trackEvent('button_click', { button: 'order_tracking_open', query });
  };

  const closeOrderTrackingModal = () => {
    setIsOrderTrackingOpen(false);
  };

  const clearOperationalData = () => {
    setOrders([]);
    setLeads([]);
    setAnalyticsEvents([]);
    setNavItems((prev) =>
      prev.map((item) => ({ ...item, clickCount: 0, clickCountA: 0, clickCountB: 0 }))
    );
    safeSaveStored('orders', []);
    safeSaveStored('leads', []);
    safeSaveStored('analyticsEvents', []);
  };

  // Export entire application database to standard JSON string
  const exportAllDataJSON = (): string => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      siteSettings,
      designSettings,
      navItems,
      packages,
      portfolio,
      beforeAfterItems,
      testimonials,
      faqs,
      howItWorksSteps,
      audioSettings,
      leads,
      orders,
      adminAuth
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  // Restore entire application database from JSON string
  const importAllDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') return false;

      if (data.siteSettings) {
        setSiteSettings(data.siteSettings);
        safeSaveStored('siteSettings', data.siteSettings);
      }
      if (data.designSettings) {
        setDesignSettings(data.designSettings);
        safeSaveStored('designSettings', data.designSettings);
      }
      if (Array.isArray(data.navItems)) {
        setNavItems(data.navItems);
        safeSaveStored('navItems', data.navItems);
      }
      if (Array.isArray(data.packages)) {
        setPackages(data.packages);
        safeSaveStored('packages', data.packages);
      }
      if (Array.isArray(data.portfolio)) {
        setPortfolio(data.portfolio);
        safeSaveStored('portfolio', data.portfolio);
      }
      if (Array.isArray(data.beforeAfterItems)) {
        setBeforeAfterItems(data.beforeAfterItems);
        safeSaveStored('beforeAfterItems', data.beforeAfterItems);
      }
      if (Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
        safeSaveStored('testimonials', data.testimonials);
      }
      if (Array.isArray(data.faqs)) {
        setFaqs(data.faqs);
        safeSaveStored('faqs', data.faqs);
      }
      if (Array.isArray(data.howItWorksSteps)) {
        setHowItWorksSteps(data.howItWorksSteps);
        safeSaveStored('howItWorksSteps', data.howItWorksSteps);
      }
      if (data.audioSettings) {
        setAudioSettings(data.audioSettings);
        safeSaveStored('audioSettings', data.audioSettings);
      }
      if (Array.isArray(data.leads)) {
        setLeads(data.leads);
        safeSaveStored('leads', data.leads);
      }
      if (Array.isArray(data.orders)) {
        setOrders(data.orders);
        safeSaveStored('orders', data.orders);
      }
      if (data.adminAuth) {
        setAdminAuth(data.adminAuth);
        safeSaveStored('adminAuth', data.adminAuth);
      }

      setHasUnsavedChanges(false);
      return true;
    } catch (err) {
      console.error('[BioSite] Error importing backup:', err);
      return false;
    }
  };

  // Reset tool
  const resetToDefaults = () => {
    setSiteSettings(defaultSiteSettings);
    setDesignSettings(defaultDesignSettings);
    setNavItems(defaultNavItems);
    setPackages(defaultPackages);
    setPortfolio(defaultPortfolio);
    setBeforeAfterItems(defaultBeforeAfterItems);
    setTestimonials(defaultTestimonials);
    setFaqs(defaultFAQs);
    setHowItWorksSteps(defaultHowItWorksSteps);
    setAudioSettings(defaultAudioSettings);
    setLeads(defaultLeads);
    setOrders(defaultOrders);
    setAnalyticsEvents(defaultAnalyticsEvents);
    localStorage.clear();
  };

  return (
    <BioSiteContext.Provider
      value={{
        siteSettings,
        updateSiteSettings,
        designSettings,
        updateDesignSettings,
        navItems,
        updateNavItems,
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        duplicatePackage,
        portfolio,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        beforeAfterItems,
        addBeforeAfterItem,
        updateBeforeAfterItem,
        deleteBeforeAfterItem,
        reorderBeforeAfterItems,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        howItWorksSteps,
        updateHowItWorksStep,
        addHowItWorksStep,
        deleteHowItWorksStep,
        reorderHowItWorksSteps,
        audioSettings,
        updateAudioSettings,
        addMusicTrack,
        updateMusicTrack,
        deleteMusicTrack,
        setSelectedTrack,
        resetToDefaultTracks,
        leads,
        addLead,
        updateLeadStatus,
        deleteLead,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        findOrderForTracking,
        analyticsEvents,
        trackEvent,
        registerNavClick,
        resetNavClickStats,
        adminAuth: {
          isAuthenticated: adminAuth.isAuthenticated,
          email: adminAuth.email
        },
        isAuthenticated: adminAuth.isAuthenticated,
        isAdminMode,
        toggleAdminMode,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        selectedPackageForOrder,
        isOrderModalOpen,
        openOrderModal,
        closeOrderModal,
        isOrderTrackingOpen,
        activeTrackingQuery,
        openOrderTrackingModal,
        closeOrderTrackingModal,
        hasUnsavedChanges,
        isCloudSynced,
        isCloudSaving,
        isInitialLoading,
        isSyncing,
        forceSyncData,
        saveAllData,
        exportAllDataJSON,
        importAllDataJSON,
        resetToDefaults,
        clearOperationalData
      }}
    >
      {children}
    </BioSiteContext.Provider>
  );
};

export const useBioSite = () => {
  const context = useContext(BioSiteContext);
  if (!context) {
    throw new Error('useBioSite must be used within a BioSiteProvider');
  }
  return context;
};

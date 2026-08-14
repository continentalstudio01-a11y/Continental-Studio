import React, { createContext, useContext, useState, useEffect } from 'react';
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
  saveAllData: () => boolean;
  exportAllDataJSON: () => string;
  importAllDataJSON: (jsonString: string) => boolean;
  resetToDefaults: () => void;
  clearOperationalData: () => void;
}

const BioSiteContext = createContext<BioSiteContextType | undefined>(undefined);

const STORAGE_PREFIX = 'continental_studio_v1_';

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

  // Initialize marketing tracking pixels (Meta Pixel, GA4, GTM)
  useEffect(() => {
    if (siteSettings?.tracking) {
      setupAllTracking(siteSettings.tracking);
    }
  }, [siteSettings?.tracking]);

  // Sync to local storage
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

  // Save All function explicitly flushing all states to LocalStorage
  const saveAllData = (): boolean => {
    try {
      safeSaveStored('siteSettings', siteSettings);
      safeSaveStored('designSettings', designSettings);
      safeSaveStored('navItems', navItems);
      safeSaveStored('packages', packages);
      safeSaveStored('portfolio', portfolio);
      safeSaveStored('beforeAfterItems', beforeAfterItems);
      safeSaveStored('testimonials', testimonials);
      safeSaveStored('faqs', faqs);
      safeSaveStored('leads', leads);
      safeSaveStored('orders', orders);
      safeSaveStored('analyticsEvents', analyticsEvents);
      safeSaveStored('adminAuth', adminAuth);
      setHasUnsavedChanges(false);
      return true;
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
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
    setSiteSettings((prev) => ({ ...prev, ...partial }));
  };

  const updateDesignSettings = (partial: Partial<DesignSettings>) => {
    setDesignSettings((prev) => {
      const next = { ...prev, ...partial };
      return next;
    });
  };

  const updateNavItems = (items: NavItem[]) => {
    setNavItems(items);
  };

  // Package CRUD
  const addPackage = (pkgData: Omit<Package, 'id'>) => {
    const newPkg: Package = {
      ...pkgData,
      id: 'pkg-' + Date.now()
    };
    setPackages((prev) => [...prev, newPkg]);
  };

  const updatePackage = (id: string, partial: Partial<Package>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
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
    setPackages((prev) => [...prev, duplicated]);
  };

  // Portfolio CRUD
  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: 'port-' + Date.now()
    };
    setPortfolio((prev) => [newItem, ...prev]);
  };

  const updatePortfolioItem = (id: string, partial: Partial<PortfolioItem>) => {
    setPortfolio((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio((prev) => prev.filter((p) => p.id !== id));
  };

  // Before & After CRUD
  const addBeforeAfterItem = (item: Omit<BeforeAfterItem, 'id'>) => {
    const newItem: BeforeAfterItem = {
      ...item,
      id: 'ba-' + Date.now()
    };
    setBeforeAfterItems((prev) => [newItem, ...prev]);
    setHasUnsavedChanges(true);
  };

  const updateBeforeAfterItem = (id: string, partial: Partial<BeforeAfterItem>) => {
    setBeforeAfterItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)));
    setHasUnsavedChanges(true);
  };

  const deleteBeforeAfterItem = (id: string) => {
    setBeforeAfterItems((prev) => prev.filter((item) => item.id !== id));
    setHasUnsavedChanges(true);
  };

  const reorderBeforeAfterItems = (items: BeforeAfterItem[]) => {
    setBeforeAfterItems(items);
    setHasUnsavedChanges(true);
  };

  // Testimonial CRUD
  const addTestimonial = (item: Omit<Testimonial, 'id'>) => {
    const newItem: Testimonial = {
      ...item,
      id: 'test-' + Date.now()
    };
    setTestimonials((prev) => [...prev, newItem]);
  };

  const updateTestimonial = (id: string, partial: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...partial } : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  // FAQ CRUD
  const addFAQ = (item: Omit<FAQItem, 'id'>) => {
    const newItem: FAQItem = {
      ...item,
      id: 'faq-' + Date.now()
    };
    setFaqs((prev) => [...prev, newItem]);
  };

  const updateFAQ = (id: string, partial: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...partial } : f)));
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
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

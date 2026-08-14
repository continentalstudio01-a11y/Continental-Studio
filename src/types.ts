export interface SiteSettings {
  brandName: string;
  slogan: string;
  description: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  logoUrl: string;
  avatarUrl: string;
  logoEnabled: boolean;
  avatarEnabled: boolean;
  trustBadges: string[];
  contact: {
    whatsapp: string;
    instagram: string;
    tiktok: string;
    facebook: string;
    email: string;
  };
  messageTemplate: string;
  defaultWhatsappMessage: string;
  howItWorksTitle?: string;
  howItWorksSubtitle?: string;
  seo: {
    pageTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    favicon: string;
  };
  tracking?: TrackingConfig;
  urgency?: UrgencySettings;
  supabaseConfig?: {
    url: string;
    anonKey: string;
    connected: boolean;
  };
}

export interface TrackingConfig {
  metaPixelId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  enabled: boolean;
}

export interface UrgencySettings {
  enabled: boolean;
  bannerText: string;
  availableSlots: number;
  totalSlots: number;
  countdownHours: number;
  highlightBadge: string;
  discountPercent?: number;
  showInHeader: boolean;
  showInPackages: boolean;
}

export type VisualStyleId = 'luxury' | 'modern' | 'feminine' | 'minimal' | 'futuristic' | 'premium_ai';
export type ColorPaletteId = 'obsidian_gold' | 'midnight_blue' | 'emerald' | 'rose' | 'violet' | 'monochrome' | 'custom';

export interface VisualStyle {
  id: VisualStyleId;
  name: string;
  description: string;
}

export interface ColorPalette {
  id: ColorPaletteId;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface?: string;
  text: string;
  mutedText?: string;
  accent: string;
}

export interface DesignSettings {
  currentStyleId: VisualStyleId;
  currentPaletteId: ColorPaletteId;
  customColors: {
    primary: string;
    secondary: string;
    background: string;
    surface?: string;
    text: string;
    mutedText?: string;
    accent: string;
  };
  typography?: {
    fontFamily: string;
    headingFont: string;
  };
  uiPreferences?: {
    buttonRadius: string;
    cardRadius: string;
    buttonStyle: 'rounded' | 'pill' | 'square' | 'gradient';
    darkMode: boolean;
    animationsEnabled: boolean;
    glassEffect: boolean;
    customCss?: string;
  };
}

export interface NavItem {
  id: string;
  label: string;
  subtitle?: string;
  target: string;
  targetType?: 'anchor' | 'external' | 'whatsapp';
  openInNewTab?: boolean;
  enabled: boolean;
  order: number;
  icon?: string;
  iconUrl?: string;
  badge?: string;
  badgeColor?: 'amber' | 'emerald' | 'purple' | 'rose' | 'sky';
  featured?: boolean;

  // 1. Agendamento & Programação
  scheduleEnabled?: boolean;
  startDate?: string;
  endDate?: string;
  autoHideExpired?: boolean;

  // 2. Métricas de Cliques em Tempo Real
  clickCount?: number;
  clickCountA?: number;
  clickCountB?: number;

  // 3. Animações de Atenção Especiais
  attentionEffect?: 'none' | 'pulse' | 'shimmer' | 'wiggle' | 'neonBorder' | 'bounce';

  // 4. Botões Restritos / Protegidos por Senha ou Cupom
  restrictedAccess?: boolean;
  requiredPassword?: string;
  restrictedMessage?: string;

  // 5. Regras de Exibição por Dispositivo
  deviceTarget?: 'all' | 'mobile' | 'desktop';

  // 6. Teste A/B de Títulos e Cores
  abTestEnabled?: boolean;
  variantBLabel?: string;
  variantBSubtitle?: string;
  variantBBadge?: string;
  variantBBadgeColor?: 'amber' | 'emerald' | 'purple' | 'rose' | 'sky';
  variantBFeatured?: boolean;
}

export interface Package {
  id: string;
  name: string;
  photos: number;
  price: number;
  currency: string;
  description: string;
  badge?: string;
  featured: boolean;
  enabled: boolean;
  sortOrder: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  gallery?: string[]; // multiple photos for this style/photoshoot
  description?: string;
  tags?: string[];
  beforeImageUrl?: string;
  afterImageUrl?: string;
  enabled: boolean;
  sortOrder: number;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  clientName?: string;
  notes?: string;
  enabled: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  photoUrl: string;
  text: string;
  rating: number;
  enabled: boolean;
  sortOrder: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  enabled: boolean;
  sortOrder: number;
}

export type OrderStatus =
  | 'novo'
  | 'contatado'
  | 'aguardando_pagamento'
  | 'pago'
  | 'em_producao'
  | 'aguardando_entrega'
  | 'entregue'
  | 'cancelado';

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  packageName: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  photoQuantity: number;
  stylePreference: string;
  observations: string;
  customerPhotos: string[];
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  adminNotes?: string;
  estimatedDelivery?: string;
  statusMessage?: string;
  deliveryPhotos?: string[];
}

export type AnalyticsEventType =
  | 'page_view'
  | 'button_click'
  | 'whatsapp_click'
  | 'instagram_click'
  | 'package_click'
  | 'lead_created'
  | 'order_created'
  | 'payment_started'
  | 'payment_completed';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  metadata?: Record<string, any>;
  timestamp: string;
}

export type StepMotionEffect = 'bounce' | 'pulse' | 'float' | 'spin' | 'wiggle' | 'glow';

export interface HowItWorksStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  iconColor?: 'amber' | 'sky' | 'purple' | 'emerald' | 'rose' | 'gold';
  motionEffect?: StepMotionEffect;
  enabled: boolean;
  sortOrder: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  duration?: string;
  audioUrl: string; // base64 or URL
  isAiGenerated?: boolean;
  promptUsed?: string;
  modelUsed?: string;
  enabled: boolean;
}

export interface AudioSettings {
  backgroundMusicEnabled: boolean;
  autoPlayOnInteraction: boolean;
  selectedTrackId: string;
  volume: number; // 0.1 to 1.0
  tracks: MusicTrack[];
}


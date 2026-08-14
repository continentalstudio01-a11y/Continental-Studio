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
  VisualStyle,
  ColorPalette,
  HowItWorksStep,
  AudioSettings,
  MusicTrack
} from '../types';

export const visualStylesList: VisualStyle[] = [
  {
    id: 'premium_ai',
    name: 'Premium + IA',
    description: 'Combinação perfeita de luxo fotográfico e tecnologia futurista.'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Visual sofisticado, elegante e dourado obsidian.'
  },
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Visual moderno com elementos tecnológicos e azuis.'
  },
  {
    id: 'feminine',
    name: 'Premium Feminino',
    description: 'Visual delicado, sofisticado, elegante e tons rosé.'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Visual limpo, alto contraste preto e branco moderno.'
  },
  {
    id: 'futuristic',
    name: 'IA Futurista',
    description: 'Visual tecnológico com estética neon e ultravioleta.'
  }
];

export const colorPalettesList: ColorPalette[] = [
  {
    id: 'obsidian_gold',
    name: 'Obsidian Gold',
    primary: '#C9A45C',
    secondary: '#111114',
    background: '#08080A',
    text: '#F5F2EA',
    accent: '#E0BB70'
  },
  {
    id: 'midnight_blue',
    name: 'Midnight Blue',
    primary: '#4F8CFF',
    secondary: '#101522',
    background: '#070A10',
    text: '#F4F7FF',
    accent: '#70A3FF'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primary: '#42D392',
    secondary: '#101714',
    background: '#070B09',
    text: '#F4FFF9',
    accent: '#64EAAB'
  },
  {
    id: 'rose',
    name: 'Rose Premium',
    primary: '#E98AAF',
    secondary: '#181116',
    background: '#0D080B',
    text: '#FFF5F8',
    accent: '#F2A9C4'
  },
  {
    id: 'violet',
    name: 'Violet Tech',
    primary: '#A98BFA',
    secondary: '#15121E',
    background: '#09070E',
    text: '#F8F5FF',
    accent: '#C4B0FF'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    primary: '#FFFFFF',
    secondary: '#181818',
    background: '#080808',
    text: '#FFFFFF',
    accent: '#D4D4D4'
  }
];

export const defaultSiteSettings: SiteSettings = {
  brandName: 'Continental Studio',
  slogan: 'Transforme suas fotos em ensaios profissionais com Inteligência Artificial.',
  description: 'Ensaios premium criados com IA, de forma rápida, online e personalizada.',
  eyebrow: 'ENSAIOS DIGITAIS PREMIUM',
  heroTitle: 'Transforme suas fotos em ensaios profissionais com Inteligência Artificial.',
  heroDescription: 'Envie fotos simples do seu celular e receba um ensaio fotográfico de altíssimo padrão, sem sair de casa.',
  primaryButtonText: 'Fazer meu ensaio',
  secondaryButtonText: 'Ver portfólio',
  logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  logoEnabled: true,
  avatarEnabled: true,
  trustBadges: [
    '⚡ Entrega em até 24h',
    '⭐ +5.000 Ensaios Criados',
    '🔒 100% Satisfação Garantida',
    '📸 Qualidade 4K Ultra HD'
  ],
  contact: {
    whatsapp: '5588997057623',
    instagram: '@continentalstudio.ia',
    tiktok: '@continentalstudio',
    facebook: 'continentalstudioia',
    email: 'contato@continentalstudio.com'
  },
  messageTemplate: 'Olá! Vim pelo BioSite. Quero o pacote {package_name}. Meu nome é {customer_name}. Meu WhatsApp é {customer_whatsapp}.',
  defaultWhatsappMessage: 'Olá! Vim pelo BioSite e quero fazer um ensaio com IA. Gostaria de conhecer os pacotes disponíveis.',
  howItWorksTitle: 'Como Funciona em 4 Passos',
  howItWorksSubtitle: 'Um processo simples, rápido e 100% online sem sair de casa.',
  seo: {
    pageTitle: 'Continental Studio | Ensaios Fotográficos com IA',
    metaDescription: 'Transforme suas selfies em ensaios de estúdio profissionais com Inteligência Artificial. Rápido, 100% online e ultra realista.',
    ogTitle: 'Continental Studio - Ensaios com IA',
    ogDescription: 'Ensaios fotográficos premium produzidos por Inteligência Artificial.',
    ogImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    favicon: '/favicon.ico'
  },
  tracking: {
    metaPixelId: '',
    googleAnalyticsId: '',
    googleTagManagerId: '',
    enabled: true
  },
  urgency: {
    enabled: true,
    bannerText: 'VAGAS LIMITADAS PARA ESTA SEMANA',
    availableSlots: 4,
    totalSlots: 15,
    countdownHours: 3,
    highlightBadge: 'RESTAM 4 VAGAS COM ENTREGA EM 24H',
    discountPercent: 25,
    showInHeader: true,
    showInPackages: true
  }
};

export const defaultDesignSettings: DesignSettings = {
  currentStyleId: 'premium_ai',
  currentPaletteId: 'obsidian_gold',
  customColors: {
    primary: '#C9A45C',
    secondary: '#111114',
    background: '#08080A',
    text: '#F5F2EA',
    accent: '#E0BB70'
  }
};

export const defaultNavItems: NavItem[] = [
  {
    id: 'order',
    label: 'Fazer Meu Ensaio Agora',
    subtitle: 'Entrega em até 24h • A partir de R$ 37',
    target: '#pacotes',
    targetType: 'anchor',
    enabled: true,
    order: 1,
    icon: 'Camera',
    badge: 'DESTAQUE',
    badgeColor: 'amber',
    featured: true,
    clickCount: 0,
    clickCountA: 0,
    clickCountB: 0,
    attentionEffect: 'shimmer',
    deviceTarget: 'all',
    abTestEnabled: true,
    variantBLabel: 'Garantir Fotos com IA em 24h',
    variantBSubtitle: 'Sessão fotográfica hiper-realista em 4K',
    variantBBadge: 'OFERTA',
    variantBBadgeColor: 'rose',
    variantBFeatured: true
  },
  {
    id: 'packages',
    label: 'Pacotes & Preços',
    subtitle: 'Escolha de 1 a 20 fotos Ultra HD',
    target: '#pacotes',
    targetType: 'anchor',
    enabled: true,
    order: 2,
    icon: 'Package',
    badge: 'MAIS VENDIDOS',
    badgeColor: 'amber',
    clickCount: 0,
    attentionEffect: 'pulse',
    deviceTarget: 'all'
  },
  {
    id: 'portfolio',
    label: 'Portfólio 4K & Antes e Depois',
    subtitle: 'Veja resultados hiper-realistas de clientes',
    target: '#portfolio',
    targetType: 'anchor',
    enabled: true,
    order: 3,
    icon: 'Sparkles',
    badgeColor: 'purple',
    clickCount: 0,
    deviceTarget: 'all'
  },
  {
    id: 'whatsapp',
    label: 'Tirar Dúvidas no WhatsApp',
    subtitle: 'Atendimento individual e personalizado',
    target: '#contato',
    targetType: 'whatsapp',
    enabled: true,
    order: 4,
    icon: 'MessageCircle',
    badgeColor: 'emerald',
    clickCount: 0,
    attentionEffect: 'wiggle',
    deviceTarget: 'all'
  },
  {
    id: 'how_it_works',
    label: 'Como Funciona',
    subtitle: 'Saiba como enviar suas fotos de forma segura em 3 passos',
    target: '#como-funciona',
    targetType: 'anchor',
    enabled: true,
    order: 5,
    icon: 'Info',
    clickCount: 0,
    deviceTarget: 'all'
  },
  {
    id: 'testimonials',
    label: 'Depoimentos de Clientes',
    subtitle: 'Mais de 1.200 ensaios entregues com nota 4.9/5',
    target: '#depoimentos',
    targetType: 'anchor',
    enabled: true,
    order: 6,
    icon: 'Star',
    badge: '4.9/5',
    badgeColor: 'amber',
    clickCount: 0,
    deviceTarget: 'all'
  },
  {
    id: 'faq',
    label: 'Perguntas Frequentes (FAQ)',
    subtitle: 'Prazos de entrega, segurança e direitos autorais',
    target: '#faq',
    targetType: 'anchor',
    enabled: true,
    order: 7,
    icon: 'HelpCircle',
    clickCount: 0,
    deviceTarget: 'all'
  }
];

export const defaultPackages: Package[] = [
  {
    id: 'pkg-1',
    name: 'Essencial',
    photos: 1,
    price: 12.90,
    currency: 'BRL',
    description: 'Uma transformação profissional para sua foto principal.',
    featured: false,
    enabled: true,
    sortOrder: 1
  },
  {
    id: 'pkg-2',
    name: 'Mini Ensaio',
    photos: 3,
    price: 30.00,
    currency: 'BRL',
    description: 'Uma seleção especial de 3 poses para testar seu novo visual.',
    featured: false,
    enabled: true,
    sortOrder: 2
  },
  {
    id: 'pkg-3',
    name: 'Premium',
    photos: 6,
    price: 69.90,
    currency: 'BRL',
    description: 'Mais variedade e estilos incríveis para seu perfil social e profissional.',
    featured: false,
    enabled: true,
    sortOrder: 3
  },
  {
    id: 'pkg-4',
    name: 'Mais Vendido',
    photos: 10,
    price: 97.00,
    currency: 'BRL',
    description: 'O equilíbrio perfeito entre quantidade, variedade de cenários e looks.',
    badge: 'MAIS VENDIDO',
    featured: true,
    enabled: true,
    sortOrder: 4
  },
  {
    id: 'pkg-5',
    name: 'Completo',
    photos: 20,
    price: 139.90,
    currency: 'BRL',
    description: 'Um ensaio executivo/editorial completo com dezenas de ângulos e roupas.',
    featured: false,
    enabled: true,
    sortOrder: 5
  }
];

export const defaultPortfolio: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Ensaio Corporativo Executivo',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Looks com blazer elegante, iluminação profissional de estúdio e poses de liderança para LinkedIn e marcas pessoais.',
    beforeImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    afterImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    enabled: true,
    sortOrder: 1
  },
  {
    id: 'port-2',
    title: 'Aniversário Editorial Luxo',
    category: 'Aniversário',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Vestidos de festa glamourosos, cenários com taças, flores e iluminação dourada cinematográfica.',
    beforeImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    afterImageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    enabled: true,
    sortOrder: 2
  },
  {
    id: 'port-3',
    title: 'Gestante Studio Sunset',
    category: 'Gestante',
    imageUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'A delicadeza e beleza da maternidade capturada em tecidos fluídos e luz suave de pôr do sol.',
    beforeImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    afterImageUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80&w=600',
    enabled: true,
    sortOrder: 3
  },
  {
    id: 'port-4',
    title: 'Retrato Masculino Moderno',
    category: 'Masculino',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Estilo urbano e executivo com ternos modernos, jaquetas de couro e iluminação dramática de alto impacto.',
    beforeImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    afterImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    enabled: true,
    sortOrder: 4
  },
  {
    id: 'port-5',
    title: 'Ensaio de Casal Romântico',
    category: 'Casal',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Cenários paradisíacos, praias ao entardecer e cidades europeias com conexão real entre o casal.',
    beforeImageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600',
    afterImageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600',
    enabled: true,
    sortOrder: 5
  },
  {
    id: 'port-6',
    title: 'Feminino Glamour Estúdio',
    category: 'Feminino',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Looks de moda conceitual, vestidos deslumbrantes e maquiagem perfeita estilo editorial Vogue.',
    beforeImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    afterImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    enabled: true,
    sortOrder: 6
  }
];

export const defaultBeforeAfterItems: BeforeAfterItem[] = [
  {
    id: 'ba-1',
    title: 'Executivo & Autoridade Profissional',
    subtitle: 'De selfie comum do celular para foto de capa e LinkedIn de alto padrão.',
    category: 'Profissional',
    clientName: 'Dra. Mariana Costa',
    beforeImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000',
    afterImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000',
    beforeLabel: 'Selfie Original do Celular',
    afterLabel: 'Transformação IA Ultra HD 4K',
    enabled: true,
    sortOrder: 1
  },
  {
    id: 'ba-2',
    title: 'Aniversário Glamour 30 Anos',
    subtitle: 'Ensaio de gala cinematográfico sem precisar alugar estúdio ou vestido.',
    category: 'Aniversário',
    clientName: 'Fernanda Lima',
    beforeImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000',
    afterImageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1000',
    beforeLabel: 'Foto Simples em Casa',
    afterLabel: 'Ensaio Editorial Luxo IA',
    enabled: true,
    sortOrder: 2
  },
  {
    id: 'ba-3',
    title: 'Gestante Studio Sunset Delicadeza',
    subtitle: 'Eternizando a gestação em cenário dos sonhos com iluminação dourada.',
    category: 'Gestante',
    clientName: 'Camila Santos',
    beforeImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000',
    afterImageUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80&w=1000',
    beforeLabel: 'Foto Básica sem Produção',
    afterLabel: 'Ensaio Materno Mágico IA',
    enabled: true,
    sortOrder: 3
  },
  {
    id: 'ba-4',
    title: 'Retrato Masculino de Sucesso',
    subtitle: 'Postura, elegância e nitidez com traços 100% reais preservados.',
    category: 'Masculino',
    clientName: 'Eduardo Martins',
    beforeImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000',
    afterImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000',
    beforeLabel: 'Selfie no Carro',
    afterLabel: 'Executivo Imponente 4K',
    enabled: true,
    sortOrder: 4
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Carolina Mendes',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    text: 'Fiquei impressionada com a qualidade! Enviei 5 fotos simples e recebi um ensaio digno de capa de revista em menos de 12 horas. Meu LinkedIn mudou completamente.',
    rating: 5,
    enabled: true,
    sortOrder: 1
  },
  {
    id: 'test-2',
    name: 'Lucas Rocha',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    text: 'Incrível! Economizei mais de R$ 1.500 em estúdio fotográfico. As fotos ficaram super naturais, mantendo totalmente meus traços reais.',
    rating: 5,
    enabled: true,
    sortOrder: 2
  },
  {
    id: 'test-3',
    name: 'Amanda Silveira',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    text: 'Comprei o pacote de 10 fotos para meu aniversário de 30 anos. Atendimento impecável pelo WhatsApp e a entrega foi super rápida!',
    rating: 5,
    enabled: true,
    sortOrder: 3
  }
];

export const defaultFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Como funciona o envio das fotos?',
    answer: 'É muito fácil! Após escolher seu pacote, você nos envia de 3 a 10 fotos simples do seu rosto direto pelo nosso formulário ou WhatsApp. As fotos podem ser selfies do celular com boa iluminação.',
    enabled: true,
    sortOrder: 1
  },
  {
    id: 'faq-2',
    question: 'As fotos ficam parecidas comigo?',
    answer: 'Sim, 100%! Nossa Inteligência Artificial é configurada com alta precisão para preservar suas características faciais, tom de pele e expressão, alterando apenas a iluminação, cenário, roupas e maquiagem.',
    enabled: true,
    sortOrder: 2
  },
  {
    id: 'faq-3',
    question: 'Em quanto tempo recebo meu ensaio?',
    answer: 'O prazo padrão de entrega é de até 24 horas úteis. Em geral, muitos clientes recebem em menos de 12 horas direto em alta resolução via link ou WhatsApp.',
    enabled: true,
    sortOrder: 3
  },
  {
    id: 'faq-4',
    question: 'Qual é a resolução das fotos?',
    answer: 'Todas as imagens são entregues em Ultra HD (4K), prontas para impressão, redes sociais, LinkedIn, currículos e sites.',
    enabled: true,
    sortOrder: 4
  },
  {
    id: 'faq-5',
    question: 'Quais os meios de pagamento aceitos?',
    answer: 'Aceitamos Pix com aprovação imediata e cartão de crédito. Todo o processo é seguro e rápido.',
    enabled: true,
    sortOrder: 5
  }
];

export const defaultLeads: Lead[] = [];

export const defaultOrders: Order[] = [];

export const defaultAnalyticsEvents: AnalyticsEvent[] = [];

export const defaultHowItWorksSteps: HowItWorksStep[] = [
  {
    id: 'step-1',
    number: '01',
    title: 'Escolha seu pacote',
    description: 'Selecione a quantidade ideal de fotos para o seu ensaio.',
    icon: 'Package',
    iconColor: 'amber',
    motionEffect: 'bounce',
    enabled: true,
    sortOrder: 1
  },
  {
    id: 'step-2',
    number: '02',
    title: 'Envie suas fotos',
    description: 'Envie de 3 a 10 selfies simples diretamente pelo nosso formulário.',
    icon: 'Upload',
    iconColor: 'sky',
    motionEffect: 'float',
    enabled: true,
    sortOrder: 2
  },
  {
    id: 'step-3',
    number: '03',
    title: 'Criamos seu ensaio',
    description: 'Nossa IA avançada gera seu ensaio de estúdio com hiper-realismo.',
    icon: 'Cpu',
    iconColor: 'purple',
    motionEffect: 'pulse',
    enabled: true,
    sortOrder: 3
  },
  {
    id: 'step-4',
    number: '04',
    title: 'Receba o resultado',
    description: 'Receba suas imagens em 4K no WhatsApp ou por e-mail em até 24h.',
    icon: 'Download',
    iconColor: 'emerald',
    motionEffect: 'wiggle',
    enabled: true,
    sortOrder: 4
  }
];

export const defaultAudioSettings: AudioSettings = {
  backgroundMusicEnabled: true,
  autoPlayOnInteraction: true,
  selectedTrackId: 'track-1',
  volume: 0.5,
  tracks: [
    {
      id: 'track-1',
      title: 'Romantic Piano Arpeggio & Strings',
      genre: 'Piano Clássico & Romântico',
      duration: '3:20',
      audioUrl: 'preset:piano_romance',
      isAiGenerated: false,
      enabled: true
    },
    {
      id: 'track-2',
      title: 'Coffee & Lo-Fi Lounge Beats',
      genre: 'Lo-Fi Chillhop / Estúdio',
      duration: '3:45',
      audioUrl: 'preset:lofi_chill',
      isAiGenerated: false,
      enabled: true
    },
    {
      id: 'track-3',
      title: 'Bossa Nova Sunset Lounge',
      genre: 'Bossa Nova & Violão Jazz',
      duration: '3:10',
      audioUrl: 'preset:bossa_lounge',
      isAiGenerated: false,
      enabled: true
    },
    {
      id: 'track-4',
      title: 'Acoustic Fingerstyle Harmony',
      genre: 'Violão Acústico & Cordas',
      duration: '2:55',
      audioUrl: 'preset:acoustic_guitar',
      isAiGenerated: false,
      enabled: true
    },
    {
      id: 'track-5',
      title: 'Continental Luxury Cinematic Pad',
      genre: 'Ambient / Fotografia de Luxo',
      duration: '4:00',
      audioUrl: 'preset:luxury_ambient',
      isAiGenerated: false,
      enabled: true
    },
    {
      id: 'track-6',
      title: 'Midnight Synthwave Retrowave',
      genre: 'Synthwave / 80s Lounge',
      duration: '3:30',
      audioUrl: 'preset:synthwave_80s',
      isAiGenerated: false,
      enabled: true
    }
  ]
};

export const presetRealRoyaltyFreeTracks: (Omit<MusicTrack, 'id'> & { category?: string })[] = [
  {
    title: 'Erik Satie - Gymnopédie No. 1 (Piano Romântico)',
    genre: 'Piano Clássico de Luxo',
    category: 'Piano',
    duration: '3:05',
    audioUrl: 'preset:piano_romance',
    isAiGenerated: false,
    enabled: true
  },
  {
    title: 'Studio Coffee Shop Lo-Fi Chill Beats',
    genre: 'Lo-Fi Chillhop / Relaxing Beats',
    category: 'Lo-Fi',
    duration: '3:45',
    audioUrl: 'preset:lofi_chill',
    isAiGenerated: false,
    enabled: true
  },
  {
    title: 'Ipanema Sunset - Bossa Nova & Jazz Acústico',
    genre: 'Bossa Nova / Violão & Percussão',
    category: 'Jazz',
    duration: '3:10',
    audioUrl: 'preset:bossa_lounge',
    isAiGenerated: false,
    enabled: true
  },
  {
    title: 'Acoustic Warmth - Violão Fingerstyle Solo',
    genre: 'Violão Acústico Solo',
    category: 'Acústico',
    duration: '2:50',
    audioUrl: 'preset:acoustic_guitar',
    isAiGenerated: false,
    enabled: true
  },
  {
    title: 'Continental Studio High-Fashion Ambient',
    genre: 'Cinematic Ambient & Chimes',
    category: 'Ambient',
    duration: '4:15',
    audioUrl: 'preset:luxury_ambient',
    isAiGenerated: false,
    enabled: true
  },
  {
    title: 'Cyberpunk Neon - Retrowave 80s Lounge',
    genre: 'Synthwave Eletrônico',
    category: 'Eletrônico',
    duration: '3:30',
    audioUrl: 'preset:synthwave_80s',
    isAiGenerated: false,
    enabled: true
  },
  {
    title: 'Serene Waves & Tibetan Singing Bowls Spa',
    genre: 'Sons da Natureza & Meditação',
    category: 'Natureza',
    duration: '5:00',
    audioUrl: 'preset:nature_spa',
    isAiGenerated: false,
    enabled: true
  }
];


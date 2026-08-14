import { TrackingConfig } from '../types';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

/**
 * Initializes Meta Pixel script dynamically in the document head
 */
export function initMetaPixel(pixelId: string) {
  if (typeof window === 'undefined' || !pixelId) return;

  const cleanId = pixelId.trim();
  if (!cleanId) return;

  if (window.fbq) {
    try {
      window.fbq('init', cleanId);
      window.fbq('track', 'PageView');
      console.log(`[Tracking] Meta Pixel (${cleanId}) re-initialized`);
    } catch (e) {
      console.warn('[Tracking] Meta Pixel error:', e);
    }
    return;
  }

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    if (s && s.parentNode) {
      s.parentNode.insertBefore(t, s);
    } else {
      b.head.appendChild(t);
    }
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  try {
    window.fbq('init', cleanId);
    window.fbq('track', 'PageView');
    console.log(`[Tracking] Meta Pixel (${cleanId}) initialized`);
  } catch (err) {
    console.warn('[Tracking] Failed to init Meta Pixel:', err);
  }
}

/**
 * Initializes Google Analytics 4 (gtag.js) dynamically
 */
export function initGoogleAnalytics(gaId: string) {
  if (typeof window === 'undefined' || !gaId) return;
  const cleanId = gaId.trim();
  if (!cleanId) return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
  }

  // Check if script already exists
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${cleanId}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`;
    document.head.appendChild(script);
  }

  try {
    window.gtag('config', cleanId, { send_page_view: true });
    console.log(`[Tracking] Google Analytics (${cleanId}) initialized`);
  } catch (err) {
    console.warn('[Tracking] Failed to configure Google Analytics:', err);
  }
}

/**
 * Initializes Google Tag Manager (GTM)
 */
export function initGoogleTagManager(gtmId: string) {
  if (typeof window === 'undefined' || !gtmId) return;
  const cleanId = gtmId.trim();
  if (!cleanId) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${cleanId}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${cleanId}`;
    document.head.appendChild(script);
    console.log(`[Tracking] Google Tag Manager (${cleanId}) script injected`);
  }
}

/**
 * Configure all tracking pixels from site settings
 */
export function setupAllTracking(config?: TrackingConfig) {
  if (!config) return;

  if (config.metaPixelId && config.metaPixelId.trim()) {
    initMetaPixel(config.metaPixelId.trim());
  }
  if (config.googleAnalyticsId && config.googleAnalyticsId.trim()) {
    initGoogleAnalytics(config.googleAnalyticsId.trim());
  }
  if (config.googleTagManagerId && config.googleTagManagerId.trim()) {
    initGoogleTagManager(config.googleTagManagerId.trim());
  }
}

/**
 * Dispatches standard marketing events to Meta Pixel, GA4, GTM and DataLayer
 */
export function fireMarketingEvent(
  eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Lead' | 'AddToCart' | 'WhatsAppClick' | 'Custom',
  params?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  const eventPayload = params || {};
  const value = eventPayload.value || eventPayload.price || eventPayload.amount || 97.0;
  const currency = eventPayload.currency || 'BRL';
  const contentName = eventPayload.content_name || eventPayload.package || eventPayload.packageName || 'Ensaio Fotográfico IA';
  const contentCategory = eventPayload.content_category || eventPayload.category || 'Ensaio Profissional IA Ultra HD';

  // 1. Meta Pixel (Facebook Ads)
  if (typeof window.fbq === 'function') {
    try {
      if (eventName === 'PageView') {
        window.fbq('track', 'PageView');
      } else if (eventName === 'ViewContent') {
        window.fbq('track', 'ViewContent', {
          content_name: contentName,
          content_category: contentCategory,
          content_type: 'product',
          value: Number(value),
          currency: currency,
          ...eventPayload
        });
      } else if (eventName === 'InitiateCheckout') {
        window.fbq('track', 'InitiateCheckout', {
          content_name: contentName,
          content_category: contentCategory,
          content_type: 'product',
          num_items: eventPayload.num_items || eventPayload.photos || 1,
          value: Number(value),
          currency: currency,
          ...eventPayload
        });
      } else if (eventName === 'Lead') {
        window.fbq('track', 'Lead', {
          content_name: contentName,
          content_category: contentCategory,
          value: Number(value),
          currency: currency,
          ...eventPayload
        });
      } else if (eventName === 'AddToCart') {
        window.fbq('track', 'AddToCart', {
          content_name: contentName,
          content_category: contentCategory,
          value: Number(value),
          currency: currency,
          ...eventPayload
        });
      } else if (eventName === 'WhatsAppClick') {
        // Dispatches both custom WhatsAppClick and standard Contact event for maximum ad campaign compatibility
        window.fbq('trackCustom', 'WhatsAppClick', {
          content_name: contentName,
          value: Number(value),
          currency: currency,
          source: eventPayload.source || 'direct_whatsapp',
          ...eventPayload
        });
        window.fbq('track', 'Contact', {
          content_name: contentName,
          value: Number(value),
          currency: currency,
          source: eventPayload.source || 'direct_whatsapp'
        });
      } else if (eventName === 'Custom') {
        window.fbq('trackCustom', eventPayload.customName || 'CustomInteraction', eventPayload);
      }
    } catch (e) {
      console.warn('[Tracking] Meta Pixel event dispatch error:', e);
    }
  }

  // 2. Google Analytics 4 (gtag.js)
  if (typeof window.gtag === 'function') {
    try {
      if (eventName === 'PageView') {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          ...eventPayload
        });
      } else if (eventName === 'ViewContent') {
        window.gtag('event', 'view_item', {
          currency: currency,
          value: Number(value),
          items: [
            {
              item_name: contentName,
              item_category: contentCategory,
              price: Number(value)
            }
          ],
          ...eventPayload
        });
      } else if (eventName === 'InitiateCheckout') {
        window.gtag('event', 'begin_checkout', {
          currency: currency,
          value: Number(value),
          items: [
            {
              item_name: contentName,
              item_category: contentCategory,
              price: Number(value),
              quantity: 1
            }
          ],
          ...eventPayload
        });
      } else if (eventName === 'Lead') {
        window.gtag('event', 'generate_lead', {
          currency: currency,
          value: Number(value),
          lead_source: 'BioSite Order Form',
          ...eventPayload
        });
      } else if (eventName === 'AddToCart') {
        window.gtag('event', 'add_to_cart', {
          currency: currency,
          value: Number(value),
          items: [
            {
              item_name: contentName,
              price: Number(value)
            }
          ],
          ...eventPayload
        });
      } else if (eventName === 'WhatsAppClick') {
        window.gtag('event', 'contact_whatsapp', {
          source: eventPayload.source || 'direct_button',
          value: Number(value),
          currency: currency,
          ...eventPayload
        });
        window.gtag('event', 'whatsapp_click', {
          source: eventPayload.source || 'direct_button',
          value: Number(value),
          currency: currency,
          ...eventPayload
        });
      } else {
        window.gtag('event', (eventName as string).toLowerCase(), eventPayload);
      }
    } catch (e) {
      console.warn('[Tracking] GA4 event dispatch error:', e);
    }
  }

  // 3. Google Tag Manager (window.dataLayer)
  window.dataLayer = window.dataLayer || [];
  try {
    // Push direct standard GTM event name
    window.dataLayer.push({
      event: eventName, // e.g. 'InitiateCheckout', 'Lead', 'ViewContent', 'WhatsAppClick'
      event_category: 'BioSite Conversion',
      event_label: contentName,
      value: Number(value),
      currency: currency,
      content_name: contentName,
      content_category: contentCategory,
      eventModel: {
        ...eventPayload,
        value: Number(value),
        currency: currency,
        content_name: contentName
      },
      ecommerce: {
        currency: currency,
        value: Number(value),
        items: [
          {
            item_name: contentName,
            item_category: contentCategory,
            price: Number(value),
            quantity: 1
          }
        ]
      },
      timestamp: new Date().toISOString()
    });

    // Also push snake_case event for standard GTM recipes (begin_checkout, generate_lead, view_item, whatsapp_click)
    let altEvent = '';
    if (eventName === 'InitiateCheckout') altEvent = 'begin_checkout';
    else if (eventName === 'Lead') altEvent = 'generate_lead';
    else if (eventName === 'ViewContent') altEvent = 'view_item';
    else if (eventName === 'WhatsAppClick') altEvent = 'whatsapp_click';

    if (altEvent) {
      window.dataLayer.push({
        event: altEvent,
        value: Number(value),
        currency: currency,
        content_name: contentName
      });
    }

    console.log(`[Tracking] Dispatched event "${eventName}" with payload:`, eventPayload);
  } catch (e) {
    console.warn('[Tracking] GTM dataLayer error:', e);
  }
}

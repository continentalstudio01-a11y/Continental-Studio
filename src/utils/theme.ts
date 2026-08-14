import { DesignSettings, ColorPalette, ColorPaletteId } from '../types';
import { colorPalettesList } from '../data/defaultData';

const FONT_GOOGLE_MAP: Record<string, string> = {
  'Playfair Display': 'Playfair+Display:ital,wght@0,400..900;1,400..900',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800',
  'Inter': 'Inter:wght@300;400;500;600;700;800',
  'Cinzel': 'Cinzel:wght@400;600;700;800;900',
  'Outfit': 'Outfit:wght@300;400;500;600;700;800',
  'Montserrat': 'Montserrat:ital,wght@0,300..900;1,300..900',
  'Poppins': 'Poppins:wght@300;400;500;600;700;800',
  'Cormorant Garamond': 'Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400',
  'Syne': 'Syne:wght@400;600;700;800',
  'Manrope': 'Manrope:wght@300;400;500;600;700;800'
};

/**
 * Sanitizes user-defined custom CSS to prevent XSS / malicious injection
 */
export function sanitizeCustomCSS(css: string | undefined): string {
  if (!css || typeof css !== 'string') return '';
  return css
    .replace(/<\/?script[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/expression\s*\([^)]*\)/gi, '')
    .replace(/@import\s*[^;]+;/gi, '')
    .trim();
}

/**
 * Ensures Google Font stylesheet links are dynamically loaded in document head
 */
export function ensureGoogleFontsLoaded(fonts: string[]) {
  if (typeof document === 'undefined') return;

  const validFonts = fonts.filter((f) => Boolean(f && FONT_GOOGLE_MAP[f]));
  if (validFonts.length === 0) return;

  const fontQueries = validFonts.map((f) => `family=${FONT_GOOGLE_MAP[f]}`).join('&');
  const href = `https://fonts.googleapis.com/css2?${fontQueries}&display=swap`;

  let linkEl = document.querySelector<HTMLLinkElement>('link#dynamic-google-fonts');
  if (!linkEl) {
    linkEl = document.createElement('link');
    linkEl.id = 'dynamic-google-fonts';
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);
  }
  if (linkEl.href !== href) {
    linkEl.href = href;
  }
}

/**
 * Applies all design and theme variables to document.documentElement (CSS Variables)
 */
export function applyThemeCSSVariables(design?: DesignSettings | null) {
  if (typeof document === 'undefined' || !design) return;

  const root = document.documentElement;

  // 1. Resolve Active Palette / Custom Colors
  let primary = design.customColors?.primary || '#C9A45C';
  let secondary = design.customColors?.secondary || '#111114';
  let background = design.customColors?.background || '#08080A';
  let surface = design.customColors?.surface || '#121216';
  let text = design.customColors?.text || '#F5F2EA';
  let mutedText = design.customColors?.mutedText || '#9CA3AF';
  let accent = design.customColors?.accent || '#E0BB70';

  if (design.currentPaletteId && design.currentPaletteId !== 'custom') {
    const palette = colorPalettesList.find((p) => p.id === design.currentPaletteId);
    if (palette) {
      primary = palette.primary;
      secondary = palette.secondary;
      background = palette.background;
      surface = palette.surface || palette.secondary;
      text = palette.text;
      mutedText = palette.mutedText || (design.uiPreferences?.darkMode === false ? '#64748B' : '#9CA3AF');
      accent = palette.accent;
    }
  }

  // 2. Set Colors (Both formats for standard CSS & Tailwind compatibility)
  root.style.setProperty('--color-primary', primary);
  root.style.setProperty('--primary-color', primary);

  root.style.setProperty('--color-secondary', secondary);
  root.style.setProperty('--secondary-color', secondary);

  root.style.setProperty('--color-bg', background);
  root.style.setProperty('--background-color', background);

  root.style.setProperty('--color-surface', surface);
  root.style.setProperty('--surface-color', surface);

  root.style.setProperty('--color-text', text);
  root.style.setProperty('--text-color', text);

  root.style.setProperty('--color-muted', mutedText);
  root.style.setProperty('--muted-text-color', mutedText);

  root.style.setProperty('--color-accent', accent);
  root.style.setProperty('--accent-color', accent);

  // 3. Set Typography
  const bodyFont = design.typography?.fontFamily || 'Plus Jakarta Sans';
  const headingFont = design.typography?.headingFont || 'Playfair Display';

  root.style.setProperty('--font-sans', `'${bodyFont}', system-ui, -apple-system, sans-serif`);
  root.style.setProperty('--font-family', `'${bodyFont}', system-ui, -apple-system, sans-serif`);

  root.style.setProperty('--font-serif', `'${headingFont}', Georgia, Cambria, serif`);
  root.style.setProperty('--heading-font', `'${headingFont}', Georgia, Cambria, serif`);

  ensureGoogleFontsLoaded([bodyFont, headingFont]);

  // 4. Set Radii & UI Preferences
  const buttonRadius = design.uiPreferences?.buttonRadius || '12px';
  const cardRadius = design.uiPreferences?.cardRadius || '16px';
  const glassEffect = design.uiPreferences?.glassEffect ?? false;
  const animationsEnabled = design.uiPreferences?.animationsEnabled ?? true;

  root.style.setProperty('--button-radius', buttonRadius);
  root.style.setProperty('--card-radius', cardRadius);

  if (glassEffect) {
    root.style.setProperty('--glass-blur', '16px');
    root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.04)');
    root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
  } else {
    root.style.setProperty('--glass-blur', '0px');
    root.style.setProperty('--glass-bg', surface);
    root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
  }

  // 5. Animations Mode
  if (!animationsEnabled) {
    root.classList.add('no-animations');
  } else {
    root.classList.remove('no-animations');
  }

  // 6. Custom CSS Injection
  const cleanCSS = sanitizeCustomCSS(design.uiPreferences?.customCss);
  let styleEl = document.getElementById('continental-custom-css');
  if (cleanCSS) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'continental-custom-css';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = cleanCSS;
  } else if (styleEl) {
    styleEl.textContent = '';
  }
}

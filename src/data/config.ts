// Central place for everything you need to activate monetization.
// Each value falls back to a Vite env var (set these in Vercel → Settings → Env),
// so you can go live without touching code. Replace the placeholders and deploy.

const env = import.meta.env;

export const SITE = {
  name: 'Stillpoint',
  tagline: 'Your deep work sanctuary',
  description:
    'Stillpoint turns focus into a ritual. Step into a living world, start a timer, and let generative soundscapes carry your deepest work.',
  url: (env.VITE_SITE_URL as string) || 'https://stillpoint-livid.vercel.app',
  handle: '@stillpointapp',
};

// Monetization links. Set the matching VITE_ env var in production, or edit here.
export const LINKS = {
  // Stripe Payment Link or Gumroad product for Stillpoint Pro (lifetime).
  pro: (env.VITE_PRO_CHECKOUT as string) || 'https://stillpoint.gumroad.com/l/pro',
  // Optional second product: a downloadable 4K wallpaper + sound pack.
  pack: (env.VITE_PACK_CHECKOUT as string) || 'https://stillpoint.gumroad.com/l/atlas',
  // Tip jar (Buy Me a Coffee / Ko-fi).
  tip: (env.VITE_TIP_URL as string) || 'https://www.buymeacoffee.com/stillpoint',
  // Newsletter form action (Formspree / ConvertKit form endpoint). Empty = inline thank-you only.
  newsletter: (env.VITE_NEWSLETTER_ACTION as string) || '',
  twitter: (env.VITE_TWITTER_URL as string) || 'https://twitter.com/stillpointapp',
  github: (env.VITE_GITHUB_URL as string) || 'https://github.com/Rahul777111/stillpoint',
};

// Price shown on the Pro card. Purely presentational — the real price lives in Stripe/Gumroad.
export const PRICING = {
  proPrice: '$29',
  proCadence: 'once, yours for life',
  packPrice: '$12',
};

export interface GearItem {
  name: string;
  blurb: string;
  category: string;
  price: string;
  // Replace # with your affiliate link (Amazon Associates, Impact, etc.).
  href: string;
}

// Curated "focus gear". Swap the hrefs for your affiliate links to earn on every click-through.
export const GEAR: GearItem[] = [
  {
    name: 'Sony WH-1000XM5',
    blurb: 'The quietest noise-cancelling over-ears. Silence on demand for deep sessions.',
    category: 'Headphones',
    price: '$$$',
    href: (env.VITE_AFF_HEADPHONES as string) || '#',
  },
  {
    name: 'Loop Quiet 2 Earplugs',
    blurb: 'Take the edge off an open office without going fully silent. Pairs with any world.',
    category: 'Earplugs',
    price: '$',
    href: (env.VITE_AFF_EARPLUGS as string) || '#',
  },
  {
    name: 'BenQ ScreenBar Halo',
    blurb: 'A monitor light bar that kills glare and keeps you working past dusk.',
    category: 'Lighting',
    price: '$$',
    href: (env.VITE_AFF_LIGHT as string) || '#',
  },
  {
    name: 'Grovemade Desk Shelf',
    blurb: 'Lift your screen, clear the clutter. A calmer desk makes for a calmer mind.',
    category: 'Desk',
    price: '$$$',
    href: (env.VITE_AFF_DESK as string) || '#',
  },
];

export const TIMER_PRESETS = [
  { label: 'Quick', minutes: 15 },
  { label: 'Focus', minutes: 25 },
  { label: 'Deep', minutes: 50 },
  { label: 'Flow', minutes: 90 },
];

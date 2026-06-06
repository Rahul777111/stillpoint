# Switching on revenue

Stillpoint ships with every money path already built into the UI. Nothing here requires touching
React. You either set environment variables in Vercel (recommended) or edit
[`src/data/config.ts`](src/data/config.ts) directly.

Estimated time to first earning setup: about 20 minutes.

---

## 1. Stillpoint Pro (your main product)

This is the biggest lever. Pro unlocks the three premium worlds and is sold as a one-time payment.

**Option A — Gumroad (fastest, no website rules):**
1. Create a Gumroad account.
2. New product, "Stillpoint Pro", set your price (the UI suggests $29). Upload the four premium scene wallpapers from `public/worlds/` (tokyo, fireside, desert) as the deliverable plus a thank-you note.
3. Copy the product URL.
4. Set `VITE_PRO_CHECKOUT` to that URL.

**Option B — Stripe Payment Link:**
1. Stripe Dashboard, Payment Links, new link, one-time price.
2. Copy the link, set `VITE_PRO_CHECKOUT`.

After someone pays, they click "Already bought it? Restore access" in the app, which unlocks Pro
on their device. This is client-side (good enough for a low-price digital good). To make it
tamper-proof later, gate the unlock behind a license-key check (Gumroad and Stripe both issue keys
via API).

## 2. The downloadable pack (second product)

A smaller impulse buy: a 4K wallpaper + extended soundscape pack. Create a second Gumroad product
and set `VITE_PACK_CHECKOUT`.

## 3. Tip jar

1. Create a [Buy Me a Coffee](https://buymeacoffee.com) or [Ko-fi](https://ko-fi.com) page.
2. Set `VITE_TIP_URL` to your page URL. It powers the "Leave a tip" button in the Support section.

## 4. Affiliate gear

The "The desk we focus from" section earns a commission on click-throughs.
1. Join [Amazon Associates](https://affiliate-program.amazon.com) (or Impact, ShareASale, etc.).
2. Generate affiliate links for each product and set:
   - `VITE_AFF_HEADPHONES`
   - `VITE_AFF_EARPLUGS`
   - `VITE_AFF_LIGHT`
   - `VITE_AFF_DESK`
3. Swap the product names in `config.ts` for whatever you actually recommend.

## 5. Newsletter (owned audience = future revenue)

1. Create a form in ConvertKit, Buttondown, or [Formspree](https://formspree.io).
2. Set `VITE_NEWSLETTER_ACTION` to the form's POST endpoint. The Support form will submit to it.
3. If left empty, the form just shows a friendly confirmation (no list).

## 6. Analytics (so you know what is working)

Add one line to `index.html` before `</head>`:
- [Plausible](https://plausible.io): `<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>`
- or [Vercel Web Analytics](https://vercel.com/analytics): enable it in the Vercel dashboard, no code needed.

---

## Setting environment variables in Vercel

Project → Settings → Environment Variables. Add each `VITE_...` key, then redeploy.

| Variable | What it is |
|---|---|
| `VITE_SITE_URL` | Your live URL (used in share cards and meta) |
| `VITE_PRO_CHECKOUT` | Pro product link |
| `VITE_PACK_CHECKOUT` | Pack product link |
| `VITE_TIP_URL` | Tip jar link |
| `VITE_NEWSLETTER_ACTION` | Newsletter form POST URL |
| `VITE_TWITTER_URL` | Your X/Twitter profile |
| `VITE_GITHUB_URL` | This repo |
| `VITE_AFF_HEADPHONES` / `_EARPLUGS` / `_LIGHT` / `_DESK` | Affiliate links |

Anything you do not set falls back to a sensible placeholder, so the site never looks broken.

## A realistic revenue picture

- **Day one** is about traffic, not big sales. The honest earners on day one are tips and affiliate clicks.
- **Pro sales** follow traffic. A focus tool converts best with knowledge-worker audiences (devs, students, writers).
- The **share card** is what makes traffic compound. Every finished session is a potential post.

Keep the free tier genuinely good. The free worlds are the marketing.

# KeshCut Studio website

One page, static site. No dependencies, no framework. Build output is plain HTML, CSS and JS.

## Folder structure
```
public/                      everything that gets published
  index.html                 the page (all text, legal modals, structured data)
  site-config.js             settings: WhatsApp number, Google Analytics ID (empty), scissors paper shading
  css/styles.css  js/app.js  js/consent.js
  images/general/            logo, hero background, social preview image
  images/gallery/            studio photos and the cards in the hero
  videos/                    three class clips for the Academy section (class-clip-1.mp4 to 3.mp4)
  images/services/           empty, not used by the page yet
  images/products/           empty, not used by the page yet
  robots.txt  sitemap.xml  favicon.ico  apple-touch-icon.png  _headers
scripts/build.mjs            checks images, fills in your domain, writes dist/
scripts/serve.mjs            local preview server
netlify.toml  vercel.json    hosting settings
```

## Images
Replace a file by saving a new image under the same name. The build stops with a clear message if any referenced image is missing.

| File | Used for | Size |
|---|---|---|
| general/hero-background.jpg | hero background (shown in black and white) | portrait, about 1080x1920 |
| general/og-image.jpg | link preview on WhatsApp, Facebook, Google | 1200x630 |
| general/logo.png, logo-192.png, logo-48.png | logo and tab icon | square, transparent corners |
| gallery/studio-interior-stone-partition.jpg, studio-interior-mask-wall.jpg, studio-interior-night.jpg | "The studio" section | portrait 3:4 |
| gallery/haircut-keshcut-cape.jpg, keshcut-studio-graphic.jpg, outdoor-haircut-training.jpg, instructor-fade-demo.jpg, back-view-fade-haircut.jpg, kids-fade-haircut.jpg, razor-practice-class.jpg | moving cards in the hero | portrait 3:4, about 600x800 |

Videos: save a replacement under the same name (H.264 mp4, portrait, about 540x960, under 4 MB each). Each clip also has a poster image in `images/gallery/class-clip-N-poster.jpg`. A clip downloads only when a visitor taps it.

## Run locally
Needs Node 18 or newer. `npm start` builds and opens a preview at http://localhost:8080. To look at `public/` directly, run `node scripts/serve.mjs public`.

## Deploy (Netlify, Vercel or Cloudflare Pages)
1. Upload the project (Git repository or drag the folder). Settings are already in `netlify.toml` and `vercel.json`. On Cloudflare Pages use build command `node scripts/build.mjs` and output folder `dist`.
2. The build reads your site address from the host automatically. After you connect your own domain, add one setting named `SITE_URL` (for example `https://www.yourdomain.com`) so the canonical link, sitemap and social previews use it, then redeploy.
3. Use HTTPS (the hosts do this for you).

## Not configured yet (the site works without all of these)
- **Google Analytics 4**: leave `gaMeasurementId` empty in `public/site-config.js`. While empty there is no banner, no cookies and no Google script. Later create a GA4 property, copy the ID (G-XXXXXXXXXX), paste it there or set `GA_MEASUREMENT_ID` in the host settings, and redeploy. The banner then appears and analytics loads only after consent. Events: page_view, whatsapp_booking_click, whatsapp_question_click, view_service, view_product (add `data-product="Name"` to a product element when products exist). No names, phone numbers, messages or booking details are ever sent.
- **Search Console**: after deploying, add the domain in Search Console, verify it (DNS record is simplest), submit `/sitemap.xml`, then inspect the home page and request indexing.
- **Google Business Profile**: create it yourself, then add its link to `sameAs` in the JSON-LD in `public/index.html`. Keep name, address and phone identical to the profile. Opening hours are left out until you supply them.
- **Bing**: add the site in Bing Webmaster Tools and submit the sitemap. The file `<key>.txt` in `public/` is an optional IndexNow key.

## Edit later
Policy text is in `public/index.html` inside `<dialog id="legal">`. Review it with a qualified person before relying on it.

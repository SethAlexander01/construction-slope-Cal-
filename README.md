# Excavation Slope Calculator

A free, frontend-only web calculator that helps contractors, foremen, and safety professionals
estimate safe horizontal setback distances for trench and excavation work — based on
OSHA 29 CFR 1926 Subpart P guidelines.

Built with plain HTML, CSS, and JavaScript. No frameworks, no build tools, no backend.

---

## Features

- Instant calculations for Type A, Type B, Type C soil, and Stable Rock
- Feet / Meters unit toggle with automatic value conversion
- Configurable trench bottom width (default 2 ft)
- Optional trench length input for footprint area estimate
- Depth warnings at 5 ft (protective system required) and 20 ft (engineer required)
- Copy to clipboard and Print results buttons
- FAQ accordion with structured FAQ schema markup (good for Google rich results)
- Soil type explanation section
- Google AdSense placeholder blocks in 3 locations
- Mobile responsive — works on phones, tablets, and desktops
- SEO meta tags, Open Graph tags, and JSON-LD structured data

---

## How to Run Locally

No build tools or npm install needed. Just open the file:

**Option 1 — Open directly in browser:**
```
Double-click index.html
```

**Option 2 — Use a local development server (recommended, avoids browser restrictions):**

```bash
# Using Node.js / npx
npx serve .

# Using Python 3
python -m http.server 8000

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

---

## How to Deploy

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. From the project folder, run: `vercel`
3. Follow the prompts — your site goes live in seconds.

### Netlify (Drag & Drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your entire project folder onto the page.
3. Done — you get a live URL immediately.

### Netlify (GitHub connected)
1. Push the project to a GitHub repository.
2. Connect the repo in the Netlify dashboard.
3. Set build command to blank, publish directory to `/`.

### GitHub Pages
1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set Source to **Deploy from a branch**, select `main`, folder `/ (root)`.
4. Your site will be live at `https://yourusername.github.io/repo-name/`

---

## Where to Add Google AdSense

There are **3 ad placeholder blocks** in `index.html`. Search for `AD PLACEHOLDER` to find them.

### Step 1 — Add the AdSense script to `<head>`:
```html
<!-- Paste inside <head> in index.html -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

### Step 2 — Replace each placeholder div with your AdSense `<ins>` tag:

**Before (placeholder):**
```html
<div class="ad-placeholder" aria-hidden="true">
  <span>Ad Space</span>
</div>
```

**After (real ad):**
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

### Ad Locations:
| # | Location | Best Format |
|---|----------|------------|
| 1 | Below hero, above calculator | Leaderboard (728×90) or Responsive |
| 2 | Inside results box, below safety note | Rectangle (300×250) or Responsive |
| 3 | Before FAQ section | Responsive |

---

## Project Structure

```
construction-cal/
├── index.html     — Main page: SEO tags, layout, calculator, FAQ, content
├── styles.css     — All styles: responsive layout, card design, print styles
├── script.js      — Calculator logic, unit conversion, copy/print/FAQ behavior
└── README.md      — This file
```

---

## SEO Notes

### Update Before Deploying
In `index.html`, replace placeholder values with your real domain:
- `<link rel="canonical" href="https://yoursite.com/" />`
- `<meta property="og:url" content="https://yoursite.com/" />`
- `<meta property="og:image" content="https://yoursite.com/og-image.jpg" />`
- Footer copyright year and brand name

### What's Already In Place
- Semantic HTML5 (`<main>`, `<section>`, `<aside>`, `<nav>`, `aria-*` attributes)
- Title tag and meta description
- Open Graph and Twitter Card tags
- Canonical URL
- JSON-LD structured data: `FAQPage` and `WebApplication` schema
- H1 with primary keywords, H2s throughout for hierarchy
- Keyword-rich intro paragraph targeting:
  - excavation slope calculator
  - trench slope calculator
  - OSHA excavation slope calculator
  - Type C soil slope calculator
- FAQ section (also feeds rich results in Google search)

---

## Future SEO Page Ideas

Expand this site into a full construction calculator hub. Each page targets a distinct keyword cluster:

| URL | Target Keywords | Notes |
|-----|----------------|-------|
| `/concrete-calculator/` | concrete calculator, concrete volume, concrete yardage | High search volume |
| `/ladder-angle-calculator/` | OSHA ladder angle, 4:1 ladder ratio, safe ladder setup | Safety angle |
| `/osha-noise-exposure-calculator/` | OSHA noise dose, permissible noise exposure, TWA noise | Compliance tool |
| `/scaffold-load-calculator/` | scaffold load capacity, scaffold weight limit, SWL | High contractor use |
| `/trench-shoring-calculator/` | trench shoring, hydraulic shore, timber shoring | Companion to this page |
| `/fall-protection-calculator/` | OSHA fall protection, anchor load, fall distance | High-value safety |
| `/excavation-volume-calculator/` | excavation volume, cut and fill, earthwork estimate | Companion to this page |
| `/forklift-capacity-calculator/` | forklift load center, rated capacity, derating | Industrial / warehouse |

---

## Disclaimer

This calculator is for planning and educational estimates only. It does not replace
OSHA regulations (29 CFR 1926 Subpart P), a qualified competent person, local codes,
or professional engineering judgment.

---

## License

MIT — free to use, modify, and deploy.

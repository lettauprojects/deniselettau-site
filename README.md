# Denise A. Lettau, P.A. — Marketing Website

A six-page marketing site for Denise A. Lettau, P.A., a boutique estate & trust planning firm
("Life & Legacy Planning") in Coral Springs, FL, serving Florida and Washington, D.C.

Built as a plain static site — no build step, no framework. Deploys to Vercel (or any static host) as-is.

## Pages
| File | Page |
| --- | --- |
| `index.html` | Homepage |
| `approach.html` | About / Approach |
| `planning.html` | Services / Planning |
| `insights.html` | Blog / Insights (pulls live from Substack) |
| `client-stories.html` | Client Stories / Testimonials |
| `contact.html` | Contact + consultation form |

## Assets
- `assets/site.css` — shared base styles, responsive nav, hover states, scroll-reveal
- `assets/site.js` — mobile menu toggle, contact-form handling, Substack feed loader
- `images/` — photography and portraits

## Notes
- **Insights feed**: `insights.html` ships a hardcoded post list and attempts to replace it at load
  with the live Substack feed (`https://denisealettaupa.substack.com/feed`) via a CORS relay
  (rss2json → allorigins). If both fail, the hardcoded list remains. For production robustness,
  fetch the feed server-side (build step / serverless function) and cache.
- **Contact form**: currently shows an inline confirmation only — no backend is wired. To receive
  submissions, point the form at a service (Formspree, Vercel serverless + Resend, etc.).

## Local preview
Any static server works, e.g.:
```
npx serve .
```

## Deploy
Vercel auto-detects this as a static site (no framework, no build command). Push to the connected
GitHub repo and Vercel builds on each commit.

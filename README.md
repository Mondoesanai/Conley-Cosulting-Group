# Conley Consulting Group

Interactive marketing site for Conley Consulting Group — revenue consulting for
founder-led professional services firms. Rebuild of conleyconsultgrp.com.

- Static site: plain HTML + one shared `assets/style.css` and `assets/app.js`
- 8 pages: home, about, services, blog, contact, **book** (3-step wizard + demo
  scheduler), **quiz** (revenue assessment), **article** (`?p=<slug>`)
- Monochrome white / grey / near-black · Sora + Inter · photo-forward

## Run locally
```
node serve.mjs      # http://localhost:3130
```
or double-click `START SERVER.bat`.

## Client TODO before launch
- `book.html` — swap the `.mockcal` demo scheduler for a real Calendly / GoHighLevel embed
- Wire the newsletter (blog) + book form to a real backend
- Replace `assets/hero.jpg` with a client photo if desired
- Privacy Policy / Terms links

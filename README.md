# siddhantyadav.com.np

Portfolio of **Siddhant Yadav (SiddTheCoder)**, Founder, Director and CTO of [Softmato Technology](https://softmato.com), Kathmandu, Nepal.

Live: https://www.siddhantyadav.com.np

## What's here

Plain static site for GitHub Pages. No build step.

| File | Purpose |
| --- | --- |
| `index.html` | The whole page, plus SEO meta and JSON-LD (Person, WebSite, Organization, ProfilePage, FAQPage) |
| `style.css` | All styles |
| `app.js` | Sound toggle, count-up numbers, draggable photo pile |
| `hero.js` | Three.js shader on the hero photo (grain + mouse ripple). Loads lazily; the `<img>` is the fallback |
| `fonts/` | Self-hosted Barlow Condensed, Open Sauce One, Shadows Into Light |
| `img/` | Photos, hero band, project screenshots (`work/`), photo pile (`pile/`) |
| `sfx/` | Sound effects generated with ElevenLabs |
| `llms.txt` | Plain-text facts for AI answer engines |

## Run locally

```bash
python -m http.server 8093
```

Then open http://localhost:8093.

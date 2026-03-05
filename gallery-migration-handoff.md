# Nutrition Hub — Gallery Migration Handoff (Stage 3)

## What Changed
Combined `nutri-guide` and `nutri-explorer` into a single Gallery-based project with routing.

## Files Added
- `src/data/views.js` — App registry (2 entries: NutriGuide, Nutrient Explorer)
- `src/components/AppCard.jsx` — Gallery card with heartPulse and search icons
- `src/components/BackToGallery.jsx` — Shared "← All Apps" back navigation
- `src/pages/Gallery.jsx` — Landing page with 2-card grid
- `src/pages/guide/NutriGuide.jsx` — NutriGuide app (moved from App.jsx, back nav added to both screens)
- `src/pages/explorer/NutrientExplorer.jsx` — Nutrient Explorer app (moved from nutri-explorer, back nav added)

## Files Modified
- `src/App.jsx` — Replaced with Routes (3 routes: `/`, `/guide/nutri-guide`, `/explorer/nutrient-explorer`)
- `src/main.jsx` — Added BrowserRouter wrapping
- `package.json` — Added `react-router-dom: ^6.28.0`

## Route Map
| Path | Component | Source |
|------|-----------|--------|
| `/` | Gallery | New |
| `/guide/nutri-guide` | NutriGuide | Former `nutri-guide/src/App.jsx` |
| `/explorer/nutrient-explorer` | NutrientExplorer | Former `nutri-explorer/src/App.jsx` |

## New Dependency
```
react-router-dom: ^6.28.0
```

## Build & Deploy
```bash
npm install
npm run build
```

## SPA Routing
Add to `staticwebapp.config.json`:
```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

## Notes
- NutriGuide has two screens (select → guidance) — back nav added to both headers
- Nutrient Explorer back nav positioned above the "Nutrient Explorer" title
- Both apps are fully self-contained monolithic components (all data embedded)
- No env vars or API keys needed for either app
- The old `nutri-explorer/` project can be archived after confirming deployment

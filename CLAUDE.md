# NutriGuide — Claude Code Context

## Workflow Rules
- Never ask for permission or confirmation. Proceed with all fixes, builds, and iterations automatically.
- After successful build, push to git.

## Project Overview
Nutrition Hub — Gallery-based app combining NutriGuide (condition-based nutrition guidance for adults 50+) and Nutrient Explorer (32-nutrient interactive database). Uses react-router-dom for routing between Gallery landing page and two app pages.

## Architecture
Gallery architecture with routing:
- `src/App.jsx` — Router with 3 routes
- `src/pages/Gallery.jsx` — Landing page with 2 app cards
- `src/pages/guide/NutriGuide.jsx` — Condition-based guidance (560 lines, 15 conditions, 14 nutrients, AI chat)
- `src/pages/explorer/NutrientExplorer.jsx` — Nutrient database (307 lines, 32 nutrients, food filters)
- `src/data/views.js` — App registry
- `src/components/` — AppCard, BackToGallery shared components

### Key Data Structures
- `catLabels` — 8 condition categories: Metabolic Risk, Cardiometabolic, Pulmonary, Cross-Cutting, Musculoskeletal, Sensory, Sleep, Mental Health
- `conditions` array — 15 conditions, each with: id, name, cat, icon (emoji), pathways, connection (2 paragraphs explaining mechanism)
- `nutrients` array (NutriGuide) — 14 nutrients with RDA, food sources, supplement guidance
- `nutrients` array (Explorer) — 32 nutrients across Vitamins, Minerals, Macronutrients, Phytonutrients

### Routes
- `/` — Gallery
- `/guide/nutri-guide` — NutriGuide
- `/explorer/nutrient-explorer` — Nutrient Explorer

## Tech Stack
- React 18 + Vite + Tailwind + react-router-dom
- No external data libraries — all data inline
- BrowserRouter in main.jsx

## Design Standards
- Muted, desaturated colors
- Font weights 400-600 only
- Emoji-based condition icons
- Clean card layout with category color coding
- Content-first — medical information presented accessibly, not with clinical jargon
- Consistent spacing and padding

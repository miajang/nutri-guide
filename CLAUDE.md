# NutriGuide — Claude Code Context

## Project Overview
Condition-based nutrition guidance app for adults 50+. Explores 15 health conditions, their biological connections to aging, shared metabolic pathways, and nutrition strategies. Focused on the obesity-to-cardiovascular disease prevention cascade.

## Architecture
Single-file React app — all logic in `src/App.jsx` (560 lines).

### Key Data Structures
- `catLabels` — 8 condition categories: Metabolic Risk, Cardiometabolic, Pulmonary, Cross-Cutting, Musculoskeletal, Sensory, Sleep, Mental Health
- `conditions` array — 15 conditions, each with: id, name, cat, icon (emoji), pathways, connection (2 paragraphs explaining mechanism)
- Conditions include: Obesity, Prediabetes, Type 2 Diabetes, High Blood Pressure, High Cholesterol, Metabolic Syndrome, Heart Disease, COPD, Chronic Kidney Disease, Chronic Inflammation, Osteoporosis, Arthritis, Age-Related Eye Disease, Sleep Disorders, Depression/Anxiety

### Features
- Category-based condition browsing
- Condition detail views with biological pathway explanations
- Shared pathway visualization across conditions
- Connection narratives (what it is + aging mechanisms)
- Nutrition strategy recommendations

## Tech Stack
- React + Vite + Tailwind
- No external libraries — all data inline
- No routing — single-page with state-driven views

## Design Standards
- Muted, desaturated colors
- Font weights 400-600 only
- Emoji-based condition icons
- Clean card layout with category color coding
- Content-first — medical information presented accessibly, not with clinical jargon
- Consistent spacing and padding

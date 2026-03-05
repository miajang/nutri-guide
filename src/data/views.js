/**
 * App registry for Nutrition Hub.
 * Each entry represents one app accessible from the Gallery.
 */
export const APPS = [
  {
    id: 'nutri-guide',
    title: 'NutriGuide',
    description: 'Condition-centered nutrition guidance for adults 50+ managing chronic conditions with AI-powered insights.',
    category: 'guide',
    path: '/guide/nutri-guide',
    accent: '#4a9e8e',
    icon: 'heartPulse',
  },
  {
    id: 'nutrient-explorer',
    title: 'Nutrient Explorer',
    description: 'Interactive database of 32 nutrients across vitamins, minerals, macronutrients, and phytonutrients.',
    category: 'explorer',
    path: '/explorer/nutrient-explorer',
    accent: '#6a8eaa',
    icon: 'search',
  },
];

/**
 * Returns all apps.
 */
export function getApps() {
  return APPS;
}

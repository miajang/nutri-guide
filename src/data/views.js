/**
 * App registry for Nutrition Hub.
 * Each entry represents one app accessible from the Gallery.
 */
export const APPS = [
  {
    id: 'nutri-guide',
    title: 'NutriGuide',
    description: 'AI-powered personalized nutrition guidance for adults 50+ managing chronic conditions. Explore how your conditions are connected, key nutrients, food strategies, and get advice tailored to your health profile.',
    category: 'guide',
    path: '/guide/nutri-guide',
    accent: '#2E7AD9',
    icon: 'heartPulse',
  },
  {
    id: 'nutrient-explorer',
    title: 'Nutrient Explorer',
    description: 'Interactive nutrient database for adults. Browse essential nutrients with food sources, daily targets by age and sex, and an AI expert for personalized insights.',
    category: 'explorer',
    path: '/explorer/nutrient-explorer',
    accent: '#2E7AD9',
    icon: 'search',
  },
];

/**
 * Returns all apps.
 */
export function getApps() {
  return APPS;
}

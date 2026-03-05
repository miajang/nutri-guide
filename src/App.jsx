import { Routes, Route } from 'react-router-dom';
import Gallery from './pages/Gallery';
import NutriGuide from './pages/guide/NutriGuide';
import NutrientExplorer from './pages/explorer/NutrientExplorer';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Gallery />} />
      <Route path="/guide/nutri-guide" element={<NutriGuide />} />
      <Route path="/explorer/nutrient-explorer" element={<NutrientExplorer />} />
    </Routes>
  );
}

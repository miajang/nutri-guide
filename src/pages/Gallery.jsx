import { getApps } from '../data/views';
import AppCard from '../components/AppCard';

export default function Gallery() {
  const apps = getApps();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-medium text-gray-800 tracking-tight">
            Nutrition Hub
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Evidence-based nutrition guidance and nutrient exploration
          </p>
        </div>

        {/* App grid */}
        {apps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-sm text-gray-400">
            No apps available yet.
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "24px 0 8px", fontSize: ".78rem", color: "#999" }}>Health & Wellness Innovations</div>
      </div>
    </div>
  );
}

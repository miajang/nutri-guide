import { useNavigate } from 'react-router-dom';

const ICONS = {
  heartPulse: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
      <polyline points="3.5 12 8.5 12 10 10 12 14 14 10 15.5 12 20.5 12" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  default: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
};

export default function AppCard({ app }) {
  const navigate = useNavigate();
  const icon = ICONS[app.icon] || ICONS.default;

  return (
    <button
      onClick={() => navigate(app.path)}
      className="group text-left bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-5 flex flex-col gap-3"
    >
      <div
        className="w-9 h-9 rounded-md flex items-center justify-center transition-colors"
        style={{ backgroundColor: `${app.accent}12`, color: app.accent }}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
          {app.title}
        </div>
        <div className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
          {app.description}
        </div>
      </div>
      <div className="mt-auto pt-2">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${app.accent}10`, color: app.accent }}
        >
          {app.category}
        </span>
      </div>
    </button>
  );
}

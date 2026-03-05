import { useNavigate } from 'react-router-dom';

export default function BackToGallery() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/')}
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-4"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      All Apps
    </button>
  );
}

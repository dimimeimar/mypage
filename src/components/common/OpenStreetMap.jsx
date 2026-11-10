import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { mapData } from '../../data/map_data';

const OpenStreetMap = ({ className = '' }) => {
  const { language } = useTranslation();
  const t = mapData[language] || mapData.el;
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mapInstance = null;

    const createMap = () => {
      try {
        // Wait for both Leaflet and DOM
        if (!window.L) {
          setTimeout(createMap, 100);
          return;
        }

        const container = document.getElementById('leaflet-map');
        if (!container) {
          setTimeout(createMap, 100);
          return;
        }

        // Create map
        const L = window.L;
        const map = L.map('leaflet-map').setView([40.6401, 22.9444], 11);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Service areas data (δίγλωσσο, από map_data.js)
        const areas = t.areas;

        // Add markers
        areas.forEach(area => {
          const marker = L.marker(area.coords).addTo(map);

          marker.bindPopup(`
            <div style="padding: 10px; min-width: 200px;">
              <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">
                ${area.name}
              </h4>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">
                ${area.details}
              </p>
              <div style="background: var(--color-teal-pale); padding: 6px 8px; border-radius: 4px; border-left: 3px solid var(--color-teal);">
                <span style="color: var(--color-teal); font-weight: bold; font-size: 13px;">
                  📍 ${area.description}
                </span>
              </div>
            </div>
          `);
        });

        mapInstance = map;

        // Finalize
        setTimeout(() => {
          map.invalidateSize();
          setIsLoaded(true);
        }, 200);

      } catch (err) {
        console.error('Map error:', err);
        setError(err.message);
      }
    };

    const timer = setTimeout(createMap, 500);

    return () => {
      clearTimeout(timer);
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [t]);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-red-600">{t.errorPrefix} {error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="text-white p-4" style={{ backgroundColor: 'var(--color-teal)' }}>
        <h3 className="text-lg font-semibold flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          {t.headerTitle}
        </h3>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {isLoaded ? t.headerSubtitleLoaded : t.headerSubtitleLoading}
        </p>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          id="leaflet-map"
          className="w-full"
          style={{ height: '400px' }}
        />

        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{ borderColor: 'var(--color-teal)' }}></div>
              <p className="text-gray-600">{t.headerSubtitleLoading}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default OpenStreetMap;
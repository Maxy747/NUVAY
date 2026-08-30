'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapMarker } from '@/lib/ai/types';
import { MapBottomSheet } from './MapBottomSheet';
import 'leaflet/dist/leaflet.css';

interface TripMapProps {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  waypoints?: string[];
}

export const TripMap: React.FC<TripMapProps> = ({ center, zoom, markers }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Dynamically load leaflet
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(container, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Dark CartoDB tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const createOrangeMarkerIcon = (day?: number) => {
        return L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              background: linear-gradient(135deg, #F59E0B, #D97706);
              color: #07090E;
              font-weight: 800;
              font-size: 11px;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid #FFFFFF;
              box-shadow: 0 0 15px rgba(245, 158, 11, 0.8);
              cursor: pointer;
            ">
              ${day ? `D${day}` : '★'}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
      };

      const polylineCoords: [number, number][] = [];

      markers.forEach((m) => {
        if (m.lat && m.lng) {
          polylineCoords.push([m.lat, m.lng]);

          const marker = L.marker([m.lat, m.lng], {
            icon: createOrangeMarkerIcon(m.day),
          }).addTo(map);

          marker.on('click', () => {
            setSelectedMarker(m);
          });

          const popupContent = `
            <div style="font-family: inherit; padding: 4px;">
              <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #F59E0B; margin-bottom: 2px;">
                ${m.type} ${m.day ? `• Day ${m.day}` : ''}
              </div>
              <div style="font-weight: 700; font-size: 14px; color: #F8FAFC; margin-bottom: 4px;">
                ${m.title}
              </div>
              <div style="font-size: 12px; color: #94A3B8; line-height: 1.3;">
                ${m.description}
              </div>
            </div>
          `;
          marker.bindPopup(popupContent);
        }
      });

      if (polylineCoords.length > 1) {
        L.polyline(polylineCoords, {
          color: '#F59E0B',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '8, 8',
        }).addTo(map);

        map.fitBounds(L.latLngBounds(polylineCoords), { padding: [40, 40] });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers]);

  return (
    <div className="relative w-full h-[40vh] min-h-[300px] sm:h-[450px] rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Dynamic Bottom Sheet for Mobile Selected Marker */}
      <MapBottomSheet selectedMarker={selectedMarker} onClose={() => setSelectedMarker(null)} />

      <div className="absolute top-3 left-3 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
        <span>OpenStreetMap • {markers.length} Waypoints</span>
      </div>
    </div>
  );
};

export default TripMap;

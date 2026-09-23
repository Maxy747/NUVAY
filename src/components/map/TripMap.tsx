'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapMarker } from '@/lib/ai/types';
import { MapBottomSheet } from './MapBottomSheet';
import 'leaflet/dist/leaflet.css';
import { createMarkerPopup, markerDay } from '@/lib/map/popup';

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

    let cancelled = false;
    // Dynamically load leaflet
    import('leaflet').then((L) => {
      if (cancelled) return;
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
              ${markerDay(day) ? `D${markerDay(day)}` : '★'}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
      };

      const polylineCoords: [number, number][] = [];

      markers.forEach((m) => {
        if (Number.isFinite(m.lat) && Number.isFinite(m.lng) && Math.abs(m.lat) <= 90 && Math.abs(m.lng) <= 180) {
          polylineCoords.push([m.lat, m.lng]);

          const marker = L.marker([m.lat, m.lng], {
            icon: createOrangeMarkerIcon(m.day),
          }).addTo(map);

          marker.on('click', () => {
            setSelectedMarker(m);
          });

          const popupContent = createMarkerPopup(document, m);
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
      cancelled = true;
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

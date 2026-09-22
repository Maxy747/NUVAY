import type { MapMarker } from '../ai/types';

export function markerDay(day: unknown): number | undefined {
  return typeof day === 'number' && Number.isInteger(day) && day > 0 && day <= 30 ? day : undefined;
}

// Leaflet treats strings as HTML. textContent keeps trip text inert.
export function createMarkerPopup(document: Document, marker: MapMarker): HTMLElement {
  const root = document.createElement('div');
  root.style.cssText = 'font-family: inherit; padding: 4px;';
  const day = markerDay(marker.day);
  const rows = [
    { text: `${marker.type}${day ? ` • Day ${day}` : ''}`, style: 'font-size: 10px; font-weight: 800; text-transform: uppercase; color: #F59E0B; margin-bottom: 2px;' },
    { text: marker.title, style: 'font-weight: 700; font-size: 14px; color: #F8FAFC; margin-bottom: 4px;' },
    { text: marker.description, style: 'font-size: 12px; color: #94A3B8; line-height: 1.3;' },
  ];
  for (const row of rows) {
    const element = document.createElement('div');
    element.style.cssText = row.style;
    element.textContent = row.text;
    root.appendChild(element);
  }
  return root;
}

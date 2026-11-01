import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Venue } from '../../types';

interface VenueMapProps {
  venues: Venue[];
  activeEventVenueId?: string;
  onSelectVenue?: (venue: Venue) => void;
}

export const VenueMap: React.FC<VenueMapProps> = ({ venues, activeEventVenueId, onSelectVenue }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on India
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
      }).setView([21.7679, 78.8718], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const bounds = L.latLngBounds([]);

    venues.forEach((v) => {
      if (v.coordinates?.lat && v.coordinates?.lng) {
        const isSelected = activeEventVenueId === v.id;

        const customIcon = L.divIcon({
          className: 'custom-venue-pin',
          html: `<div style="
            background: ${isSelected ? '#34A853' : '#4285F4'};
            color: white;
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid white;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
          ">
            <span>📍 ${v.name.length > 20 ? v.name.slice(0, 18) + '...' : v.name}</span>
          </div>`,
          iconSize: [130, 32],
          iconAnchor: [65, 16],
        });

        const marker = L.marker([v.coordinates.lat, v.coordinates.lng], { icon: customIcon }).addTo(map);

        const popupContainer = document.createElement('div');
        popupContainer.style.padding = '4px';
        popupContainer.style.fontFamily = 'Inter, sans-serif';
        popupContainer.innerHTML = `
          <div style="font-weight: bold; font-size: 13px; color: #0F172A; margin-bottom: 2px;">${v.name}</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 4px;">📍 ${v.location}, ${v.city}</div>
          <div style="font-size: 11px; font-weight: bold; color: #4285F4; margin-bottom: 2px;">${v.priceRange}</div>
          <div style="font-size: 11px; color: #334155;">Capacity: ${v.capacity} Guests | ⭐ ${v.rating}/5</div>
        `;

        if (onSelectVenue) {
          const btn = document.createElement('button');
          btn.innerText = isSelected ? 'Current Active Venue' : 'Assign to Active Event';
          btn.style.marginTop = '8px';
          btn.style.width = '100%';
          btn.style.padding = '6px';
          btn.style.background = isSelected ? '#34A853' : '#4285F4';
          btn.style.color = 'white';
          btn.style.border = 'none';
          btn.style.borderRadius = '8px';
          btn.style.fontWeight = 'bold';
          btn.style.fontSize = '11px';
          btn.style.cursor = 'pointer';
          btn.onclick = () => onSelectVenue(v);
          popupContainer.appendChild(btn);
        }

        marker.bindPopup(popupContainer);
        bounds.extend([v.coordinates.lat, v.coordinates.lng]);
      }
    });

    if (venues.some((v) => v.coordinates?.lat) && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

  }, [venues, activeEventVenueId]);

  return (
    <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md relative z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

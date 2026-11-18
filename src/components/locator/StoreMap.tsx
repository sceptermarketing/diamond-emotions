'use client';

import { useEffect, useRef } from 'react';
import type { LayerGroup, Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import type { LocatedStore } from './StoreLocator';
import s from './StoreLocator.module.css';

type Props = {
  stores: LocatedStore[];
  origin: { lat: number; lng: number } | null;
  selected: number | null;
  onSelect: (id: number) => void;
};

const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
export const directionsUrl = (st: LocatedStore) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${st.name}, ${st.street}, ${st.city}, ${st.state} ${st.zip}`)}`;

/** Leaflet map (OpenStreetMap tiles) with clustered store markers; loaded in the browser only */
export default function StoreMap({ stores, origin, selected, onSelect }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const originLayer = useRef<LayerGroup | null>(null);
  const markers = useRef(new Map<number, Marker>());
  const L = useRef<typeof import('leaflet') | null>(null);
  const select = useRef(onSelect);
  select.current = onSelect;

  // create the map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const leaflet = (await import('leaflet')).default;
      await import('leaflet.markercluster');
      if (cancelled || !el.current || map.current) return;
      L.current = leaflet;
      const m = leaflet.map(el.current, { scrollWheelZoom: false, zoomControl: true }).setView([42.3, -86], 5);
      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(m);
      // scroll-zoom only after the map is clicked, so the page scrolls past it normally
      m.on('click', () => m.scrollWheelZoom.enable());
      m.on('mouseout', () => m.scrollWheelZoom.disable());
      map.current = m;
      originLayer.current = leaflet.layerGroup().addTo(m);
      // remount markers now that the map exists
      window.dispatchEvent(new Event('de-map-ready'));
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      layer.current = null;
      markers.current.clear();
    };
  }, []);

  // (re)draw markers for the current results and fit them in view
  useEffect(() => {
    const draw = () => {
      const m = map.current;
      const leaflet = L.current;
      if (!m || !leaflet) return;
      layer.current?.remove();
      markers.current.clear();
      const group = leaflet.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 45,
        iconCreateFunction: (c) =>
          leaflet.divIcon({
            html: `<span>${c.getChildCount()}</span>`,
            className: s.cluster,
            iconSize: leaflet.point(40, 40),
          }),
      });
      const icon = leaflet.divIcon({ className: s.pin, html: '<span></span>', iconSize: [28, 36], iconAnchor: [14, 34], popupAnchor: [0, -30] });
      for (const st of stores) {
        const mk = leaflet.marker([st.lat, st.lng], { icon, title: st.name, alt: st.name });
        mk.bindPopup(
          `<strong>${esc(st.name)}</strong><br>${esc(st.street)}<br>${esc(st.city)}, ${esc(st.state)} ${esc(st.zip)}` +
            (st.phone ? `<br><a href="tel:${esc(st.phone.replace(/[^\d+]/g, ''))}">${esc(st.phone)}</a>` : '') +
            `<br><a href="${esc(directionsUrl(st))}" target="_blank" rel="noopener noreferrer">Get directions ↗</a>`,
        );
        mk.on('click', () => select.current(st.id));
        markers.current.set(st.id, mk);
        group.addLayer(mk);
      }
      group.addTo(m);
      layer.current = group;

      originLayer.current?.clearLayers();
      if (origin) {
        leaflet
          .circleMarker([origin.lat, origin.lng], { radius: 8, color: '#fff', weight: 3, fillColor: '#e11d48', fillOpacity: 1 })
          .bindTooltip('Your search')
          .addTo(originLayer.current!);
      }
      const points: [number, number][] = stores.map((st) => [st.lat, st.lng]);
      if (origin) points.push([origin.lat, origin.lng]);
      if (points.length === 1) m.setView(points[0], 11);
      else if (points.length) m.fitBounds(leaflet.latLngBounds(points), { padding: [36, 36], maxZoom: 11 });
    };
    draw();
    window.addEventListener('de-map-ready', draw);
    return () => window.removeEventListener('de-map-ready', draw);
  }, [stores, origin]);

  // a store chosen in the list: zoom to it and open its popup
  useEffect(() => {
    if (selected == null || !layer.current) return;
    const mk = markers.current.get(selected);
    if (!mk) return;
    (layer.current as unknown as { zoomToShowLayer: (m: Marker, cb: () => void) => void }).zoomToShowLayer(mk, () =>
      mk.openPopup(),
    );
  }, [selected]);

  return <div ref={el} className={s.map} role="region" aria-label="Map of Diamond Emotions jewelers" />;
}

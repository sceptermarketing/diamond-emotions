'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import s from './StoreLocator.module.css';

export type Store = {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website: string;
  hours: string;
};
export type LocatedStore = Store & { miles?: number };

// the map needs the browser (Leaflet), so it loads on the client only
const StoreMap = dynamic(() => import('./StoreMap'), {
  ssr: false,
  loading: () => <div className={`${s.map} ${s.mapLoading}`}>Loading map…</div>,
});

// the old store locator's distance choices (miles), plus "any"
const RADII = [20, 40, 60, 80, 100] as const;
const SORTS = [
  { id: 'nearest', label: 'Nearest' },
  { id: 'name', label: 'Name' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
] as const;
type SortId = (typeof SORTS)[number]['id'];
const PAGE = 30;

const STATE_NAMES: Record<string, string> = {
  AR: 'Arkansas', CA: 'California', CT: 'Connecticut', FL: 'Florida', IA: 'Iowa', IL: 'Illinois', IN: 'Indiana',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', MS: 'Mississippi',
  NC: 'North Carolina', ND: 'North Dakota', NE: 'Nebraska', NJ: 'New Jersey', OH: 'Ohio', PA: 'Pennsylvania',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', WA: 'Washington', WI: 'Wisconsin', ON: 'Ontario',
};

// great-circle distance in miles
function miles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 3958.8;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const centre = (list: Store[]) => ({
  lat: list.reduce((n, x) => n + x.lat, 0) / list.length,
  lng: list.reduce((n, x) => n + x.lng, 0) / list.length,
});

type Origin = { lat: number; lng: number; label: string };

/** Find a Jeweler: search a ZIP, city or state (or use your location), filter by distance and state, list + map */
export default function StoreLocator({ stores }: { stores: Store[] }) {
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [radius, setRadius] = useState<number | 'any'>(100);
  const [sort, setSort] = useState<SortId>('name');
  const [state, setState] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [shown, setShown] = useState(PAGE);
  const [status, setStatus] = useState<{ kind: 'info' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const states = useMemo(() => [...new Set(stores.map((x) => x.state))].sort(), [stores]);

  const results = useMemo(() => {
    let list: LocatedStore[] = stores.map((x) => (origin ? { ...x, miles: miles(origin, x) } : x));
    if (origin && radius !== 'any') list = list.filter((x) => x.miles! <= radius);
    if (state) list = list.filter((x) => x.state === state);
    const by = (k: 'name' | 'city' | 'state') => (a: LocatedStore, b: LocatedStore) =>
      a[k].localeCompare(b[k]) || a.name.localeCompare(b.name);
    const order = sort === 'nearest' && origin ? (a: LocatedStore, b: LocatedStore) => a.miles! - b.miles! : by(sort === 'nearest' ? 'name' : sort);
    return [...list].sort(order);
  }, [stores, origin, radius, state, sort]);

  const go = (o: Origin) => {
    setOrigin(o);
    setSort('nearest');
    setSelected(null);
    setShown(PAGE);
  };

  // ZIP, "City", "City, ST" or a state: matched against the jewelers first, otherwise looked up on OpenStreetMap
  async function search(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setStatus(null);
    if (!q) return clearSearch();
    const lower = q.toLowerCase();
    const [cityPart, statePart] = lower.split(',').map((x) => x.trim());
    const local = stores.filter((x) => x.zip === q);
    const byCity = stores.filter(
      (x) => x.city.toLowerCase() === cityPart && (!statePart || x.state.toLowerCase() === statePart || STATE_NAMES[x.state]?.toLowerCase() === statePart),
    );
    const byState = stores.filter((x) => x.state.toLowerCase() === lower || STATE_NAMES[x.state]?.toLowerCase() === lower);
    const hit = local.length ? local : byCity.length ? byCity : byState;
    if (hit.length) {
      if (hit === byState) {
        setState(hit[0].state);
        setOrigin(null);
        setSort('name');
        setShown(PAGE);
        setStatus({ kind: 'info', text: `Showing jewelers in ${STATE_NAMES[hit[0].state] ?? hit[0].state}.` });
        return;
      }
      return go({ ...centre(hit), label: q });
    }
    setBusy(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us,ca&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const data: { lat: string; lon: string; display_name: string }[] = await res.json();
      if (!data.length) {
        setStatus({ kind: 'error', text: `We couldn’t find “${q}”. Try a ZIP code or “City, State”.` });
        return;
      }
      setState('');
      go({ lat: +data[0].lat, lng: +data[0].lon, label: q });
    } catch {
      setStatus({ kind: 'error', text: 'Location search is unavailable right now. Try a ZIP code or city of a jeweler, or choose a state.' });
    } finally {
      setBusy(false);
    }
  }

  function locateMe() {
    if (!('geolocation' in navigator)) {
      setStatus({ kind: 'error', text: 'Your browser can’t share its location. Search by ZIP code or city instead.' });
      return;
    }
    setBusy(true);
    setStatus(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setBusy(false);
        setQuery('');
        setState('');
        go({ lat: p.coords.latitude, lng: p.coords.longitude, label: 'your location' });
      },
      () => {
        setBusy(false);
        setStatus({ kind: 'error', text: 'We couldn’t get your location. Search by ZIP code or city instead.' });
      },
      { timeout: 10000, maximumAge: 600000 },
    );
  }

  function clearSearch() {
    setQuery('');
    setOrigin(null);
    setState('');
    setSort('name');
    setStatus(null);
    setSelected(null);
    setShown(PAGE);
  }

  // a marker clicked on the map: make sure its card is listed and scrolled into view
  useEffect(() => {
    if (selected == null) return;
    const i = results.findIndex((x) => x.id === selected);
    if (i >= shown) setShown(i + 1);
    requestAnimationFrame(() =>
      document.getElementById(`store-${selected}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }),
    );
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const summary = origin
    ? `${results.length} ${results.length === 1 ? 'jeweler' : 'jewelers'} ${radius === 'any' ? 'by distance from' : `within ${radius} miles of`} ${origin.label}`
    : `${results.length} ${results.length === 1 ? 'jeweler' : 'jewelers'}${state ? ` in ${STATE_NAMES[state] ?? state}` : ''}`;

  return (
    <div className={s.locator}>
      <form className={s.controls} onSubmit={search} role="search" aria-label="Find a jeweler">
        <div className={`${s.field} ${s.searchField}`}>
          <label htmlFor="loc-q" className={s.label}>
            Search Location
          </label>
          <div className={s.searchRow}>
            <input
              id="loc-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ZIP code, city or state"
              autoComplete="postal-code"
            />
            <button type="button" className={s.locate} onClick={locateMe} aria-label="Use my location" title="Use my location" disabled={busy}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <circle cx="9" cy="9" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="9" cy="9" r="1.8" fill="currentColor" />
                <path d="M9 1v3M9 14v3M1 9h3M14 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button type="submit" className={`btn btn-sm btn-dark ${s.go}`} disabled={busy}>
              {busy ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>
        <div className={s.field}>
          <label htmlFor="loc-radius" className={s.label}>
            Distance
          </label>
          <select
            id="loc-radius"
            value={String(radius)}
            onChange={(e) => {
              setRadius(e.target.value === 'any' ? 'any' : +e.target.value);
              setShown(PAGE);
            }}
          >
            {RADII.map((r) => (
              <option key={r} value={r}>
                {r} Miles
              </option>
            ))}
            <option value="any">Any distance</option>
          </select>
        </div>
        <div className={s.field}>
          <label htmlFor="loc-state" className={s.label}>
            State
          </label>
          <select
            id="loc-state"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setShown(PAGE);
            }}
          >
            <option value="">All states</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {STATE_NAMES[st] ?? st}
              </option>
            ))}
          </select>
        </div>
        <div className={s.field}>
          <label htmlFor="loc-sort" className={s.label}>
            Sort By
          </label>
          <select id="loc-sort" value={sort} onChange={(e) => setSort(e.target.value as SortId)}>
            {SORTS.map((o) => (
              <option key={o.id} value={o.id} disabled={o.id === 'nearest' && !origin}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className={s.summaryRow}>
        <p className={s.summary} aria-live="polite">
          {summary}
        </p>
        {(origin || state || query) && (
          <button type="button" className={s.clear} onClick={clearSearch}>
            Clear search
          </button>
        )}
      </div>
      {status && <p className={status.kind === 'error' ? s.error : s.info}>{status.text}</p>}

      <div className={s.body}>
        <div className={s.listWrap}>
          {results.length === 0 ? (
            <div className={s.empty}>
              <p>No jewelers within {radius} miles of {origin?.label ?? 'this location'}.</p>
              {radius !== 'any' && (
                <button type="button" className={s.clear} onClick={() => setRadius('any')}>
                  Show the nearest jewelers at any distance
                </button>
              )}
            </div>
          ) : (
            <ul className={s.list}>
              {results.slice(0, shown).map((st) => (
                <li key={st.id}>
                  <article
                    id={`store-${st.id}`}
                    className={`${s.card} ${selected === st.id ? s.cardOn : ''}`}
                    onClick={() => setSelected(st.id)}
                  >
                    <div className={s.cardHead}>
                      <h3 className={s.name}>{st.name}</h3>
                      {st.miles != null && <span className={s.dist}>{st.miles < 10 ? st.miles.toFixed(1) : Math.round(st.miles)} mi</span>}
                    </div>
                    <address className={s.address}>
                      {st.street}
                      <br />
                      {st.city}, {st.state} {st.zip}
                    </address>
                    <ul className={s.contact}>
                      {st.phone && (
                        <li>
                          <a href={`tel:${st.phone.replace(/[^\d+]/g, '')}`} onClick={(e) => e.stopPropagation()}>
                            {st.phone}
                          </a>
                        </li>
                      )}
                      {st.email && (
                        <li>
                          <a href={`mailto:${st.email}`} onClick={(e) => e.stopPropagation()}>
                            {st.email}
                          </a>
                        </li>
                      )}
                      {st.hours && <li className={s.hours}>Hours: {st.hours}</li>}
                    </ul>
                    <div className={s.actions}>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${st.name}, ${st.street}, ${st.city}, ${st.state} ${st.zip}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.action}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Directions ↗
                      </a>
                      {st.website && (
                        <a href={st.website} target="_blank" rel="noopener noreferrer" className={s.action} onClick={(e) => e.stopPropagation()}>
                          Website ↗
                        </a>
                      )}
                      <button
                        type="button"
                        className={s.action}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(st.id);
                        }}
                      >
                        View on map
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
          {shown < results.length && (
            <button type="button" className={s.more} onClick={() => setShown((n) => n + PAGE)}>
              Show more jewelers ({results.length - shown} more)
            </button>
          )}
        </div>
        <div className={s.mapWrap}>
          <StoreMap stores={results} origin={origin} selected={selected} onSelect={setSelected} />
        </div>
      </div>
    </div>
  );
}

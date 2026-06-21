// geocodeLocation.js
//
// Turns a worker's saved { latitude, longitude } into a short, human-readable
// place name (city / town / area), using OpenStreetMap's free Nominatim API.
//
// Why this exists: Signup only ever saves latitude/longitude (no "city"
// field is ever submitted), so anywhere in the app that wants to *show* the
// worker's location needs to derive a readable name from those coordinates.
// Using ONE shared helper means the listing page, the profile page, and any
// future screen all resolve the location the same way — so an edit made in
// the profile is automatically reflected everywhere that reads from it.
//
// - In-memory + localStorage cache, keyed by rounded coordinates (~100m),
//   so the same spot is never looked up twice.
// - Requests are queued ~1.1s apart to respect Nominatim's "max 1 request/sec"
//   usage policy, even if many worker cards mount at once.

import { useEffect, useState } from "react";

const CACHE_KEY = "geocodeCache_v1";
const memoryCache = new Map();

function loadPersistedCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.entries(parsed).forEach(([k, v]) => memoryCache.set(k, v));
  } catch {
    // corrupted/unavailable cache — ignore and start fresh
  }
}
loadPersistedCache();

function persistCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(memoryCache)));
  } catch {
    // storage full or unavailable — non-fatal, cache just stays in-memory
  }
}

function roundKey(lat, lng) {
  return `${Number(lat).toFixed(3)},${Number(lng).toFixed(3)}`;
}

// FIFO queue so we never fire requests at Nominatim faster than ~1/sec
let queue = Promise.resolve();
function enqueue(task) {
  const result = queue.then(() => task());
  queue = result.catch(() => {}).then(() => new Promise((r) => setTimeout(r, 1100)));
  return result;
}

/**
 * Resolve { lat, lng } -> place name string, or null if unresolvable.
 * Safe to call many times with the same coordinates; cached after the
 * first successful lookup.
 */
export function reverseGeocode(lat, lng) {
  if (lat == null || lng == null) return Promise.resolve(null);
  const key = roundKey(lat, lng);

  if (memoryCache.has(key)) return Promise.resolve(memoryCache.get(key));

  return enqueue(async () => {
    if (memoryCache.has(key)) return memoryCache.get(key); // resolved while queued

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      if (!res.ok) throw new Error("geocode failed");
      const data = await res.json();
      const addr = data.address || {};
      const name =
        addr.city || addr.town || addr.village || addr.suburb ||
        addr.county || addr.state || data.name || null;

      memoryCache.set(key, name);
      persistCache();
      return name;
    } catch {
      memoryCache.set(key, null);
      return null;
    }
  });
}

/**
 * React hook: resolves { lat, lng } -> { placeName, loading }.
 * Use this in any component that needs to display a worker's location.
 */
export function useReverseGeocode(lat, lng) {
  const [placeName, setPlaceName] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat == null || lng == null) {
      setPlaceName(null);
      return;
    }
    let active = true;
    setLoading(true);
    reverseGeocode(lat, lng).then((name) => {
      if (active) {
        setPlaceName(name);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [lat, lng]);

  return { placeName, loading };
}
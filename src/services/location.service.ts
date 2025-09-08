import { fetchStatesRequest, getLGAFromApiRequest } from '@/services/state.service';

// Helper: fetch list of countries from Rest Countries API
export const fetchCountries = async () => {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();
    // Map to label/value with ISO2 code
    return data
      .map((c: any) => ({ label: c.name.common, value: c.cca2 }))
      .sort((a: any, b: any) => a.label.localeCompare(b.label));
  } catch (err) {
    // Fallback to a small list if the API fails
    return [
      { label: 'Nigeria', value: 'NG' },
      { label: 'Ghana', value: 'GH' },
      { label: 'Kenya', value: 'KE' },
    ];
  }
};

// Fetch states/regions for a given country.
// For Nigeria we delegate to your existing states/LGA API. For others we use the public CountriesNow API.
export const fetchStates = async (countryCodeOrName?: string) => {
  if (!countryCodeOrName) return [];

  const code = countryCodeOrName?.toUpperCase();
  if (code === 'NG' || countryCodeOrName === 'Nigeria') {
    // use existing Nigeria states endpoint
    try {
      const states = await fetchStatesRequest();
      return states;
    } catch (err) {
      return [];
    }
  }

  // For other countries: attempt CountriesNow API which expects the country name
  try {
    // If the caller passed ISO2 code, try to get country name via restcountries
    let countryName = countryCodeOrName;
    if (countryName.length === 2) {
      const r = await fetch(`https://restcountries.com/v3.1/alpha/${countryName}`);
      const json = await r.json();
      countryName = json?.[0]?.name?.common || countryName;
    }

    const payload = { country: countryName };
    const resp = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await resp.json();
    if (body && body.data && Array.isArray(body.data.states)) {
      return body.data.states.map((s: any) => s.name);
    }
    return [];
  } catch (err) {
    return [];
  }
};

// Fetch cities for a country + state. For NG, use LGA API; for others use CountriesNow API.
export const fetchCities = async (countryCodeOrName?: string, state?: string) => {
  if (!countryCodeOrName) return [];
  const code = countryCodeOrName?.toUpperCase();
  if (code === 'NG' || countryCodeOrName === 'Nigeria') {
    try {
      const lgas = await getLGAFromApiRequest(state);
      return lgas;
    } catch (err) {
      return [];
    }
  }

  try {
    // CountriesNow expects country name and state
    let countryName = countryCodeOrName;
    if (countryName.length === 2) {
      const r = await fetch(`https://restcountries.com/v3.1/alpha/${countryName}`);
      const json = await r.json();
      countryName = json?.[0]?.name?.common || countryName;
    }

    const payload = { country: countryName, state };
    const resp = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await resp.json();
    if (body && body.data && Array.isArray(body.data)) return body.data;
    return [];
  } catch (err) {
    return [];
  }
};

// Address autocomplete via Nominatim (OpenStreetMap) - no API key required but has rate limits
export const autocompleteAddress = async (query: string, countryCode?: string) => {
  if (!query) return [];
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    addressdetails: '1',
    limit: '10',
    countrycodes: countryCode ? countryCode.toLowerCase() : undefined,
  } as any);

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'fuelsgate-frontend/1.0 (contact@yourdomain.com)'
    }
  });
  const data = await res.json();
  // Map to simple label/value pairs
  return data.map((item: any) => ({
    label: item.display_name,
    value: item.osm_id,
    raw: item,
  }));
};

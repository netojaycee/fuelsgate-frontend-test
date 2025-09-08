import { fetchCountries, fetchStates, fetchCities, autocompleteAddress } from '@/services/location.service';
import { useQuery } from '@tanstack/react-query';

const useLocationHook = () => {
  const useFetchCountries = useQuery({
    queryFn: async () => {
      return await fetchCountries();
    },
    queryKey: ['COUNTRIES'],
  });

  const useFetchStates = (countryCode?: string) =>
    useQuery({
      queryFn: async () => {
        return await fetchStates(countryCode);
      },
      queryKey: [`STATES_${countryCode}`, countryCode],
    });

  const useFetchCities = (countryCode?: string, state?: string) =>
    useQuery({
      queryFn: async () => {
        return await fetchCities(countryCode, state);
      },
      queryKey: [`CITIES_${countryCode}_${state}`, countryCode, state],
    });

  const useAddressAutocomplete = (query?: string, countryCode?: string) =>
    useQuery({
      queryFn: async () => {
        if (!query) return [];
        return await autocompleteAddress(query, countryCode?.toLowerCase());
      },
      queryKey: [`ADDRESS_AUTOCOMPLETE_${countryCode}_${query}`, countryCode, query],
      enabled: !!query,
    });

  return { useFetchCountries, useFetchStates, useFetchCities, useAddressAutocomplete };
};

export default useLocationHook;

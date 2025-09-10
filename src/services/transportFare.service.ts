import { requestHandler } from "@/utils/requestHandler"

export interface FareCalculationRequest {
  truckCapacity: number;
  truckCategory: string;
  truckType: string;
  deliveryState: string;
  deliveryLGA: string;
  loadPoint: string;
}

export interface FareCalculationResponse {
  success: boolean;
  message: string;
  data: {
    minFarePerLitre: number;
    maxFarePerLitre: number;
    totalMin: number;
    totalMax: number;
    breakdowns: {
      freightRateMin: number;
      freightRateMax: number;
      dieselDeliveryCostMin: number;
      dieselDeliveryCostMax: number;
      dieselQuantityMin: number;
      dieselQuantityMax: number;
      variableCostPerKmMin: number;
      variableCostPerKmMax: number;
      fixedCostPerKm: number;
      distance: number;
      truckCapacity: number;
    };
  };
}

export interface LoadPoint {
  _id: string;
  name: string;
  displayName: string;
  state: string;
  lga: string;
  isActive: boolean;
}

export interface LoadPointsResponse {
  success: boolean;
  data: LoadPoint[];
}

// Calculate transport fare
export const calculateTransportFareRequest = async (data: FareCalculationRequest) => {
  const url = '/transport-fare/calculate'
  return await requestHandler('post', url, data)
}

// Get all load points
export const fetchLoadPointsRequest = async () => {
  const url = '/transport-fare/load-points'
  return await requestHandler('get', url)
}

// Admin endpoints (for future use)
export const fetchTransportConfigRequest = async () => {
  const url = '/transport-fare/admin/config'
  return await requestHandler('get', url)
}

export const updateTransportConfigRequest = async (key: string, value: number) => {
  const url = `/transport-fare/admin/config/${key}`
  return await requestHandler('put', url, { value })
}

import { requestHandler } from "@/utils/requestHandler"

export const fetchTruckOffersRequest = async (query: string, pageParam: number) => {
  const url = '/truck-offers' + (query ?? '') + pageParam
  return await requestHandler('get', url)
}

export const fetchTruckOfferAnalyticsRequest = async (query: string) => {
  const url = '/truck-offers/get-offers-count' + (query ?? '')
  return await requestHandler('get', url)
}

export const saveTruckOffersRequest = async (data: unknown) => {
  const url = '/truck-offers';
  return await requestHandler('post', url, data)
}

export const updateTruckOfferStatusRequest = async (data: unknown, id: string) => {
  const url = `/truck-offers/${id}`;
  return await requestHandler('patch', url, data)
}

export const getTruckOfferDetailsRequest = async (data: unknown, id: string) => {
  const url = `/truck-offers/${id}`;
  return await requestHandler('get', url)
}

export const fetchTruckMessagesRequest = async (query: string, pageParam: number, truckOfferId: string) => {
  const url = `/truck-messages/${truckOfferId}` + (query ?? '') + pageParam
  return await requestHandler('get', url)
}

export const sendNewTruckMessageRequest = async (data: unknown) => {
  const url = `/truck-messages`;
  return await requestHandler('post', url, data)
}

export const updateTruckMessageStatusRequest = async (data: unknown, id: string) => {
  const url = `/truck-messages/status/${id}`
  return await requestHandler('patch', url, data)
}

export const acceptTruckMessageStatusRequest = async (id: string) => {
  const url = `/truck-messages/${id}/accept`
  return await requestHandler('put', url)
}

export const rejectTruckMessageStatusRequest = async (id: string) => {
  const url = `/truck-messages/${id}/reject`
  return await requestHandler('put', url)
}

export const getTruckMessageDetailsRequest = async (id: string) => {
  const url = `/truck-messages/show/${id}`
  return await requestHandler('get', url)
}
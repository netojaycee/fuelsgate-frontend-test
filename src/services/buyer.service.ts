import { requestHandler } from "@/utils/requestHandler"

export const fetchBuyerAnalyticsRequest = async () => {
  const url = '/buyer/analytics'
  return await requestHandler('get', url)
}

export const fetchBuyerScrollDataRequest = async () => {
  const url = '/buyer/scroll-data'
  return await requestHandler('get', url)
}
import { requestHandler } from "@/utils/requestHandler"

export const fetchSellerOrderRequest = async (query: string) => {
  const url = '/order' + (query ?? '')
  return await requestHandler('get', url)
}
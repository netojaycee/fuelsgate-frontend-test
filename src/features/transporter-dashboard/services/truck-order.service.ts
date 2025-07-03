import { requestHandler } from "@/utils/requestHandler"

export const fetchTransporterOrderRequest = async (query: string) => {
  const url = '/truck-order' + (query ?? '')
  return await requestHandler('get', url)
}

export const fetchUserTransporterOrderRequest = async (query: string) => {
  const url = '/truck-order/user' + (query ?? '')
  return await requestHandler('get', url)
}
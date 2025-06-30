import { requestHandler } from "@/utils/requestHandler"

export const fetchTransporterOrderRequest = async (query: string) => {
  const url = '/truck-order' + (query ?? '')
  return await requestHandler('get', url)
}
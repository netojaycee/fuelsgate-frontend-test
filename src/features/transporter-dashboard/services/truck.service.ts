import { requestHandler } from "@/utils/requestHandler"
import { TruckDto } from "../types/truck.type"

export const fetchTrucksRequest = async (query: string, pageParam: number) => {
  const url = '/truck' + (query ?? '') + pageParam
  return await requestHandler('get', url)
}

export const fetchUserTrucksRequest = async (query: string, pageParam: number) => {
  const url = '/truck/get-user-trucks' + (query ?? '') + pageParam
  return await requestHandler('get', url)
}


export const saveTrucksRequest = async (data: Omit<TruckDto, '_id' | 'profileId' | 'status'>) => {
  const url = '/truck';
  return await requestHandler('post', url, data)
}

export const updateTrucksRequest = async (data: Omit<TruckDto, '_id' | 'profileId'>, id: string) => {
  const url = `/truck/${id}`;
  return await requestHandler('put', url, data)
}

export const deleteTruckRequest = async (id: string) => {
  const url = `/truck/${id}`;
  return await requestHandler('delete', url)
}
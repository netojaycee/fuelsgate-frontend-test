import { DepotHubDto } from "@/types/depot-hub.types";
// import { ProductDto } from "@/types/product.types";

export type TruckStatus = 'available' | 'locked' | 'pending';

export interface TruckDto {
  _id?: string
  profileId: string | any
  availability?: 'locked' | 'available'
  truckNumber?: string // Optional for flatbed trucks
  capacity?: string // Optional for flatbed trucks
  productId?: string | any // Optional for flatbed trucks
  depotHubId?: string | DepotHubDto // Optional for flatbed trucks
  depot?: string // Optional for flatbed trucks
  loadStatus?: 'loaded' | 'unloaded' // Optional for flatbed trucks
  truckType: 'tanker' | 'flatbed' | 'sidewall' | 'lowbed'
  status?: TruckStatus
  truckOrderId?: string
  profileType?: string | undefined
}
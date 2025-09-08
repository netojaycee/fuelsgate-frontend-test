import { DepotHubDto } from "@/types/depot-hub.types";
import { ProductDto } from "@/types/product.types";

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
  truckType: 'tanker' | 'flatbed' | 'stepdeck' | 'dropdeck'
  currentState?: string
  currentCity?: string
  // Flatbed specific (optional)
  flatbedSubtype?: string
  deckLengthFt?: string
  deckWidthFt?: string
  maxPayloadKg?: string
  equipment?: string[]
  preferredCargoTypes?: string[]
  permitRequired?: string
  // baseRateType and baseRate removed - RFQ negotiation uses RFQ pricing
  notes?: string
  country?: string
  city?: string
  address?: string
  status?: TruckStatus
  truckOrderId?: string
  profileType?: string | undefined
}
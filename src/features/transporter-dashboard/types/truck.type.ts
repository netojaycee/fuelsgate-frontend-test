import { DepotHubDto } from "@/types/depot-hub.types";
import { ProductDto } from "@/types/product.types";

export type TruckStatus = 'available' | 'locked' | 'pending';

export interface TruckDto {
  _id?: string
  profileId: string | any
  availability?: 'locked' | 'available'
  truckNumber: string
  capacity: string 
  productId: string | any
  depotHubId: string | DepotHubDto
  depot: string
  // currentState: string;
  // currentCity: string;
  status?: TruckStatus
  truckOrderId?: string
  profileType: string
}
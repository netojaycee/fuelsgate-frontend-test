import { BuyerDto, SellerDto } from "@/features/authentication/types/onboarding.types";
import { ProductUploadDto } from "./product-upload.types";
import { TruckDto } from "@/features/transporter-dashboard/types/truck.type";
import { TruckOrderRFQStatus } from "./truck-order.types";

export type TruckOrderStatus = 'awaiting-approval' | 'in-progress' | 'completed' | 'cancelled';

export interface TruckOrderDto {
  _id?: string;
  profileId?: any;
  buyerId?: BuyerDto | string;
  truckId?: TruckDto | string;
  price: number
  trackingId: string
  status: TruckOrderStatus
  quantity: number
  createdAt?: Date
  updatedAt?: Date
  profileType: string;
  orderId?: string
  rfqStatus: TruckOrderRFQStatus;
  loadingDate?: Date;
  loadingDepot: string;
  // loadingCity: string;
  // loadingAddress: string;
  arrivalTime?: Date;
  destination?: string;
  state?: string;
  city?: string;
  isRated?: boolean;
  
}

export type OrderFormDto = Pick<TruckOrderDto, 'profileId' | 'truckId' | 'price' | 'quantity'>

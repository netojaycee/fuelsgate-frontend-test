import { TruckDto } from "@/features/transporter-dashboard/types/truck.type";
import { MessageDto } from "./message.type";
import { ProductUploadDto } from "./product-upload.types";
import { UserType } from "./user.types";

export type TruckOfferStatus = 'ongoing' | 'completed' | 'cancelled';

export interface TruckOfferDto {
  _id?: string
  senderId?: string | UserType
  receiverId: string | UserType
  truckOrderId?: string
  senderDetails?: UserType
  receiverDetails?: UserType
  truckId: string | TruckDto
  status?: TruckOfferStatus
  quantity?: number
  lastMessage?: MessageDto
}

export type SendTruckMessageDto = {
  truckOfferId: string;
  truckOffer: number
}

export type TruckOfferFormDto = { truckOffer: number, truckOrderId: string }
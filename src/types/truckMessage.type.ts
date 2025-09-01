import { UserType } from "./user.types";

export type MessageStatus = 'pending' | 'accepted' | 'rejected';

export interface TruckMessageDto {
  _id?: string
  truckOfferId?: string
  actionBy?: string | UserType
  userId?: string | UserType
  status: MessageStatus
  truckOffer: number
  createdAt?: string
  updatedAt?: string
}

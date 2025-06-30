import { requestHandler } from "@/utils/requestHandler"
import { BuyerDto, SellerDto, TransporterDto } from "../types/onboarding.types"


export const sellerRequest = async (data: SellerDto) => {
  return await requestHandler('post', '/seller/onboarding', data)
}

export const buyerRequest = async (data: BuyerDto) => {
  return await requestHandler('post', '/buyer/onboarding', data)
}

export const transporterRequest = async (data: TransporterDto) => {
  return await requestHandler('post', '/transporter/onboarding', data)
}

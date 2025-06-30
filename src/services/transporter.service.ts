import { TransporterDto } from "@/features/authentication/types/onboarding.types"
import { requestHandler } from "@/utils/requestHandler"

export const fetchTransporterAnalyticsRequest = async () => {
  const url = '/transporter/analytics'
  return await requestHandler('get', url)
}

export const updateTransporterProfileRequest = async (data: TransporterDto) => {
  const url = '/transporter/update'
  return await requestHandler('put', url, data)
}

export const updateTransporterProfilePictureRequest = async (
  data: Partial<TransporterDto>
) => {
  const url = '/transporter/upload-profile-picture'
  return await requestHandler('post', url, data)
}
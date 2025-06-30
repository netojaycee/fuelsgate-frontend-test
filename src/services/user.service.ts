import { requestHandler } from "@/utils/requestHandler";

export const updateUserPasswordRequest = async (data: unknown) => {
  const url = `/user/change-password`;
  return await requestHandler('patch', url, data)
}
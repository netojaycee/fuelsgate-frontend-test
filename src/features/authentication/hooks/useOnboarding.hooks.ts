import { AuthContext } from "@/contexts/AuthContext";
import useToastConfig from "@/hooks/useToastConfig.hook";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { BuyerDto, SellerDto, TransporterDto } from "../types/onboarding.types";
import { buyerRequest, sellerRequest, transporterRequest } from "../services/onboarding.service";

const useOnboardingHooks = () => {
  const router = useRouter();
  const { showToast } = useToastConfig();
  const { storeProfile } = useContext(AuthContext);

  const saveProfileData = (data: SellerDto | BuyerDto | TransporterDto): boolean | void => {
    if (!storeProfile) {
      showToast('An error occurred when trying to authenticate user', 'error');
      return false
    }
    storeProfile(data);
  }

  const useSellerOnboarding = useMutation({
    mutationFn: (data: SellerDto) => sellerRequest(data),
    onSuccess: (response) => {
      showToast(response.message, 'success');
      saveProfileData(response.data);
      router.push('/onboarding/complete')
    }
  })

  const useTransporterOnboarding = useMutation({
    mutationFn: (data: TransporterDto) => transporterRequest(data),
    onSuccess: (response) => {
      showToast(response.message, 'success');
      saveProfileData(response.data);
      router.push('/onboarding/complete')
    }
  })

  const useBuyerOnboarding = useMutation({
    mutationFn: (data: BuyerDto) => buyerRequest(data),
    onSuccess: (response) => {
      showToast(response.message, 'success');
      saveProfileData(response.data);
      router.push('/dashboard')
    }
  })

  return {
    useSellerOnboarding,
    useTransporterOnboarding,
    useBuyerOnboarding,
    saveProfileData
  }
}

export default useOnboardingHooks
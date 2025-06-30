'use client'
import Cookies from "js-cookie";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/user.types";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "@/contexts/AuthContext";
import useOnboardingHooks from "./useOnboarding.hooks";
import useToastConfig from "@/hooks/useToastConfig.hook";
import { ForgotPasswordDto, LoginDto, RegisterFormType, ResetPasswordDto, VerifyOtpDto } from "../types/authentication.types";
import { forgotPasswordRequest, loginRequest, registerRequest, resetPasswordRequest, verifyOtpRequest } from "../services/authentication.service";

const useAuthenticationHook = () => {
  const { storeUser } = useContext(AuthContext);
  const { showToast } = useToastConfig();
  const router = useRouter();
  const { saveProfileData } = useOnboardingHooks()

  const saveUserData = (data: UserType): boolean | void => {
    if (!storeUser) {
      showToast('An error occurred when trying to authenticate user', 'error');
      return false
    }
    storeUser({ token: data.token, data: data, isLoggedIn: true });
  }

  const useLogin = useMutation({
    mutationFn: (data: LoginDto) => loginRequest(data),
    onSuccess: (response) => {
      showToast(response.message, 'success');
      saveUserData(response.data.user);
      if (response.data.user.role === 'transporter' && !response.data.profile) {
        router.push('/onboarding');
      } else {
        saveProfileData(response.data.profile)
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      showToast(error.message, 'error');
    }
  })

  const useRegister = useMutation({
    mutationFn: (data: RegisterFormType) => registerRequest(data),
    onSuccess: (response) => {
      showToast(response.message, 'success');
      if (response.data.role === 'transporter') {
        router.push('/login');
      } else {
        saveUserData(response.data.user);
        router.push('/onboarding');
      }
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      showToast(error.message, 'error');
    }
  })

  const useForgotPassword = useMutation({
    mutationFn: (data: ForgotPasswordDto) => forgotPasswordRequest(data),
    onSuccess: (response) => {
      showToast(response.message, 'success');
      Cookies.set('email', response.data.email, { expires: 0.0417 })
      router.push('/verify-otp')
    }
  })

  const useVerifyOtp = useMutation({
    mutationFn: (data: VerifyOtpDto) => verifyOtpRequest(data),
    onSuccess: (response) => {
      showToast(response.message, 'success');
      router.push('/reset-password')
    }
  })

  const useResetPassword = useMutation({
    mutationFn: (data: ResetPasswordDto) => resetPasswordRequest(data),
    onSuccess: (response) => {
      showToast(response.message, 'success');
      router.push('/login')
    }
  })

  return {
    useLogin,
    useRegister,
    useForgotPassword,
    useVerifyOtp,
    useResetPassword,
    saveUserData
  }
}

export default useAuthenticationHook
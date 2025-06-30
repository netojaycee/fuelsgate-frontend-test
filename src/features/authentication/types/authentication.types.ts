export type Roles = 'seller' | 'transporter' | 'buyer';

export interface RegisterFormType {
  firstName: string
  lastName: string
  role: Roles
  email: string
  password: string
}

export type LoginDto = {
  email: string
  password: string
}

export type ForgotPasswordDto = {
  email: string
}

export type VerifyOtpDto = {
  email: string
  otp: string
}

export type ResetPasswordDto = {
  email: string
  password: string
  confirmPassword: string
}
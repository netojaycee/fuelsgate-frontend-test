import type { Metadata } from "next";
import OnboardingFooter from "@/features/authentication/components/onboarding-footer";
import OnboardingNavbar from "@/features/authentication/components/onboarding-navbar";
import CustomButton from "@/components/atoms/custom-button";
import { CornerUpLeft } from "lucide-react";
import GoBack from "@/features/authentication/components/go-back";

export const metadata: Metadata = {
  title: "Fuelsgate | Onboarding",
  description: "A Digital Platform For Bulk Fuel Procurement",
};


export default function OnBoardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full min-h-screen">
      <OnboardingNavbar />
      <div className="container mx-auto py-16 max-sm:px-2.5">
        <GoBack />
        <div className="max-md:mt-10">
          {children}
        </div>
      </div>
      <OnboardingFooter />
    </div>
  );
}

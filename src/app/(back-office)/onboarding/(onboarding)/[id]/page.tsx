import PetOwnerOnboardingForm from "@/components/BackOffice/Onboarding/PetOwner";
import DoctorNurseOnboardingForm from "@/components/BackOffice/Onboarding/VetDoctorNurse";
// import { useSession } from "next-auth/react";
import React from "react";

const OnboardingPage = () => {
  // const { data: session } = useSession();
  // console.log(session);

  return (
    <>
      {/* Form Container */}
      <div className="mx-auto max-w-4xl">
        {/* Conditional Form Rendering */}
        {/* {session?.user?.role === "PET_OWNER" ? (
              <PetOwnerOnboardingForm />
            ) : (session?.user?.role === "VET_DOCTOR" || 
                session?.user?.role === "VET_NURSE") ? (
              <DoctorNurseOnboardingForm />
            ) : (
              <div className="text-center text-gray-500">
                Please sign in to continue
              </div>
            )} */}
        <PetOwnerOnboardingForm />
        <DoctorNurseOnboardingForm />
      </div>
    </>
  );
};

export default OnboardingPage;

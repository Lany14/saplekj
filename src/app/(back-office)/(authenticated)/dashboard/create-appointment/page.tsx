// src/app/authenticated/dashboard/appointment/create-appointment/page.tsx

"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import CreateAppointmentForm from "@/components/BackOffice/CreateAppointmentForm"; // Import the form component
import { Button } from "@nextui-org/react";

export default function CreateAppointmentPage() {
  const { data: session } = useSession();

  return (
    <>
      <Breadcrumb
        pageName={
          session?.user?.role === "PET_OWNER"
            ? "Create Appointment"
            : "Create Appointment"
        }
      />
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        <CreateAppointmentForm /> {/* Render your form here */}
      </div>
    </>
  );
}

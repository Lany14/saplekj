"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import AppointmentTable from "@/components/BackOffice/Tables/AppointmentTable";
import VetDoctorAppointmentTable from "@/components/BackOffice/Tables/VetDoctorAppointmentTable";
import { Button } from "@nextui-org/react"; // Ensure you have NextUI installed

export default function AppointmentPage() {
  const { data: session } = useSession();
  const isPetOwner = session?.user?.role === "PET_OWNER";
  const isVetDoctor = session?.user?.role === "VET_DOCTOR";

  return (
    <>
      <Breadcrumb pageName={isPetOwner ? "My Appointments" : "Appointments"} />
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        {/* Conditionally render the appropriate table based on role */}
        {isPetOwner && <AppointmentTable />}
        {isVetDoctor && <VetDoctorAppointmentTable />}

        {/* Show the Create Appointment button only for PET_OWNER */}
        {isPetOwner && (
          <div className="mt-4">
            <Link href="/dashboard/create-appointment">
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-dark">
                Create Appointment
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

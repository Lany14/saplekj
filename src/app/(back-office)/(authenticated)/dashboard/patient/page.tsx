"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import PatientTable from "@/components/BackOffice/Tables/PatientTable";

export default function PatientPage() {
  const { data: session } = useSession();
  return (
    <>
      <Breadcrumb
        pageName={
          session?.user?.role === "PET_OWNER" ? "My Pets" : "Pet Patients"
        }
      />
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        <PatientTable />
      </div>
    </>
  );
}

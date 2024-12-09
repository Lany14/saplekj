import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import AppointmentsTable from "@/components/BackOffice/Cards/AppointmentsTable";
import Medication from "@/components/BackOffice/Cards/Medication";
import { OwnerDetails } from "@/components/BackOffice/Cards/OwnerDetails";
import { PatientInfoCard } from "@/components/BackOffice/Cards/PatientInfoCard";
import { PetDocumentTable } from "@/components/BackOffice/Cards/PetDocumentTable";
import { WeightChart } from "@/components/BackOffice/Cards/WeightChart";
import React from "react";

export default function PatientInfo() {
  return (
    <>
      <Breadcrumb pageName="Pet Details" />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 grid-rows-4 gap-4">
          <div className="row-span-2">
            <PatientInfoCard />
          </div>
          <div>
            <OwnerDetails />
          </div>
          <div className="col-start-2 row-start-2">
            <WeightChart />
          </div>
          <div className="col-start-3 row-span-2 row-start-1">
            <PetDocumentTable />
          </div>
          <div className="col-span-2 row-span-2 row-start-3">
            <AppointmentsTable />
          </div>
          <div className="col-start-3 row-span-2 row-start-3">
            <Medication />
          </div>
        </div>
      </div>
    </>
  );
}

// mt-4 grid  grid-cols-3 grid-rows-2   gap-4 md:mt-6 md:gap-6 2xl:mt-9  2xl:gap-7.5

{
  /* <div className="mt-4 grid grid-flow-row gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:grid-cols-3 2xl:gap-7.5">
        <div className="">
          <PatientInfoCard />
        </div>
        <div className="space-y-4 2xl:grid-rows-2">
          <div className="">
            <OwnerDetails />
          </div>
          <div className="">
            <WeightChart />
          </div>
        </div>
        <div className="">
          <PetDocumentTable />
        </div>
      </div> */
}

import AddClinicStaff from "@/components/BackOffice/AddClinicStaff";
import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import React from "react";

export default function AddAccountPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Breadcrumb pageName="Add Account" />

      <AddClinicStaff />
    </div>
  );
}

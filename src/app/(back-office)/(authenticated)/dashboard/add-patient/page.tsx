import AddPetForm from "@/components/BackOffice/AddPetForm";
import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "AbysAgrivet | Add Pet",
};

const AddPetRecordPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Breadcrumb pageName="Add Pet Record" />
      <AddPetForm />
    </div>
  );
};

export default AddPetRecordPage;

import React from "react";
import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import PaymentLog from "@/src/components/BackOffice/PaymentLog";

export const metadata: Metadata = {
  title: "AbyVet | Admin",
};

export default function PaymentPage() {
  return (
    <>
      <Breadcrumb pageName="Payment Records" />
      <div>
        <PaymentLog />
      </div>
    </>
  );
}

"use client";

import React from "react";
import { Metadata } from "next";
import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import UserTable from "@/components/BackOffice/Tables/UserTable";
import { useSession } from "next-auth/react";
export default function UserPage() {
  const { data: session } = useSession();
  return (
    <>
      {session?.user?.role === "VET_DOCTOR" ||
      session?.user?.role === "VET_NURSE" ? (
        <Breadcrumb pageName="Fur Parents" />
      ) : session?.user?.role === "ADMIN" ||
        session?.user?.role === "VET_RECEPTIONIST" ? (
        <Breadcrumb pageName="User Accounts" />
      ) : null}

      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        <UserTable />
      </div>
    </>
  );
}

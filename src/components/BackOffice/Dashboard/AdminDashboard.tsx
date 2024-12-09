"use client";
import React from "react";
import ChartThree from "../Charts/ChartThree";
import AdminDataStatsOne from "../DataStats/AdminDataStatsOne";
import ClinicRevenueChart from "@/components/BackOffice/Charts/ChartOne";

const AdminDashboard: React.FC = () => {
  return (
    <>
      AdminDashboard
      <AdminDataStatsOne />
      <div className="mt-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ClinicRevenueChart />
      </div>
    </>
  );
};

export default AdminDashboard;

// mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5

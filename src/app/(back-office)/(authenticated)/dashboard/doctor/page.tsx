// src/app/(back-office)/(authenticated)/dashboard/doctor/index.tsx

import VetDoctorsTable from "@/components/BackOffice/Tables/Vetdoctors";

export default function VetDoctorsPage() {
  return (
    <div className="dashboard-container">
      <VetDoctorsTable />
    </div>
  );
}

import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import AlertError from "@/components/BackOffice/Alerts/AlertError";
import AlertWarning from "@/components/BackOffice/Alerts/AlertWarning";
import AlertSuccess from "@/components/BackOffice/Alerts/AlertSuccess";

const Alerts = () => {
  return (
    <>
      <Breadcrumb pageName="Alerts" />

      <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-6 xl:p-9">
        <div className="flex flex-col gap-7.5">
          <AlertWarning />
          <AlertSuccess />
          <AlertError />
        </div>
      </div>
    </>
  );
};

export default Alerts;

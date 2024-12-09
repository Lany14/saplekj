import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
// import TableOne from "@/components/BackOffice/Tables/TableOne";
// import TableThree from "@/components/BackOffice/Tables/TableThree";
// import TableTwo from "@/components/BackOffice/Tables/TableTwo";

import { Metadata } from "next";

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        {/* <TableOne /> */}
        {/* <TableTwo /> */}
        {/* <TableThree /> */}
      </div>
    </>
  );
};

export default TablesPage;

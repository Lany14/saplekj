import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import PersonalInfoBox from "@/src/components/BackOffice/AccountSetting/PersonalInfoBox";
import SecuritySettingBox from "@/src/components/BackOffice/AccountSetting/SecuritySettingBox";
import PreferenceBox from "@/src/components/BackOffice/AccountSetting/PreferenceBox";

export const metadata: Metadata = {
  title: "AbyVet | Admin",
};

const Settings = () => {
  return (
    <>
      <div className="mx-auto max-w-4xl space-y-6">
        <Breadcrumb pageName="Account Setting" />
        <PersonalInfoBox />
        <SecuritySettingBox />
        <PreferenceBox />
      </div>
    </>
  );
};

export default Settings;

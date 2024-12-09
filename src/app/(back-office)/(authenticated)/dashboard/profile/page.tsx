import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
// import ProfileBox from "@/components/BackOffice/ProfileBox";

export const metadata: Metadata = {
  title: "AbyVet | Admin",
};

const Profile = () => {
  return (
    <>
      <Breadcrumb pageName="Profile" />
      <div className="mx-auto w-full max-w-[970px] grid-cols-2">
        {/* <Availability /> */}
        {/* <ProfileBox /> */}
      </div>
    </>
  );
};

export default Profile;

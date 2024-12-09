"use client";

import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import SearchForm from "@/components/BackOffice/Header/SearchForm";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import "next-auth";
import { MenuIcon } from "lucide-react";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface session {
    adminProfile?: {
      firstName: string;
    };
  }

  interface PetOwnerProfile {
    petOwnerProfile?: {
      firstName: string;
    };
  }
  interface ReceptionistProfile {
    receptionistProfile?: {
      firstName: string;
    };
  }
  interface DoctorNurseProfile {
    doctorNurseProfile?: {
      firstName: string;
    };
  }
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const [greeting, setGreeting] = useState<string>("");
  const { data: session } = useSession();

  const getGreeting = useCallback(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, [getGreeting]);

  const getUserFirstName = () => {
    const role = session?.user?.role;
    if (!role) return null;

    const profileMap = {
      PET_OWNER: session?.user?.name,
      ADMIN: session?.user?.name,
      VET_RECEPTIONIST: session?.user?.name,
      VET_DOCTOR: session?.user?.name,
      VET_NURSE: session?.user?.name,
    };

    return profileMap[role as keyof typeof profileMap];
  };

  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-4 py-5 shadow-2 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            className="hover:bg-primary-hover flex items-center gap-2.5 rounded-full bg-primary px-5 py-2.5 text-white"
            title="Open sidebar"
          >
            <MenuIcon />
          </button>
        </div>

        <div className="hidden xl:block">
          <div>
            <h1 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
              {greeting} {getUserFirstName()}!
            </h1>
            <p className="font-medium">{session?.user?.role} Dashboard</p>
          </div>
        </div>

        <div className="flex items-center justify-normal gap-2 2xsm:gap-4 lg:w-full lg:justify-between xl:w-auto xl:justify-normal">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Search Form --> */}
            <SearchForm />
            {/* <!-- Search Form --> */}

            {/* <!-- Dark Mode Toggle --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggle --> */}

            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          {/* <DropdownUser /> */}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;

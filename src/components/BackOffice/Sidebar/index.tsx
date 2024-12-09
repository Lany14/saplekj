"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "../Sidebar/SidebarItem";
import ClickOutside from "@/components/BackOffice/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";

import { Button } from "@nextui-org/react";

import {
  AlarmClock,
  Briefcase,
  BriefcaseMedical,
  Calendar,
  HandCoins,
  Hospital,
  House,
  Inbox,
  LogOut,
  PawPrint,
  Plus,
  Settings,
  SquareActivity,
  UserRoundPen,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  // openModal: (content: React.ReactNode) => void; // Make sure this is defined
}

type ModalId = "addPetPatient" | "addClinicStaff" | null;

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  route: string;
}

interface MenuGroup {
  name: string;
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession(); // Moved inside component
  console.log("Session data:", session);
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  // const [visibleModal, setVisibleModal] = useState<ModalId>(null);

  // const openModal = (modalId: ModalId) => {
  //   setVisibleModal(modalId);
  // };

  // const closeModal = () => {
  //   setVisibleModal(null);
  // };

  // Role-based menu logic
  const getMenuGroups = (): MenuGroup[] => {
    const baseMenu: MenuGroup[] = [
      {
        name: "ACCOUNT",
        menuItems: [
          {
            icon: <Settings />,
            label: "Setting",
            route: "/dashboard/setting",
          },
        ],
      },
    ];

    console.log("User role:", session?.user?.role);
    if (session?.user?.role === "ADMIN") {
      return [
        {
          name: "DASHBOARD",
          menuItems: [
            { icon: <House />, label: "Overview", route: "/dashboard" },
            {
              icon: <PawPrint />,
              label: "Pet Patients",
              route: "/dashboard/patient",
            },
            {
              icon: <Users />,
              label: "User Accounts",
              route: "/dashboard/user",
            },
            { icon: <Inbox />, label: "Inbox", route: "/dashboard/inbox" },
            {
              icon: <Calendar />,
              label: "Calendar",
              route: "/dashboard/calendar",
            },
            {
              icon: <HandCoins />,
              label: "Payment Log",
              route: "/dashboard/payment",
            },
            {
              icon: <SquareActivity />,
              label: "System Activity",
              route: "/dashboard/system-activity",
            },
          ],
        },
        ...baseMenu,
      ];
    } else if (session?.user?.role === "VET_DOCTOR") {
      return [
        {
          name: "DASHBOARD",
          menuItems: [
            { icon: <House />, label: "Overview", route: "/dashboard" },
            {
              icon: <PawPrint />,
              label: "Pet Patients",
              route: "/dashboard/patient",
            },
            {
              icon: <Users />,
              label: "Fur Parents",
              route: "/dashboard/user",
            },
            {
              icon: <AlarmClock />,
              label: "My Appointments",
              route: "/dashboard/appointment",
            },
            { icon: <Inbox />, label: "Inbox", route: "/dashboard/inbox" },
            {
              icon: <Calendar />,
              label: "Calendar",
              route: "/dashboard/calendar",
            },
          ],
        },
        {
          name: "ACCOUNT",
          menuItems: [
            {
              icon: <UserRoundPen />,
              label: "Profile",
              route: "/dashboard/profile",
            },
            {
              icon: <Settings />,
              label: "Setting",
              route: "/dashboard/setting",
            },
          ],
        },
      ];
    } else if (session?.user?.role === "VET_NURSE") {
      return [
        {
          name: "DASHBOARD",
          menuItems: [
            {
              icon: <House />,
              label: "Overview",
              route: "/dashboard",
            },
            {
              icon: <PawPrint />,
              label: "Pet Patients",
              route: "/dashboard/patient",
            },
            {
              icon: <Users />,
              label: "Fur Parents",
              route: "/dashboard/user",
            },
            {
              icon: <AlarmClock />,
              label: "My Appointments",
              route: "/dashboard/appointment",
            },
            {
              icon: <Inbox />,
              label: "Inbox",
              route: "/dashboard/inbox",
            },
            {
              icon: <Calendar />,
              label: "Calendar",
              route: "/dashboard/calendar",
            },
          ],
        },
        {
          name: "ACCOUNT",
          menuItems: [
            {
              icon: <UserRoundPen />,
              label: "Profile",
              route: "/dashboard/profile",
            },
            {
              icon: <Settings />,
              label: "Setting",
              route: "/dashboard/setting",
            },
          ],
        },
      ];
    } else if (session?.user?.role === "VET_RECEPTIONIST") {
      return [
        {
          name: "DASHBOARD",
          menuItems: [
            {
              icon: <House />,
              label: "Overview",
              route: "/dashboard",
            },
            {
              icon: <PawPrint />,
              label: "Pet Patients",
              route: "/dashboard/patient",
            },
            {
              icon: <Users />,
              label: "User Accounts",
              route: "/dashboard/user",
            },
            {
              icon: <AlarmClock />,
              label: "Scheduled Appointments",
              route: "/dashboard/appointment",
            },
            {
              icon: <Inbox />,
              label: "Inbox",
              route: "/dashboard/inbox",
            },
            {
              icon: <Calendar />,
              label: "Calendar",
              route: "/dashboard/calendar",
            },
            {
              icon: <HandCoins />,
              label: "Payment Log",
              route: "/dashboard/payment",
            },
          ],
        },
        ...baseMenu,
      ];
    } else if (session?.user?.role === "PET_OWNER") {
      return [
        {
          name: "DASHBOARD",
          menuItems: [
            {
              icon: <House />,
              label: "Overview",
              route: "/dashboard",
            },
            {
              icon: <PawPrint />,
              label: "My Pets",
              route: "/dashboard/patient",
            },
            {
              icon: <AlarmClock />,
              label: "My Appointments",
              route: "/dashboard/appointment",
            },
            {
              icon: <BriefcaseMedical />,
              label: "Vet Doctors",
              route: "/dashboard/doctor",
            },
            {
              icon: <Calendar />,
              label: "Calendar",
              route: "/dashboard/calendar",
            },
          ],
        },
        ...baseMenu,
      ];
    }
    return baseMenu;
  };

  const menuGroups = getMenuGroups();

  // const setModalContent = useContext(ModalContext);

  // const openAddClinicStaff = () =>
  //   setModalContent(<AddClinicStaff onClose={closeModal} />);
  // const openAddPetPatient = () => setModalContent(<AddPetForm />);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/">
            <Image
              width={106}
              height={21}
              src={"/images/logo/logo-light.svg"}
              alt="Logo"
              priority
              className="dark:hidden"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              width={106}
              height={21}
              src={"/images/logo/logo-dark.svg"}
              alt="Logo"
              priority
              className="hidden dark:block"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
            title="Toggle Sidebar"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-bold text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}

            <div className="pb-2">
              {/* Buttons to open different modals */}

              <div className="pb-2">
                <Button
                  as={Link}
                  className="w-full bg-blue-600 text-white hover:bg-blue-dark"
                  startContent={<Plus />}
                  href={
                    session?.user?.role === "VET_DOCTOR"
                      ? "/dashboard/diagnose-patient"
                      : "/dashboard/add-patient"
                  }
                >
                  {session?.user?.role === "VET_DOCTOR"
                    ? "Diagnose Pet"
                    : "Add Pet"}
                </Button>
              </div>
              {/* <Modal
                size="2xl"
                isOpen={visibleModal === "addPetPatient"}
                onClose={closeModal}
                scrollBehavior="inside"
                backdrop="blur"
              >
                <AddPetForm />
              </Modal> */}
            </div>

            {(session?.user?.role === "ADMIN" ||
              session?.user?.role === "VET_RECEPTIONIST") && (
              <div>
                <div className="pb-2">
                  <Button
                    as={Link}
                    className="w-full bg-primary text-white hover:bg-primaryho"
                    // onPress={() => openModal("addClinicStaff")}
                    // onClick={handleOpenAddClinicStaff}
                    startContent={<UserRoundPlus />}
                    href="/dashboard/add-account"
                  >
                    Add User Account
                  </Button>
                </div>
                {/* <Modal
                  size="xl"
                  isOpen={visibleModal === "addClinicStaff"}
                  onClose={closeModal}
                  // className="ModalOverlay"
                  scrollBehavior="inside"
                  backdrop="blur"
                >
                  <AddClinicStaff onClose={closeModal} />
                </Modal> */}
              </div>
            )}

            <Button
              className="w-full "
              onClick={() => signOut()}
              startContent={<LogOut />}
            >
              Sign Out
            </Button>
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;

import React from "react";
// import Image from "next/image";
// import { PetDocumentTable } from "./PetDocumentTable";
// import { Divider } from "@nextui-org/react";
// import { VaccineChip } from "./VaccineChip";
import { CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const PatientInfoCard = () => {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              alt="Daisy"
              src="/placeholder.svg?height=96&width=96"
            />
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Daisy</h2>
            <p className="text-sm text-gray-500">Female | 3 Years</p>
            <p className="text-sm text-gray-500">ID: 014 4384 3478023</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Member:</p>
            <p>Yes</p>
          </div>
          <div>
            <p className="font-semibold">Date of Birth:</p>
            <p>02.09.2019</p>
          </div>
          <div>
            <p className="font-semibold">Address:</p>
            <p>934 Hilltop Rd, Falkenberg</p>
            <p>Louisiana, 68848</p>
          </div>
          <div>
            <p className="font-semibold">Breed:</p>
            <p>Border Collie</p>
          </div>
          <div>
            <p className="font-semibold">Vaccinated:</p>
            <p>Yes</p>
          </div>
          <div>
            <p className="font-semibold">Last Check Up:</p>
            <p>18.02.2022</p>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

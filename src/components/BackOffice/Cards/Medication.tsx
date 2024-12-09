import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const Medication = () => {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medications</CardTitle>
        <Button>Add Medication</Button>
      </CardHeader>
      <CardContent>
        <div className="flex h-[100px] items-center justify-center rounded-md bg-gray-100">
          <p className="text-gray-500">No Medications Prescribed</p>
        </div>
      </CardContent>
    </div>
  );
};

export default Medication;

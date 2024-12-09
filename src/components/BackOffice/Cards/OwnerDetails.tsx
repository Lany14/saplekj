import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@nextui-org/react";
import { Mail, Phone } from "lucide-react";
import React from "react";

export const OwnerDetails = () => {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <CardHeader>
        <CardTitle>Owner Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Olivia Edward" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="734-450-5415" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="olivia@yahoo.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additional">Additional Patients</Label>
            <Input id="additional" placeholder="Leo" />
          </div>
        </div>
      </CardContent>
    </div>
  );
};

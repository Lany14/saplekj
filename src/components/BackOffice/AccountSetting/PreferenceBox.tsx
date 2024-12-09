"use client";
import React from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Switch,
  Button,
  Divider,
} from "@nextui-org/react";

const PreferenceBox = () => {
  return (
    <Card className="p-4">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Preferences</p>
          <p className="text-small text-default-500">
            Customize your account preferences
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-md">Email Notifications</p>
            <p className="text-small text-default-500">
              Receive email updates about your account
            </p>
          </div>
          <Switch defaultSelected />
        </div>
        <Divider />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-md">Dark Mode</p>
            <p className="text-small text-default-500">
              Switch between light and dark mode
            </p>
          </div>
          <Switch />
        </div>
      </CardBody>
    </Card>
  );
};

export default PreferenceBox;

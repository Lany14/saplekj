"use client";
import React from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Switch,
  Button,
  Divider,
} from "@nextui-org/react";
import { EyeSlashFilledIcon } from "@/public/images/icon/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/public/images/icon/EyeFilledIcon";

const SecuritySettingBox = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <Card className="p-4">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Security Settings</p>
          <p className="text-small text-default-500">
            Manage your account security
          </p>
        </div>
      </CardHeader>
      <form action="">
        {" "}
        <CardBody className="space-y-4">
          <Input
            label="Current Password"
            placeholder="Enter Current Password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
          <Input
            label="New Password"
            placeholder="Enter New Password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
          <Input
            label="Confirm New Password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          <Button color="primary">Change Password</Button>

          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-md">Two-Factor Authentication</p>
              <p className="text-small text-default-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch />
          </div>
        </CardBody>
      </form>
    </Card>
  );
};

export default SecuritySettingBox;

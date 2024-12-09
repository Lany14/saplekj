"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";

interface FormData {
  // Personal Data
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  address: string;
  phoneNumber: string;
  birthDate: string;
  age: string;
  streetAddress: string;
  city: string;
  province: string;
  barangay: string;
  zipCode: string;
}

interface FormErrors {
  // Personal Data
  firstName?: string;
  lastName?: string;
  email?: string;
  sex?: string;
  address?: string;
  phoneNumber?: string;
  birthDate?: string;
  age?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  barangay?: string;
  zipCode?: string;
}

export const SexProp = [
  { key: "Male", label: "Male" },
  { key: "Female", label: "Female" },
] as const;

const INITIAL_FORM_DATA: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  sex: "",
  address: "",
  phoneNumber: "",
  birthDate: "",
  age: "",
  streetAddress: "",
  city: "",
  province: "",
  barangay: "",
  zipCode: "",
};

const PersonalInfoBox = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [phoneNumber, setPhoneNumber] = useState("");

  const isValid = phoneNumber.length === 10;

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    const requiredFields = {
      firstName: "First name",
      lastName: "Last name",
      birthDate: "Birth date",
      email: "Email",
      sex: "Sex",
      phoneNumber: "Phone number",
      age: "Age",
      streetAddress: "Street address",
      city: "City",
      province: "Province",
      barangay: "Barangay",
      zipCode: "Zip code",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field as keyof FormData]?.trim()) {
        newErrors[field as keyof FormErrors] = `${label} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/[^0-9]/g, "");
      if (input.length <= 10 && (!input.length || input[0] === "9")) {
        setPhoneNumber(input);
      }
    },
    [],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [],
  );

  const calculateAge = useCallback((birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);

    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    if (today.getDate() < birthDate.getDate()) ageMonths--;

    return { age: ageYears };
  }, []);

  useEffect(() => {
    if (formData.birthDate) {
      const { age } = calculateAge(formData.birthDate);
      setFormData((prev) => ({ ...prev, age: age.toString() }));
    }
  }, [formData.birthDate, calculateAge]);

  useEffect(() => {
    if (session) {
      setFormData((prev) => ({
        ...prev,
        lastName:
          session?.petOwnerProfile?.lastName ||
          session?.adminProfile?.lastName ||
          session?.receptionistProfile?.lastName ||
          session?.doctorNurseProfile?.lastName ||
          prev.lastName,
      }));
    }
  }, [session]);

  return (
    <Card className="p-4">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Personal Information</p>
          <p className="text-small text-default-500">
            Update your personal details here
          </p>
        </div>
      </CardHeader>
      <form>
        <CardBody className="gap-4 md:grid md:grid-cols-2">
          <Input
            isRequired
            label="First Name"
            name="firstName"
            value={session?.user?.name || formData.firstName}
            onChange={handleInputChange}
            isInvalid={!!errors.firstName}
            errorMessage={errors.firstName}
          />
          <Input
            isRequired
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            isInvalid={!!errors.lastName}
            errorMessage={errors.lastName}
          />
          <Input
            className="col-span-2"
            isRequired
            label="Email"
            name="email"
            defaultValue={session?.user?.email || ""}
            value={formData.email}
            onChange={handleInputChange}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
          />
          <Input
            className="col-span-2"
            isRequired
            label="Phone Number"
            placeholder="ex. 9XXXXXXXXX"
            value={phoneNumber}
            onChange={handlePhoneChange}
            startContent={<span className="text-small">+63</span>}
            endContent={
              <div className="pointer-events-none flex items-center">
                <span
                  className={`text-small ${isValid ? "text-success" : "text-danger"}`}
                >
                  {phoneNumber.length}/10
                </span>
              </div>
            }
            type="tel"
            isInvalid={!isValid && phoneNumber.length > 0}
            errorMessage={
              !isValid && phoneNumber.length > 0
                ? "Phone number must be 10 digits"
                : ""
            }
            classNames={{
              input: "pl-1",
              innerWrapper: "bg-transparent",
            }}
          />
          <Select
            isRequired
            label="Sex"
            placeholder="Choose Sex"
            value={formData.sex}
            isInvalid={!!errors.sex}
            errorMessage={errors.sex}
          >
            {SexProp.map((sex) => (
              <SelectItem value={sex.key} key={sex.key}>
                {sex.label}
              </SelectItem>
            ))}
          </Select>
          <div className="md:flex">
            <Input
              isRequired
              className=""
              type="date"
              label="Birthdate"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]}
              isInvalid={!!errors.birthDate}
              errorMessage={errors.birthDate}
            />
            <Input
              isRequired
              isReadOnly
              type="number"
              label="Age"
              id="age"
              name="age"
              value={formData.age}
              isInvalid={!!errors.age}
              errorMessage={errors.age}
              defaultValue={session?.petOwnerProfile?.age || ""}
            />
          </div>

          <Button className="col-span-2" color="primary">
            Save Changes
          </Button>
        </CardBody>
      </form>
    </Card>
  );
};

export default PersonalInfoBox;

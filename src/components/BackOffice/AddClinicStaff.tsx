"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ModalContext } from "./Layouts/DefaultLayout";
import { useSession } from "next-auth/react";

export const SexProp = [
  { key: "Male", label: "Male" },
  { key: "Female", label: "Female" },
] as const;

export const RoleProp = [
  { key: "ADMIN", label: "ADMIN" },
  { key: "VET_NURSE", label: "VETERINARY NURSE" },
  { key: "VET_DOCTOR", label: "VETERINARY DOCTOR" },
  { key: "VET_RECEPTIONIST", label: "VETERINARY RECEPTIONIST" },
  { key: "PET_OWNER", label: "PET OWNER" },
] as const;

const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  sex: "",
  phoneNumber: "",
  birthDate: "",
  age: "",
  email: "",
  role: "",
  licenseNumber: "",
  specialization: "",
};

const AddClinicStaff: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const setModalContent = useContext(ModalContext);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneNumber, setPhoneNumber] = useState("");

  const isValid = useMemo(() => phoneNumber.length === 10, [phoneNumber]);

  const calculateAge = useCallback((birthdate: string): number => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }, []);

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
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" &&
        value === "PET_OWNER" && {
          licenseNumber: "",
          specialization: "",
        }),
    }));
  }, []);

  const validateForm = useCallback(() => {
    const tempErrors: Record<string, string> = {};
    const requiredFields = {
      firstName: "First name",
      lastName: "Last name",
      sex: "Sex",
      birthDate: "Birthdate",
      email: "Email",
      role: "Role",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        tempErrors[field] = `${label} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Valid email is required";
    }

    if (
      formData.role !== "PET_OWNER" &&
      formData.role !== "VET_RECEPTIONIST" &&
      formData.role !== "ADMIN" &&
      !formData.licenseNumber
    ) {
      tempErrors.licenseNumber = "License number is required for this role";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }, [formData]);

  useEffect(() => {
    if (formData.birthDate) {
      const calculatedAge = calculateAge(formData.birthDate);
      setFormData((prev) => ({
        ...prev,
        age: calculatedAge.toString(),
      }));
    }
  }, [formData.birthDate, calculateAge]);

  useEffect(() => {
    if (session?.user?.role === "VET_RECEPTIONIST") {
      handleSelectChange("role", "PET_OWNER");
    }
  }, [session?.user?.role, handleSelectChange]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const fullPhoneNumber = `+63${phoneNumber}`;
    const userData = {
      ...formData,
      phoneNumber: fullPhoneNumber,
    };

    try {
      const loadingToast = toast.loading("Creating user account...");
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User account created successfully");
        setFormData(INITIAL_FORM_DATA);
        setPhoneNumber("");
      } else if (response.status === 409) {
        toast.error("This email address is already registered in the system.");
      } else if (response.status === 410) {
        toast.error("This phone number is already registered in the system.");
      } else {
        console.error("Error response:", data.error);
        toast.error("Failed to create user account.");
      }
      toast.dismiss(loadingToast);
    } catch (error) {
      console.error("Error creating user account:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit}>
        <CardBody>
          <div className="gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  isRequired
                  type="text"
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.firstName}
                  errorMessage={errors.firstName}
                />
              </div>
              <div>
                <Input
                  isRequired
                  type="text"
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.lastName}
                  errorMessage={errors.lastName}
                />
              </div>
              <div>
                <Select
                  isRequired
                  label="Sex"
                  placeholder="Choose Sex"
                  value={formData.sex}
                  onChange={(e) => handleSelectChange("sex", e.target.value)}
                  isInvalid={!!errors.sex}
                  errorMessage={errors.sex}
                >
                  {SexProp.map((sex) => (
                    <SelectItem value={sex.key} key={sex.key}>
                      {sex.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <Input
                    isRequired
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
                </div>
                <div className="w-full">
                  <Input
                    isRequired
                    isReadOnly
                    type="number"
                    label="Age"
                    id="age"
                    name="age"
                    value={formData.age}
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-4">
                <Input
                  isRequired
                  type="email"
                  label="Email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                />
                <Input
                  isRequired
                  label="Phone Number"
                  placeholder="ex. 9XXXXXXXXX"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  startContent={<span className="text-small">+63</span>}
                  endContent={
                    <span
                      className={`text-small ${isValid ? "text-success" : "text-danger"}`}
                    >
                      {phoneNumber.length}/10
                    </span>
                  }
                  type="tel"
                  isInvalid={!isValid && phoneNumber.length > 0}
                  errorMessage={
                    phoneNumber.length === 0
                      ? "Phone number is required"
                      : !isValid && phoneNumber.length > 0
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
                  label="User Role"
                  placeholder="Choose User Role"
                  value={formData.role}
                  onChange={(e) => handleSelectChange("role", e.target.value)}
                  isDisabled={session?.user?.role === "VET_RECEPTIONIST"}
                  defaultSelectedKeys={
                    session?.user?.role === "VET_RECEPTIONIST"
                      ? ["PET_OWNER"]
                      : undefined
                  }
                  className="col-span-2"
                  isInvalid={!!errors.role}
                  errorMessage={errors.role}
                >
                  {RoleProp.map((role) => (
                    <SelectItem value={role.key} key={role.key}>
                      {role.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {formData.role !== "PET_OWNER" &&
                formData.role !== "VET_RECEPTIONIST" &&
                formData.role !== "ADMIN" && (
                  <>
                    <Divider className="col-span-2" />
                    <Input
                      isRequired
                      className="col-span-2"
                      type="text"
                      label="Vet License Number"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      isInvalid={!!errors.licenseNumber}
                      errorMessage={errors.licenseNumber}
                    />
                    <Textarea
                      className="col-span-2"
                      type="text"
                      label="Specialization"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                    />
                  </>
                )}
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <Button color="primary" type="submit">
            Done
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddClinicStaff;

"use client";

import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { ModalContext } from "./Layouts/DefaultLayout";

export const SexProp = [
  { key: "Male", label: "Male" },
  { key: "Female", label: "Female" },
];

export const RoleProp = [
  { key: "ADMIN", label: "ADMIN" },
  { key: "VET_NURSE", label: "VETERINARY NURSE" },
  { key: "VET_DOCTOR", label: "VETERINARY DOCTOR" },
  { key: "VET_RECEPTIONIST", label: "VETERINARY RECEPTIONIST" },
  { key: "PET_OWNER", label: "PET OWNER" },
];

const AddClinicStaffModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
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
  });

  const setModalContent = useContext(ModalContext);

  const closeModal = () => setModalContent(null);

  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState<any>({});

  const calculateAge = (birthdate: string): number => {
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
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9]/g, ""); // Remove non-digit characters
    if (input.length <= 10 && (input.length === 0 || input[0] === "9")) {
      setPhoneNumber(input);
      setIsValid(input.length === 10);
    }
  };

  useEffect(() => {
    if (formData.birthDate) {
      const calculatedAge = calculateAge(formData.birthDate);
      setFormData((prevData) => ({
        ...prevData,
        age: calculatedAge.toString(),
      }));
    }
  }, [formData.birthDate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "role" && value === "PET_OWNER") {
      // Clear Vet License Number and Specialization when role is PET_OWNER
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        licenseNumber: "", // Reset license number
        specialization: "", // Reset specialization
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let tempErrors: any = {};
    if (!formData.firstName) tempErrors.firstName = "First name is required";
    if (!formData.lastName) tempErrors.lastName = "Last name is required";
    if (!formData.sex) tempErrors.sex = "Sex is required";
    if (!formData.birthDate) tempErrors.birthDate = "Birthdate is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Valid email is required";
    if (!formData.role) tempErrors.role = "Role is required";
    if (
      formData.role !== "PET_OWNER" &&
      formData.role !== "VET_RECEPTIONIST" &&
      formData.role !== "ADMIN" &&
      !formData.licenseNumber
    )
      tempErrors.licenseNumber = "License number is required for this role";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const fullPhoneNumber = `+63${phoneNumber}`;
      const userData = {
        ...formData,
        phoneNumber: fullPhoneNumber,
      };
      console.log(formData);

      try {
        const response = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          console.log("Form submitted:", formData);
          toast.success("User account created successfully");
          setShowNotification(true);
          // Reset form data
          setFormData({
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
          });
          setTimeout(() => {
            if (typeof onClose === "function") {
              onClose();
            }
          }, 2000);
        } else {
          // Log the full response for debugging
          console.error("Error response:", await response.text());
          toast.error(
            "Failed to create user account. Check console for details.",
          );
        }
      } catch (error) {
        console.error("Error creating user account:", error);
        toast.error("An unexpected error occurred.");
      }
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <Modal
      size="2xl"
      // isOpen={visibleModal === "addPetPatient"}
      onClose={closeModal}
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="justify-center text-center text-xl">
            Add Staff or User
          </ModalHeader>
          {showNotification && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">Account Created Successfully!</span>
            </Alert>
          )}
          <ModalBody>
            <div className="gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    isRequired
                    className=""
                    type="text"
                    label="First Name"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <span className="text-xs text-red-500">
                      {errors.firstName}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    isRequired
                    className=""
                    type="text"
                    label="Last Name"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <span className="text-xs text-red-500">
                      {errors.lastName}
                    </span>
                  )}
                </div>
                <div>
                  <Select
                    isRequired
                    label="Sex"
                    placeholder="Choose Sex"
                    value={formData.sex}
                    onChange={(e) => handleSelectChange("sex", e.target.value)}
                    isInvalid={!!errors.sex}
                  >
                    {SexProp.map((sex) => (
                      <SelectItem value={sex.key} key={sex.key}>
                        {sex.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.sex && (
                    <span className="text-xs text-red-500">{errors.sex}</span>
                  )}
                </div>
                <div className="flex grid-cols-2 gap-4 ">
                  <div>
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
                    />
                    {errors.birthDate && (
                      <span className="text-xs text-red-500">
                        {errors.birthDate}
                      </span>
                    )}
                  </div>
                  <div>
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
                  <div>
                    <Input
                      isRequired
                      type="email"
                      label="Email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div>
                    <Input
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
                        input: "pl-1", // Add left padding to input to prevent overlap with country code
                        innerWrapper: "bg-transparent",
                      }}
                    />
                  </div>
                  <div>
                    <Select
                      isRequired
                      label="Clinic Role"
                      placeholder="Choose Clinic Role"
                      value={formData.role}
                      onChange={(e) =>
                        handleSelectChange("role", e.target.value)
                      }
                      className="col-span-2"
                      isInvalid={!!errors.role}
                    >
                      {RoleProp.map((role) => (
                        <SelectItem value={role.key} key={role.key}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </Select>
                    {errors.role && (
                      <span className="text-xs text-red-500">
                        {errors.role}
                      </span>
                    )}
                  </div>
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
                      />
                      {errors.licenseNumber && (
                        <span className="text-xs text-red-500">
                          {errors.licenseNumber}
                        </span>
                      )}

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
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" type="submit">
              Done
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddClinicStaffModal;

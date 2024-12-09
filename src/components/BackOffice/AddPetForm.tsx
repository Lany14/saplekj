"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const speciesOptions = ["Dog", "Cat", "Bird"];
const breedOptions = {
  Dog: ["Shih Tzu", "Pomeranian", "Beagle", "Pug", "Golden Retriever"],
  Cat: ["Siamese", "British Shorthair", "Maine", "Persian", "Sphynx", "Calico"],
  Bird: ["Cockatiel", "Parrot", "Parakeet", "Lovebirds", "Dove"],
};

const AddPetForm: React.FC = () => {
  const [formData, setFormData] = useState({
    petName: "",
    petSex: "",
    petSpecies: "",
    petBreed: "",
    petBirthdate: "",
    petAge: "",
    petWeight: "",
    petColorAndMarkings: "",
  });

  const [errors, setErrors] = useState({
    petName: "",
    petSex: "",
    petSpecies: "",
    petBreed: "",
    petBirthdate: "",
    petAge: "",
  });

  const validateForm = () => {
    const newErrors = { ...errors };

    newErrors.petName = formData.petName ? "" : "Pet name is required.";
    newErrors.petSex = formData.petSex ? "" : "Please select the sex.";
    newErrors.petSpecies = formData.petSpecies ? "" : "Species is required.";
    newErrors.petBreed = formData.petBreed ? "" : "Breed is required.";
    newErrors.petBirthdate = formData.petBirthdate
      ? ""
      : "Birth date is required.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const calculateAge = useCallback((birthdate: string) => {
    const today = new Date();
    const petBirthDate = new Date(birthdate);

    let petAgeYears = today.getFullYear() - petBirthDate.getFullYear();
    let petAgeMonths = today.getMonth() - petBirthDate.getMonth();

    if (petAgeMonths < 0) {
      petAgeYears--;
      petAgeMonths += 12;
    }

    const petAgeFormatted = `${petAgeYears} yr${petAgeYears !== 1 ? "s" : ""}${
      petAgeMonths > 0
        ? ` and ${petAgeMonths} mo${petAgeMonths !== 1 ? "s" : ""}`
        : ""
    }`;

    return petAgeFormatted;
  }, []);

  useEffect(() => {
    if (formData.petBirthdate) {
      const petAge = calculateAge(formData.petBirthdate);
      setFormData((prev) => ({ ...prev, petAge }));
    }
  }, [formData.petBirthdate, calculateAge]);

  const handleSpeciesChange = (species: string) => {
    setFormData((prev) => ({
      ...prev,
      petSpecies: species,
      petBreed: "", // Reset breed when species changes
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Current form data:", formData);
    const isFormValid = validateForm();
    console.log("Validation result:", isFormValid);
    console.log("Validation errors:", errors);
    if (validateForm()) {
      console.log("Form data after passing validation:", formData);
      try {
        const response = await fetch("/api/add-pet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Pet added successfully");
          setFormData({
            petName: "",
            petSex: "",
            petSpecies: "",
            petBreed: "",
            petBirthdate: "",
            petAge: "",
            petWeight: "",
            petColorAndMarkings: "",
          });
        } else {
          toast.error("Failed to add pet.");
        }
      } catch (error) {
        console.error("Error adding pet:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <CardBody>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Add Pet Profile</p>
              <p className="text-small text-default-500">
                Add a new pet profile to your account
              </p>
            </div>
          </CardHeader>
          <div className="gap-4 md:grid md:grid-cols-2">
            <Input
              isRequired
              label="Pet Name"
              name="petName"
              value={formData.petName}
              onChange={handleInputChange}
              isInvalid={!!errors.petName}
              errorMessage={errors.petName}
            />
            <Select
              isRequired
              label="Sex"
              name="petSex"
              value={formData.petSex}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "petSex", value: e.target.value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              isInvalid={!!errors.petSex}
              errorMessage={errors.petSex}
            >
              <SelectItem key="male" value="male">
                Male
              </SelectItem>
              <SelectItem key="female" value="female">
                Female
              </SelectItem>
            </Select>
            <Select
              isRequired
              label="Species"
              name="petSpecies"
              value={formData.petSpecies}
              onChange={(e) => handleSpeciesChange(e.target.value)}
              isInvalid={!!errors.petSpecies}
              errorMessage={errors.petSpecies}
            >
              {speciesOptions.map((species) => (
                <SelectItem key={species} value={species}>
                  {species}
                </SelectItem>
              ))}
            </Select>
            <Select
              isRequired
              label="Breed"
              name="petBreed"
              value={formData.petBreed}
              onChange={handleInputChange}
              isInvalid={!!errors.petBreed}
              errorMessage={errors.petBreed}
            >
              {(
                breedOptions[
                  formData.petSpecies as keyof typeof breedOptions
                ] || []
              ).map((breed) => (
                <SelectItem key={breed} value={breed}>
                  {breed}
                </SelectItem>
              ))}
            </Select>
            <Input
              isRequired
              type="date"
              label="Birthdate"
              name="petBirthdate"
              value={formData.petBirthdate}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]}
              isInvalid={!!errors.petBirthdate}
              errorMessage={errors.petBirthdate}
            />
            <Input
              isReadOnly
              label="Age"
              name="petAge"
              value={formData.petAge}
              isInvalid={!!errors.petAge}
              errorMessage={errors.petAge}
            />
          </div>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button color="primary" type="submit">
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddPetForm;

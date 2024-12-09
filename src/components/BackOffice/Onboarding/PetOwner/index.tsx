"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Tabs,
  Tab,
  Input,
  Button,
  Card,
  CardBody,
  SelectItem,
  Select,
  Divider,
  Textarea,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { TrashIcon } from "lucide-react";

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

  // Pet Data
  petName: string;
  petSex: string;
  petSpecies: string;
  petBreed: string;
  petBirthdate: string;
  petAge: string;
  petWeight: string;
  petColorAndMarkings: string;
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

  // Pet Data
  petName?: string;
  petSex?: string;
  petSpecies?: string;
  petBreed?: string;
  petBirthdate?: string;
  petAge?: string;
  petWeight?: string;
  petColorAndMarkings?: string;

  // credit/debit data
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

interface PetProfile {
  petName: string;
  petSex: string;
  petSpecies: string;
  petBreed: string;
  petBirthdate: string;
  petAge: string;
  petWeight: string;
  petColorAndMarkings: string;
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
  petName: "",
  petSex: "",
  petSpecies: "",
  petBreed: "",
  petBirthdate: "",
  petAge: "",
  petWeight: "",
  petColorAndMarkings: "",
};

const INITIAL_PET_PROFILE: PetProfile = {
  petName: "",
  petSex: "",
  petSpecies: "",
  petBreed: "",
  petBirthdate: "",
  petAge: "",
  petWeight: "",
  petColorAndMarkings: "",
};

const PetOwnerOnboardingForm = () => {
  const { data: session } = useSession();
  const [selected, setSelected] = useState("personal");
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [petProfiles, setPetProfiles] = useState<PetProfile[]>([]);
  const [currentPet, setCurrentPet] = useState<PetProfile>(INITIAL_PET_PROFILE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
  };

  const tabs = useMemo(() => ["personal", "addPet", "addPaymentInfo"], []);
  const currentIndex = tabs.indexOf(selected);

  const isValid = phoneNumber.length === 10;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [],
  );

  const handlePetInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const petFieldName = `pet${name.charAt(0).toUpperCase() + name.slice(1)}`;
      setCurrentPet((prev) => ({ ...prev, [petFieldName]: value }));
      setErrors((prev) => ({ ...prev, [petFieldName]: "" }));
    },
    [],
  );

  const validatePaymentForm = useCallback(() => {
    let isValid = true;
    const newErrors = {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    };

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
      isValid = false;
    }

    if (cardName.trim().length === 0) {
      newErrors.cardName = "Card name is required";
      isValid = false;
    }

    if (expiryDate.length !== 5) {
      newErrors.expiryDate = "Invalid expiry date";
      isValid = false;
    } else {
      const [month, year] = expiryDate.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Card has expired";
        isValid = false;
      }
    }

    if (cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [cardName, cardNumber, cvv.length, expiryDate]);

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

  const handleAddPet = useCallback(() => {
    if (validateForm()) {
      setPetProfiles((prev) => [...prev, currentPet]);
      setCurrentPet(INITIAL_PET_PROFILE);
    }
  }, [currentPet, validateForm]);

  const handleDeletePet = useCallback((indexToDelete: number) => {
    setPetProfiles((prev) =>
      prev.filter((_, index) => index !== indexToDelete),
    );
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

  const calculateAge = useCallback(
    (birthdate: string, petBirthdate: string) => {
      const today = new Date();
      const birthDate = new Date(birthdate);
      const petBirthDate = new Date(petBirthdate);

      let ageYears = today.getFullYear() - birthDate.getFullYear();
      let petAgeYears = today.getFullYear() - petBirthDate.getFullYear();
      let ageMonths = today.getMonth() - birthDate.getMonth();
      let petAgeMonths = today.getMonth() - petBirthDate.getMonth();

      if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
      }
      if (petAgeMonths < 0) {
        petAgeYears--;
        petAgeMonths += 12;
      }

      if (today.getDate() < birthDate.getDate()) ageMonths--;
      if (today.getDate() < petBirthDate.getDate()) petAgeMonths--;

      const petAgeFormatted = `${petAgeYears} yr${petAgeYears !== 1 ? "s" : ""}${
        petAgeMonths > 0
          ? ` and ${petAgeMonths} mo${petAgeMonths !== 1 ? "s" : ""}`
          : ""
      }`;

      return { age: ageYears, petAge: petAgeFormatted };
    },
    [],
  );

  useEffect(() => {
    if (formData.birthDate && currentPet.petBirthdate) {
      const { age, petAge } = calculateAge(
        formData.birthDate,
        currentPet.petBirthdate,
      );
      setFormData((prev) => ({ ...prev, age: age.toString() }));
      setCurrentPet((prev) => ({ ...prev, petAge }));
    }
  }, [formData.birthDate, currentPet.petBirthdate, calculateAge]);

  const handleSubmit = useCallback(() => {
    if (validateForm() && validatePaymentForm()) {
      const fullPhoneNumber = `+63${phoneNumber}`;
      const fullAddress = `${formData.streetAddress}, ${formData.city}, ${formData.province}, ${formData.barangay}, ${formData.zipCode}`;

      const userData = {
        ...formData,
        phoneNumber: fullPhoneNumber,
        address: fullAddress,
        pets: petProfiles,
        paymentInfo: {
          cardNumber,
          cardName,
          expiryDate,
          cvv,
        },
      };

      console.log("Form submitted:", userData);
      alert("Onboarding completed successfully!");
    }
  }, [
    validateForm,
    validatePaymentForm,
    formData,
    phoneNumber,
    petProfiles,
    cardNumber,
    cardName,
    expiryDate,
    cvv,
  ]);

  const handleNext = useCallback(() => {
    if (currentIndex < tabs.length - 1) {
      setSelected(tabs[currentIndex + 1]);
    }
  }, [currentIndex, tabs]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setSelected(tabs[currentIndex - 1]);
    }
  }, [currentIndex, tabs]);

  // Rest of the JSX remains the same...
  return (
    <Card className="p-4">
      <Tabs
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
        aria-label="Onboarding steps"
      >
        <Tab key="personal" title="Personal Info">
          <CardBody>
            <form className="gap-4 md:grid md:grid-cols-2">
              <Input
                isRequired
                label="First Name"
                name="firstName"
                value={
                  session?.petOwnerProfile?.firstName || formData.firstName
                }
                onChange={handleInputChange}
                isInvalid={!!errors.firstName}
                errorMessage={errors.firstName}
              />
              <Input
                isRequired
                label="Last Name"
                name="lastName"
                value={session?.petOwnerProfile?.lastName || formData.lastName}
                onChange={handleInputChange}
                isInvalid={!!errors.lastName}
                errorMessage={errors.lastName}
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
              />
              <Input
                isRequired
                label="Phone Number"
                placeholder="ex. 9XXXXXXXXX"
                value={session?.user?.phoneNumber || phoneNumber}
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
              <div className="col-span-2">
                <Divider className="my-4" />
              </div>
              <Input
                isRequired
                className="col-span-2"
                label="Street Address"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                isInvalid={!!errors.streetAddress}
                errorMessage={errors.streetAddress}
              />
              <Input
                isRequired
                label="Province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                isInvalid={!!errors.province}
                errorMessage={errors.province}
              />
              <Input
                isRequired
                label="Municipality/City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                isInvalid={!!errors.city}
                errorMessage={errors.city}
              />
              <Input
                isRequired
                label="Barangay"
                name="barangay"
                value={formData.barangay}
                onChange={handleInputChange}
                isInvalid={!!errors.barangay}
                errorMessage={errors.barangay}
              />
              <Input
                isRequired
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                isInvalid={!!errors.zipCode}
                errorMessage={errors.zipCode}
              />
            </form>
          </CardBody>
        </Tab>
        <Tab key="addPet" title="Pet Info">
          <CardBody>
            <h3 className="text-lg font-semibold">Added Pets:</h3>
            {petProfiles.map((pet, index) => (
              <div
                key={index}
                className="flex justify-between rounded-xl border border-default-200 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex flex-col">
                    <span>{pet.petName}</span>
                    <span className="text-tiny text-default-500">
                      {pet.petSpecies}
                    </span>
                    <span className="text-tiny text-default-500">
                      {pet.petBreed}
                    </span>
                  </div>
                </div>
                <div>
                  <Button
                    className="items-center"
                    isIconOnly
                    color="danger"
                    onClick={() => handleDeletePet(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div>
              <form className="gap-4 md:grid md:grid-cols-2">
                <Input
                  isRequired
                  label="Pet Name"
                  name="name"
                  value={currentPet.petName}
                  onChange={handlePetInputChange}
                  isInvalid={!!errors.petName}
                  errorMessage={errors.petName}
                />
                <Select
                  isRequired
                  label="Sex"
                  name="sex"
                  value={currentPet.petSex}
                  onChange={(e) =>
                    handlePetInputChange({
                      target: { name: "sex", value: e.target.value },
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
                <Input
                  isRequired
                  label="Species"
                  name="species"
                  value={currentPet.petSpecies}
                  onChange={handlePetInputChange}
                  isInvalid={!!errors.petSpecies}
                  errorMessage={errors.petSpecies}
                />
                <Input
                  isRequired
                  label="Breed"
                  name="breed"
                  value={currentPet.petBreed}
                  onChange={handlePetInputChange}
                  isInvalid={!!errors.petBreed}
                  errorMessage={errors.petBreed}
                />
                <div className="md:flex ">
                  <Input
                    isRequired
                    type="date"
                    label="Birthdate"
                    name="birthdate"
                    value={currentPet.petBirthdate}
                    onChange={handlePetInputChange}
                    max={new Date().toISOString().split("T")[0]}
                    isInvalid={!!errors.petBirthdate}
                    errorMessage={errors.petBirthdate}
                  />
                  <Input
                    isRequired
                    isReadOnly
                    type="text"
                    label="Age"
                    name="age"
                    value={currentPet.petAge}
                    isInvalid={!!errors.petAge}
                    errorMessage={errors.petAge}
                  />
                </div>

                <Input
                  isRequired
                  label="Weight"
                  name="weight"
                  value={currentPet.petWeight}
                  onChange={handlePetInputChange}
                  isInvalid={!!errors.petWeight}
                  errorMessage={errors.petWeight}
                />
                <Textarea
                  placeholder="Describe your Pet"
                  className="max-w col-span-2"
                  label="Color and Markings"
                  name="colorAndMarkings"
                  value={currentPet.petColorAndMarkings}
                  onChange={handlePetInputChange}
                  isInvalid={!!errors.petColorAndMarkings}
                  errorMessage={errors.petColorAndMarkings}
                />
                <Button onClick={handleAddPet} color="primary">
                  Add Pet
                </Button>
              </form>
            </div>
          </CardBody>
        </Tab>
        <Tab key="addPaymentInfo" title="Payment Info">
          <CardBody>
            <form className="gap-4 md:grid md:grid-cols-2">
              <Input
                isRequired
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                errorMessage={errors.cardNumber}
              />
              <Input
                isRequired
                label="Cardholder Name"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                errorMessage={errors.cardName}
              />
              <Input
                isRequired
                label="Expiry Date"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                maxLength={5}
                errorMessage={errors.expiryDate}
              />
              <Input
                isRequired
                label="CVV"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={3}
                type="password"
                errorMessage={errors.cvv}
              />
            </form>
          </CardBody>
        </Tab>
      </Tabs>
      <div className="mt-4 flex justify-between">
        <Button onClick={handlePrevious} disabled={currentIndex === 0}>
          Previous
        </Button>
        {currentIndex === tabs.length - 1 ? (
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentIndex === tabs.length - 1}
          >
            Next
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PetOwnerOnboardingForm;

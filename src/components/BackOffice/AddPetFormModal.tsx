import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

const AddPetFormModal: React.FC = () => {
  const [formData, setFormData] = useState({
    petName: "",
    sex: "",
    species: "",
    breed: "",
    birthDate: "",
    age: "",
    weight: "",
    colorSpecialMarkings: "",
  });

  const [errors, setErrors] = useState({
    petName: "",
    sex: "",
    species: "",
    breed: "",
    birthDate: "",
    age: "",
    weight: "",
    colorSpecialMarkings: "",
  });

  const [selection, setSelection] = useState("birthday");
  const [monthOrYear, setMonthOrYear] = useState("year");

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

  useEffect(() => {
    if (formData.birthDate) {
      const calculatedAge = calculateAge(formData.birthDate);
      setFormData((prevData) => ({
        ...prevData,
        age: calculatedAge.toString(),
      }));
    }
  }, [formData.birthDate]);

  const validateForm = () => {
    const newErrors = { ...errors };

    newErrors.petName = formData.petName ? "" : "Pet name is required.";
    newErrors.sex = formData.sex ? "" : "Please select the sex.";
    newErrors.species = formData.species ? "" : "Species is required.";
    newErrors.breed = formData.breed ? "" : "Breed is required.";
    newErrors.birthDate = formData.birthDate ? "" : "Birth date is required.";
    newErrors.age = formData.age ? "" : "Age is required.";
    newErrors.weight =
      formData.weight && !isNaN(Number(formData.weight))
        ? ""
        : "Weight must be a number.";

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Perform form submission actions here (e.g., send data to the backend)
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <ModalContent>
      {(onClose) => (
        <form onSubmit={handleSubmit}>
          <ModalHeader className="justify-center text-center text-xl">
            Add Pet Record
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Input
                  isRequired
                  type="text"
                  label="Pet's Name"
                  id="petName"
                  name="petName"
                  value={formData.petName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.petName}
                />
                {errors.sex && (
                  <span className="text-xs text-red-500">{errors.petName}</span>
                )}
              </div>
              <div className="col-span-2">
                <RadioGroup
                  isRequired
                  label="Sex"
                  orientation="horizontal"
                  value={formData.sex}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sex: value })
                  }
                  isInvalid={!!errors.sex}
                >
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </RadioGroup>
                {errors.sex && (
                  <span className="text-xs text-red-500">{errors.sex}</span>
                )}
              </div>
              <div className="col-span-2">
                <Input
                  isRequired
                  type="text"
                  label="Species"
                  placeholder="ex. Cat, Dog, etc."
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  // helperText={errors.species}
                  isInvalid={!!errors.species}
                />
                {errors.sex && (
                  <span className="text-xs text-red-500">{errors.species}</span>
                )}
              </div>
              <div className="col-span-2">
                <Input
                  isRequired
                  type="text"
                  label="Breed"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  // helperText={errors.breed}
                  isInvalid={!!errors.breed}
                />
                {errors.sex && (
                  <span className="text-xs text-red-500">{errors.breed}</span>
                )}
              </div>
              <div className="col-span-2">
                <RadioGroup
                  value={selection}
                  onValueChange={setSelection}
                  defaultValue="birthday"
                  // onValueChange={setInputType}
                  className="flex space-x-4"
                  label="Birthday or Age"
                  orientation="horizontal"
                >
                  <Radio value="birthday">Birthday</Radio>
                  <Radio value="age">Age</Radio>
                </RadioGroup>
              </div>

              {selection === "birthday" ? (
                <div className="col-span-2">
                  <Input
                    label="Date"
                    type="date"
                    placeholder="MM/DD/YYYY"
                    labelPlacement="outside"
                  />
                </div>
              ) : (
                <div className="col-span-2">
                  <span className="text-sm font-light">Month or year</span>
                  <div className="flex space-x-4">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="bordered" className="w-32">
                          {monthOrYear}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Month or year selection"
                        onAction={(key) => setMonthOrYear(key.toString())}
                      >
                        <DropdownItem key="month">Month</DropdownItem>
                        <DropdownItem key="year">Year</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <Input
                      type="number"
                      placeholder="Enter number"
                      labelPlacement="outside"
                    />
                  </div>
                </div>
              )}
              {/* <div>
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
                {errors.age && (
                  <span className="text-xs text-red-500">{errors.age}</span>
                )}
              </div> */}
              <div className="col-span-4">
                <Input
                  isRequired
                  type="text"
                  label="Weight (in kg)"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  // helperText={errors.weight}
                  isInvalid={!!errors.weight}
                />
                {errors.sex && (
                  <span className="text-xs text-red-500">{errors.weight}</span>
                )}
              </div>

              <Textarea
                label="Color and Special Markings"
                placeholder="Enter Pet Special Markings"
                className="col-span-4"
                name="specialMarkings"
                value={formData.colorSpecialMarkings}
                onChange={handleInputChange}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={onClose}>
              Close
            </Button>
            <Button color="primary" type="submit">
              Done
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
};

export default AddPetFormModal;

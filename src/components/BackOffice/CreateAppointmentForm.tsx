"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateAppointmentForm: React.FC = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    petId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "", // Renamed from startTime to appointmentTime for clarity
    note: "",
  });
  const [pets, setPets] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorAvailability, setDoctorAvailability] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [isDoctorSelectable, setIsDoctorSelectable] = useState(false);
  const router = useRouter();

  // Fetch pets and doctors data on component load
  useEffect(() => {
    if (session?.user?.role === "PET_OWNER") {
      // Fetch pets owned by the owner
      fetch("/api/pets")
        .then((res) => res.json())
        .then((data) => setPets(data));
    }

    // Fetch doctors
    fetch("/api/users/vet-docs")
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, [session?.user]);

  // Handle changes to appointment date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, appointmentDate: value }));
    setIsDoctorSelectable(!!value);
  };

  const handleDoctorChange = async (doctorId: string) => {
    setFormData((prev) => ({ ...prev, doctorId }));
    if (!formData.appointmentDate) {
      return;
    }

    const response = await fetch(
      `/api/doctors/schedule?doctorId=${doctorId}&date=${formData.appointmentDate}`,
    );
    const data = await response.json();
    setDoctorAvailability(data.availableSlots || []);
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.petId) newErrors.petId = "Pet is required.";
    if (!formData.doctorId) newErrors.doctorId = "Doctor is required.";
    if (!formData.appointmentDate)
      newErrors.appointmentDate = "Date is required.";
    if (!formData.appointmentTime)
      newErrors.appointmentTime = "Time is required.";

    setErrors(newErrors);
    console.log("Validation Errors:", newErrors); // Add this log
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submit button clicked");
    e.preventDefault();
    const isValid = validateForm();
    console.log("Form is valid:", isValid);
    if (!isValid) return;

    // Log formData values to ensure they are set correctly
    console.log("Form Data - Pet ID:", formData.petId);
    console.log("Form Data - Doctor ID:", formData.doctorId);
    console.log("Form Data - Appointment Date:", formData.appointmentDate);
    console.log(
      "Form Data - Appointment Time (index):",
      formData.appointmentTime,
    );
    console.log("Form Data - Note:", formData.note);

    // Retrieve the actual time value from doctorAvailability array
    const selectedTimeValue =
      doctorAvailability[parseInt(formData.appointmentTime)];
    console.log("Selected Time Value:", selectedTimeValue);

    // Extract the time part from selectedTimeValue
    const timeString = new Date(selectedTimeValue).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Combine `appointmentDate` and `timeString` into `startTime` ISO string
    const startTime =
      formData.appointmentDate && timeString
        ? new Date(`${formData.appointmentDate}T${timeString}`).toISOString()
        : null;

    // Log the computed startTime to verify its format
    console.log("Computed startTime:", startTime);

    const payload = {
      petId: formData.petId,
      doctorId: formData.doctorId,
      appointmentDate: new Date(formData.appointmentDate).toISOString(), // Only date part
      startTime: startTime, // Combined date and time
      note: formData.note || "",
    };

    // Log the final payload to see what is being sent to the server
    console.log("Submitting form with data:", payload);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Appointment created successfully");
        router.push("/dashboard/appointment");
      } else {
        const errorData = await response.json();
        console.error("Failed to create appointment:", errorData);
        toast.error("Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <CardBody>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Create Appointment</p>
              <p className="text-small text-default-500">
                Schedule a new appointment for your pet
              </p>
            </div>
          </CardHeader>
          <div className="gap-4 md:grid md:grid-cols-2">
            <Select
              isRequired
              label="Select Pet"
              name="petId"
              value={formData.petId}
              onChange={handleInputChange}
              isInvalid={!!errors.petId}
              errorMessage={errors.petId}
            >
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {pet.petName}
                </SelectItem>
              ))}
            </Select>

            <Input
              isRequired
              label="Appointment Date"
              name="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              onChange={handleDateChange}
              isInvalid={!!errors.appointmentDate}
              errorMessage={errors.appointmentDate}
            />

            <Select
              isRequired
              label="Select Doctor"
              name="doctorId"
              value={formData.doctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
              isDisabled={!isDoctorSelectable}
              isInvalid={!!errors.doctorId}
              errorMessage={errors.doctorId}
            >
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Select Time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={(e) => {
                console.log("Selected time:", e.target.value); // Log the selected time
                setFormData((prevData) => ({
                  ...prevData,
                  appointmentTime: e.target.value,
                }));
              }}
              isInvalid={!!errors.appointmentTime}
              errorMessage={errors.appointmentTime}
            >
              {doctorAvailability.map((time, index) => {
                // Format each available time as HH:MM
                const formattedTime = new Date(time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
                return (
                  <SelectItem key={index} value={formattedTime}>
                    {formattedTime}
                  </SelectItem>
                );
              })}
            </Select>

            <Textarea
              label="Additional Notes"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
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

export default CreateAppointmentForm;

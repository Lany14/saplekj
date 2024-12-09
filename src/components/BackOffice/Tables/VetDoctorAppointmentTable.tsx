"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  status: string;
  pet: {
    petName: string;
    petSpecies: string;
  };
  petOwner?: {
    firstName: string;
    lastName: string;
  };
}

export default function VetDoctorAppointmentTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments");
        const data = await response.json();

        console.log("API Response Data:", data);

        if (Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleApprove = async (id: string) => {
    console.log(`Appointment ${id} Approved`);
    try {
      const response = await fetch(`/api/appointments/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: id }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Appointment approved:", result);
        // Optionally, update the table to reflect the new status
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id
              ? { ...appointment, status: "APPROVED" }
              : appointment,
          ),
        );
      } else {
        console.error("Error approving appointment:", result.error);
        alert(result.error || "Failed to approve the appointment");
      }
    } catch (error) {
      console.error("Error in handleApprove:", error);
      alert("An error occurred while approving the appointment");
    }
  };

  const handleDeny = (id: string) => {
    console.log(`Appointment ${id} Denied`);
  };

  return (
    <div className="vet-doctor-appointment-table-container">
      <h2>Appointments</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table
          aria-label="Vet Doctor's Appointments Table"
          css={{ height: "auto", minWidth: "100%" }}
        >
          <TableHeader>
            <TableColumn>Pet</TableColumn>
            <TableColumn>Species</TableColumn>
            <TableColumn>Pet Owner</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Time</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No appointments found">
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.pet?.petName || "N/A"}</TableCell>
                <TableCell>{appointment.pet?.petSpecies || "N/A"}</TableCell>
                <TableCell>
                  {appointment.petOwner
                    ? `${appointment.petOwner.firstName || "N/A"} ${appointment.petOwner.lastName || "N/A"}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {appointment.date
                    ? new Date(appointment.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "Invalid Date"}
                </TableCell>
                <TableCell>
                  {appointment.startTime
                    ? new Date(appointment.startTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )
                    : "Invalid Time"}
                </TableCell>
                <TableCell>{appointment.status || "N/A"}</TableCell>
                <TableCell>
                  <Dropdown placement="bottom-right">
                    <DropdownTrigger>
                      <Button isIconOnly auto size="sm" variant="light">
                        ⋮
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key="approve"
                        color="success"
                        onClick={() => handleApprove(appointment.id)}
                      >
                        Approve
                      </DropdownItem>
                      <DropdownItem
                        key="deny"
                        color="danger"
                        onClick={() => handleDeny(appointment.id)}
                      >
                        Deny
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

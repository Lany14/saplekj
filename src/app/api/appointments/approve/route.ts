import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createGoogleCalendarEvent } from "@/lib/google"; // Use the Google Calendar helper function

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.error("Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    // Only Vet Doctor can approve appointments
    if (userRole !== "VET_DOCTOR") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const body = await request.json();
    console.log("Request body:", body);
    const { appointmentId } = body;

    if (!appointmentId) {
      console.error("Missing appointment ID.");
      return NextResponse.json(
        { error: "Missing appointment ID" },
        { status: 400 },
      );
    }

    // Fetch the appointment to ensure it exists
    const appointment = await prismaClient.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        veterinarian: {
          select: {
            user: { select: { email: true, name: true } }, // Fix email field
          },
        },
        petOwner: {
          select: {
            user: { select: { email: true, name: true } }, // Fix email field
          },
        },
        pet: { select: { petName: true } },
      },
    });

    console.log("Fetched appointment:", appointment);

    if (!appointment) {
      console.error("Appointment not found.");
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Ensure the appointment belongs to the Vet Doctor approving it
    const vetProfile = await prismaClient.doctorNurseProfile.findUnique({
      where: { doctorNurseId: session.user.id },
    });

    if (!vetProfile || vetProfile.id !== appointment.veterinarianId) {
      return NextResponse.json(
        { error: "Unauthorized action on this appointment" },
        { status: 403 },
      );
    }

    // Update the appointment status to "APPROVED"
    const updatedAppointment = await prismaClient.appointment.update({
      where: { id: appointmentId },
      data: { status: "APPROVED" },
    });

    const eventStartTime = new Date(appointment.startTime); // Use consistent start time
    const eventEndTime = new Date(eventStartTime.getTime() + 3600 * 1000); // Add 1 hour duration

    // Create a single calendar event for both vet doctor and pet owner
    const calendarEvent = await createGoogleCalendarEvent({
      email: appointment.veterinarian.user.email, // Use the vet's account to create the event
      title: `Appointment for ${appointment.pet.petName}`,
      description: `Online cosultation for your pet`,
      start: eventStartTime,
      end: eventEndTime,
      timeZone: "Asia/Manila", // Adjust as needed
      attendees: [
        appointment.veterinarian.user.email,
        appointment.petOwner.user.email,
      ],
    });

    // Save the Google Meet link to the database
    await prismaClient.appointment.update({
      where: { id: appointmentId },
      data: {
        googleMeetLink: calendarEvent.hangoutLink,
        status: "APPROVED",
      },
    });

    return NextResponse.json({
      message: "Appointment approved and added to calendars",
      appointment: updatedAppointment,
      calendarEvent,
    });
  } catch (error) {
    console.error("Error approving appointment:", error);
    return NextResponse.json(
      { error: "Failed to approve appointment", details: error.message },
      { status: 500 },
    );
  }
}

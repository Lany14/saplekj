import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session Data:", session);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;
    const userId = session.user.id;
    let appointments = [];

    if (userRole === "PET_OWNER") {
      // Fetch the PetOwnerProfile associated with this user
      const petOwnerProfile = await prismaClient.petOwnerProfile.findUnique({
        where: { petOwnerId: userId },
        select: { id: true },
      });

      if (!petOwnerProfile) {
        return NextResponse.json(
          { error: "No PetOwner profile found" },
          { status: 404 },
        );
      }

      const petOwnerId = petOwnerProfile.id;
      console.log("Fetched petOwnerId:", petOwnerId);

      // Fetch appointments for this petOwnerId
      appointments = await prismaClient.appointment.findMany({
        where: {
          petOwnerId: petOwnerId,
        },
        select: {
          id: true,
          date: true,
          startTime: true,
          status: true,
          note: true,
          pet: {
            select: {
              petName: true,
            },
          },
          veterinarian: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          petOwner: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    } else if (userRole === "VET_DOCTOR") {
      // Fetch the DoctorNurseProfile associated with this user
      const doctorProfile = await prismaClient.doctorNurseProfile.findUnique({
        where: { doctorNurseId: userId },
        select: { id: true },
      });

      if (!doctorProfile) {
        return NextResponse.json(
          { error: "No Doctor/Nurse profile found" },
          { status: 404 },
        );
      }

      const veterinarianId = doctorProfile.id;
      console.log("Fetched veterinarianId:", veterinarianId);

      // Fetch appointments for this veterinarianId
      appointments = await prismaClient.appointment.findMany({
        where: {
          veterinarianId: veterinarianId,
        },
        select: {
          id: true,
          date: true,
          startTime: true,
          status: true,
          pet: {
            select: {
              petName: true,
              petSpecies: true,
            },
          },
          petOwner: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    } else {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    console.log("Fetched appointments:", appointments);

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the user is a PET_OWNER before proceeding
    if (session.user.role !== "PET_OWNER") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const data = await request.json();

    // Validate the required fields
    if (
      !data.petId ||
      !data.doctorId ||
      !data.appointmentDate ||
      !data.startTime
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Fetch the petOwnerProfile to get the correct petOwnerId
    const petOwnerProfile = await prismaClient.petOwnerProfile.findUnique({
      where: { petOwnerId: session.user.id },
      select: { id: true },
    });

    if (!petOwnerProfile) {
      return NextResponse.json(
        { error: "No PetOwner profile found" },
        { status: 404 },
      );
    }

    // Use the PetOwnerProfile id as the petOwnerId for the appointment
    const petOwnerId = petOwnerProfile.id;

    // Convert dates to DateTime format
    const appointmentDate = new Date(data.appointmentDate);
    const startTime = new Date(data.startTime);

    // Create the appointment with petOwnerId included
    const appointment = await prismaClient.appointment.create({
      data: {
        petId: data.petId,
        veterinarianId: data.doctorId,
        petOwnerId: petOwnerId, // Use the fetched petOwnerId from PetOwnerProfile
        date: appointmentDate,
        startTime: startTime,
        note: data.note || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Appointment created", appointment },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment", details: error.message },
      { status: 500 },
    );
  }
}

// src/app/api/users/vet-docs/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vetDoctors = await prisma.doctorNurseProfile.findMany({
      where: {
        user: {
          role: "VET_DOCTOR",
        },
      },
      select: {
        id: true, // This is the correct id field for DoctorSchedule
        firstName: true,
        lastName: true,
        specialization: true, // Include other fields as necessary
      },
    });

    // Format data to include full name for easier selection in the frontend
    const formattedDoctors = vetDoctors.map((doctor) => ({
      id: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      specialization: doctor.specialization,
    }));

    return NextResponse.json(formattedDoctors, { status: 200 });
  } catch (error) {
    console.error("Error fetching vet doctors:", error);
    return NextResponse.json(
      { error: "Error fetching vet doctors", details: error.message },
      { status: 500 },
    );
  }
}

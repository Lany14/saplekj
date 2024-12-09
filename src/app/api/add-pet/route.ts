import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth"; // Use the appropriate method to get session in your setup
import { authOptions } from "@/lib/auth"; // Update with your NextAuth auth options path
import { generateId } from "@/src/utils/generateId";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get the user session to retrieve the owner ID
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch the petOwnerId from PetOwnerProfile using the user field
    const userProfile = await prisma.petOwnerProfile.findUnique({
      where: { petOwnerId: session.user.id },
    });

    if (!userProfile) {
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 },
      );
    }

    const petOwnerId = userProfile.id;

    // Extract pet data from request
    const {
      petName,
      petSex,
      petSpecies,
      petBreed,
      petAge,
      petWeight,
      petColorAndMarkings,
      birthDate,
    } = await request.json();

    console.log("Received data:", {
      petName,
      petSex,
      petSpecies,
      petBreed,
      petAge,
      petWeight,
      petColorAndMarkings,
      birthDate,
      petOwnerId,
    });

    // Create pet with the derived petOwnerId
    const pet = await prisma.pet.create({
      data: {
        petId: parseInt(generateId()),
        petName,
        petSex,
        petSpecies,
        petBreed,
        petAge,
        petWeight,
        petColorAndMarkings,
        petBirthdate: birthDate ? new Date(birthDate) : null,
        owner: {
          connect: {
            id: petOwnerId,
          },
        },
      },
    });

    console.log("Pet profile created successfully:", pet);

    return NextResponse.json(
      { message: "Pet profile created successfully", pet },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating pet profile:", error);
    return NextResponse.json(
      { message: "Error creating pet profile", error: error.message },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import { generatePassword } from "@/utils/passwordGenerator";
import { AccountCreatedEmail } from "@/components/Emails/AccountCreatedEmail";
import { prismaClient } from "@/lib/db";
import toast from "react-hot-toast";
import { generateId } from "@/src/utils/generateId";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      sex,
      birthDate,
      age,
      email,
      phoneNumber,
      role,
      licenseNumber,
      specialization,
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check for existing user by email
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({
        error: `User with email ${email} already exists`,
        status: 409,
      });
    }

    // Check for existing phone number across all profile types
    const profileTypes = [
      "adminProfile",
      "receptionistProfile",
      "doctorNurseProfile",
      "petOwnerProfile",
    ];
    const phoneNumberQueries = profileTypes.map((type) =>
      (prismaClient[type as keyof typeof prismaClient] as any).findUnique({
        where: { phoneNumber },
      }),
    );

    const existingProfiles = await Promise.all(phoneNumberQueries);
    if (existingProfiles.some((profile) => profile)) {
      return NextResponse.json({
        error: `Phone number ${phoneNumber} already exists`,
        status: 410,
      });
    }

    // Generate credentials
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userToken = Math.floor(100000 + Math.random() * 900000); // 6-digit token

    // Base user data
    const baseProfileData = {
      firstName,
      lastName,
      sex,
      birthDate: new Date(birthDate),
      age: parseInt(age),
      phoneNumber,
      user: {
        connect: { id: "" }, // Will be set after user creation
      },
    };

    // Create user and profile in a transaction
    const result = await prismaClient.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          userId: parseInt(generateId()),
          name: `${firstName} ${lastName}`,
          email,
          role,
          password: hashedPassword,
          token: userToken,
        },
      });

      baseProfileData.user.connect.id = user.id;

      switch (role) {
        case "PET_OWNER":
          await tx.petOwnerProfile.create({ data: baseProfileData });
          break;
        case "ADMIN":
          await tx.adminProfile.create({ data: baseProfileData });
          break;
        case "VET_DOCTOR":
        case "VET_NURSE":
          await tx.doctorNurseProfile.create({
            data: {
              ...baseProfileData,
              licenseNumber,
              specialization,
            },
          });
          break;
        case "VET_RECEPTIONIST":
          await tx.receptionistProfile.create({ data: baseProfileData });
          break;
      }

      return user;
    });

    // Send welcome email
    await resend.emails.send({
      from: "Abys Agrivet <noreply@abysagrivet.online>",
      to: email,
      subject: "Welcome to Abys Agrivet",
      react: AccountCreatedEmail({ firstName, email, password }),
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

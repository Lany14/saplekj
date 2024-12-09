"use server";

import { EmailVerification } from "@/components/Emails/EmailVerification";
import { prismaClient } from "@/lib/db";
import { SignUpInputProps } from "@/types/credInputs";
import { generateId } from "@/utils/generateId";
import bcrypt from "bcrypt";
import { exportTraceState } from "next/dist/trace";
import { Resend } from "resend";

export default async function signup(formData: SignUpInputProps) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { firstName, lastName, name, email, password, role } = formData;
  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      // throw new Error(`User with this email ( ${email})  already exists in the Database`);
      return {
        data: null,
        error: `User with this email (${email})  already exists in the Database`,
        status: 409,
      };
    }
    // Encrypt the Password =>bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    //Generate Token
    const generateToken = () => {
      const min = 100000; // Minimum 6-figure number
      const max = 999999; // Maximum 6-figure number
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const generatedUserId = generateId();
    const userToken = generateToken();
    const newUser = await prismaClient.user.create({
      data: {
        userId: parseInt(generatedUserId),
        name,
        email,
        password: hashedPassword,
        role,
        token: userToken,
      },
    });
    if (role === "PET_OWNER") {
      await prismaClient.petOwnerProfile.create({
        data: {
          firstName,
          lastName,
          user: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });
    }
    //Send an Email with the Token on the link as a search param
    const token = newUser.token;
    // const name = newUser.firstName.split(" ")[0];
    const linkText = "Verify your Account ";
    const message =
      "Thank you for registering with Abys Agrivet Vet Clinic Portal. To complete your registration and verify your email address, please enter the following 6-digit verification code on our website :";
    const sendMail = await resend.emails.send({
      from: "Abys Agrivet <noreply@abysagrivet.online>",
      to: email,
      subject: "Verify Your Email Address",
      react: EmailVerification({
        firstName,
        token: token ?? 0,
        linkText,
        message,
      }),
    });
    console.log(token);
    console.log(sendMail);
    console.log(newUser);
    return {
      data: newUser,
      error: null,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong",
    };
  }
}

export async function getUserById(id: string) {
  if (id) {
    try {
      const user = await prismaClient.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}

export async function updateUserById(id: string) {
  if (id) {
    try {
      const updatedUser = await prismaClient.user.update({
        where: {
          id,
        },
        data: {
          isVerified: true,
          emailVerified: new Date(),
        },
      });
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }
}

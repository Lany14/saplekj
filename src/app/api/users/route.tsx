export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prismaClient } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user's role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let users: {
      id: string;
      userId: number;
      name: string;
      email: string;
      status: string;
      role: string;
    }[] = [];

    // If user is ADMIN or VET_RECEPTIONIST, show all users
    if (["ADMIN", "VET_RECEPTIONIST"].includes(currentUser.role)) {
      users = await prisma.user.findMany({
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          status: true,
          role: true,
        },
      });
    }
    // If user is VET_DOCTOR or VET_NURSE, show only PET_OWNER users
    else if (["VET_DOCTOR", "VET_NURSE"].includes(currentUser.role)) {
      users = await prisma.user.findMany({
        where: {
          role: "PET_OWNER",
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          status: true,
          role: true,
        },
      });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

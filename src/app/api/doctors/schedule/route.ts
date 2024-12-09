import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  console.log("Received doctorId:", doctorId);
  console.log("Received date:", date);

  if (!doctorId || !date) {
    console.log("Missing doctorId or date");
    return NextResponse.json(
      { message: "Doctor ID and date are required" },
      { status: 400 },
    );
  }

  try {
    const dayOfWeek = new Date(date).getDay();
    console.log("Computed dayOfWeek:", dayOfWeek);

    const schedule = await prismaClient.doctorSchedule.findFirst({
      where: {
        doctorId: doctorId,
        dayOfWeek: dayOfWeek,
      },
    });
    console.log("Fetched schedule:", schedule);

    if (!schedule) {
      console.log("No schedule found for this day.");
      return NextResponse.json(
        { message: "No schedule found for this day." },
        { status: 404 },
      );
    }

    const appointments = await prismaClient.appointment.findMany({
      where: {
        veterinarianId: doctorId,
        date: new Date(date),
      },
      select: { startTime: true, endTime: true },
    });
    console.log("Fetched appointments for the date:", appointments);

    const startTime = new Date(schedule.startTime);
    const endTime = new Date(schedule.endTime);
    const slotDuration = 30 * 60 * 1000; // 30 minutes

    let availableSlots: string[] = [];

    for (
      let time = startTime;
      time < endTime;
      time = new Date(time.getTime() + slotDuration)
    ) {
      const isBooked = appointments.some(
        (appointment) =>
          new Date(appointment.startTime).getTime() === time.getTime(),
      );

      if (!isBooked) {
        availableSlots.push(time.toISOString());
      }
    }

    console.log("Available slots:", availableSlots);
    return NextResponse.json({ availableSlots });
  } catch (error: any) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { message: "Error fetching schedule", error: error.message },
      { status: 500 },
    );
  }
}

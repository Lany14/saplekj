"use client";

import Breadcrumb from "@/components/BackOffice/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import PendingAppointmentsTable from "@/src/components/BackOffice/Tables/AppointmentTable";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const CalendarPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Call the API route you created for fetching calendar events
        const response = await fetch("/api/calendar");
        const data = await response.json();
        console.log("Fetched Google Calendar data:", data); // Debug the fetched data

        if (response.ok && data.items) {
          // Debug individual event details
          data.items.forEach((event: any) => {
            console.log("Event start:", event.start);
            console.log("Event end:", event.end);
          });

          const fetchedEvents = data.items.map((event: any) => ({
            title: event.summary || "No title",
            start: new Date(
              event.start.dateTime || event.start.date,
            ).toISOString(), // Normalize timezone
            end: new Date(event.end.dateTime || event.end.date).toISOString(), // Normalize timezone
          }));

          console.log("Mapped events:", fetchedEvents); // Debug mapped events
          setEvents(fetchedEvents);
        } else {
          console.warn("No events found or failed to fetch calendar events.");
        }
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Refetch events periodically (e.g., every 5 minutes)
    const interval = setInterval(() => {
      fetchEvents();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        const response = await fetch(
          "/api/appointments/getPendingAppointments",
        );
        const data = await response.json();
        setPendingAppointments(data);
      } catch (error) {
        console.error("Failed to fetch pending appointments:", error);
      }
    };

    fetchPendingAppointments();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Calendar" />

        <h2 className="mt-4 text-lg font-semibold">
          Pending Appointment Approvals
        </h2>
        <PendingAppointmentsTable appointments={pendingAppointments} />

        <h1 className="mb-4 mt-8 text-xl font-bold">Google Calendar Events</h1>

        {loading ? (
          <p>Loading calendar events...</p>
        ) : (
          <div className="custom-calendar-container mt-4">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;

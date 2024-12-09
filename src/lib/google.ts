import axios from "axios";
import { prismaClient } from "@/lib/db";

interface CalendarEvent {
  email: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  attendees: string[];
  timeZone?: string;
}

export async function createGoogleCalendarEvent(event: CalendarEvent) {
  try {
    // Fetch the user's account and access token from the database
    const userAccount = await prismaClient.account.findFirst({
      where: { provider: "google", user: { email: event.email } },
    });

    if (!userAccount || !userAccount.access_token) {
      console.error(`No access token found for email: ${event.email}`);
      throw new Error(`No access token found for user: ${event.email}`);
    }

    let accessToken = userAccount.access_token;

    // Check if the access token has expired
    const now = Math.floor(Date.now() / 1000);
    if (userAccount.expires_at && userAccount.expires_at <= now) {
      console.log("Access token expired. Attempting to refresh...");

      // Refresh the access token
      const refreshedTokens = await refreshGoogleAccessToken(
        userAccount.refresh_token,
      );

      if (!refreshedTokens) {
        throw new Error("Failed to refresh Google Access Token");
      }

      accessToken = refreshedTokens.accessToken;

      // Update the refreshed tokens in the database
      await prismaClient.account.update({
        where: { id: userAccount.id },
        data: {
          access_token: refreshedTokens.accessToken,
          expires_at: refreshedTokens.expiresAt,
          refresh_token:
            refreshedTokens.refreshToken || userAccount.refresh_token,
        },
      });

      console.log("Access token successfully refreshed.");
    }

    // Create the event on Google Calendar
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: event.timeZone || "UTC",
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: event.timeZone || "UTC",
        },
        attendees: event.attendees.map((email) => ({ email })), // Add attendees
        conferenceData: {
          createRequest: {
            requestId: "random-string-id",
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          conferenceDataVersion: 1, // Enable Google Meet link generation
        },
      },
    );

    console.log("Google Calendar Event Created:", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to create Google Calendar event:", error);
    throw new Error("Failed to create Google Calendar event");
  }
}

// Helper function to refresh the access token
async function refreshGoogleAccessToken(refreshToken: string) {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    console.log("Refreshed Google Access Token:", response.data);

    return {
      accessToken: response.data.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + response.data.expires_in,
      refreshToken: response.data.refresh_token,
    };
  } catch (error) {
    console.error(
      "Failed to refresh Google Access Token:",
      error.response?.data || error.message,
    );
    return null;
  }
}

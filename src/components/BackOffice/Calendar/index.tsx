// components/BackOffice/CalendarBox.tsx

import React from "react";

interface CalendarBoxProps {
  events: any[];
}

const CalendarBox: React.FC<CalendarBoxProps> = ({ events }) => (
  <div>
    {events.length > 0 ? (
      <ul>
        {events.map((event) => (
          <li key={event.id} className="mb-4">
            <h3 className="text-lg font-semibold">{event.summary}</h3>
            <p>
              {new Date(
                event.start?.dateTime || event.start?.date,
              ).toLocaleString()}{" "}
              -{" "}
              {new Date(
                event.end?.dateTime || event.end?.date,
              ).toLocaleString()}
            </p>
            {event.description && <p>{event.description}</p>}
          </li>
        ))}
      </ul>
    ) : (
      <p>No upcoming events found.</p>
    )}
  </div>
);

export default CalendarBox;

import React, { useState } from "react";
import moment from "moment";

interface CalendarBoxProps {
  events: { title: string; date: string }[];
}

const CalendarBox: React.FC<CalendarBoxProps> = ({ events }) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const today = moment();
  const startOfMonth = today.clone().startOf("month");
  const endOfMonth = today.clone().endOf("month");
  const daysInMonth = endOfMonth.date();
  const startDayOfWeek = startOfMonth.day();

  const getEventForDate = (date: string) => {
    return events.find((event) => event.date === date);
  };

  const handleMouseEnter = (date: string) => {
    setHoveredDate(date);
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3>{today.format("MMMM YYYY")}</h3>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day">
            {day}
          </div>
        ))}
        {Array.from({ length: startDayOfWeek }).map((_, index) => (
          <div key={index} className="calendar-empty"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = today.clone().date(index + 1);
          const formattedDate = date.format("YYYY-MM-DD");
          const event = getEventForDate(formattedDate);
          return (
            <div
              key={index}
              className="calendar-date"
              onMouseEnter={() => handleMouseEnter(formattedDate)}
              onMouseLeave={handleMouseLeave}
            >
              {date.date()}
              {hoveredDate === formattedDate && (
                <div className="tooltip">
                  {event ? (
                    <div>
                      <strong>{event.title}</strong>
                      <p>{formattedDate}</p>
                    </div>
                  ) : (
                    <p>No Appointment Scheduled</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .calendar-container {
          width: 100%;
          background-color: #1e293b;
          border-radius: 8px;
          padding: 20px;
          color: white;
        }
        .calendar-header {
          text-align: center;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }
        .calendar-day,
        .calendar-date {
          text-align: center;
          padding: 10px;
        }
        .calendar-day {
          font-weight: bold;
          color: #cbd5e1;
        }
        .calendar-date {
          position: relative;
          cursor: pointer;
          background-color: #334155;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        .calendar-date:hover {
          background-color: #475569;
        }
        .calendar-empty {
          padding: 10px;
        }
        .tooltip {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 5px;
          background-color: #2d3748;
          padding: 10px;
          border-radius: 4px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 100;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default CalendarBox;

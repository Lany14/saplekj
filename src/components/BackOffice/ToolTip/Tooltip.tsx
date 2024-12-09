import React from "react";

interface TooltipProps {
  title: string;
  date: string;
  time: string;
}

const Tooltip: React.FC<TooltipProps> = ({ title, date, time }) => (
  <div className="tooltip-content rounded bg-gray-800 p-2 text-white shadow-lg">
    <p className="font-semibold">{title}</p>
    <p>{date}</p>
    <p>{time}</p>
  </div>
);

export default Tooltip;

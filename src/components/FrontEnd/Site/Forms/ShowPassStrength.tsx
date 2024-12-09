import { cn } from "@nextui-org/react";
import React from "react";

interface PasswordStrengthProps {
  strength: 0 | 1 | 2 | 3;
}
const ShowPassStrength = ({ strength }: PasswordStrengthProps) => {
  return (
    <div className="flex gap-2 pt-2">
      {Array.from({ length: strength + 1 }).map((i, index) => (
        <div
          key={index}
          className={cn("h-2 w-32 rounded-md", {
            "bg-red-500": strength === 0,
            "bg-yellow-500": strength === 1,
            "bg-blue-500": strength === 2,
            "grow bg-green-500": strength === 3,
          })}
        ></div>
      ))}
    </div>
  );
};

export default ShowPassStrength;

/* {strength === 0 && <span className="text-red-500">Weak</span>}
{strength === 1 && <span className="text-yellow-500">Moderate</span>}
{strength === 2 && <span className="text-green-500">Strong</span>}
{strength === 3 && <span className="text-blue-500">Very Strong</span>}
{strength === 4 && <span className="text-purple-500">Excellent</span>}  */

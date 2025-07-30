import React from "react";
import { cn } from "@/utils/cn";

const TimeSlotPicker = ({ 
  selectedTime, 
  onTimeSelect, 
  availableSlots = [],
  className 
}) => {
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        Select Time
      </label>
      <div className="grid grid-cols-4 gap-2">
        {timeSlots.map((time) => {
          const isAvailable = availableSlots.length === 0 || availableSlots.includes(time);
          const isSelected = selectedTime === time;
          
          return (
            <button
              key={time}
              type="button"
              disabled={!isAvailable}
              onClick={() => onTimeSelect(time)}
              className={cn(
                "px-3 py-2 text-sm rounded-lg border transition-all duration-200",
                isSelected && "bg-gradient-to-r from-primary to-blue-600 text-white border-primary shadow-lg",
                !isSelected && isAvailable && "bg-white border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-700",
                !isAvailable && "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
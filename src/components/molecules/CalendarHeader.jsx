import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-card border border-gray-100 mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={onToday}
          className="text-primary border-primary/20 hover:bg-primary/5"
        >
          Today
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevMonth}
          icon="ChevronLeft"
          className="hover:bg-primary/10 hover:text-primary"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextMonth}
          icon="ChevronRight"
          className="hover:bg-primary/10 hover:text-primary"
        />
      </div>
    </div>
  );
};

export default CalendarHeader;
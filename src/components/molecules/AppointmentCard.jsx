import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
const AppointmentCard = ({ appointment, onClick, patient, doctor }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "completed";
      case "cancelled": return "cancelled";
      default: return "scheduled";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "CheckCircle";
      case "cancelled": return "XCircle";
      default: return "Clock";
    }
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={() => onClick(appointment)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <ApperIcon 
            name={getStatusIcon(appointment.status)} 
            size={16} 
            className={cn(
              appointment.status.toLowerCase() === "completed" && "text-success",
              appointment.status.toLowerCase() === "cancelled" && "text-error",
              appointment.status.toLowerCase() === "scheduled" && "text-primary"
            )}
          />
          <span className="text-sm font-medium text-gray-900">
            {format(new Date(`${appointment.date}T${appointment.startTime}`), "h:mm a")}
          </span>
        </div>
        <Badge variant={getStatusVariant(appointment.status)}>
          {appointment.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ApperIcon name="User" size={14} className="text-gray-400" />
          <span className="text-sm text-gray-700">{patient?.name || "Unknown Patient"}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <ApperIcon name="Stethoscope" size={14} className="text-gray-400" />
          <span className="text-sm text-gray-700">{doctor?.name || "Unknown Doctor"}</span>
        </div>

        <div className="flex items-center gap-2">
          <ApperIcon name="FileText" size={14} className="text-gray-400" />
          <span className="text-sm text-gray-700">{appointment.type}</span>
        </div>
      </div>

      {appointment.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2">{appointment.notes}</p>
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard;
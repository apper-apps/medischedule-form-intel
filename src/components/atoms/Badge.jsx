import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ variant = "default", className, children }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-blue-100 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-success/10 to-green-100 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-yellow-100 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    scheduled: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200",
    completed: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200",
    cancelled: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
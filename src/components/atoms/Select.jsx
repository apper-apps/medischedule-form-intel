import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  children,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed bg-white";
  
  const errorStyles = error 
    ? "border-error focus:ring-error" 
    : "border-gray-300 hover:border-gray-400";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={cn(baseStyles, errorStyles, className)}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
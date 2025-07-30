import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No appointments found", 
  description = "Get started by booking your first appointment",
  actionLabel = "Book Appointment",
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-full mb-6">
        <ApperIcon name="Calendar" size={48} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <ApperIcon name="Plus" size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;
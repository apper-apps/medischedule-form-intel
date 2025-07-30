import React from "react";

const Loading = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen">
        {/* Appointment List Skeleton */}
        <div className="lg:col-span-1 space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-40"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="calendar-grid">
            {[...Array(42)].map((_, i) => (
              <div key={i} className="calendar-cell bg-white p-2">
                <div className="h-4 bg-gray-200 rounded w-6 mb-2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Panel Skeleton */}
        <div className="lg:col-span-1 space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg"></div>
          <div className="bg-white p-6 rounded-lg shadow-card space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="pt-4">
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
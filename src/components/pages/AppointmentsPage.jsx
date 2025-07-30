import React, { useState } from "react";
import AppointmentList from "@/components/organisms/AppointmentList";
import CalendarView from "@/components/organisms/CalendarView";
import AppointmentDetails from "@/components/organisms/AppointmentDetails";
import BookAppointmentModal from "@/components/organisms/BookAppointmentModal";

const AppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
  };

  const handleBookAppointment = () => {
    setShowBookModal(true);
  };

  const handleBookingSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedAppointment(null);
  };

  const handleAppointmentUpdate = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedAppointment(null);
  };

  const handleAppointmentCancel = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedAppointment(null);
  };

  return (
    <div className="h-screen bg-surface">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full gap-1">
        {/* Appointment List - 25% */}
        <div className="lg:col-span-1 bg-white border-r border-gray-200">
          <AppointmentList
            key={`list-${refreshKey}`}
            onAppointmentSelect={handleAppointmentSelect}
            onBookAppointment={handleBookAppointment}
            selectedDate={selectedDate}
          />
        </div>

        {/* Calendar View - 50% */}
        <div className="lg:col-span-2 bg-white border-r border-gray-200 p-6">
          <CalendarView
            key={`calendar-${refreshKey}`}
            onDateSelect={handleDateSelect}
            onAppointmentSelect={handleAppointmentSelect}
          />
        </div>

        {/* Appointment Details - 25% */}
        <div className="lg:col-span-1 bg-white">
          <AppointmentDetails
            appointment={selectedAppointment}
            onUpdate={handleAppointmentUpdate}
            onCancel={handleAppointmentCancel}
          />
        </div>
      </div>

      <BookAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onSuccess={handleBookingSuccess}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default AppointmentsPage;
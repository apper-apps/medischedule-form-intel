import React, { useState, useEffect } from "react";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { format, isToday } from "date-fns";

const AppointmentList = ({ onAppointmentSelect, onBookAppointment, selectedDate }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to load appointments");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === "" || 
      patients.find(p => p.Id === appointment.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctors.find(d => d.Id === appointment.doctorId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate ? 
      appointment.date === format(selectedDate, "yyyy-MM-dd") :
      isToday(new Date(appointment.date));
    
    return matchesSearch && matchesDate;
  });

  const walkInQueue = appointments.filter(apt => 
    apt.type === "Walk-in" && 
    apt.status === "Scheduled" &&
    isToday(new Date(apt.date))
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedDate ? format(selectedDate, "MMM d") : "Today's"} Appointments
          </h2>
          <Button
            onClick={onBookAppointment}
            size="sm"
            icon="Plus"
            className="shrink-0"
          >
            Book
          </Button>
        </div>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by patient or doctor..."
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredAppointments.length === 0 ? (
          <Empty
            title="No appointments found"
            description={selectedDate ? "No appointments scheduled for this date" : "No appointments scheduled for today"}
            actionLabel="Book Appointment"
            onAction={onBookAppointment}
          />
        ) : (
          filteredAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.Id}
              appointment={appointment}
              patient={patients.find(p => p.Id === appointment.patientId)}
              doctor={doctors.find(d => d.Id === appointment.doctorId)}
              onClick={onAppointmentSelect}
            />
          ))
        )}
      </div>

      {walkInQueue.length > 0 && (
        <div className="walk-in-queue p-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
            Walk-in Queue ({walkInQueue.length})
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {walkInQueue.map(appointment => (
              <div key={appointment.Id} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <span className="text-sm text-gray-700">
                  {patients.find(p => p.Id === appointment.patientId)?.name}
                </span>
                <span className="text-xs text-gray-500">
                  {appointment.startTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
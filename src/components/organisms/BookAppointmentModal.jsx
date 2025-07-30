import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TimeSlotPicker from "@/components/molecules/TimeSlotPicker";
import ApperIcon from "@/components/ApperIcon";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const BookAppointmentModal = ({ isOpen, onClose, onSuccess, selectedDate }) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    startTime: "",
    endTime: "",
    type: "",
    status: "Scheduled",
    notes: ""
  });
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd")
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      checkAvailability();
    }
  }, [formData.doctorId, formData.date]);

  const loadData = async () => {
    try {
      const [patientsData, doctorsData, appointmentsData] = await Promise.all([
        patientService.getAll(),
        doctorService.getAll(),
        appointmentService.getAll()
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
    } catch (err) {
      toast.error("Failed to load data");
      console.error("Error loading data:", err);
    }
  };

  const checkAvailability = () => {
    const doctorAppointments = appointments.filter(apt => 
      apt.doctorId === formData.doctorId && 
      apt.date === formData.date &&
      apt.status !== "Cancelled"
    );

    const bookedSlots = doctorAppointments.map(apt => apt.startTime);
    
    const allSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
      "16:00", "16:30", "17:00", "17:30"
    ];

    const available = allSlots.filter(slot => !bookedSlots.includes(slot));
    setAvailableSlots(available);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.doctorId || !formData.startTime || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      await appointmentService.create(formData);
      toast.success("Appointment booked successfully");
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      toast.error("Failed to book appointment");
      console.error("Error booking appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      startTime: time,
      endTime: addMinutes(time, 30)
    }));
  };

  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMins = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMins / 60);
    const newMins = totalMins % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
      type: "",
      status: "Scheduled",
      notes: ""
    });
    setAvailableSlots([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Book New Appointment
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon="X"
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Patient *"
                value={formData.patientId}
                onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.Id} value={patient.Id}>
                    {patient.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Doctor *"
                value={formData.doctorId}
                onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.Id} value={doctor.Id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="date"
                label="Date *"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />

              <Select
                label="Appointment Type *"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="">Select Type</option>
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Check-up">Check-up</option>
                <option value="Emergency">Emergency</option>
                <option value="Walk-in">Walk-in</option>
              </Select>
            </div>

            {formData.doctorId && formData.date && (
              <TimeSlotPicker
                selectedTime={formData.startTime}
                onTimeSelect={handleTimeSelect}
                availableSlots={availableSlots}
              />
            )}

            {availableSlots.length === 0 && formData.doctorId && formData.date && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <ApperIcon name="AlertTriangle" size={18} className="text-warning" />
                  <p className="text-sm text-yellow-800">
                    No available time slots for the selected doctor and date.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add any notes about this appointment..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                loading={loading} 
                className="flex-1"
                disabled={availableSlots.length === 0 && formData.doctorId && formData.date}
              >
                Book Appointment
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
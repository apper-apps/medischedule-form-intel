import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import TimeSlotPicker from "@/components/molecules/TimeSlotPicker";
import ApperIcon from "@/components/ApperIcon";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AppointmentDetails = ({ appointment, onUpdate, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    status: "Scheduled",
    notes: ""
  });

  useEffect(() => {
    loadData();
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || "",
        doctorId: appointment.doctorId || "",
        date: appointment.date || "",
        startTime: appointment.startTime || "",
        endTime: appointment.endTime || "",
        type: appointment.type || "",
        status: appointment.status || "Scheduled",
        notes: appointment.notes || ""
      });
    }
  }, [appointment]);

  const loadData = async () => {
    try {
      const [patientsData, doctorsData] = await Promise.all([
        patientService.getAll(),
        doctorService.getAll()
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (appointment) {
        await appointmentService.update(appointment.Id, formData);
        toast.success("Appointment updated successfully");
        onUpdate();
      }
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update appointment");
      console.error("Error updating appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentService.update(appointment.Id, { ...formData, status: "Cancelled" });
        toast.success("Appointment cancelled");
        onCancel();
      } catch (err) {
        toast.error("Failed to cancel appointment");
        console.error("Error cancelling appointment:", err);
      }
    }
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      startTime: time,
      endTime: addMinutes(time, 30) // Default 30-minute appointments
    }));
  };

  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMins = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMins / 60);
    const newMins = totalMins % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "completed";
      case "cancelled": return "cancelled";
      default: return "scheduled";
    }
  };

  if (!appointment) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-full mb-4 w-fit mx-auto">
            <ApperIcon name="Calendar" size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select an appointment</h3>
          <p className="text-gray-600">Choose an appointment from the list or calendar to view details</p>
        </div>
      </div>
    );
  }

  const patient = patients.find(p => p.Id === appointment.patientId);
  const doctor = doctors.find(d => d.Id === appointment.doctorId);

  if (isEditing) {
    return (
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Appointment</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
            icon="X"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Patient"
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
            label="Doctor"
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

          <Input
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />

          <TimeSlotPicker
            selectedTime={formData.startTime}
            onTimeSelect={handleTimeSelect}
          />

          <Select
            label="Appointment Type"
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

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add any notes about this appointment..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading} className="flex-1">
              Update Appointment
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
            icon="Edit"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleCancel}
            icon="Trash2"
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-3 rounded-full">
                <ApperIcon name="Calendar" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {format(new Date(`${appointment.date}T${appointment.startTime}`), "EEEE, MMMM d, yyyy")}
                </h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(`${appointment.date}T${appointment.startTime}`), "h:mm a")} - 
                  {format(new Date(`${appointment.date}T${appointment.endTime}`), "h:mm a")}
                </p>
              </div>
            </div>
            <Badge variant={getStatusVariant(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <ApperIcon name="User" size={18} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{patient?.name || "Unknown Patient"}</p>
                <p className="text-sm text-gray-600">{patient?.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ApperIcon name="Stethoscope" size={18} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{doctor?.name || "Unknown Doctor"}</p>
                <p className="text-sm text-gray-600">{doctor?.specialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ApperIcon name="FileText" size={18} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{appointment.type}</p>
                <p className="text-sm text-gray-600">Appointment Type</p>
              </div>
            </div>
          </div>
        </Card>

        {patient && (
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ApperIcon name="UserCircle" size={18} className="text-primary" />
              Patient Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{patient.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="text-gray-900">
                  {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "MMM d, yyyy") : "Not provided"}
                </span>
              </div>
            </div>
          </Card>
        )}

        {appointment.notes && (
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ApperIcon name="FileText" size={18} className="text-primary" />
              Notes
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{appointment.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
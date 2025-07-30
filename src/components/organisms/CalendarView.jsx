import React, { useState, useEffect } from "react";
import CalendarHeader from "@/components/molecules/CalendarHeader";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isToday,
  isSameMonth
} from "date-fns";

const CalendarView = ({ onDateSelect, onAppointmentSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("Failed to load calendar data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getDoctorColor = (doctorId) => {
    const doctor = doctors.find(d => d.Id === doctorId);
    return doctor?.color || "doctor-color-1";
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="h-full flex flex-col">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <div className="flex-1">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-surface rounded-lg">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid flex-1">
          {calendarDays.map(day => {
            const dayAppointments = getAppointmentsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`calendar-cell p-2 cursor-pointer transition-all duration-200 ${
                  !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                } ${isTodayDate ? "bg-blue-50 border-2 border-primary" : ""}`}
                onClick={() => onDateSelect(day)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isTodayDate ? "text-primary font-bold" : "text-gray-900"
                }`}>
                  {format(day, "d")}
                </div>
                
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((apt, index) => {
                    const patient = patients.find(p => p.Id === apt.patientId);
                    const colorClass = getDoctorColor(apt.doctorId);
                    
                    return (
                      <div
                        key={apt.Id}
                        className={`appointment-block ${colorClass}`}
                        style={{ top: `${20 + (index * 22)}px` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentSelect(apt);
                        }}
                        title={`${patient?.name} - ${apt.startTime}`}
                      >
                        <span className="truncate">
                          {format(new Date(`${apt.date}T${apt.startTime}`), "h:mm")} {patient?.name}
                        </span>
                      </div>
                    );
                  })}
                  
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500 text-center mt-1">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
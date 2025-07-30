import appointmentsData from "@/services/mockData/appointments.json";

let appointments = [...appointmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentService = {
  async getAll() {
    await delay(300);
    return [...appointments];
  },

  async getById(id) {
    await delay(200);
    const appointment = appointments.find(apt => apt.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  },

  async create(appointmentData) {
    await delay(400);
    const newId = Math.max(...appointments.map(apt => apt.Id), 0) + 1;
    const newAppointment = {
      Id: newId,
      ...appointmentData
    };
    appointments.push(newAppointment);
    return { ...newAppointment };
  },

  async update(id, updateData) {
    await delay(350);
    const index = appointments.findIndex(apt => apt.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    appointments[index] = { ...appointments[index], ...updateData };
    return { ...appointments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = appointments.findIndex(apt => apt.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    const deleted = appointments.splice(index, 1)[0];
    return { ...deleted };
  }
};
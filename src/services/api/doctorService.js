import doctorsData from "@/services/mockData/doctors.json";

let doctors = [...doctorsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const doctorService = {
  async getAll() {
    await delay(250);
    return [...doctors];
  },

  async getById(id) {
    await delay(200);
    const doctor = doctors.find(d => d.Id === parseInt(id));
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return { ...doctor };
  },

  async create(doctorData) {
    await delay(300);
    const newId = Math.max(...doctors.map(d => d.Id), 0) + 1;
    const newDoctor = {
      Id: newId,
      ...doctorData
    };
    doctors.push(newDoctor);
    return { ...newDoctor };
  },

  async update(id, updateData) {
    await delay(300);
    const index = doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    doctors[index] = { ...doctors[index], ...updateData };
    return { ...doctors[index] };
  },

  async delete(id) {
    await delay(250);
    const index = doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    const deleted = doctors.splice(index, 1)[0];
    return { ...deleted };
  }
};
import patientsData from "@/services/mockData/patients.json";

let patients = [...patientsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const patientService = {
  async getAll() {
    await delay(250);
    return [...patients];
  },

  async getById(id) {
    await delay(200);
    const patient = patients.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error("Patient not found");
    }
    return { ...patient };
  },

  async create(patientData) {
    await delay(300);
    const newId = Math.max(...patients.map(p => p.Id), 0) + 1;
    const newPatient = {
      Id: newId,
      ...patientData
    };
    patients.push(newPatient);
    return { ...newPatient };
  },

  async update(id, updateData) {
    await delay(300);
    const index = patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patients[index] = { ...patients[index], ...updateData };
    return { ...patients[index] };
  },

  async delete(id) {
    await delay(250);
    const index = patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    const deleted = patients.splice(index, 1)[0];
    return { ...deleted };
  }
};
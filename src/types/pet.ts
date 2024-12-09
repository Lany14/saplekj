// Types for Pet Management
export interface PetInput {
  name: string;
  breed: string;
  age: number;
  species: string;
  sex: string;
  weight?: number;
  colorAndMarkings?: string;
  birthDate?: Date;
  ownerId: string;
}

export interface MedicalRecordInput {
  petId: string;
  veterinarianId: string;
  type: string;
  diagnosis: string;
  symptoms: string[];
  treatment?: string;
  note?: string;
  file?: string;
}

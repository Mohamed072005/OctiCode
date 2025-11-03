import { PatientRepository } from '../repositories/patient.repository'
import type { Patient, CreatePatientDto, UpdatePatientDto } from '../types'
import { nanoid } from 'nanoid'

export class PatientService {
    private patientRepository: PatientRepository

    constructor() {
        this.patientRepository = new PatientRepository()
    }

    async getAllPatients(): Promise<Patient[]> {
        return this.patientRepository.findAll();
    }

    async getPatientById(id: string): Promise<Patient | null> {
        return this.patientRepository.findById(id);
    }

    async createPatient(dto: CreatePatientDto): Promise<Patient> {
        // Check if email already exists
        const existing = await this.patientRepository.findByEmail(dto.email);
        if (existing) {
            throw new Error('Patient with this email already exists');
        }

        const now = new Date().toISOString();
        const patient: Patient = {
            id: nanoid(),
            ...dto,
            createdAt: now,
            updatedAt: now,
        };

        return this.patientRepository.create(patient);
    }

    async updatePatient(
        id: string,
        dto: UpdatePatientDto
    ): Promise<Patient | null> {
        const existing = await this.patientRepository.findById(id);
        if (!existing) return null;

        // Check email uniqueness if email is being updated
        if (dto.email && dto.email !== existing.email) {
            const emailExists = await this.patientRepository.findByEmail(dto.email);
            if (emailExists) {
                throw new Error('Email already in use');
            }
        }

        const updates = {
            ...dto,
            updatedAt: new Date().toISOString(),
        };

        return this.patientRepository.update(id, updates);
    }

    async deletePatient(id: string): Promise<boolean> {
        return this.patientRepository.delete(id);
    }
}
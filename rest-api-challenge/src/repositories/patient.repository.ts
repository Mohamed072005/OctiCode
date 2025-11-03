import database from '../database/jsonDb';
import type { Patient } from '../types';

export class PatientRepository {
    async findAll(): Promise<Patient[]> {
        const db = await database.read();
        return db.patients;
    }

    async findById(id: string): Promise<Patient | null> {
        const db = await database.read();
        return db.patients.find((p) => p.id === id) || null;
    }

    async findByEmail(email: string): Promise<Patient | null> {
        const db = await database.read();
        return db.patients.find((p) => p.email === email) || null;
    }

    async create(patient: Patient): Promise<Patient> {
        const db = await database.read();
        db.patients.push(patient);
        await database.write(db);
        return patient;
    }

    async update(id: string, updates: Partial<Patient>): Promise<Patient | null> {
        const db = await database.read();
        const index = db.patients.findIndex((p) => p.id === id);

        if (index === -1) return null;

        db.patients[index] = {
            ...db.patients[index],
            ...updates,
            id: db.patients[index].id,
            createdAt: db.patients[index].createdAt,
        };

        await database.write(db);
        return db.patients[index];
    }

    async delete(id: string): Promise<boolean> {
        const db = await database.read();
        const index = db.patients.findIndex((p) => p.id === id);

        if (index === -1) return false;

        db.patients.splice(index, 1);
        await database.write(db);
        return true;
    }
}
import database from '../database/jsonDb';
import type { VoiceNote } from '../types';

export class NoteRepository {
    async findAll(): Promise<VoiceNote[]> {
        const db = await database.read();
        return db.notes;
    }

    async findById(id: string): Promise<VoiceNote | null> {
        const db = await database.read();
        return db.notes.find((n) => n.id === id) || null;
    }

    async findByPatientId(patientId: string): Promise<VoiceNote[]> {
        const db = await database.read();
        return db.notes.filter((n) => n.patientId === patientId);
    }

    async create(note: VoiceNote): Promise<VoiceNote> {
        const db = await database.read();
        db.notes.push(note);
        await database.write(db);
        return note;
    }

    async delete(id: string): Promise<boolean> {
        const db = await database.read();
        const index = db.notes.findIndex((n) => n.id === id);

        if (index === -1) return false;

        db.notes.splice(index, 1);
        await database.write(db);
        return true;
    }
}
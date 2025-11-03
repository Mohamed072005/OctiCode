import database from '../database/jsonDb';
import type { Summary } from '../types';

export class SummaryRepository {
    async findByNoteId(noteId: string): Promise<Summary | null> {
        const db = await database.read();
        return db.summaries.find((s) => s.noteId === noteId) || null;
    }

    async create(summary: Summary): Promise<Summary> {
        const db = await database.read();
        db.summaries.push(summary);
        await database.write(db);
        return summary;
    }

    async delete(noteId: string): Promise<boolean> {
        const db = await database.read();
        const index = db.summaries.findIndex((s) => s.noteId === noteId);

        if (index === -1) return false;

        db.summaries.splice(index, 1);
        await database.write(db);
        return true;
    }
}
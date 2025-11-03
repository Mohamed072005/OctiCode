import { promises as fs } from 'fs';
import path from 'path';
import type { Database } from '../types';

class JsonDatabase {
    private dbPath: string;

    constructor(dbPath: string = path.join(process.cwd(), 'data', 'db.json')) {
        this.dbPath = dbPath;
    }

    private async ensureDataDir(): Promise<void> {
        const dir = path.dirname(this.dbPath);
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }
    }

    async read(): Promise<Database> {
        try {
            const data = await fs.readFile(this.dbPath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return { patients: [], notes: [], summaries: [] };
        }
    }

    async write(db: Database): Promise<void> {
        await this.ensureDataDir();
        await fs.writeFile(this.dbPath, JSON.stringify(db, null, 2));
    }
}

export default new JsonDatabase();
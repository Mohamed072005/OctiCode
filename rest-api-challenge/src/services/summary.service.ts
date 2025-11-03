import { nanoid } from 'nanoid';
import { SummaryRepository } from '../repositories/summary.repository';
import { NoteRepository } from '../repositories/note.repository';
import type { Summary, VoiceNote } from '../types';

export class SummaryService {
    private summaryRepository: SummaryRepository;
    private noteRepository: NoteRepository;

    constructor() {
        this.summaryRepository = new SummaryRepository();
        this.noteRepository = new NoteRepository();
    }

    async getSummaryByNoteId(noteId: string): Promise<Summary | null> {
        return this.summaryRepository.findByNoteId(noteId);
    }

    async generateSummary(noteId: string): Promise<Summary> {
        // Verify note exists
        const note = await this.noteRepository.findById(noteId);
        if (!note) {
            throw new Error('Note not found');
        }

        // Check if summary already exists
        const existing = await this.summaryRepository.findByNoteId(noteId);
        if (existing) {
            throw new Error('Summary already exists for this note');
        }

        // Generate AI-like summary
        const generatedContent = this.generateContent(note);

        const summary: Summary = {
            id: nanoid(),
            noteId,
            ...generatedContent,
            generatedAt: new Date().toISOString(),
        };

        return this.summaryRepository.create(summary);
    }

    private generateContent(note: VoiceNote): {
        content: string;
        keyPoints: string[];
    } {
        const minutes = Math.floor(note.duration / 60);
        const seconds = note.duration % 60;

        return {
            content: `This is an AI-generated summary of the voice note titled "${note.title}". The recording lasted ${minutes} minutes and ${seconds} seconds. The patient discussed their current symptoms, treatment progress, and any concerns they may have. The healthcare provider can use this summary to quickly review the main points of the consultation.`,
            keyPoints: [
                'Patient consultation recorded',
                'Current symptoms and concerns discussed',
                'Treatment compliance and progress reviewed',
                `Total duration: ${minutes}m ${seconds}s`,
                'Follow-up recommendations provided',
            ],
        };
    }

    async deleteSummary(noteId: string): Promise<boolean> {
        return this.summaryRepository.delete(noteId);
    }
}
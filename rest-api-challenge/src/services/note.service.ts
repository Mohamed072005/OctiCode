import { NoteRepository } from '../repositories/note.repository'
import { PatientRepository } from '../repositories/patient.repository';
import type { VoiceNote, CreateNoteDto } from '../types'
import { nanoid } from 'nanoid'

export class NoteService {
    private noteRepository: NoteRepository
    private patientRepository: PatientRepository;

    constructor() {
        this.noteRepository = new NoteRepository()
        this.patientRepository = new PatientRepository()
    }

    async getAllNotes(patientId?: string): Promise<VoiceNote[]> {
        if (patientId) {
            return this.noteRepository.findByPatientId(patientId);
        }
        return this.noteRepository.findAll();
    }

    async getNoteById(id: string): Promise<VoiceNote | null> {
        return this.noteRepository.findById(id);
    }

    async createNote(dto: CreateNoteDto): Promise<VoiceNote> {
        // Verify patient exists
        const patient = await this.patientRepository.findById(dto.patientId);
        if (!patient) {
            throw new Error('Patient not found');
        }

        const note: VoiceNote = {
            id: nanoid(),
            ...dto,
            createdAt: new Date().toISOString(),
        };

        return this.noteRepository.create(note);
    }

    async deleteNote(id: string): Promise<boolean> {
        return this.noteRepository.delete(id);
    }
}

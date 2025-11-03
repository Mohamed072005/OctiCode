import type { Request, Response, NextFunction } from 'express';
import { NoteService } from '../services/note.service';
import { SummaryService } from '../services/summary.service';
import { VoiceNoteSchema } from '../validators/schemas';

export class NoteController {
    private noteService: NoteService;
    private summaryService: SummaryService;

    constructor() {
        this.noteService = new NoteService();
        this.summaryService = new SummaryService();
    }

    getAllNotes = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { patientId } = req.query;
            const notes = await this.noteService.getAllNotes(patientId as string);
            res.json({ data: notes, count: notes.length });
        } catch (error) {
            next(error);
        }
    };

    getNoteById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const note = await this.noteService.getNoteById(req.params.id);

            if (!note) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }

            res.json({ data: note });
        } catch (error) {
            next(error);
        }
    };

    createNote = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const validated = VoiceNoteSchema.parse(req.body);
            const note = await this.noteService.createNote(validated);
            res.status(201).json({ data: note });
        } catch (error) {
            next(error);
        }
    };

    deleteNote = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const deleted = await this.noteService.deleteNote(req.params.id);

            if (!deleted) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    generateSummary = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const summary = await this.summaryService.generateSummary(req.params.id);
            res.status(201).json({ data: summary });
        } catch (error) {
            next(error);
        }
    };

    getSummary = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const summary = await this.summaryService.getSummaryByNoteId(
                req.params.id
            );

            if (!summary) {
                res.status(404).json({ error: 'Summary not found' });
                return;
            }

            res.json({ data: summary });
        } catch (error) {
            next(error);
        }
    };
}
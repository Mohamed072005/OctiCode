import { z } from 'zod';

export const PatientSchema = z.object({
    name: z.string().min(2).max(100),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
    email: z.string().email(),
    phone: z.string().optional(),
});

export const VoiceNoteSchema = z.object({
    patientId: z.string().min(1),
    title: z.string().min(1).max(200),
    duration: z.number().positive(),
    recordedAt: z.string().datetime(),
    metadata: z
        .object({
            fileSize: z.number().optional(),
            format: z.string().optional(),
        })
        .passthrough()
        .optional(),
});

export const SummarySchema = z.object({
    noteId: z.string().min(1),
    content: z.string().min(10).max(5000),
    keyPoints: z.array(z.string()).min(1).max(10),
});
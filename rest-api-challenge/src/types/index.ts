export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    email: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VoiceNote {
    id: string;
    patientId: string;
    title: string;
    duration: number;
    recordedAt: string;
    metadata?: {
        fileSize?: number;
        format?: string;
        [key: string]: any;
    };
    createdAt: string;
}

export interface Summary {
    id: string;
    noteId: string;
    content: string;
    keyPoints: string[];
    generatedAt: string;
}

export interface Database {
    patients: Patient[];
    notes: VoiceNote[];
    summaries: Summary[];
}

export interface CreatePatientDto {
    name: string;
    dateOfBirth: string;
    email: string;
    phone?: string;
}

export interface UpdatePatientDto {
    name?: string;
    dateOfBirth?: string;
    email?: string;
    phone?: string;
}

export interface CreateNoteDto {
    patientId: string;
    title: string;
    duration: number;
    recordedAt: string;
    metadata?: {
        fileSize?: number;
        format?: string;
        [key: string]: any;
    };
}

export interface CreateSummaryDto {
    noteId: string;
    content: string;
    keyPoints: string[];
}
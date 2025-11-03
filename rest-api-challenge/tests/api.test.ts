import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

const API_KEY = 'dev-key-123';

describe('Notes & Summaries API', () => {
    let patientId: string;
    let noteId: string;

    describe('Health Endpoints', () => {
        it('should return healthy status', async () => {
            const res = await request(app).get('/health');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status', 'healthy');
            expect(res.body).toHaveProperty('uptime');
        });

        it('should return ready status', async () => {
            const res = await request(app).get('/health/ready');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('ready', true);
        });
    });

    describe('Authentication Middleware', () => {
        it('should reject requests without API key', async () => {
            const res = await request(app).get('/api/patients');

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error', 'Unauthorized');
        });

        it('should reject requests with invalid API key', async () => {
            const res = await request(app)
                .get('/api/patients')
                .set('X-API-Key', 'invalid-key');

            expect(res.status).toBe(401);
        });

        it('should accept requests with valid API key', async () => {
            const res = await request(app)
                .get('/api/patients')
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(200);
        });
    });

    describe('Patient Controller', () => {
        it('should create a new patient via service layer', async () => {
            const res = await request(app)
                .post('/api/patients')
                .set('X-API-Key', API_KEY)
                .send({
                    name: 'John Doe',
                    dateOfBirth: '1990-05-15',
                    email: 'john@example.com',
                    phone: '+1234567890',
                });

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.name).toBe('John Doe');

            patientId = res.body.data.id;
        });

        it('should prevent duplicate email', async () => {
            const res = await request(app)
                .post('/api/patients')
                .set('X-API-Key', API_KEY)
                .send({
                    name: 'Jane Doe',
                    dateOfBirth: '1992-03-20',
                    email: 'john@example.com', // Same email
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('already exists');
        });

        it('should validate patient data with Zod', async () => {
            const res = await request(app)
                .post('/api/patients')
                .set('X-API-Key', API_KEY)
                .send({
                    name: 'J', // Too short
                    dateOfBirth: 'invalid-date',
                    email: 'not-an-email',
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Validation Error');
        });

        it('should get all patients from repository', async () => {
            const res = await request(app)
                .get('/api/patients')
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.count).toBeGreaterThan(0);
        });

        it('should get a specific patient by ID', async () => {
            const res = await request(app)
                .get(`/api/patients/${patientId}`)
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe(patientId);
        });

        it('should update patient via service', async () => {
            const res = await request(app)
                .patch(`/api/patients/${patientId}`)
                .set('X-API-Key', API_KEY)
                .send({ name: 'Jane Doe Updated' });

            expect(res.status).toBe(200);
            expect(res.body.data.name).toBe('Jane Doe Updated');
        });

        it('should return 404 for non-existent patient', async () => {
            const res = await request(app)
                .get('/api/patients/non-existent-id')
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(404);
        });
    });

    describe('Note Controller', () => {
        it('should create a voice note via service', async () => {
            const res = await request(app)
                .post('/api/notes')
                .set('X-API-Key', API_KEY)
                .send({
                    patientId,
                    title: 'Consultation Session',
                    duration: 180,
                    recordedAt: new Date().toISOString(),
                    metadata: {
                        fileSize: 1024000,
                        format: 'mp3',
                    },
                });

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.title).toBe('Consultation Session');

            noteId = res.body.data.id;
        });

        it('should reject note with invalid patient (service validation)', async () => {
            const res = await request(app)
                .post('/api/notes')
                .set('X-API-Key', API_KEY)
                .send({
                    patientId: 'invalid-id',
                    title: 'Test',
                    duration: 60,
                    recordedAt: new Date().toISOString(),
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('not found');
        });

        it('should get notes filtered by patient ID', async () => {
            const res = await request(app)
                .get(`/api/notes?patientId=${patientId}`)
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0].patientId).toBe(patientId);
        });

        it('should get all notes from repository', async () => {
            const res = await request(app)
                .get('/api/notes')
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('Summary Service via Controller', () => {
        it('should generate a summary via service layer', async () => {
            const res = await request(app)
                .post(`/api/notes/${noteId}/summary`)
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('content');
            expect(res.body.data).toHaveProperty('keyPoints');
            expect(Array.isArray(res.body.data.keyPoints)).toBe(true);
        });

        it('should prevent duplicate summaries (service validation)', async () => {
            const res = await request(app)
                .post(`/api/notes/${noteId}/summary`)
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('already exists');
        });

        it('should retrieve a summary from repository', async () => {
            const res = await request(app)
                .get(`/api/notes/${noteId}/summary`)
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('content');
            expect(res.body.data).toHaveProperty('noteId', noteId);
        });

        it('should return 404 for non-existent summary', async () => {
            const res = await request(app)
                .get('/api/notes/non-existent-id/summary')
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(404);
        });
    });

    describe('CRUD Operations via Layered Architecture', () => {
        it('should delete a patient via service and repository', async () => {
            const res = await request(app)
                .delete(`/api/patients/${patientId}`)
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(204);

            // Verify deletion
            const checkRes = await request(app)
                .get(`/api/patients/${patientId}`)
                .set('X-API-Key', API_KEY);

            expect(checkRes.status).toBe(404);
        });

        it('should delete a note via service and repository', async () => {
            const res = await request(app)
                .delete(`/api/notes/${noteId}`)
                .set('X-API-Key', API_KEY);

            expect(res.status).toBe(204);
        });
    });
});
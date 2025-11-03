import express from "express";
import { authenticate } from './middleware/auth'
import patientRoutes from './routes/patient.routes'
import noteRoutes from './routes/note.routes'
import healthRoutes from './routes/health.routes'
import { errorHandler } from './middleware/errorHandler'
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json())

// Public routes
app.use('/', healthRoutes);

// Protected routes
app.use(authenticate)
app.use('/api/patients', patientRoutes);
app.use('/api/notes', noteRoutes);

// Error Handler Middleware
app.use(errorHandler)

export default app;
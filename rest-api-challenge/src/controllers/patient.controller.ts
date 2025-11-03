import type { Request, Response, NextFunction } from 'express';
import { PatientService } from '../services/patient.service';
import { PatientSchema } from '../validators/schemas';

export class PatientController {
    private patientService: PatientService;

    constructor() {
        this.patientService = new PatientService();
    }

    getAllPatients = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const patients = await this.patientService.getAllPatients();
            res.json({ data: patients, count: patients.length });
        } catch (error) {
            next(error);
        }
    };

    getPatientById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const patient = await this.patientService.getPatientById(req.params.id);

            if (!patient) {
                res.status(404).json({ error: 'Patient not found' });
                return;
            }

            res.json({ data: patient });
        } catch (error) {
            next(error);
        }
    };

    createPatient = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const validated = PatientSchema.parse(req.body);
            const patient = await this.patientService.createPatient(validated);
            res.status(201).json({ data: patient });
        } catch (error) {
            next(error);
        }
    };

    updatePatient = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const validated = PatientSchema.partial().parse(req.body);
            const patient = await this.patientService.updatePatient(
                req.params.id,
                validated
            );

            if (!patient) {
                res.status(404).json({ error: 'Patient not found' });
                return;
            }

            res.json({ data: patient });
        } catch (error) {
            next(error);
        }
    };

    deletePatient = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const deleted = await this.patientService.deletePatient(req.params.id);

            if (!deleted) {
                res.status(404).json({ error: 'Patient not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
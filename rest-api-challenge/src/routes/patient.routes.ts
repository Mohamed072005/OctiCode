import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';

const router = Router();
const controller = new PatientController();

router.get('/', controller.getAllPatients);
router.get('/:id', controller.getPatientById);
router.post('/', controller.createPatient);
router.patch('/:id', controller.updatePatient);
router.delete('/:id', controller.deletePatient);

export default router;
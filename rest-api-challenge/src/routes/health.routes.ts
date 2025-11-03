import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const controller = new HealthController();

router.get('/health', controller.getHealth);
router.get('/health/ready', controller.getReadiness);

export default router;
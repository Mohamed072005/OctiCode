import type { Request, Response } from 'express';

export class HealthController {
    getHealth = (req: Request, res: Response): void => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    };

    getReadiness = (req: Request, res: Response): void => {
        res.json({
            ready: true,
            timestamp: new Date().toISOString(),
        });
    };
}
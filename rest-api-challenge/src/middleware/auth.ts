import type { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const requestApiKey = req.headers['x-api-key'] as string;
    const API_KEY = process.env.API_KEY;

    if (!requestApiKey || !(API_KEY === requestApiKey)) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Valid API key required in X-API-Key header',
        });
    }

    req.apiKey = requestApiKey;
    next();
}
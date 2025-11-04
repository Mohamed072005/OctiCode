import type { Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
) {
    console.error(
        JSON.stringify({
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
        })
    );

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors,
        });
    }

    // Business logic errors
    if (err.message.includes('already exists') || err.message.includes('not found') || err.message.includes('already in use')) {
        return res.status(400).json({
            error: 'Bad Request',
            message: err.message,
        });
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message:
            process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message,
    });
}
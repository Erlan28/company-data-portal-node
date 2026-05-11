import { Request, Response, NextFunction } from 'express'
import { verifyToken, JwtPayload } from '../utils/jwt'

// Extend Express Request interface to include our user payload
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

/**
 * Middleware to check if the user is authenticated (has a valid JWT)
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    if (!decoded) {
        return res.status(401).json({ success: false, message: 'Unauthorized - Invalid or expired token' })
    }

    req.user = decoded
    next()
}

/**
 * Middleware to check if the authenticated user has an ADMIN role
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    // This should run after requireAuth, so req.user should exist
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden - Admin access required' })
    }

    next()
}

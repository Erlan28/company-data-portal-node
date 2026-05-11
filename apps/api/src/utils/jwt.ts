import jwt from 'jsonwebtoken'

// In production, this should be a strong, randomly generated string stored in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-company-portal-key-2026'

export interface JwtPayload {
    id: string
    email: string
    role: string
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }) // Token valid for 1 day
}

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch (error) {
        return null
    }
}

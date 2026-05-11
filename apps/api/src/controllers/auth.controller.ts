import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' })
            }

            const data = await AuthService.login(email, password)
            res.status(200).json({ success: true, data })

        } catch (error: any) {
            // Usually we shouldn't expose internal errors, but for login we can send the explicit message
            res.status(401).json({ success: false, message: error.message || 'Authentication failed' })
        }
    }

    static async setupAdmin(req: Request, res: Response) {
        try {
            const admin = await AuthService.setupInitialAdmin()
            res.status(201).json({ success: true, message: 'Admin created successfully', data: { email: admin.email } })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }
}

import { Request, Response } from 'express'
import { UserService } from '../services/user.service'

export class UserController {
    // GET /users
    static async getAll(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers()
            res.status(200).json({ success: true, data: users })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // GET /users/:id
    static async getById(req: Request, res: Response) {
        try {
            const user = await UserService.getUserById(req.params.id as string)
            if (!user) return res.status(404).json({ success: false, message: 'User not found' })
            res.status(200).json({ success: true, data: user })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // POST /users
    static async create(req: Request, res: Response) {
        try {
            const { name, email, password, role } = req.body
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: 'Name, email and password are required' })
            }
            const user = await UserService.createUser({ name, email, password, role: role || 'USER' })
            res.status(201).json({ success: true, data: user })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Failed to create user' })
        }
    }

    // PUT /users/:id
    static async update(req: Request, res: Response) {
        try {
            const user = await UserService.updateUser(req.params.id as string, req.body)
            res.status(200).json({ success: true, data: user })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Failed to update user' })
        }
    }

    // DELETE /users/:id
    static async delete(req: Request, res: Response) {
        try {
            await UserService.deleteUser(req.params.id as string)
            res.status(200).json({ success: true, message: 'User deleted successfully' })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}

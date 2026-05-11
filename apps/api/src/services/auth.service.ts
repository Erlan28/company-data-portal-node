import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt'

export class AuthService {
    /**
     * Authenticate user and return a JWT token if successful
     */
    static async login(email: string, password: string) {
        // 1. Find user by email
        const user = await prisma.user.findUnique({ where: { email } })
        
        if (!user) {
            throw new Error('Invalid email or password')
        }

        // 2. Compare password hashes
        const isValidPassword = await bcrypt.compare(password, user.password)
        
        if (!isValidPassword) {
            throw new Error('Invalid email or password')
        }

        // 3. Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        })

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        }
    }

    /**
     * Create initial admin (For setup purposes only)
     */
    static async setupInitialAdmin() {
        const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
        
        if (existingAdmin) {
            throw new Error('Admin already exists')
        }

        const hashedPassword = await bcrypt.hash('admin123', 10)

        return prisma.user.create({
            data: {
                name: 'Super Admin',
                email: 'admin@companyportal.com',
                password: hashedPassword,
                role: 'ADMIN'
            }
        })
    }
}

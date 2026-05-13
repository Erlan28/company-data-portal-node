import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'

export class UserService {
    // GET all users (Admin only - never return passwords)
    static async getAllUsers() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        bookmarks: true,
                        reviews: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    }

    // GET single user by ID
    static async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        })
    }

    // CREATE a new user
    static async createUser(data: { name: string; email: string; password: string; role: string }) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } })
        if (existing) {
            throw new Error('Email already in use')
        }
        const hashedPassword = await bcrypt.hash(data.password, 10)
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role as 'ADMIN' | 'USER',
            },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
    }

    // UPDATE an existing user
    static async updateUser(id: string, data: { name?: string; email?: string; password?: string; role?: string }) {
        const updateData: any = {}
        if (data.name) updateData.name = data.name
        if (data.email) updateData.email = data.email
        if (data.role) updateData.role = data.role
        if (data.password && data.password.trim() !== '') {
            updateData.password = await bcrypt.hash(data.password, 10)
        }
        return prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
    }

    // DELETE a user
    static async deleteUser(id: string) {
        return prisma.user.delete({ where: { id } })
    }
}

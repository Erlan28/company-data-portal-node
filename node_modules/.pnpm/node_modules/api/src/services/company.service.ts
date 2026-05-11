import prisma from '../lib/prisma'

/**
 * Service class handles all business logic and database interactions.
 * This keeps our controllers clean and focused only on HTTP req/res handling.
 */
export class CompanyService {
    // 1. Get all companies (Public / Admin)
    static async getAllCompanies(industryFilter?: string) {
        // Build the where clause dynamically based on filters
        const whereClause = industryFilter ? { industry: industryFilter } : {}

        return prisma.company.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            // Include related data like reviews if needed
            include: {
                _count: {
                    select: { reviews: true }
                }
            }
        })
    }

    // 2. Get single company by slug
    static async getCompanyBySlug(slug: string) {
        return prisma.company.findUnique({
            where: { slug },
            include: {
                reviews: {
                    include: {
                        user: { select: { name: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })
    }

    // 3. Create a new company (Admin Only)
    static async createCompany(data: any) {
        // Generate slug from name
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4)

        return prisma.company.create({
            data: {
                ...data,
                slug,
            }
        })
    }

    // 4. Update an existing company (Admin Only)
    static async updateCompany(id: string, data: any) {
        return prisma.company.update({
            where: { id },
            data
        })
    }

    // 5. Delete a company (Admin Only)
    static async deleteCompany(id: string) {
        return prisma.company.delete({
            where: { id }
        })
    }
}

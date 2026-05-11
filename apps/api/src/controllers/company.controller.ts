import { Request, Response } from 'express'
import { CompanyService } from '../services/company.service'

/**
 * Controller handles HTTP requests, extracts parameters, 
 * calls the appropriate Service method, and sends the response.
 */
export class CompanyController {
    
    // GET /companies
    static async getAll(req: Request, res: Response) {
        try {
            const industry = req.query.industry as string | undefined
            const companies = await CompanyService.getAllCompanies(industry)
            
            res.status(200).json({ success: true, data: companies })
        } catch (error) {
            console.error('Error fetching companies:', error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // GET /companies/:slug
    static async getBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params
            const company = await CompanyService.getCompanyBySlug(slug as string)
            
            if (!company) {
                return res.status(404).json({ success: false, message: 'Company not found' })
            }

            res.status(200).json({ success: true, data: company })
        } catch (error) {
            console.error('Error fetching company:', error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // POST /companies
    static async create(req: Request, res: Response) {
        try {
            // NOTE: In production, you should validate req.body here using Zod or Joi
            const company = await CompanyService.createCompany(req.body)
            
            res.status(201).json({ success: true, data: company })
        } catch (error) {
            console.error('Error creating company:', error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // PUT /companies/:id
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const company = await CompanyService.updateCompany(id as string, req.body)
            
            res.status(200).json({ success: true, data: company })
        } catch (error) {
            console.error('Error updating company:', error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // DELETE /companies/:id
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            await CompanyService.deleteCompany(id as string)
            
            res.status(200).json({ success: true, message: 'Company deleted successfully' })
        } catch (error) {
            console.error('Error deleting company:', error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}

import { Router } from 'express'
import { CompanyController } from '../controllers/company.controller'
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware'

const router = Router()

// Public Routes (READ ONLY)
router.get('/', CompanyController.getAll)
router.get('/:slug', CompanyController.getBySlug) 

// Protected Routes (ADMIN ONLY) 
router.post('/', requireAuth, requireAdmin, CompanyController.create)
router.put('/:id', requireAuth, requireAdmin, CompanyController.update)
router.delete('/:id', requireAuth, requireAdmin, CompanyController.delete)

export default router
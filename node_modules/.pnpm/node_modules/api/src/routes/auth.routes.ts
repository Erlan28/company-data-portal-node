import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'

const router = Router()

// POST /auth/login - Endpoint for user authentication
router.post('/login', AuthController.login)

// POST /auth/setup-admin - One-time setup endpoint to create the initial admin
router.post('/setup-admin', AuthController.setupAdmin)

export default router

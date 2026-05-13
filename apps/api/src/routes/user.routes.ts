import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware'

const router = Router()

// All user routes are protected — Admin only
router.use(requireAuth, requireAdmin)

router.get('/', UserController.getAll)
router.get('/:id', UserController.getById)
router.post('/', UserController.create)
router.put('/:id', UserController.update)
router.delete('/:id', UserController.delete)

export default router

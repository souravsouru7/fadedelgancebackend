import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { GalleryItem } from '../models/GalleryItem.js'
import { AdminUser } from '../models/AdminUser.js'

const router = Router()

router.get('/stats', requireAuth, requireAdmin, async (_req, res) => {
  const [items, published, users] = await Promise.all([
    GalleryItem.countDocuments({}),
    GalleryItem.countDocuments({ isPublished: true }),
    AdminUser.countDocuments({}),
  ])
  res.json({
    totals: {
      galleryItems: items,
      publishedItems: published,
      adminUsers: users,
    }
  })
})

export default router



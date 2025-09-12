import { Router } from 'express'
import { GalleryItem } from '../models/GalleryItem.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// Public list
router.get('/', async (req, res) => {
  const { page = 1, limit = 24 } = req.query
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    GalleryItem.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    GalleryItem.countDocuments({ isPublished: true })
  ])
  res.json({ items, total, page: Number(page), limit: Number(limit) })
})

// Public single
router.get('/:id', async (req, res) => {
  const item = await GalleryItem.findOne({ _id: req.params.id, isPublished: true })
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

// Admin CRUD
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, beforeImageUrl, afterImageUrl, isPublished = true, displayOrder = 0 } = req.body || {}
  if (!title || !description || !beforeImageUrl || !afterImageUrl) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const created = await GalleryItem.create({ title, description, beforeImageUrl, afterImageUrl, isPublished, displayOrder })
  res.status(201).json(created)
})

router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  const updated = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json(updated)
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const deleted = await GalleryItem.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

export default router



import { Router } from 'express'
import { ContactMessage } from '../models/ContactMessage.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// All routes below require admin
router.use(requireAuth, requireAdmin)

// GET /api/admin/contacts?page=&limit=&status=
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, status } = req.query
  const skip = (Number(page) - 1) * Number(limit)
  const query = {}
  if (status && ['new','read','replied','archived'].includes(status)) {
    query.status = status
  }
  const [items, total] = await Promise.all([
    ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ContactMessage.countDocuments(query)
  ])
  res.json({ items, total, page: Number(page), limit: Number(limit) })
})

// GET /api/admin/contacts/:id
router.get('/:id', async (req, res) => {
  const item = await ContactMessage.findById(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

// PATCH /api/admin/contacts/:id  { status?, notes? }
router.patch('/:id', async (req, res) => {
  const { status, notes } = req.body || {}
  const update = {}
  if (status && ['new','read','replied','archived'].includes(status)) update.status = status
  if (typeof notes === 'string') update.notes = notes
  const item = await ContactMessage.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

// DELETE /api/admin/contacts/:id
router.delete('/:id', async (req, res) => {
  const item = await ContactMessage.findByIdAndDelete(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

export default router



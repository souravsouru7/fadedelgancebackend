import { Router } from 'express'
import { ContactMessage } from '../models/ContactMessage.js'

const router = Router()

// Public: submit a contact message
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body || {}
    if (!firstName || !email || !message) {
      return res.status(400).json({ error: 'firstName, email and message are required' })
    }
    const doc = await ContactMessage.create({ firstName, lastName, email, phone, message })
    res.status(201).json({ id: doc._id })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to submit message' })
  }
})

export default router



/* eslint-env node */
import { Router } from 'express'
import crypto from 'crypto'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// POST /api/uploads/sign
// Body: { folder?: string }
// Returns: { cloudName, apiKey, timestamp, signature, folder }
router.post('/sign', requireAuth, requireAdmin, (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'faded-elegance/gallery'

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Cloudinary is not configured on the server' })
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const folder = (req.body && req.body.folder) ? String(req.body.folder) : defaultFolder

  // Cloudinary signature: sha1 of a sorted, url-encoded parameter string (excluding file & signature)
  // We sign at least { folder, timestamp }
  const paramsToSign = [`folder=${folder}`, `timestamp=${timestamp}`].sort().join('&')
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex')

  res.json({ cloudName, apiKey, timestamp, signature, folder })
})

export default router



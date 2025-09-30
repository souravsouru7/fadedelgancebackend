import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { connectToDatabase } from './config/db.js'
import authRoutes from './routes/auth.js'
import galleryRoutes from './routes/gallery.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/uploads.js'
import contactRoutes from './routes/contact.js'
import adminContactsRoutes from './routes/adminContacts.js'

const app = express()

// Core middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://www.fadedelegance.ae',
  'https://fadedelegance.ae',
]

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser or same-origin requests with no Origin header
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(helmet())
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'faded-elegance-backend', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin/contacts', adminContactsRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl })
})

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 4000

// Start server after DB is connected
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`[backend] listening on :${PORT}`)
  })
}).catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})



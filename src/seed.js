import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from './config/db.js'
import { AdminUser } from './models/AdminUser.js'
import { GalleryItem } from './models/GalleryItem.js'

async function run() {
  await connectToDatabase()

  // Seed admin user (predefined)
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@'
  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'Admin123'
  const passwordHash = await bcrypt.hash(adminPass, 10)
  await AdminUser.findOneAndUpdate(
    { email: adminEmail },
    { email: adminEmail, passwordHash, role: 'admin' },
    { upsert: true, new: true }
  )

  // Seed a few gallery items
  const existing = await GalleryItem.countDocuments({})
  if (existing === 0) {
    await GalleryItem.insertMany([
      {
        title: 'Luxury Leather Handbag Restoration',
        description: 'Complete restoration of a vintage leather handbag including color restoration and hardware replacement.',
        beforeImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        afterImageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
        isPublished: true,
        displayOrder: 1,
      },
      {
        title: 'Luxury Shoe Restoration',
        description: 'Complete restoration of leather shoes including sole repair and color enhancement.',
        beforeImageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        afterImageUrl: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80',
        isPublished: true,
        displayOrder: 2,
      },
    ])
  }

  console.log('[seed] done')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})



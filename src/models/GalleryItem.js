import mongoose from 'mongoose'

const GalleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  beforeImageUrl: { type: String, required: true },
  afterImageUrl: { type: String, required: true },
  isPublished: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true })

export const GalleryItem = mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema)



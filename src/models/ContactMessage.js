import mongoose from 'mongoose'

const ContactMessageSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: false, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: false, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
  notes: { type: String, required: false, trim: true },
}, { timestamps: true })

export const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema)



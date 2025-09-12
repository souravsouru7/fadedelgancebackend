import mongoose from 'mongoose'

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true })

export const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema)



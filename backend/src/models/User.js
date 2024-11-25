const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // Not required for Google users
  userType: { type: String, enum: ['client', 'provider'], required: true },
  profilePicture: { type: String, default: null },
  googleId: { type: String, unique: true, sparse: true }, // Allow null for non-Google users

  // Provider-specific fields
  bio: { type: String, default: null }, // About the provider
  categories: [{ type: String }], // Example: ['DJ', 'Band', 'Catering']
  website: { type: String, default: null }, // Optional link to their personal site
  socialLinks: {
    facebook: { type: String, default: null },
    instagram: { type: String, default: null },
    twitter: { type: String, default: null },
  },
  location: { type: String, default: null }, // City or region they operate in
  hourlyRate: { type: Number, default: null }, // Example: $50/hour

  // Gallery or portfolio
  gallery: [{ type: String }], // URLs to images or videos showcasing work
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare the password for login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

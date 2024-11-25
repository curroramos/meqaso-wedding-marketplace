const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true,
    },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  radius: { type: Number, default: 0 }, // Availability radius in kilometers
  photoUrl: { type: String, default: null },
}, { timestamps: true });

serviceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Service', serviceSchema);

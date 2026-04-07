const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  manufacturer: String,
  saltComposition: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  packSize: String,
  form: String,
  category: { type: String, required: true, index: true },
  availabilityStatus: { type: String, default: 'In Stock' },
  imageUrl: { type: String, default: 'https://via.placeholder.com/300x200?text=Medicine' }
}, { timestamps: true });

// Optimize search by creating a text index
medicineSchema.index({ name: 'text', saltComposition: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);
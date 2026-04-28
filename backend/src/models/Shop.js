const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  inventory: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    }
  }]
}, { timestamps: true });

// Create a 2dsphere index for geospatial querying
shopSchema.index({ location: '2dsphere' });
// Indexing inventory items for fast medicine availability lookups
shopSchema.index({ "inventory.medicine": 1 });

module.exports = mongoose.model('Shop', shopSchema);

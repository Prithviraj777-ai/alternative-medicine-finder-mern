const Medicine = require('../models/Medicine');
const priceUtils = require('../utils/priceUtils');

class MedicineService {
  async searchMedicines(query, limit = 5) {
    return await Medicine.find({
      name: { $regex: query, $options: 'i' }
    }).limit(limit);
  }

  async getMedicineById(id) {
    return await Medicine.findById(id);
  }

  async getAlternatives(medicineId) {
    const original = await Medicine.findById(medicineId);
    if (!original) throw new Error('Medicine not found');

    // Find medicines with same salt, excluding the current one
    const alternatives = await Medicine.find({
      saltComposition: original.saltComposition,
      _id: { $ne: medicineId }
    });

    const sortedAlternatives = priceUtils.sortByPrice(alternatives, 'asc');
    const cheapest = priceUtils.findCheapest(alternatives);

    return {
      original,
      alternatives: sortedAlternatives,
      cheapestId: cheapest ? cheapest._id : null
    };
  }

  async getByCategory(category, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const items = await Medicine.find({ category }).skip(skip).limit(limit);
    const total = await Medicine.countDocuments({ category });
    
    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  async addMedicine(data) {
    return await Medicine.create(data);
  }
}

module.exports = new MedicineService();
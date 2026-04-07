const MedicineService = require('../services/medicineService');

exports.addMedicine = async (req, res, next) => {
  try {
    const medicine = await MedicineService.addMedicine(req.body);
    res.status(201).json(medicine);
  } catch (err) { next(err); }
};

exports.searchMedicines = async (req, res, next) => {
  try {
    const results = await MedicineService.searchMedicines(req.query.name);
    res.json(results);
  } catch (err) { next(err); }
};

exports.getMedicineById = async (req, res, next) => {
  try {
    const medicine = await MedicineService.getMedicineById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (err) { next(err); }
};

exports.getAlternatives = async (req, res, next) => {
  try {
    const data = await MedicineService.getAlternatives(req.params.id);
    res.json(data);
  } catch (err) { next(err); }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 12;
    const data = await MedicineService.getByCategory(req.params.category, page, limit);
    res.json(data);
  } catch (err) { next(err); }
};
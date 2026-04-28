import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const MedicineModal = ({ isOpen, onClose, onSave, medicine }) => {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    saltComposition: '',
    price: '',
    mrp: '',
    packSize: '',
    form: '',
    category: '',
    availabilityStatus: 'In Stock',
    imageUrl: 'https://via.placeholder.com/300x200?text=Medicine',
  });

  useEffect(() => {
    if (medicine) {
      setFormData(medicine);
    } else {
      setFormData({
        name: '',
        manufacturer: '',
        saltComposition: '',
        price: '',
        mrp: '',
        packSize: '',
        form: '',
        category: '',
        availabilityStatus: 'In Stock',
        imageUrl: 'https://via.placeholder.com/300x200?text=Medicine',
      });
    }
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      toast.success(medicine ? 'Medicine updated!' : 'Medicine added!');
      onClose();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">
            {medicine ? 'Edit Medicine' : 'Add Medicine'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salt Composition</label>
              <input type="text" name="saltComposition" value={formData.saltComposition} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturer</label>
              <input type="text" name="manufacturer" value={formData.manufacturer || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">MRP (₹)</label>
              <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineModal;

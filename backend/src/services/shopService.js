const Shop = require('../models/Shop');
const Medicine = require('../models/Medicine');

const getNearestShop = async (lat, lng) => {
    // Default to Mumbai center if no real location is provided by browser
    const userLat = lat ? parseFloat(lat) : 19.0;
    const userLng = lng ? parseFloat(lng) : 72.9;

    const shop = await Shop.findOne({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [userLng, userLat] }
        }
      }
    });
    return shop;
};

const checkLocalAvailability = async (medicineId, lat, lng) => {
    const shop = await getNearestShop(lat, lng);
    if (!shop) {
        throw new Error("No chemist shops available in your area.");
    }

    const originalMedicine = await Medicine.findById(medicineId);
    if (!originalMedicine) throw new Error("Medicine not found");

    // Check if original is in stock at this specific shop
    const inventoryItem = shop.inventory.find(i => i.medicine.toString() === medicineId.toString());
    const isAvailable = !!inventoryItem && inventoryItem.stock > 0;

    let availableAlternatives = [];

    // If out of stock, find alternatives that ARE in stock at THIS exact shop
    if (!isAvailable) {
        // Find cheaper alternative medicines with exact same salt composition
        const allAlternatives = await Medicine.find({
            saltComposition: originalMedicine.saltComposition,
            _id: { $ne: originalMedicine._id },
            price: { $lt: originalMedicine.price }
        }).sort({ price: 1 });

        // Filter and only keep the ones present in this shop's inventory!
        availableAlternatives = allAlternatives.filter(alt => {
             const altIndb = shop.inventory.find(i => i.medicine.toString() === alt._id.toString());
             return altIndb && altIndb.stock > 0;
        });
        
        // Take top 4 cheapest available
        availableAlternatives = availableAlternatives.slice(0, 4);
    }

    // Rough distance calculation for UI purposes (Haversine formula rough approx)
    const userLat = lat ? parseFloat(lat) : 19.0;
    const userLng = lng ? parseFloat(lng) : 72.9;
    
    // Convert to straight line distance roughly in km
    const dLat = (shop.location.coordinates[1] - userLat) * 111;
    const dLng = (shop.location.coordinates[0] - userLng) * 111 * Math.cos(userLat * (Math.PI/180));
    const distanceKm = Math.sqrt(dLat*dLat + dLng*dLng).toFixed(1);

    return {
        shop: {
            name: shop.name,
            address: shop.address,
            distance: `${distanceKm} km away`
        },
        isAvailable,
        availableAlternatives
    };
};

module.exports = {
    getNearestShop,
    checkLocalAvailability
};

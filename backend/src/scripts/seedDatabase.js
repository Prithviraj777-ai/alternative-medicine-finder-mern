require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');

// Categories mapping to arrays
const medData = {
  "Pain Relief": ["Paracetamol", "Crocin", "Calpol", "Dolo 650", "Combiflam", "Ibuprofen", "Brufen", "Diclofenac", "Aspirin", "Naproxen"],
  "Cold & Cough": ["Benadryl", "Corex", "Ascoril", "Vicks Formula 44", "Alex Syrup", "Chericof", "Grilinctus", "T-Minic", "Sinarest", "Levocetirizine"],
  "Antibiotics": ["Amoxicillin", "Azithromycin", "Ciprofloxacin", "Doxycycline", "Cefixime", "Ceftriaxone", "Metronidazole", "Ofloxacin", "Norfloxacin", "Clarithromycin"],
  "Vitamins": ["Becosules", "Revital", "Zincovit", "Neurobion", "Shelcal", "Vitamin C Tablets", "Vitamin D Capsules", "Folic Acid", "Iron Tablets", "Multivitamin Tablets"],
  "Digestive": ["Gelusil", "Digene", "Rantac", "Pantoprazole", "Omeprazole", "Domperidone", "Ondansetron", "Loperamide", "ORS", "Eno"],
  "Diabetes": ["Metformin", "Glimepiride", "Sitagliptin", "Voglibose", "Insulin", "Glipizide", "Pioglitazone", "Repaglinide", "Acarbose", "Linagliptin"],
  "Blood Pressure": ["Amlodipine", "Atenolol", "Losartan", "Telmisartan", "Enalapril", "Ramipril", "Hydrochlorothiazide", "Metoprolol", "Nifedipine", "Propranolol"],
  "Skin & Allergy": ["Cetirizine", "Loratadine", "Hydrocortisone Cream", "Betnovate", "Clotrimazole", "Miconazole", "Calamine Lotion", "Permethrin Cream", "Fexofenadine", "Montelukast"],
  "Eye & Ear": ["Ciplox Eye Drops", "Refresh Tears", "Tobramycin Drops", "Ofloxacin Ear Drops", "Gentamicin Drops", "Natamycin Drops", "Carboxymethylcellulose Drops", "Chloramphenicol Drops", "Moxifloxacin Drops", "Ketorolac Eye Drops"],
  "Miscellaneous": ["Alprazolam", "Diazepam", "Sertraline", "Fluoxetine", "Ranitidine", "Prednisolone", "Salbutamol", "Budesonide", "Theophylline", "Warfarin", "Heparin", "Atorvastatin", "Rosuvastatin", "Clopidogrel", "Digoxin"],
  
  "Ayurvedic": ["Ashwagandha", "Triphala", "Brahmi", "Neem", "Turmeric", "Giloy", "Amla", "Tulsi", "Shatavari", "Shilajit"],
  "Homeopathic": ["Arnica Montana", "Rhus Tox", "Nux Vomica", "Belladonna", "Aconite", "Pulsatilla", "Ignatia", "Lycopodium", "Gelsemium"],
  "Herbal": ["Ginger Extract", "Garlic Oil", "Peppermint Extract", "Chamomile Tea", "Echinacea", "Ginkgo Biloba", "St. John's Wort"],
  "Unani": ["Khamira Abresham", "Majun Shabab Awar", "Habbe Asgand", "Itrifal Shahtara", "Jawarish Mastagi", "Rooh Afza"]
};

const allCategories = Object.keys(medData);

// Realistic images for general/allopathic
const allopathicImages = [
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Pills scattered
  "https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Capsule blister
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Pharma bottles
];

// Realistic images for alternative
const alternativeImages = [
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Amber bottles / tincture
  "https://images.unsplash.com/photo-1629851606830-ec4b802672ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Dropper bottle with herbs
  "https://images.unsplash.com/photo-1596541617185-35ee61d7a8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Herbal powders / turmeric
  "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"  // Homeopathic small white vials
];

const manufacturers = ["Cipla", "Sun Pharma", "Mankind", "Abbott", "Alkem", "Torrent", "Dabur", "Patanjali", "Baidyanath", "Himalaya", "Zandu"];

// Create a pool of 5000+ alternatives derived from the base lists
const generateMedicine = (index) => {
  // Pick random category focusing on balanced distribution
  const category = allCategories[Math.floor(Math.random() * allCategories.length)];
  const isAlternative = ["Ayurvedic", "Homeopathic", "Herbal", "Unani"].includes(category);
  
  const pool = medData[category];
  const medicineBase = pool[Math.floor(Math.random() * pool.length)];
  
  const imageUrl = isAlternative 
    ? alternativeImages[Math.floor(Math.random() * alternativeImages.length)]
    : allopathicImages[Math.floor(Math.random() * allopathicImages.length)];

  const identifier = String.fromCharCode(65 + (index % 26)) + (index % 100);
  const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
  
  const saltStr = isAlternative ? `${medicineBase} active compounds` : medicineBase;
  const name = isAlternative ? `${medicineBase} Extract - V${index % 100}` : `${medicineBase} by ${manufacturer} ${identifier}`;

  const mrp = Math.floor(Math.random() * 800) + 100;
  // Alternatives pricing: generic versions are significantly cheaper
  const discountFactor = Math.random() * 0.4 + 0.3; // 30% to 70% of MRP
  const price = Math.floor(mrp * discountFactor);

  let form = "Tablet";
  let packSize = "1 Pack";

  if (medicineBase.toLowerCase().includes("syrup") || medicineBase.toLowerCase().includes("drops") || medicineBase.toLowerCase().includes("lotion")) {
     form = medicineBase.toLowerCase().includes("drops") ? "Drop" : "Syrup";
     packSize = (Math.random() > 0.5 ? "100ml" : "200ml");
  } else if (medicineBase.toLowerCase().includes("cream") || medicineBase.toLowerCase().includes("ointment")) {
     form = "Ointment";
     packSize = "50g";
  } else if (medicineBase.toLowerCase().includes("capsule")) {
     form = "Capsule";
     packSize = "10 Capsules";
  } else {
     form = isAlternative ? (Math.random() > 0.6 ? "Tablet" : "Powder") : (Math.random() > 0.7 ? "Capsule" : "Tablet");
     packSize = (form === "Powder") ? "100g" : (Math.random() > 0.5 ? "10 " + form + "s" : "15 " + form + "s");
  }

  return {
    name: name,
    manufacturer: manufacturer,
    saltComposition: saltStr,
    price: price,
    mrp: mrp,
    packSize: packSize,
    form: form,
    category: category,
    imageUrl: imageUrl
  };
};

const Shop = require('../models/Shop');

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error("MongoDB URI is not defined in environment variables");
    
    await mongoose.connect(uri);
    await Medicine.deleteMany({});
    await Shop.deleteMany({});
    console.log("Database cleared...");

    const medicines = [];
    // Generate 5000 items so we have tons of cheaper alternatives matching by saltComposition
    for (let i = 0; i < 5000; i++) {
        medicines.push(generateMedicine(i));
    }

    const batchSize = 500;
    for (let i = 0; i < medicines.length; i += batchSize) {
      const batch = medicines.slice(i, i + batchSize);
      await Medicine.insertMany(batch);
      console.log(`Inserted batch: ${i + batch.length} medicines...`);
    }

    console.log("Generating Pharmacies and Inventories (This might take a moment)...");
    const allMeds = await Medicine.find({}, '_id');
    const shopNames = ["Apollo Pharmacy", "MedPlus", "Wellness Forever", "Netmeds Store", "Sanjivani", "Frank Ross", "Guardian", "Local Chemist", "LifeCare", "City Meds"];
    
    const shops = [];
    for(let i=0; i < 20; i++) {
        // Each shop randomly stocks ~2000 out of 5000 medicines
        const shuffled = [...allMeds].sort(() => 0.5 - Math.random());
        const selectedMeds = shuffled.slice(0, 2000);
        
        const inventory = selectedMeds.map(m => ({
            medicine: m._id,
            stock: Math.floor(Math.random() * 50) + 1
        }));
        
        // Mocking coordinates near Mumbai (Lat: 18.9-19.2, Lng: 72.8-73.0)
        const lat = 18.9 + Math.random() * 0.3;
        const lng = 72.8 + Math.random() * 0.2;
        
        shops.push({
            name: `${shopNames[i % shopNames.length]} - Branch ${i+1}`,
            address: `Shop No. ${i+10}, High Street Market, City Area`,
            location: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            inventory: inventory
        });
    }
    
    await Shop.insertMany(shops);
    console.log("20 Shops with randomized inventories seeded successfully!");

    console.log("Seeding Successful!");
    process.exit();
  } catch (error) {
    console.error("Seeding Failed:", error);
    process.exit(1);
  }
};

seedData();
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');

const categories = ["Pain Relief", "Antibiotics", "Vitamins", "Diabetes", "Blood Pressure", "Cold & Cough", "Stomach", "Heart"];
const realisticImages = [
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Pills scattered
  "https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Capsule blister
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Pharma bottles
  "https://images.unsplash.com/photo-1550572017-edb799002fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Med pack
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", // Syringe & Vial
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"  // generic medicine
];

const realisticSalts = [
  "Paracetamol 500mg", "Paracetamol 650mg", "Amoxicillin 250mg", "Amoxicillin 500mg", "Metformin 500mg SR", 
  "Metformin 1000mg", "Atorvastatin 10mg", "Atorvastatin 20mg", "Ibuprofen 400mg", "Cetirizine 10mg", 
  "Azithromycin 500mg", "Pantoprazole 40mg", "Telmisartan 40mg", "Amlodipine 5mg", "Vitamin B Complex", 
  "Vitamin C 500mg", "Diclofenac 50mg", "Omeprazole 20mg", "Rabeprazole 20mg", "Levocetirizine 5mg"
];

const manufacturers = ["Cipla", "Sun Pharma", "Mankind", "Abbott", "Alkem", "Torrent", "Intas", "Dr. Reddy's", "Lupin", "Zydus", "GlaxoSmithKline"];

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(uri);
    await Medicine.deleteMany({});
    console.log("Database cleared...");

    const medicines = [];
    for (let i = 0; i < 2000; i++) {
      const salt = realisticSalts[Math.floor(Math.random() * realisticSalts.length)];
      const mrp = Math.floor(Math.random() * 500) + 50;
      const price = Math.floor(mrp * (0.4 + Math.random() * 0.5)); // Price is 40-90% of MRP

      medicines.push({
        name: `${salt.split(" ")[0]} - ${String.fromCharCode(65 + (i % 26))}${i % 100}`,
        manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
        saltComposition: salt,
        price: price,
        mrp: mrp,
        packSize: (Math.random() > 0.5 ? "10 Tablets" : "15 Tablets"),
        form: "Tablet",
        category: categories[Math.floor(Math.random() * categories.length)],
        imageUrl: realisticImages[Math.floor(Math.random() * realisticImages.length)]
      });
    }

    // Insert in batches of 500
    const batchSize = 500;
    for (let i = 0; i < medicines.length; i += batchSize) {
      const batch = medicines.slice(i, i + batchSize);
      await Medicine.insertMany(batch);
      console.log(`Inserted batch: ${i + batch.length} medicines...`);
    }

    console.log("Seeding Successful!");
    process.exit();
  } catch (error) {
    console.error("Seeding Failed:", error);
    process.exit(1);
  }
};

seedData();
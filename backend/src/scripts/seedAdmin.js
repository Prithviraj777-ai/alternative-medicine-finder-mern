/**
 * Seed script to create a default admin user.
 * Run: npm run seed:admin
 *
 * Default credentials:
 *   Email:    admin@medmatch.com
 *   Password: admin123
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@medmatch.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: admin@medmatch.com`);
      console.log(`   Role:  ${existingAdmin.role}`);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@medmatch.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   Password: admin123`);
    console.log('\n⚠️  Change this password in production!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();

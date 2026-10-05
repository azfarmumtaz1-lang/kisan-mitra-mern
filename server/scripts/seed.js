import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Crop from '../models/Crop.js';
import Pest from '../models/Pest.js';
import { cropsData } from '../data/cropsData.js';
import { pestsData } from '../data/pestsData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('MongoDB not reachable. Database seeding skipped, application will use embedded data fallback.');
      process.exit(0);
    }

    console.log('🌱 Seeding Crops...');
    await Crop.deleteMany({});
    const insertedCrops = await Crop.insertMany(cropsData);
    console.log(`✅ Seeded ${insertedCrops.length} Crops successfully!`);

    console.log('🐛 Seeding Pests & Pesticide Prescriptions...');
    await Pest.deleteMany({});
    const insertedPests = await Pest.insertMany(pestsData);
    console.log(`✅ Seeded ${insertedPests.length} Pests and Plant Diseases successfully!`);

    console.log('🌾 All agricultural seed data populated successfully into MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
};

seedDatabase();

import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hindiName: {
      type: String,
      trim: true,
    },
    scientificName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Cereal', 'Pulse', 'Oilseed', 'Cash Crop', 'Vegetable', 'Fodder', 'Spices', 'Horticulture'],
      required: true,
    },
    season: [
      {
        type: String,
        enum: ['Kharif', 'Rabi', 'Zaid', 'Year-round'],
        required: true,
      },
    ],
    sowingMonths: [
      {
        type: String,
      },
    ],
    harvestingMonths: [
      {
        type: String,
      },
    ],
    durationDays: {
      min: { type: Number, default: 90 },
      max: { type: Number, default: 120 },
    },
    soilTypes: [
      {
        type: String,
        enum: ['Alluvial', 'Black Cotton', 'Red', 'Laterite', 'Loamy', 'Sandy Loam', 'Clay'],
      },
    ],
    waterRequirement: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    climate: {
      tempMin: { type: Number, default: 15 },
      tempMax: { type: Number, default: 35 },
      rainfallMm: { type: String, default: '500-1000 mm' },
    },
    seedRate: {
      type: String, // e.g., "40-50 kg/acre"
      required: true,
    },
    expectedYield: {
      type: String, // e.g., "18-24 quintals/acre"
      required: true,
    },
    profitPotential: {
      type: String,
      enum: ['Moderate', 'High', 'Very High'],
      default: 'High',
    },
    estimatedCostPerAcre: {
      type: Number,
      default: 15000,
    },
    estimatedRevenuePerAcre: {
      type: Number,
      default: 45000,
    },
    sowingInstructions: {
      soilPrep: { type: String },
      seedTreatment: { type: String },
      spacing: { type: String },
      irrigation: { type: String },
      fertilizerNPK: { type: String },
    },
    commonPests: [
      {
        type: String,
      },
    ],
    companionCrops: [
      {
        type: String,
      },
    ],
    icon: {
      type: String,
      default: '🌾',
    },
    tips: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// Text index for search
cropSchema.index({ name: 'text', hindiName: 'text', category: 'text' });

export default mongoose.models.Crop || mongoose.model('Crop', cropSchema);

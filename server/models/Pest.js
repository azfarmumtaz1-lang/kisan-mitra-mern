import mongoose from 'mongoose';

const pesticideItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  commercialNames: [{ type: String }],
  dosagePerLiter: { type: String, required: true }, // e.g. "0.4 ml/L"
  backpackDosage15L: { type: String, required: true }, // e.g. "6 ml in 15L water tank"
  perAcreDosage: { type: String, required: true }, // e.g. "60 ml in 150-200 L water"
  preHarvestIntervalDays: { type: Number, default: 7 }, // Wait before harvest
  applicationMethod: { type: String, default: 'Foliar spray during early morning or late afternoon' },
  targetStage: { type: String, default: 'Early infestation / Larval stage' },
  toxicityLevel: { type: String, enum: ['Green (Safe)', 'Blue (Moderately Toxic)', 'Yellow (Highly Toxic)', 'Red (Extremely Toxic)'], default: 'Blue (Moderately Toxic)' }
});

const pestSchema = new mongoose.Schema(
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
      enum: ['Insect / Pest', 'Fungal Disease', 'Bacterial Disease', 'Viral Disease', 'Nematode', 'Mite'],
      default: 'Insect / Pest',
    },
    severity: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Critical'],
      default: 'High',
    },
    affectedCrops: [
      {
        type: String,
        required: true,
      },
    ],
    symptoms: [
      {
        type: String,
        required: true,
      },
    ],
    hindiSymptoms: [
      {
        type: String,
      },
    ],
    visualDamageTypes: [
      {
        type: String,
        enum: ['Leaves chewed/holes', 'Yellowing leaves', 'Curled leaves', 'White/black powdery spots', 'Wilting/drying stem', 'Sticky sap/honey dew', 'Fruit/pod boring', 'Root decay'],
      },
    ],
    favorableConditions: {
      type: String,
    },
    identificationGuide: {
      type: String,
    },
    organicControl: {
      remedy: { type: String, required: true },
      ingredients: { type: String },
      dosagePerLiter: { type: String },
      backpackDosage15L: { type: String },
      frequency: { type: String, default: 'Every 7-10 days until resolved' },
      preparationMethod: { type: String },
    },
    chemicalControl: {
      pesticides: [pesticideItemSchema],
      safetyPrecautions: [
        {
          type: String,
        },
      ],
    },
    preventionTips: [
      {
        type: String,
      },
    ],
    icon: {
      type: String,
      default: '🐛',
    },
  },
  { timestamps: true }
);

pestSchema.index({ name: 'text', hindiName: 'text', affectedCrops: 'text', symptoms: 'text' });

export default mongoose.models.Pest || mongoose.model('Pest', pestSchema);

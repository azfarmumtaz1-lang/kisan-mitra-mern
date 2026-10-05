import mongoose from 'mongoose';

const farmerQuerySchema = new mongoose.Schema(
  {
    farmerName: {
      type: String,
      default: 'Kisan Bhai',
    },
    queryText: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    identifiedCrop: {
      type: String,
    },
    identifiedIssue: {
      type: String,
    },
    aiResponse: {
      type: String,
      required: true,
    },
    recommendedPesticides: [
      {
        name: String,
        dosage: String,
        backpackDosage: String,
        isOrganic: Boolean,
      },
    ],
    confidenceScore: {
      type: Number,
      default: 0.95,
    },
    helpful: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.FarmerQuery || mongoose.model('FarmerQuery', farmerQuerySchema);

import Crop from '../models/Crop.js';
import { cropsData } from '../data/cropsData.js';

// Helper to get crops from DB or fallback dataset
const fetchCrops = async (filter = {}) => {
  try {
    const dbCrops = await Crop.find(filter);
    if (dbCrops && dbCrops.length > 0) return dbCrops;
  } catch (err) {
    console.warn('DB query error, serving in-memory crops:', err.message);
  }
  return cropsData;
};

export const getCrops = async (req, res) => {
  try {
    const { season, soilType, waterRequirement, category, search } = req.query;

    let filter = {};
    if (season && season !== 'All') {
      filter.season = season;
    }
    if (soilType && soilType !== 'All') {
      filter.soilTypes = soilType;
    }
    if (waterRequirement && waterRequirement !== 'All') {
      filter.waterRequirement = waterRequirement;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    let crops = await fetchCrops(filter);

    // Apply filters in-memory if fallback is active
    if (season && season !== 'All') {
      crops = crops.filter(c => c.season.includes(season) || c.season.includes('Year-round'));
    }
    if (soilType && soilType !== 'All') {
      crops = crops.filter(c => c.soilTypes && c.soilTypes.includes(soilType));
    }
    if (waterRequirement && waterRequirement !== 'All') {
      crops = crops.filter(c => c.waterRequirement === waterRequirement);
    }
    if (category && category !== 'All') {
      crops = crops.filter(c => c.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      crops = crops.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.hindiName && c.hindiName.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.commonPests && c.commonPests.some(p => p.toLowerCase().includes(q)))
      );
    }

    res.json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCropById = async (req, res) => {
  try {
    const { id } = req.params;
    let crop = null;

    try {
      crop = await Crop.findById(id);
    } catch {
      // not a mongo id, find in in-memory
    }

    if (!crop) {
      crop = cropsData.find(c => c._id === id || c.name.toLowerCase().includes(id.toLowerCase()));
    }

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Intelligent Multi-Parameter Sowing Recommendation Wizard
 * Takes season, soil, water, land size, and returns customized ranked crops with estimated net profit
 */
export const recommendSowing = async (req, res) => {
  try {
    const { season = 'Rabi', soilType = 'Loamy', waterAvailability = 'Medium', landSize = 2, priority = 'Profit' } = req.body;

    let pool = await fetchCrops();

    // Filter by season
    let matches = pool.filter(crop =>
      crop.season.includes(season) || crop.season.includes('Year-round')
    );

    // Score each crop based on match
    const scored = matches.map(crop => {
      let score = 50; // base score
      let reasons = [];

      // Soil match
      if (crop.soilTypes && crop.soilTypes.includes(soilType)) {
        score += 25;
        reasons.push(`Highly suited for ${soilType} soil type`);
      } else {
        score += 5;
      }

      // Water match
      if (crop.waterRequirement === waterAvailability) {
        score += 25;
        reasons.push(`Optimal fit for your ${waterAvailability} water availability`);
      } else if (waterAvailability === 'High') {
        score += 15;
      } else if (crop.waterRequirement === 'Low' && waterAvailability === 'Medium') {
        score += 20;
        reasons.push('Low water requirement leaves buffer against drought');
      }

      // Profitability weighting
      if (priority === 'Profit') {
        if (crop.profitPotential === 'Very High') score += 20;
        else if (crop.profitPotential === 'High') score += 10;
      } else if (priority === 'LowRisk') {
        if (crop.category === 'Cereal' || crop.category === 'Pulse') {
          score += 20;
          reasons.push('Stable government MSP market support with low price fluctuation');
        }
      }

      const totalCost = (crop.estimatedCostPerAcre || 15000) * Number(landSize);
      const totalRevenue = (crop.estimatedRevenuePerAcre || 45000) * Number(landSize);
      const netProfit = totalRevenue - totalCost;

      return {
        ...crop.toObject ? crop.toObject() : crop,
        matchScore: Math.min(score, 99),
        suitabilityReasons: reasons,
        economics: {
          acres: Number(landSize),
          totalCost,
          totalRevenue,
          netProfit,
          roiPercent: Math.round((netProfit / totalCost) * 100),
        }
      };
    });

    // Sort descending by match score
    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      parameters: { season, soilType, waterAvailability, landSize, priority },
      count: scored.length,
      recommendations: scored
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

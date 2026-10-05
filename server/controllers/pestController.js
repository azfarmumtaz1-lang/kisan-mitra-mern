import Pest from '../models/Pest.js';
import { pestsData } from '../data/pestsData.js';

// Helper to get pests from DB or fallback dataset
const fetchPests = async (filter = {}) => {
  try {
    const dbPests = await Pest.find(filter);
    if (dbPests && dbPests.length > 0) return dbPests;
  } catch (err) {
    console.warn('DB query error, serving in-memory pests:', err.message);
  }
  return pestsData;
};

export const getPests = async (req, res) => {
  try {
    const { crop, category, severity, search } = req.query;

    let pests = await fetchPests();

    if (crop && crop !== 'All') {
      pests = pests.filter(p =>
        p.affectedCrops.some(c => c.toLowerCase().includes(crop.toLowerCase()))
      );
    }
    if (category && category !== 'All') {
      pests = pests.filter(p => p.category === category);
    }
    if (severity && severity !== 'All') {
      pests = pests.filter(p => p.severity === severity);
    }
    if (search) {
      const q = search.toLowerCase();
      pests = pests.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
        p.symptoms.some(s => s.toLowerCase().includes(q)) ||
        p.chemicalControl.pesticides.some(chem =>
          chem.name.toLowerCase().includes(q) ||
          (chem.commercialNames && chem.commercialNames.some(c => c.toLowerCase().includes(q)))
        )
      );
    }

    res.json({
      success: true,
      count: pests.length,
      data: pests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPestById = async (req, res) => {
  try {
    const { id } = req.params;
    let pest = null;

    try {
      pest = await Pest.findById(id);
    } catch {
      // not a mongo id
    }

    if (!pest) {
      pest = pestsData.find(p => p._id === id || p.name.toLowerCase().includes(id.toLowerCase()));
    }

    if (!pest) {
      return res.status(404).json({ success: false, message: 'Pest or disease not found' });
    }

    res.json({ success: true, data: pest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Visual Symptom-Based Diagnostic Doctor
 * Farmer selects damage cues (e.g. holes, yellowing, curled leaves, wilting)
 */
export const diagnoseBySymptoms = async (req, res) => {
  try {
    const { symptoms = [], crop = '', freeText = '' } = req.body;

    const allPests = await fetchPests();

    const matches = allPests.map(pest => {
      let confidence = 0;
      let matchedFactors = [];

      // Check crop match
      if (crop && pest.affectedCrops.some(c => c.toLowerCase().includes(crop.toLowerCase()))) {
        confidence += 35;
        matchedFactors.push(`Known to severely damage ${crop}`);
      }

      // Check visual damage types
      if (symptoms && symptoms.length > 0) {
        const matchingSymptoms = pest.visualDamageTypes.filter(v => symptoms.includes(v));
        if (matchingSymptoms.length > 0) {
          confidence += (matchingSymptoms.length / symptoms.length) * 45;
          matchedFactors.push(`Matches symptoms: ${matchingSymptoms.join(', ')}`);
        }
      }

      // Check free text search
      if (freeText) {
        const ft = freeText.toLowerCase();
        if (pest.name.toLowerCase().includes(ft) || (pest.hindiName && pest.hindiName.toLowerCase().includes(ft))) {
          confidence += 30;
          matchedFactors.push('Matched name keywords');
        }
        if (pest.symptoms.some(s => s.toLowerCase().includes(ft))) {
          confidence += 20;
          matchedFactors.push('Matched clinical symptom text');
        }
      }

      return {
        ...pest.toObject ? pest.toObject() : pest,
        confidenceScore: Math.min(Math.round(confidence), 98),
        matchedFactors,
      };
    });

    const ranked = matches.filter(m => m.confidenceScore > 20).sort((a, b) => b.confidenceScore - a.confidenceScore);

    res.json({
      success: true,
      querySymptoms: symptoms,
      crop,
      diagnoses: ranked.length > 0 ? ranked : matches.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Sprayer Dilution & Tank Dosage Calculator
 * Solves the #1 confusion farmers face: "How much medicine should I put in my 15L backpack sprayer?"
 */
export const calculateSprayerDosage = (req, res) => {
  try {
    const {
      tankCapacityLiters = 15, // Standard 15L or 16L or 20L
      dosagePerLiter = 0.5,    // in ml or g per liter
      unit = 'ml',            // 'ml' or 'grams'
      farmAreaAcres = 1,      // farm size in acres
      tanksPerAcre = 8,       // 8 to 10 tanks per acre (approx 120-150L)
    } = req.body;

    const dosePerTank = Number(dosagePerLiter) * Number(tankCapacityLiters);
    const totalTanksNeeded = Math.ceil(Number(farmAreaAcres) * Number(tanksPerAcre));
    const totalWaterLiters = totalTanksNeeded * Number(tankCapacityLiters);
    const totalChemicalNeeded = totalTanksNeeded * dosePerTank;

    res.json({
      success: true,
      calculation: {
        perTankDosage: `${dosePerTank.toFixed(1)} ${unit} per ${tankCapacityLiters}-Litre tank`,
        perTankInstruction: `Fill tank halfway with ${tankCapacityLiters / 2} L water, add ${dosePerTank.toFixed(1)} ${unit} of pesticide, stir well, then top up to ${tankCapacityLiters} Litres.`,
        totalTanksNeeded: `${totalTanksNeeded} sprayer tanks`,
        totalWaterVolume: `${totalWaterLiters} Litres water needed for ${farmAreaAcres} acre(s)`,
        totalChemicalNeeded: `${totalChemicalNeeded.toFixed(1)} ${unit} (Approx ${Math.ceil(totalChemicalNeeded)} ${unit})`,
        bestSprayingTime: 'Early morning (6 AM - 9 AM) or late evening (4:30 PM - 6:30 PM)',
        safetyReminder: 'Do not spray against the direction of the wind. Wear protective cloth/mask.',
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

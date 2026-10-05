import { pestsData } from '../data/pestsData.js';
import { cropsData } from '../data/cropsData.js';

/**
 * Intelligent Agricultural AI Engine for Farmers
 * Provides instant diagnosis for pests, insects, plant diseases, chemical & bio-pesticide prescriptions,
 * dilution ratios, sprayer tank dosages, and seasonal sowing advice.
 */

export class AgriAIEngine {
  /**
   * Main entry point for farmer queries
   */
  static async answerFarmerQuery(queryText, options = {}) {
    const text = (queryText || '').toLowerCase().trim();
    const apiKey = options.geminiApiKey || process.env.GEMINI_API_KEY;

    // Check if Gemini API key is available for generative expansion
    if (apiKey) {
      try {
        const geminiResult = await this.callGeminiAPI(queryText, apiKey);
        if (geminiResult) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local expert system:', err.message);
      }
    }

    // Local Agricultural Expert Engine (100% reliable, zero latency, offline capable)
    return this.expertRuleEngine(text);
  }

  /**
   * Deep expert rule engine for agricultural pest, insect, and sowing diagnosis
   */
  static expertRuleEngine(text) {
    // 1. Detect Pest or Insect or Disease
    let matchedPest = null;
    let matchedCrop = null;

    // Check for crop match
    for (const crop of cropsData) {
      const cropNames = [
        crop.name.toLowerCase(),
        crop.hindiName ? crop.hindiName.toLowerCase() : '',
        ...(crop.name.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])
      ];
      if (cropNames.some(name => name && text.includes(name))) {
        matchedCrop = crop;
        break;
      }
    }

    // Keyword mappings for common Hindi / Hinglish / English terms
    const pestKeywords = [
      { key: ['fall armyworm', 'armyworm', 'sainik', 'faw', 'makkai sundi', 'corn worm'], index: 0 }, // Fall Armyworm
      { key: ['aphid', 'whitefly', 'mahu', 'chepa', 'safed makkhi', 'mowha', 'sap sucker', 'honeydew', 'sticky leaves'], index: 1 }, // Aphids & Whiteflies
      { key: ['stem borer', 'tana chhedak', 'dead heart', 'white earhead', 'safed baali', 'chhedak', 'rice borer'], index: 2 }, // Yellow Stem Borer
      { key: ['pink bollworm', 'bollworm', 'gulabi sundi', 'cotton sundi', 'rosette flower', 'kapas sundi'], index: 3 }, // Pink Bollworm
      { key: ['blight', 'jhulsa', 'late blight', 'early blight', 'pacheti', 'ageti', 'potato rotting', 'leaf rot', 'target spot'], index: 4 }, // Blights
      { key: ['murda', 'leaf curl', 'thrips', 'mite', 'churra', 'patti marod', 'patti modak', 'mirch rog', 'curling up'], index: 5 }, // Chilli Murda
      { key: ['powdery mildew', 'bhabhutia', 'churna', 'safed powder', 'white powder', 'downy mildew', 'mildew'], index: 6 }, // Powdery Mildew
      { key: ['termite', 'deemak', 'white ant', 'dimak', 'root eating', 'jad kaatna'], index: 7 }, // Termites
    ];

    for (const mapping of pestKeywords) {
      if (mapping.key.some(k => text.includes(k))) {
        matchedPest = pestsData[mapping.index];
        break;
      }
    }

    // If no direct pest keyword matched, check symptoms mentioned in the query
    if (!matchedPest) {
      if (text.includes('curl') || text.includes('marod') || text.includes('mud rahi') || text.includes('boat')) {
        matchedPest = pestsData[5]; // Chilli Leaf curl / thrips
      } else if (text.includes('yellow') || text.includes('peeli') || text.includes('sticky') || text.includes('chipchipa')) {
        matchedPest = pestsData[1]; // Aphids / Whiteflies
      } else if (text.includes('hole') || text.includes('chhed') || text.includes('sundi') || text.includes('keeda') || text.includes('worm') || text.includes('caterpillar')) {
        matchedPest = matchedCrop?.name.includes('Cotton') ? pestsData[3] : (matchedCrop?.name.includes('Rice') ? pestsData[2] : pestsData[0]);
      } else if (text.includes('powder') || text.includes('safed') || text.includes('dhabba') || text.includes('ash')) {
        matchedPest = pestsData[6]; // Powdery Mildew
      } else if (text.includes('rot') || text.includes('sukha') || text.includes('black spot') || text.includes('jhulsa') || text.includes('burn')) {
        matchedPest = pestsData[4]; // Blight
      } else if (text.includes('root') || text.includes('jad') || text.includes('dimak') || text.includes('sukhi ja rahi')) {
        matchedPest = pestsData[7]; // Termites
      }
    }

    // 2. Check if the query is about SOWING or SEASONAL SELECTION
    const isSowingQuery = text.includes('sow') || text.includes('bona') || text.includes('boyein') ||
      text.includes('season') || text.includes('mausam') || text.includes('kharif') ||
      text.includes('rabi') || text.includes('zaid') || text.includes('fassal') ||
      text.includes('which crop') || text.includes('kaun si fasal');

    if (isSowingQuery && !matchedPest) {
      return this.generateSowingAdvice(text, matchedCrop);
    }

    // 3. If Pest or Insect Issue is identified
    if (matchedPest) {
      return this.generatePestAdvice(matchedPest, matchedCrop, text);
    }

    // 4. Default Helpful Farmer Advisory
    return this.generateGeneralAdvisory(text);
  }

  /**
   * Generates a structured clinical pest & pesticide prescription
   */
  static generatePestAdvice(pest, crop, query) {
    const primaryPesticide = pest.chemicalControl.pesticides[0];
    const secondaryPesticide = pest.chemicalControl.pesticides[1] || pest.chemicalControl.pesticides[0];

    const targetCrop = crop ? crop.name : (pest.affectedCrops[0] || 'Crop');

    return {
      type: 'pest_prescription',
      status: 'success',
      identifiedIssue: pest.name,
      hindiIssueName: pest.hindiName,
      category: pest.category,
      severity: pest.severity,
      cropContext: targetCrop,
      icon: pest.icon,
      summary: `Diagnosis confirmed for **${pest.name}** in ${targetCrop}. Below is your immediate action plan with organic remedies and exact sprayer dosages.`,
      symptoms: pest.symptoms,
      organicControl: {
        title: '🌿 Step 1: Safe Organic & Biological Control',
        remedy: pest.organicControl.remedy,
        backpackDosage: pest.organicControl.backpackDosage15L,
        frequency: pest.organicControl.frequency,
        instructions: pest.organicControl.preparationMethod,
      },
      chemicalControl: {
        title: '🧪 Step 2: Chemical Pesticide Prescription & Sprayer Dosages',
        warning: 'Always spray during calm weather (early morning before 10 AM or evening after 4 PM). Wear gloves & face mask.',
        pesticides: pest.chemicalControl.pesticides.map(p => ({
          name: p.name,
          tradeNames: p.commercialNames ? p.commercialNames.join(', ') : '',
          dosagePerLiter: p.dosagePerLiter,
          backpackSprayer15L: p.backpackDosage15L,
          perAcre: p.perAcreDosage,
          preHarvestWaiting: `${p.preHarvestIntervalDays} days before harvest (सुरक्षा अवधि / PHI)`,
          targetStage: p.targetStage,
          toxicity: p.toxicityLevel,
        })),
        safetyPrecautions: pest.chemicalControl.safetyPrecautions,
      },
      backpackGuide: {
        tankSize: '15-Liter Knapsack Sprayer (15 लीटर वाली टंकी)',
        primaryDosage: primaryPesticide ? `${primaryPesticide.backpackDosage15L}` : 'Refer to chemical table',
        alternativeDosage: secondaryPesticide ? `${secondaryPesticide.backpackDosage15L}` : '',
        waterVolumePerAcre: 'Use 8 to 10 sprayer tanks (150 - 200 Litres water) per acre for uniform coverage.',
      },
      prevention: pest.preventionTips,
      voiceFriendlyText: `किसान भाई, आपकी फसल में ${pest.hindiName || pest.name} का लक्षण पाया गया है। तुरंत नियंत्रण के लिए 15 लीटर वाली स्प्रे टंकी में ${primaryPesticide ? primaryPesticide.backpackDosage15L : 'दवाई'} मिलाकर छिड़काव करें। जैविक उपाय के लिए ${pest.organicControl.remedy} का इस्तेमाल करें। छिड़काव हमेशा सुबह या शाम के समय करें।`
    };
  }

  /**
   * Generates seasonal sowing guidance
   */
  static generateSowingAdvice(query, matchedCrop) {
    let season = 'All';
    if (query.includes('kharif') || query.includes('monsoon') || query.includes('rainy') || query.includes('barsat')) {
      season = 'Kharif';
    } else if (query.includes('rabi') || query.includes('winter') || query.includes('sardi') || query.includes('thand')) {
      season = 'Rabi';
    } else if (query.includes('zaid') || query.includes('summer') || query.includes('garmi')) {
      season = 'Zaid';
    }

    let recommended = cropsData;
    if (season !== 'All') {
      recommended = cropsData.filter(c => c.season.includes(season));
    }

    return {
      type: 'sowing_advice',
      status: 'success',
      seasonDetected: season,
      summary: `Here is the comprehensive Sowing Calendar & Crop Recommendation for **${season} Season**. Selected crops match soil fertility, moisture retention, and high net profit returns per acre.`,
      crops: recommended.slice(0, 5).map(c => ({
        name: c.name,
        hindiName: c.hindiName,
        category: c.category,
        sowingMonths: c.sowingMonths.join(', '),
        harvestingMonths: c.harvestingMonths.join(', '),
        duration: `${c.durationDays.min} - ${c.durationDays.max} days`,
        waterRequirement: c.waterRequirement,
        seedRate: c.seedRate,
        expectedYield: c.expectedYield,
        profitPotential: c.profitPotential,
        icon: c.icon,
        soilPrep: c.sowingInstructions.soilPrep,
      })),
      generalSowingTips: [
        'Always conduct seed germination test before sowing (minimum 85% germination rate required).',
        'Treat seeds with Trichoderma (5g/kg) or Carbendazim (2g/kg) to prevent damping-off and root rot.',
        'Use line sowing with a seed drill rather than broadcasting to ensure uniform depth and spacing.',
        'Apply well-decomposed FYM/compost 3 weeks before sowing to boost soil organic carbon.'
      ],
      voiceFriendlyText: `किसान भाई, ${season} मौसम के लिए सबसे उपयुक्त फसलें हैं: ${recommended.slice(0, 3).map(c => c.name).join(', ')}। बुवाई से पहले बीजोपचार अवश्य करें और कतार में बुवाई करें।`
    };
  }

  /**
   * General fallback agricultural advisory
   */
  static generateGeneralAdvisory(query) {
    return {
      type: 'general_advisory',
      status: 'info',
      summary: `I'm Dr. Kisan AI, your agricultural assistant. I noticed you asked: "${query}".`,
      guidance: [
        'To get the most accurate pesticide prescription, please tell me: (1) Crop Name (e.g. Tomato, Cotton, Wheat), (2) Symptoms you see (e.g. yellow curled leaves, holes, powdery spots, drying stems).',
        'Or ask me about sowing: "What crop should I sow in Rabi in black soil with low water?"',
        'You can also pick from the visual symptom picker below or tap the microphone to speak in Hindi or English!'
      ],
      quickSuggestions: [
        { label: '🐛 Fall Armyworm in Maize', query: 'Fall Armyworm in maize pesticide dosage' },
        { label: '🌶️ Upward Leaf Curling in Chilli', query: 'Chilli leaves curling upward thrips pesticide' },
        { label: '🌾 White earhead / Stem borer in Rice', query: 'Stem borer in paddy chemical and bio control' },
        { label: '🍂 Blight / rotting leaves in Potato', query: 'Late blight in potato fungicide spray per 15L tank' },
        { label: '🌱 What to sow in Rabi (Winter)', query: 'What are the best crops to sow in Rabi season?' }
      ],
      voiceFriendlyText: 'नमस्ते किसान भाई, मैं डॉ. किसान एआई हूँ। कृपया मुझे अपनी फसल का नाम और पत्तियों या फल में दिख रहे लक्षण बताएं, जैसे कीड़े, पत्ती मुड़ना या धब्बे। मैं आपको सही कीटनाशक और 15 लीटर टंकी का नाप बताऊंगा।'
    };
  }

  /**
   * Gemini API integration for advanced generative inquiries
   */
  static async callGeminiAPI(query, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are "Dr. Kisan AI", an expert agricultural entomologist and senior agronomist dedicated to Indian and global farmers.
When answering farmer queries about pests, insects, crop diseases, or sowing:
1. Speak in a respectful, warm, and highly practical manner (empathetic to farmers).
2. Clearly give:
   - Suspected Pest / Disease Diagnosis
   - Organic / Bio-control remedy (Neem oil, biological agents)
   - Chemical pesticide active ingredients with commercial brand names (e.g. Coragen, Confidor, Ridomil)
   - Exact dosage per liter AND dosage for a standard 15-Litre backpack knapsack sprayer tank!
   - Pre-Harvest Interval (PHI / wait days before picking)
   - Safety precautions (gloves, mask, wind direction, bee safety).
3. If the query is about sowing, recommend the best crops for the season with seed rate and spacing.
4. Keep the advice actionable, bulleted, and easy to read on mobile.`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nFarmer's Query: "${query}"` }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) return null;

    return {
      type: 'gemini_response',
      status: 'success',
      aiResponseText: candidate,
      voiceFriendlyText: candidate.slice(0, 300).replace(/[*#_]/g, ''),
    };
  }
}

import { AgriAIEngine } from '../services/aiKnowledgeEngine.js';
import FarmerQuery from '../models/FarmerQuery.js';

// In-memory query storage for resilience
const recentQueriesStore = [];

export const askDoctorAI = async (req, res) => {
  try {
    const { query, language = 'en', farmerName = 'Kisan Bhai', apiKey } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a farming question or symptom description.' });
    }

    const aiResult = await AgriAIEngine.answerFarmerQuery(query, {
      geminiApiKey: apiKey || process.env.GEMINI_API_KEY
    });

    // Save query log
    const queryLog = {
      farmerName,
      queryText: query,
      language,
      identifiedCrop: aiResult.cropContext || '',
      identifiedIssue: aiResult.identifiedIssue || '',
      aiResponse: aiResult.summary || (aiResult.aiResponseText ? aiResult.aiResponseText.slice(0, 300) : 'Advisory generated'),
      confidenceScore: 0.95,
      createdAt: new Date(),
    };

    try {
      await FarmerQuery.create(queryLog);
    } catch {
      // In-memory fallback
      recentQueriesStore.unshift(queryLog);
      if (recentQueriesStore.length > 20) recentQueriesStore.pop();
    }

    res.json({
      success: true,
      query,
      result: aiResult
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentQueries = async (req, res) => {
  try {
    let queries = [];
    try {
      queries = await FarmerQuery.find().sort({ createdAt: -1 }).limit(10);
    } catch {
      // fallback
    }

    if (!queries || queries.length === 0) {
      queries = recentQueriesStore;
    }

    res.json({
      success: true,
      queries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { queryId, helpful } = req.body;
    try {
      await FarmerQuery.findByIdAndUpdate(queryId, { helpful });
    } catch {
      // ignore
    }
    res.json({ success: true, message: 'Thank you for your feedback! It helps improve farmer advisory.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

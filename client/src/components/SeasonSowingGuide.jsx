import React, { useState, useEffect } from 'react';
import { Sprout, Filter, Search, Sparkles, TrendingUp, Droplets, Calendar, ShieldCheck, ChevronRight, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export default function SeasonSowingGuide({ lang, onSelectCrop }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedSoil, setSelectedSoil] = useState('All');
  const [selectedWater, setSelectedWater] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sowing Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [wizardLandSize, setWizardLandSize] = useState(2);
  const [wizardSoil, setWizardSoil] = useState('Loamy');
  const [wizardWater, setWizardWater] = useState('Medium');
  const [wizardPriority, setWizardPriority] = useState('Profit');
  const [wizardRecommendations, setWizardRecommendations] = useState(null);
  const [wizardLoading, setWizardLoading] = useState(false);

  // Translations
  const t = {
    en: {
      headline: "Seasonal Sowing Guide & Crop Advisor",
      subline: "Discover the best crops to sow based on the current season, your soil type, and water availability to maximize your farm income.",
      seasons: {
        all: "All Crops",
        rabi: "❄️ Rabi (Winter: Oct-Apr)",
        kharif: "🌧️ Kharif (Monsoon: June-Nov)",
        zaid: "☀️ Zaid (Summer: Mar-June)",
        yearRound: "🔄 Year-Round"
      },
      filters: {
        soil: "Soil Type",
        water: "Water Availability",
        allSoils: "All Soils",
        allWater: "All Water Levels",
        searchPlaceholder: "Search crop by name (e.g. Wheat, गेंहू, Cotton, Mustard)...",
      },
      wizardBtn: "✨ Smart Sowing Recommendation Wizard",
      wizardTitle: "Find Your Best Crop in 10 Seconds",
      wizardDesc: "Enter your land size and farm conditions to receive tailored high-profit crop recommendations.",
      landSize: "Land Size (in Acres)",
      priority: "Farming Goal",
      priorityProfit: "Maximize Net Profit",
      prioritySafe: "Low Risk & Stable MSP",
      calculateBtn: "Calculate Best Crops",
      yield: "Expected Yield",
      seedRate: "Seed Rate",
      duration: "Duration",
      waterReq: "Water Req.",
      viewGuideBtn: "Full Sowing Guide",
      profitBadge: "Profit Potential",
      suitability: "Match Score",
      netProfitEst: "Estimated Net Profit",
    },
    hi: {
      headline: "मौसम के अनुसार बुवाई मार्गदर्शिका",
      subline: "अपने खेत की मिट्टी, पानी की उपलब्धता और वर्तमान मौसम के अनुसार जानें कौन सी फसल बोएं जिससे अधिक से अधिक मुनाफा हो।",
      seasons: {
        all: "सभी फसलें",
        rabi: "❄️ रबी (सर्दियों में: अक्टूबर-अप्रैल)",
        kharif: "🌧️ खरीफ (मानसून में: जून-नवंबर)",
        zaid: "☀️ जायद (गर्मी में: मार्च-जून)",
        yearRound: "🔄 बारहमासी फसलें"
      },
      filters: {
        soil: "मिट्टी का प्रकार",
        water: "पानी की उपलब्धता",
        allSoils: "सभी प्रकार की मिट्टी",
        allWater: "पानी का स्तर",
        searchPlaceholder: "फसल खोजें (जैसे गेंहू, धान, सरसों, कपास, मक्का)...",
      },
      wizardBtn: "✨ स्मार्ट फसल चयन सहायक (Wizard)",
      wizardTitle: "10 सेकंड में अपने खेत के लिए सबसे सही फसल चुनें",
      wizardDesc: "अपनी जमीन का रकबा (एकड़) और पानी की स्थिति बताएं, हम सबसे अधिक मुनाफे वाली फसल बताएंगे।",
      landSize: "जमीन का आकार (एकड़ में)",
      priority: "प्राथमिकता",
      priorityProfit: "अधिकतम शुद्ध मुनाफा",
      prioritySafe: "कम जोखिम व सुरक्षित सरकारी भाव (MSP)",
      calculateBtn: "सर्वोत्तम फसलें खोजें",
      yield: "अनुमानित पैदावार",
      seedRate: "बीज दर (प्रति एकड़)",
      duration: "फसल अवधि",
      waterReq: "पानी की आवश्यकता",
      viewGuideBtn: "बुवाई की पूरी विधि",
      profitBadge: "मुनाफा स्तर",
      suitability: "मैच स्कोर",
      netProfitEst: "अनुमानित शुद्ध बचत",
    }
  }[lang];

  useEffect(() => {
    fetchCrops();
  }, [selectedSeason, selectedSoil, selectedWater, searchQuery]);

  async function fetchCrops() {
    setLoading(true);
    try {
      const res = await api.getCrops({
        season: selectedSeason,
        soilType: selectedSoil,
        waterRequirement: selectedWater,
        search: searchQuery
      });
      if (res.success) {
        setCrops(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch crops:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRunWizard(e) {
    if (e) e.preventDefault();
    setWizardLoading(true);
    try {
      const res = await api.recommendSowing({
        season: selectedSeason === 'All' ? 'Rabi' : selectedSeason,
        soilType: wizardSoil,
        waterAvailability: wizardWater,
        landSize: wizardLandSize,
        priority: wizardPriority,
      });
      if (res.success) {
        setWizardRecommendations(res.recommendations);
      }
    } catch (err) {
      console.error('Wizard error:', err);
    } finally {
      setWizardLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header & Wizard Launch Banner */}
      <div className="bg-gradient-to-br from-agri-800 via-agri-700 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute right-32 -top-12 w-48 h-48 rounded-full bg-amber-400/10 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-stone-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            <Sprout className="w-3.5 h-3.5 text-stone-900" />
            Seasonal Agronomy Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t.headline}
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            {t.subline}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setShowWizard(!showWizard);
                if (!wizardRecommendations) handleRunWizard();
              }}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer text-sm"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>{showWizard ? 'Hide Recommendation Wizard' : t.wizardBtn}</span>
            </button>
            <span className="text-xs text-emerald-200">
              ⚡ Analyzes soil type, season, and market profits instantly
            </span>
          </div>
        </div>
      </div>

      {/* Sowing Wizard Interactive Drawer / Panel */}
      {showWizard && (
        <div className="bg-white rounded-3xl border-2 border-agri-400/50 p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🧙‍♂️</span>
                <h3 className="text-lg font-extrabold text-stone-900">{t.wizardTitle}</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{t.wizardDesc}</p>
            </div>
            <button
              onClick={() => setShowWizard(false)}
              className="text-xs text-stone-400 hover:text-stone-700 font-medium self-end sm:self-auto cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          {/* Wizard Form Controls */}
          <form onSubmit={handleRunWizard} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                {t.landSize}
              </label>
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={wizardLandSize}
                onChange={(e) => setWizardLandSize(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-agri-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                {t.filters.soil}
              </label>
              <select
                value={wizardSoil}
                onChange={(e) => setWizardSoil(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-agri-500 outline-hidden"
              >
                <option value="Loamy">Loamy Soil (दोमट मिट्टी)</option>
                <option value="Black Cotton">Black Cotton Soil (काली मिट्टी)</option>
                <option value="Alluvial">Alluvial Soil (जलोढ़ मिट्टी)</option>
                <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
                <option value="Clay">Clay Soil (चिकनी मिट्टी)</option>
                <option value="Red">Red Soil (लाल मिट्टी)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                {t.filters.water}
              </label>
              <select
                value={wizardWater}
                onChange={(e) => setWizardWater(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-agri-500 outline-hidden"
              >
                <option value="Low">Low / Rainfed (कम पानी / वर्षा आधारित)</option>
                <option value="Medium">Medium / Tubewell (मध्यम पानी / नलकूप)</option>
                <option value="High">High / Canal Irrigation (प्रचुर पानी / नहर)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                {t.priority}
              </label>
              <select
                value={wizardPriority}
                onChange={(e) => setWizardPriority(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-agri-500 outline-hidden"
              >
                <option value="Profit">{t.priorityProfit}</option>
                <option value="LowRisk">{t.prioritySafe}</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button
                type="submit"
                disabled={wizardLoading}
                className="bg-agri-700 hover:bg-agri-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {wizardLoading ? 'Analyzing...' : t.calculateBtn}
              </button>
            </div>
          </form>

          {/* Wizard Results */}
          {wizardRecommendations && (
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <span>🏆 Top Recommended Crops for Your Plot ({wizardLandSize} Acres)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {wizardRecommendations.slice(0, 3).map((rec, idx) => (
                  <div
                    key={rec._id || idx}
                    className="bg-gradient-to-b from-stone-50 to-white rounded-2xl border border-stone-200 p-4 shadow-xs relative hover:border-agri-400 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 bg-agri-100 rounded-xl">{rec.icon}</span>
                        <div>
                          <h5 className="font-extrabold text-stone-900 text-base">{rec.name}</h5>
                          <span className="text-xs text-stone-500">{rec.hindiName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                          {rec.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    {/* Economics summary */}
                    <div className="mt-3.5 p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/60 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-emerald-900">
                        <span>{t.netProfitEst}:</span>
                        <span className="text-sm font-extrabold text-emerald-700">
                          ₹{rec.economics.netProfit.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>ROI: {rec.economics.roiPercent}%</span>
                        <span>Est. Cost: ₹{rec.economics.totalCost.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Reasons */}
                    <div className="mt-2.5 space-y-1">
                      {rec.suitabilityReasons && rec.suitabilityReasons.slice(0, 2).map((reason, i) => (
                        <div key={i} className="text-[11px] text-stone-600 flex items-start gap-1">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onSelectCrop(rec)}
                      className="mt-3 w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{t.viewGuideBtn}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Season Selection Filter Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <span>🌾</span>
            <span>Select Sowing Season</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Showing {crops.length} agricultural crops
          </span>
        </div>

        {/* Season buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: 'All', label: t.seasons.all, icon: '🌱' },
            { id: 'Rabi', label: t.seasons.rabi, icon: '❄️' },
            { id: 'Kharif', label: t.seasons.kharif, icon: '🌧️' },
            { id: 'Zaid', label: t.seasons.zaid, icon: '☀️' },
            { id: 'Year-round', label: t.seasons.yearRound, icon: '🔄' },
          ].map((s) => {
            const isSelected = selectedSeason === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSeason(s.id)}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border text-center ${
                  isSelected
                    ? 'bg-agri-700 text-white border-agri-700 shadow-md shadow-agri-700/20 scale-[1.02]'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row: Soil, Water, Search */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Soil dropdown */}
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={selectedSoil}
              onChange={(e) => setSelectedSoil(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-800 w-full outline-hidden"
            >
              <option value="All">{t.filters.allSoils}</option>
              <option value="Loamy">Loamy Soil (दोमट)</option>
              <option value="Black Cotton">Black Cotton (काली मिट्टी)</option>
              <option value="Alluvial">Alluvial (जलोढ़)</option>
              <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
              <option value="Clay">Clay (चिकनी मिट्टी)</option>
              <option value="Red">Red Soil (लाल मिट्टी)</option>
            </select>
          </div>

          {/* Water dropdown */}
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
            <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
            <select
              value={selectedWater}
              onChange={(e) => setSelectedWater(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-800 w-full outline-hidden"
            >
              <option value="All">{t.filters.allWater}</option>
              <option value="Low">Low / Rainfed Water</option>
              <option value="Medium">Medium Water</option>
              <option value="High">High Water Requirement</option>
            </select>
          </div>

          {/* Search box */}
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder={t.filters.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-stone-800 placeholder-stone-400 w-full outline-hidden"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-stone-400 hover:text-stone-700">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Crops Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-stone-500 space-y-2">
          <div className="inline-block w-8 h-8 border-4 border-agri-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold">Loading seasonal crop data...</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <span className="text-4xl">🌾</span>
          <h3 className="text-base font-bold text-stone-800">No matching crops found</h3>
          <p className="text-xs text-stone-500">Try adjusting your season, soil type, or water filters.</p>
          <button
            onClick={() => {
              setSelectedSeason('All');
              setSelectedSoil('All');
              setSelectedWater('All');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-agri-700 hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div
              key={crop._id || crop.name}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between hover:border-agri-400 group"
            >
              <div>
                {/* Header: Icon, Name, Category */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-agri-50 to-emerald-100 flex items-center justify-center text-3xl shadow-inner border border-agri-200">
                      {crop.icon || '🌾'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-agri-700 transition">
                        {crop.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        {crop.hindiName} • <span className="italic">{crop.scientificName}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    crop.profitPotential === 'Very High'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {crop.profitPotential} Profit
                  </span>
                </div>

                {/* Sowing Months & Duration Tag */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {crop.season.map(s => (
                    <span key={s} className="bg-stone-100 text-stone-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      📅 {s} Season
                    </span>
                  ))}
                  <span className="bg-sky-50 text-sky-800 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-sky-200">
                    💧 {crop.waterRequirement} Water
                  </span>
                  <span className="bg-stone-100 text-stone-600 text-[11px] font-medium px-2 py-0.5 rounded-md">
                    ⏱️ {crop.durationDays?.min || 90}-{crop.durationDays?.max || 120} days
                  </span>
                </div>

                {/* Quick Info Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-tight">
                      {t.yield}
                    </span>
                    <span className="font-extrabold text-stone-800 text-xs">
                      {crop.expectedYield}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-tight">
                      {t.seedRate}
                    </span>
                    <span className="font-extrabold text-stone-800 text-xs">
                      {crop.seedRate}
                    </span>
                  </div>
                </div>

                {/* Sowing Window Months */}
                <div className="mt-3 text-xs text-stone-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-agri-600" />
                  <span>
                    <strong>Sowing Window:</strong> {crop.sowingMonths ? crop.sowingMonths.join(', ') : 'Seasonal'}
                  </span>
                </div>

                {/* Common pests preview */}
                {crop.commonPests && crop.commonPests.length > 0 && (
                  <div className="mt-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-rose-700">Common Pests:</span>{' '}
                    {crop.commonPests.slice(0, 3).join(', ')}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-stone-100">
                <button
                  onClick={() => onSelectCrop(crop)}
                  className="w-full bg-agri-50 hover:bg-agri-700 text-agri-800 hover:text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <Sprout className="w-4 h-4" />
                  <span>{t.viewGuideBtn}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

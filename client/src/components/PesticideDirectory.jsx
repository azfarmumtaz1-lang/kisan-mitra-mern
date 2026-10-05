import React, { useState, useEffect } from 'react';
import { Bug, Search, Filter, ShieldCheck, ChevronDown, ChevronUp, AlertCircle, Droplets } from 'lucide-react';
import { api } from '../services/api';

export default function PesticideDirectory({ lang }) {
  const [pests, setPests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedPest, setExpandedPest] = useState(null);

  const t = {
    en: {
      title: "Crop Insect & Pesticide Encyclopedia",
      subline: "Comprehensive field guide of agricultural pests, diseases, organic remedies, and approved chemical pesticide dosages.",
      searchPlaceholder: "Search pest, insect, symptom, or chemical (e.g. Coragen, Blight, Aphid)...",
      affectedCrops: "Affects Crops:",
      symptomsTitle: "Key Visual Symptoms:",
      organicTitle: "🌿 Organic & Biological Remedy:",
      chemicalTitle: "🧪 Registered Chemical Controls:",
      tankDose: "15L Tank Dose:",
      acreDose: "Per Acre Dose:",
      phi: "Pre-Harvest Interval (PHI):",
      allCrops: "All Crops",
      allCategories: "All Disease/Pest Types",
    },
    hi: {
      title: "कीट एवं कीटनाशक संपूर्ण निर्देशिका",
      subline: "कृषि फसलों के प्रमुख कीट, रोग, उनके जैविक उपचार और अनुमोदित कीटनाशक दवाओं की संपूर्ण जानकारी।",
      searchPlaceholder: "कीड़ा, रोग, लक्षण या दवा खोजें (जैसे कोराजन, माहू, झुलसा, सैनिक सुंडी)...",
      affectedCrops: "प्रभावित फसलें:",
      symptomsTitle: "पहचान के मुख्य लक्षण:",
      organicTitle: "🌿 जैविक व घरेलू रोकथाम:",
      chemicalTitle: "🧪 रासायनिक कीटनाशक व सही खुराक:",
      tankDose: "15 ली. टंकी का नाप:",
      acreDose: "प्रति एकड़ मात्रा:",
      phi: "तुड़ाई पूर्व प्रतीक्षा (PHI):",
      allCrops: "सभी फसलें",
      allCategories: "सभी प्रकार के रोग/कीट",
    }
  }[lang];

  useEffect(() => {
    fetchPests();
  }, [selectedCrop, selectedCategory, searchQuery]);

  async function fetchPests() {
    setLoading(true);
    try {
      const res = await api.getPests({
        crop: selectedCrop,
        category: selectedCategory,
        search: searchQuery
      });
      if (res.success) {
        setPests(res.data);
      }
    } catch (err) {
      console.error('Failed to load pests:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bug className="w-6 h-6 text-agri-700" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {t.title}
          </h1>
        </div>
        <p className="text-stone-600 text-sm max-w-3xl">
          {t.subline}
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="bg-transparent text-xs text-stone-800 placeholder-stone-400 w-full outline-hidden"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-stone-400">✕</button>
          )}
        </div>

        {/* Crop Filter */}
        <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-transparent text-xs font-semibold text-stone-800 w-full outline-hidden"
          >
            <option value="All">{t.allCrops}</option>
            <option value="Cotton">Cotton (कपास)</option>
            <option value="Paddy">Paddy / Rice (धान)</option>
            <option value="Wheat">Wheat (गेंहू)</option>
            <option value="Maize">Maize (मक्का)</option>
            <option value="Chilli">Chilli (मिर्च)</option>
            <option value="Tomato">Tomato (टमाटर)</option>
            <option value="Potato">Potato (आलू)</option>
            <option value="Mustard">Mustard (सरसों)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
          <ShieldCheck className="w-4 h-4 text-agri-600 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-xs font-semibold text-stone-800 w-full outline-hidden"
          >
            <option value="All">{t.allCategories}</option>
            <option value="Insect / Pest">Insect / Pest (कीट / सुंडी)</option>
            <option value="Fungal Disease">Fungal Disease (फफूंद रोग / झुलसा)</option>
            <option value="Bacterial Disease">Bacterial Disease (जीवाणु रोग)</option>
          </select>
        </div>
      </div>

      {/* Directory Cards */}
      {loading ? (
        <div className="text-center py-16 text-stone-500 space-y-2">
          <div className="inline-block w-8 h-8 border-4 border-agri-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold">Loading pest encyclopedia...</p>
        </div>
      ) : pests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-2">
          <span className="text-4xl">🐛</span>
          <h3 className="text-base font-bold text-stone-800">No matching pests found</h3>
          <p className="text-xs text-stone-500">Try searching for other symptoms or clear your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pests.map((pest) => {
            const isExpanded = expandedPest === (pest._id || pest.name);
            return (
              <div
                key={pest._id || pest.name}
                className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:border-agri-400 transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedPest(isExpanded ? null : (pest._id || pest.name))}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50/70 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl p-2 bg-agri-50 rounded-2xl border border-agri-100">
                      {pest.icon || '🐛'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                          {pest.name}
                        </h3>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          pest.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {pest.severity}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {pest.hindiName} • <span className="italic">{pest.scientificName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-wrap gap-1 max-w-xs justify-end">
                      {pest.affectedCrops.slice(0, 3).map((c, ci) => (
                        <span key={ci} className="bg-stone-100 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {c}
                        </span>
                      ))}
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-stone-50/50 border-t border-stone-200 space-y-5 animate-fadeIn text-xs">
                    {/* Affected crops & symptoms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                        <span className="font-bold uppercase tracking-wider text-stone-400 text-[10px] block">
                          {t.affectedCrops}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {pest.affectedCrops.map((c, i) => (
                            <span key={i} className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                              🌾 {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                        <span className="font-bold uppercase tracking-wider text-stone-400 text-[10px] block">
                          {t.symptomsTitle}
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-stone-700 text-[11px]">
                          {pest.symptoms.map((s, si) => (
                            <li key={si}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Step 1: Organic Control */}
                    {pest.organicControl && (
                      <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-1.5">
                        <div className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                          <span>🌿</span>
                          <span>{t.organicTitle}</span>
                        </div>
                        <div className="text-emerald-900 font-bold">
                          {pest.organicControl.remedy}
                        </div>
                        <div className="text-emerald-800 text-[11px]">
                          <strong>15L Tank Dilution:</strong> {pest.organicControl.backpackDosage15L}
                        </div>
                        <p className="text-emerald-700 text-[11px]">
                          {pest.organicControl.preparationMethod}
                        </p>
                      </div>
                    )}

                    {/* Step 2: Chemical Pesticides with Exact Sprayer Dilutions */}
                    {pest.chemicalControl && (
                      <div className="space-y-3">
                        <div className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                          <span>🧪</span>
                          <span>{t.chemicalTitle}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {pest.chemicalControl.pesticides.map((chem, ci) => (
                            <div
                              key={ci}
                              className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2"
                            >
                              <div className="flex items-start justify-between">
                                <h4 className="font-extrabold text-stone-900 text-sm">{chem.name}</h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                                  {chem.toxicityLevel}
                                </span>
                              </div>

                              {chem.commercialNames && (
                                <div className="text-[11px] text-stone-500">
                                  <strong>Brand Names:</strong> {chem.commercialNames.join(', ')}
                                </div>
                              )}

                              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-stone-900 space-y-1">
                                <div className="flex justify-between font-bold text-amber-950">
                                  <span>{t.tankDose}</span>
                                  <span className="text-amber-700">{chem.backpackDosage15L}</span>
                                </div>
                                <div className="flex justify-between text-stone-600 text-[11px]">
                                  <span>{t.acreDose}</span>
                                  <span>{chem.perAcreDosage}</span>
                                </div>
                                <div className="flex justify-between text-stone-600 text-[11px]">
                                  <span>{t.phi}</span>
                                  <span className="font-semibold text-rose-700">{chem.preHarvestIntervalDays} days</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

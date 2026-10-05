import React from 'react';
import { Calendar, Droplets, Sprout, TrendingUp, ShieldAlert, Award, X, Sparkles } from 'lucide-react';

export default function CropDetailModal({ crop, onClose, onAskAIAboutCrop, lang }) {
  if (!crop) return null;

  const t = {
    en: {
      sowingWindow: "Sowing Window",
      harvestingWindow: "Harvesting Window",
      duration: "Duration",
      seedRate: "Seed Rate",
      expectedYield: "Expected Yield",
      profitEst: "Economics & Profit Potential",
      soilPrep: "1. Soil Preparation & Tilth",
      seedTreatment: "2. Seed Treatment (Beejopchar)",
      spacing: "3. Spacing & Depth",
      irrigation: "4. Irrigation Schedule",
      npk: "5. Fertilizer & Nutrient Management (NPK)",
      commonPests: "Common Insect Pests & Diseases",
      tips: "Senior Agronomist Pro-Tips",
      askAIBtn: "Ask Dr. Kisan AI About This Crop",
      closeBtn: "Close",
    },
    hi: {
      sowingWindow: "बुवाई का समय",
      harvestingWindow: "कटाई का समय",
      duration: "फसल अवधि",
      seedRate: "बीज दर (प्रति एकड़)",
      expectedYield: "अनुमानित पैदावार",
      profitEst: "लागत एवं मुनाफा विश्लेषण",
      soilPrep: "1. खेत की तैयारी (जुताई एवं खाद)",
      seedTreatment: "2. बीजोपचार (रोगों से सुरक्षा)",
      spacing: "3. कतार से कतार की दूरी व गहराई",
      irrigation: "4. सिंचाई की मुख्य अवस्थाएं",
      npk: "5. खाद एवं उर्वरक प्रबंधन (NPK)",
      commonPests: "मुख्य कीट एवं संभावित रोग",
      tips: "कृषि वैज्ञानिक के मुख्य सुझाव",
      askAIBtn: "इस फसल के बारे में डॉ. किसान AI से पूछें",
      closeBtn: "बंद करें",
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3.5">
            <span className="text-4xl p-3 bg-agri-50 rounded-2xl border border-agri-100">
              {crop.icon || '🌾'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                  {crop.name}
                </h2>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {crop.profitPotential} Profit
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                {crop.hindiName} • <span className="italic">{crop.scientificName}</span> • {crop.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">{t.sowingWindow}</span>
            <span className="font-extrabold text-stone-800">{crop.sowingMonths?.join(', ') || 'Seasonal'}</span>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">{t.duration}</span>
            <span className="font-extrabold text-stone-800">{crop.durationDays?.min}-{crop.durationDays?.max} Days</span>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">{t.seedRate}</span>
            <span className="font-extrabold text-agri-800">{crop.seedRate}</span>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">{t.expectedYield}</span>
            <span className="font-extrabold text-amber-800">{crop.expectedYield}</span>
          </div>
        </div>

        {/* Economic Profit Estimate per Acre */}
        <div className="bg-gradient-to-r from-emerald-500 via-agri-600 to-emerald-700 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-100">{t.profitEst} (1 Acre)</div>
            <div className="text-xl sm:text-2xl font-black mt-0.5">
              Net Profit: ₹{((crop.estimatedRevenuePerAcre || 50000) - (crop.estimatedCostPerAcre || 15000)).toLocaleString('en-IN')} / Acre
            </div>
            <div className="text-[11px] text-emerald-100/80">
              Est. Cost: ₹{crop.estimatedCostPerAcre?.toLocaleString('en-IN')} | Est. Revenue: ₹{crop.estimatedRevenuePerAcre?.toLocaleString('en-IN')}
            </div>
          </div>
          <Award className="w-10 h-10 text-amber-300 opacity-90" />
        </div>

        {/* Step-by-Step Agronomy Guide */}
        {crop.sowingInstructions && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="font-extrabold text-stone-900 block">{t.soilPrep}</span>
              <p className="text-stone-700 leading-relaxed text-[11px]">{crop.sowingInstructions.soilPrep}</p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
              <span className="font-extrabold text-amber-950 block">{t.seedTreatment}</span>
              <p className="text-amber-900 leading-relaxed text-[11px]">{crop.sowingInstructions.seedTreatment}</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="font-extrabold text-stone-900 block">{t.spacing}</span>
              <p className="text-stone-700 leading-relaxed text-[11px]">{crop.sowingInstructions.spacing}</p>
            </div>

            <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-1">
              <span className="font-extrabold text-sky-950 block">{t.irrigation}</span>
              <p className="text-sky-900 leading-relaxed text-[11px]">{crop.sowingInstructions.irrigation}</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="font-extrabold text-stone-900 block">{t.npk}</span>
              <p className="text-stone-700 leading-relaxed text-[11px]">{crop.sowingInstructions.fertilizerNPK}</p>
            </div>
          </div>
        )}

        {/* Common Pests and Pro Tips */}
        {crop.commonPests && (
          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2 text-xs">
            <span className="font-bold text-rose-950 uppercase tracking-wider text-[10px] block">
              {t.commonPests}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {crop.commonPests.map((p, pi) => (
                <span key={pi} className="bg-white text-rose-800 font-semibold px-2.5 py-1 rounded-lg border border-rose-200 text-[11px]">
                  🐛 {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
          <button
            onClick={() => {
              onClose();
              onAskAIAboutCrop(crop);
            }}
            className="w-full sm:w-auto bg-agri-700 hover:bg-agri-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.askAIBtn}</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

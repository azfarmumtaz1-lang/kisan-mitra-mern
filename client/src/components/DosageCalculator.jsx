import React, { useState } from 'react';
import { Calculator, Droplets, ShieldAlert, Sparkles, Check, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export default function DosageCalculator({ lang }) {
  const [tankCapacity, setTankCapacity] = useState(15); // standard 15L
  const [dosagePerLiter, setDosagePerLiter] = useState(0.5);
  const [unit, setUnit] = useState('ml');
  const [farmArea, setFarmArea] = useState(1);
  const [tanksPerAcre, setTanksPerAcre] = useState(8);

  const t = {
    en: {
      title: "15-Liter Knapsack Sprayer Dilution Calculator",
      subline: "Eliminate dosage mistakes! Calculate the exact amount of pesticide to add into your 15L or 20L sprayer tank and total chemical needed for your farm.",
      tankSize: "Sprayer Tank Capacity",
      tank15: "15 Litres (Standard Knapsack)",
      tank16: "16 Litres",
      tank20: "20 Litres (Large Tank)",
      dosagePerLiter: "Recommended Chemical Dose (per Liter of water)",
      unitType: "Formulation Unit",
      areaLabel: "Farm Area (in Acres)",
      tanksPerAcreLabel: "Spray Volume Intensity",
      lowIntensity: "Light Foliage (6-8 Tanks / Acre)",
      mediumIntensity: "Medium Foliage (8-10 Tanks / Acre)",
      denseIntensity: "Dense Foliage (10-12 Tanks / Acre)",
      resultsTitle: "Your Exact Sprayer Dilution Plan",
      perTankHeading: "Medicine to Pour in EACH Sprayer Tank:",
      perTankSub: "Pour this amount, stir well in half bucket water, then top up tank to full.",
      totalWater: "Total Water Required:",
      totalTanks: "Total Tanks to Spray:",
      totalMedicine: "Total Bottle Size Needed:",
      sprayRules: "Important Spray Safety Guidelines:",
      rule1: "Never spray in the middle of hot afternoon; spray before 10 AM or after 4 PM.",
      rule2: "Always spray with the wind at your back, never against the direction of the wind.",
      rule3: "Wear cloth mask, rubber gloves, and wash spray equipment thoroughly with clean water."
    },
    hi: {
      title: "15 लीटर स्प्रेयर टंकी दवाई कैलकुलेटर",
      subline: "दवाई के नाप में गलती न करें! अपनी 15 या 20 लीटर वाली टंकी में डाली जाने वाली सही दवाई की मात्रा और पूरे खेत के लिए जरूरी पानी की गणना करें।",
      tankSize: "स्प्रे टंकी का आकार",
      tank15: "15 लीटर (मानक पीठ वाली टंकी)",
      tank16: "16 लीटर",
      tank20: "20 लीटर (बड़ी टंकी)",
      dosagePerLiter: "दवाई की संस्तुत मात्रा (प्रति लीटर पानी में)",
      unitType: "दवाई का रूप",
      areaLabel: "खेत का रकबा (एकड़ में)",
      tanksPerAcreLabel: "छिड़काव घनत्व",
      lowIntensity: "हल्की फसल (6-8 टंकी / एकड़)",
      mediumIntensity: "मध्यम फसल (8-10 टंकी / एकड़)",
      denseIntensity: "घनी फसल (10-12 टंकी / एकड़)",
      resultsTitle: "आपका सटीक स्प्रेयर नाप चार्ट",
      perTankHeading: "प्रत्येक 15 लीटर टंकी में डालने की मात्रा:",
      perTankSub: "पहले आधी बाल्टी पानी में दवा घोलें, फिर टंकी में भरकर पूरा 15 लीटर करें।",
      totalWater: "कुल पानी की आवश्यकता:",
      totalTanks: "कुल टंकियों की संख्या:",
      totalMedicine: "कुल दवाई की आवश्यकता:",
      sprayRules: "छिड़काव के जरूरी नियम:",
      rule1: "दोपहर की तेज धूप में कभी छिड़काव न करें; सुबह 10 बजे से पहले या शाम 4 बजे के बाद छिड़कें।",
      rule2: "हवा की दिशा में ही छिड़काव करें, कभी भी हवा के विपरीत रुख में न छिड़कें।",
      rule3: "मुंह पर मास्क और हाथों में दस्ताने जरूर पहनें और काम के बाद हाथ-मुंह साबुन से धोएं।"
    }
  }[lang];

  // Live Calculations
  const dosePerTank = (Number(dosagePerLiter) * Number(tankCapacity)).toFixed(1);
  const totalTanks = Math.ceil(Number(farmArea) * Number(tanksPerAcre));
  const totalWater = totalTanks * Number(tankCapacity);
  const totalChemical = (totalTanks * (Number(dosagePerLiter) * Number(tankCapacity))).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Calculator className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {t.title}
          </h1>
        </div>
        <p className="text-stone-600 text-sm max-w-3xl">
          {t.subline}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
          {/* Tank Capacity */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              {t.tankSize}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 16, 20].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTankCapacity(size)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition cursor-pointer text-center ${
                    tankCapacity === size
                      ? 'bg-agri-700 text-white border-agri-700 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {size} Litres
                </button>
              ))}
            </div>
          </div>

          {/* Dosage per Liter & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                {t.dosagePerLiter}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="50"
                  value={dosagePerLiter}
                  onChange={(e) => setDosagePerLiter(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-agri-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                {t.unitType}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-agri-500 outline-hidden"
              >
                <option value="ml">ml (Liquid spray, e.g. Coragen / Confidor)</option>
                <option value="grams">grams (Powder / Granules, e.g. Ridomil / Actara)</option>
              </select>
            </div>
          </div>

          {/* Farm Area in Acres */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                {t.areaLabel}
              </label>
              <span className="text-xs font-extrabold text-agri-700 bg-agri-50 px-2 py-0.5 rounded-md border border-agri-200">
                {farmArea} Acre(s)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={farmArea}
              onChange={(e) => setFarmArea(e.target.value)}
              className="w-full accent-agri-600 cursor-pointer"
            />
          </div>

          {/* Foliage Volume / Tanks per acre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              {t.tanksPerAcreLabel}
            </label>
            <select
              value={tanksPerAcre}
              onChange={(e) => setTanksPerAcre(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-agri-500 outline-hidden"
            >
              <option value="7">{t.lowIntensity}</option>
              <option value="9">{t.mediumIntensity}</option>
              <option value="11">{t.denseIntensity}</option>
            </select>
          </div>
        </div>

        {/* Live Calculation Results Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-400 rounded-3xl p-6 text-stone-950 shadow-xl border border-amber-300 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider bg-stone-950 text-amber-300 px-3 py-1 rounded-full">
                {t.resultsTitle}
              </span>
              <span className="text-2xl">🎯</span>
            </div>

            {/* Giant Highlight: Dose per Tank */}
            <div className="bg-white/95 rounded-2xl p-5 shadow-inner border border-amber-200 space-y-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-tight block">
                {t.perTankHeading}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">
                {dosePerTank} {unit}
              </div>
              <p className="text-xs text-stone-600 font-medium pt-1">
                👉 {t.perTankSub}
              </p>
            </div>

            {/* Grid of Total Quantities */}
            <div className="grid grid-cols-3 gap-3 text-stone-900">
              <div className="bg-white/90 p-3 rounded-2xl border border-amber-200 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  {t.totalTanks}
                </span>
                <span className="text-lg font-black text-stone-900">
                  {totalTanks} Tanks
                </span>
              </div>

              <div className="bg-white/90 p-3 rounded-2xl border border-amber-200 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  {t.totalWater}
                </span>
                <span className="text-lg font-black text-sky-800">
                  {totalWater} Litres
                </span>
              </div>

              <div className="bg-white/90 p-3 rounded-2xl border border-amber-200 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  {t.totalMedicine}
                </span>
                <span className="text-lg font-black text-stone-900">
                  {totalChemical} {unit}
                </span>
              </div>
            </div>
          </div>

          {/* Spray Safety Guidelines */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2 text-xs">
            <h4 className="font-extrabold text-stone-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>{t.sprayRules}</span>
            </h4>
            <ul className="space-y-1 text-stone-600 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-agri-600 font-bold">✓</span>
                <span>{t.rule1}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-agri-600 font-bold">✓</span>
                <span>{t.rule2}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-agri-600 font-bold">✓</span>
                <span>{t.rule3}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

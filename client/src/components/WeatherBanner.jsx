import React, { useEffect, useState } from 'react';
import { CloudSun, Droplets, Wind, ShieldCheck, Calendar, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function WeatherBanner({ lang }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await api.getWeather();
        if (res.success) {
          setWeatherData(res);
        }
      } catch (err) {
        console.warn('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  if (loading || !weatherData) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 py-3 px-4 text-center text-xs text-stone-500 animate-pulse">
        🌾 Loading agricultural weather & seasonal sowing forecast...
      </div>
    );
  }

  const { activeSeason, seasonDescription, weatherConditions, sprayingSafetyIndex, seasonalAlerts } = weatherData;

  const t = {
    en: {
      seasonBadge: `Active Season: ${activeSeason}`,
      readiness: "Sowing Readiness Index",
      spraySafety: "Pesticide Spray Feasibility Today",
      optimal: "Excellent Field Conditions",
      alert: "Seasonal Field Advisory"
    },
    hi: {
      seasonBadge: `वर्तमान मौसम: ${activeSeason === 'Rabi' ? 'रबी (Rabi)' : (activeSeason === 'Kharif' ? 'खरीफ (Kharif)' : 'जायद (Zaid)')}`,
      readiness: "बुवाई अनुकूलता सूचकांक",
      spraySafety: "आज कीटनाशक छिड़काव की स्थिति",
      optimal: "खेत बुवाई के लिए अत्यंत अनुकूल",
      alert: "मौसमी कृषि सलाह"
    }
  }[lang];

  return (
    <section className="bg-gradient-to-b from-agri-50/70 via-stone-50 to-stone-50 border-b border-agri-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-stretch">
          
          {/* Card 1: Active Season & Sowing Window */}
          <div className="bg-white rounded-2xl p-4 border border-agri-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl border border-amber-200 shrink-0">
                {activeSeason === 'Rabi' ? '🌾' : (activeSeason === 'Kharif' ? '🌧️' : '☀️')}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-2 py-0.5 rounded-full border border-agri-200">
                  {t.seasonBadge}
                </span>
                <h3 className="text-sm font-bold text-stone-900 mt-1">
                  {seasonDescription}
                </h3>
                <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  {weatherData.currentDate}
                </p>
              </div>
            </div>
            <div className="text-right pl-2 border-l border-stone-100">
              <div className="text-xl font-extrabold text-agri-700">94%</div>
              <div className="text-[10px] font-medium text-stone-500 uppercase tracking-tight">{t.readiness}</div>
            </div>
          </div>

          {/* Card 2: Field Weather Conditions */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
                <CloudSun className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-stone-900">{weatherConditions.temperature}</span>
                  <span className="text-xs text-stone-500 font-medium">({weatherConditions.condition})</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" /> {weatherConditions.humidity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-teal-600" /> {weatherConditions.windSpeed}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
              {t.optimal}
            </div>
          </div>

          {/* Card 3: Pesticide Spray Safety Guidance */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs flex items-start gap-3 bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  {t.spraySafety}
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-xs text-emerald-800 font-medium mt-1 leading-snug">
                {sprayingSafetyIndex.guidance}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

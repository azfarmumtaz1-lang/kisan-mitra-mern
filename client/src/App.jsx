import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WeatherBanner from './components/WeatherBanner';
import SeasonSowingGuide from './components/SeasonSowingGuide';
import PestDoctorAI from './components/PestDoctorAI';
import PesticideDirectory from './components/PesticideDirectory';
import DosageCalculator from './components/DosageCalculator';
import CropDetailModal from './components/CropDetailModal';
import { Sprout, PhoneCall, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('sowing');
  const [lang, setLang] = useState('en');
  const [selectedCropModal, setSelectedCropModal] = useState(null);

  function handleAskAIAboutCrop(crop) {
    setActiveTab('aiDoctor');
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-agri-200 selection:text-agri-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
      />

      {/* Live Agricultural Weather & Seasonal Feasibility Banner */}
      <WeatherBanner lang={lang} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {activeTab === 'sowing' && (
          <SeasonSowingGuide
            lang={lang}
            onSelectCrop={(crop) => setSelectedCropModal(crop)}
          />
        )}

        {activeTab === 'aiDoctor' && (
          <PestDoctorAI
            lang={lang}
          />
        )}

        {activeTab === 'pests' && (
          <PesticideDirectory
            lang={lang}
          />
        )}

        {activeTab === 'calculator' && (
          <DosageCalculator
            lang={lang}
          />
        )}
      </main>

      {/* Crop Detail Modal Popup */}
      {selectedCropModal && (
        <CropDetailModal
          crop={selectedCropModal}
          onClose={() => setSelectedCropModal(null)}
          onAskAIAboutCrop={handleAskAIAboutCrop}
          lang={lang}
        />
      )}

      {/* Modern Agricultural Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Branding */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white text-lg">
                  🌾
                </div>
                <span>KisanMitra • किसान मित्र</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Empowering farmers with smart seasonal sowing decisions, AI-driven pest diagnosis, and precise sprayer tank dilutions.
              </p>
            </div>

            {/* Helpline Contacts */}
            <div className="space-y-2">
              <h4 className="text-stone-200 font-extrabold uppercase tracking-wider text-[11px]">
                Emergency Kisan Helpline
              </h4>
              <p className="text-stone-400 text-xs">
                📞 <strong>Kisan Call Centre:</strong> 1800-180-1551 (Toll-Free)
              </p>
              <p className="text-stone-400 text-xs">
                🌾 <strong>PM-Kisan Helpline:</strong> 155261 / 011-24300606
              </p>
              <p className="text-stone-400 text-xs">
                🚜 <strong>Agri Clinic & Business:</strong> 1800-425-1556
              </p>
            </div>

            {/* Quick Sowing Calendars */}
            <div className="space-y-2">
              <h4 className="text-stone-200 font-extrabold uppercase tracking-wider text-[11px]">
                Sowing Calendars
              </h4>
              <ul className="space-y-1 text-stone-400 text-xs">
                <li>• <strong>Rabi (Winter):</strong> Wheat, Mustard, Chickpea, Potato</li>
                <li>• <strong>Kharif (Monsoon):</strong> Paddy, Cotton, Soybean, Maize</li>
                <li>• <strong>Zaid (Summer):</strong> Watermelon, Cucumber, Moong</li>
                <li>• <strong>Cash Crops:</strong> Sugarcane, Spices, Vegetables</li>
              </ul>
            </div>

            {/* Technology Stack Info */}
            <div className="space-y-2">
              <h4 className="text-stone-200 font-extrabold uppercase tracking-wider text-[11px]">
                Platform Architecture
              </h4>
              <div className="space-y-1 text-stone-400 text-xs">
                <p>🍃 <strong>MongoDB:</strong> Agronomic & Pest Knowledge Base</p>
                <p>⚡ <strong>Express.js & Node.js:</strong> High-performance REST API</p>
                <p>⚛️ <strong>React & Tailwind:</strong> Fast Responsive Farmer Portal</p>
                <p>🤖 <strong>Dr. Kisan AI:</strong> Entomology Diagnostic Engine</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <div>
              © 2026 KisanMitra Agricultural Intelligence. Dedicated to the farmers of the nation.
            </div>
            <div className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian & Global Farmers
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

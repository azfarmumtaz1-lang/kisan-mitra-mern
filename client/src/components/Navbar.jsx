import React from 'react';
import { Sprout, Bug, ShieldAlert, Calculator, Sparkles, PhoneCall, Globe, Sun } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, lang, setLang }) {
  const t = {
    en: {
      title: "KisanMitra",
      subtitle: "Smart Seasonal Sowing & AI Pest Advisor",
      tabs: {
        sowing: "🌾 Sowing Guide",
        aiDoctor: "🩺 Dr. Kisan AI",
        pests: "🐛 Pest Directory",
        calculator: "🧮 Sprayer Calculator",
      },
      helpline: "📞 Kisan Call Centre (Toll-Free): 1800-180-1551",
      badge: "MERN Stack AI Platform"
    },
    hi: {
      title: "किसान मित्र",
      subtitle: "मौसम के अनुसार बुवाई और एआई कीट विशेषज्ञ",
      tabs: {
        sowing: "🌾 बुवाई मार्गदर्शिका",
        aiDoctor: "🩺 डॉ. किसान AI",
        pests: "🐛 कीट एवं रोग",
        calculator: "🧮 स्प्रेयर कैलकुलेटर",
      },
      helpline: "📞 किसान कॉल सेंटर (निशुल्क): 1800-180-1551",
      badge: "MERN कृषि एआई पोर्टल"
    }
  }[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Agricultural Emergency Alert & Helpline Ribbon */}
      <div className="bg-gradient-to-r from-emerald-800 via-agri-700 to-emerald-900 text-emerald-100 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
          <span>{t.helpline}</span>
          <span className="hidden md:inline text-emerald-300/60">|</span>
          <span className="hidden md:inline text-emerald-200">24x7 Farmer Agricultural Advisory Service</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-600/40 text-emerald-100 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-amber-300" /> {t.badge}
          </span>
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-md font-medium transition cursor-pointer"
            title="Change Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'en' ? 'हिंदी में देखें' : 'Switch to English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('sowing')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 flex items-center justify-center text-white shadow-md shadow-agri-600/20 ring-2 ring-agri-400/30">
              <Sprout className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-900 font-sans">
                  {t.title}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-agri-100 text-agri-800 px-2 py-0.5 rounded-full border border-agri-300">
                  Krishi AI
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'sowing', label: t.tabs.sowing, icon: Sprout },
              { id: 'aiDoctor', label: t.tabs.aiDoctor, icon: Sparkles, badge: 'AI' },
              { id: 'pests', label: t.tabs.pests, icon: Bug },
              { id: 'calculator', label: t.tabs.calculator, icon: Calculator },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-agri-700 text-white shadow-sm shadow-agri-800/20 ring-1 ring-agri-700'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-stone-900' : 'bg-agri-500 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

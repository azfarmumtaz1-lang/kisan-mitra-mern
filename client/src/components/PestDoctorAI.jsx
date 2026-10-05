import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Volume2, VolumeX, ShieldAlert, Bug, CheckCircle2,
  AlertTriangle, Droplets, Camera, RefreshCw, HelpCircle, Info, Stethoscope
} from 'lucide-react';
import { api } from '../services/api';

export default function PestDoctorAI({ lang }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showSymptomPicker, setShowSymptomPicker] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);

  const messagesEndRef = useRef(null);

  const t = {
    en: {
      badge: "AI Agricultural Entomologist & Plant Doctor",
      title: "Dr. Kisan AI - Insect & Pesticide Advisor",
      subline: "Confused or stuck regarding crop insects, leaf diseases, or what pesticide to spray? Ask Dr. Kisan AI in plain language or use the visual symptom picker.",
      placeholder: "Type your query (e.g. 'leaves curling in chilli', 'tamatar me keede', 'fall armyworm in corn dosage')...",
      send: "Ask AI",
      listenBtn: "Listen Aloud",
      stopListenBtn: "Stop Audio",
      symptomPickerBtn: "🔍 Visual Symptom Diagnostic Matrix",
      scannerBtn: "📷 Leaf Photo Scanner (AI Vision)",
      quickQuestions: "Common Farmer Inquiries:",
      organicTitle: "🌿 Organic & Biological Remedy",
      chemicalTitle: "🧪 Chemical Pesticide Prescription",
      tankDosageTitle: "🎯 15-Liter Sprayer Backpack Tank Dilution",
      phiTitle: "⏳ Pre-Harvest Waiting Period (PHI)",
      safetyTitle: "🛡️ Farmer Health & Spray Safety Precautions",
      cropFilter: "Filter by Crop",
      symptomPrompt: "Select visual symptoms you see on your plant:",
      diagnoseBtn: "Run Visual Symptom Diagnosis",
    },
    hi: {
      badge: "एआई कीट वैज्ञानिक एवं फसल रोग विशेषज्ञ",
      title: "डॉ. किसान AI - कीट एवं कीटनाशक सलाहकार",
      subline: "फसल में कीड़े लगने, पत्तियां मुड़ने, धब्बे पड़ने या कौन सी कीटनाशक दवा छिड़कें? अपनी भाषा में पूछें या लक्षणों पर क्लिक करें।",
      placeholder: "अपनी समस्या लिखें (जैसे 'मिर्च में पत्ती मरोड़', 'कपास में सुंडी', '15 लीटर टंकी में कितनी दवाई डालें')...",
      send: "पूछें",
      listenBtn: "आवाज़ में सुनें",
      stopListenBtn: "आवाज़ बंद करें",
      symptomPickerBtn: "🔍 लक्षण देखकर कीट पहचानें (Matrix)",
      scannerBtn: "📷 पत्ती की फोटो स्कैन करें (AI Vision)",
      quickQuestions: "किसान भाइयों द्वारा पूछे गए प्रमुख प्रश्न:",
      organicTitle: "🌿 सुरक्षित जैविक व घरेलू उपचार",
      chemicalTitle: "🧪 रासायनिक कीटनाशक और सही मात्रा",
      tankDosageTitle: "🎯 15 लीटर वाली स्प्रे टंकी का सही नाप",
      phiTitle: "⏳ फसल तुड़ाई से पहले की प्रतीक्षा अवधि (PHI)",
      safetyTitle: "🛡️ किसान सुरक्षा व छिड़काव के जरूरी नियम",
      cropFilter: "फसल चुनें",
      symptomPrompt: "अपनी फसल में दिख रहे लक्षणों पर टिक करें:",
      diagnoseBtn: "लक्षणों के आधार पर जांच करें",
    }
  }[lang];

  // Quick chips for farmers
  const quickPrompts = [
    { label: "🐛 Fall Armyworm in Maize", query: "Fall Armyworm in maize what pesticide and 15L tank dosage" },
    { label: "🌶️ Upward Leaf Curling in Chilli", query: "Mirch me patti marod rog thrips pesticide dosage" },
    { label: "🌾 Dead Heart in Paddy / Rice", query: "Rice yellow stem borer chemical and organic remedy" },
    { label: "🦟 Whitefly & Aphids in Cotton", query: "Cotton me safed makkhi and aphid ka spray" },
    { label: "🍂 Blight & Leaf Rot in Potato", query: "Potato late blight fungicide spray per 15 liter sprayer" },
    { label: "🐜 Termites eating roots in Wheat", query: "Wheat gehun me deemak ka ilaj" },
  ];

  const symptomOptions = [
    { id: 'Leaves chewed/holes', label: 'Leaves chewed / holes (पत्तियों में छेद/कटाव)', icon: '🐛' },
    { id: 'Curled leaves', label: 'Curled leaves (पत्तियां ऊपर या नीचे मुड़ना/मरोड़िया)', icon: '🍃' },
    { id: 'Yellowing leaves', label: 'Yellowing leaves (पत्तियां पीली पड़ना)', icon: '🍂' },
    { id: 'White/black powdery spots', label: 'White / black powdery spots (सफेद या काले फफूंदी धब्बे)', icon: '❄️' },
    { id: 'Wilting/drying stem', label: 'Wilting / drying central shoot (गोभ का सूखना / डेड हार्ट)', icon: '🥀' },
    { id: 'Sticky sap/honey dew', label: 'Sticky sap / honeydew on leaves (चिपचिपा रस व काली फफूंद)', icon: '🍯' },
    { id: 'Fruit/pod boring', label: 'Fruit or pod boring (फल या फली में छेद)', icon: '🍅' },
    { id: 'Root decay', label: 'Root cutting or decay (जड़ों का कटना / दीमक)', icon: '🐜' },
  ];

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: lang === 'hi'
          ? "राम-राम किसान भाई! मैं **डॉ. किसान AI** हूँ। आपकी फसल में किसी भी प्रकार का कीड़ा, सुंडी, माहू, या फफूंदी रोग लगा हो, या आपको समझ न आ रहा हो कि 15 लीटर वाली स्प्रे टंकी में कितनी दवाई डालकर छिड़कें — बेझिझक पूछें।"
          : "Hello Kisan Bhai! I am **Dr. Kisan AI**, your dedicated crop protection and entomology specialist. Ask me any query if you are stuck or confused regarding insects, fungal diseases, or what pesticide & tank dosage to spray.",
        isPrescription: false,
      }
    ]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Audio Speech Synthesis
  function handleSpeak(text) {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  // Submit Farmer Query to Backend
  async function handleSubmitQuery(queryText) {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.askAI({
        query: textToSend,
        language: lang,
      });

      if (res.success && res.result) {
        const aiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          data: res.result,
          isPrescription: res.result.type === 'pest_prescription',
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('AI error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: "Sorry, I encountered a temporary connection issue. Please check your query or try again.",
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Symptom Matrix Diagnosis
  async function handleSymptomDiagnosis() {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    setShowSymptomPicker(false);

    const userQuery = `Plant showing symptoms: ${selectedSymptoms.join(', ')} in crop: ${selectedCrop}`;
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `🔍 ${userQuery}`,
      }
    ]);

    try {
      const res = await api.diagnoseSymptoms({
        symptoms: selectedSymptoms,
        crop: selectedCrop === 'All' ? '' : selectedCrop,
      });

      if (res.success && res.diagnoses && res.diagnoses.length > 0) {
        const topPest = res.diagnoses[0];
        // Now ask AI about this top pest to get full prescription
        const presRes = await api.askAI({
          query: `${topPest.name} in ${selectedCrop === 'All' ? topPest.affectedCrops[0] : selectedCrop} pesticide dosage`,
          language: lang,
        });

        if (presRes.success && presRes.result) {
          setMessages(prev => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              sender: 'ai',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              data: presRes.result,
              isPrescription: true,
            }
          ]);
        }
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
    } finally {
      setLoading(false);
    }
  }

  // Leaf photo scanner simulator
  function handleSimulateScan(cropName, symptomDesc, queryText) {
    setShowCameraScanner(false);
    handleSubmitQuery(queryText);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-agri-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-stone-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5 text-stone-900" />
            {t.badge}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.title}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            {t.subline}
          </p>

          {/* Quick Action Tools */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowSymptomPicker(!showSymptomPicker)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs backdrop-blur-sm border border-white/20 transition cursor-pointer"
            >
              <Bug className="w-4 h-4 text-amber-300" />
              <span>{t.symptomPickerBtn}</span>
            </button>
            <button
              onClick={() => setShowCameraScanner(!showCameraScanner)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs backdrop-blur-sm border border-white/20 transition cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>{t.scannerBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Symptom Picker Modal / Drawer */}
      {showSymptomPicker && (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🩺</span>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">{t.symptomPickerBtn}</h3>
                <p className="text-xs text-stone-500">{t.symptomPrompt}</p>
              </div>
            </div>
            <button
              onClick={() => setShowSymptomPicker(false)}
              className="text-stone-400 hover:text-stone-700 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Crop Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
              {t.cropFilter}:
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-stone-50 border border-stone-300 text-xs font-semibold rounded-xl px-3 py-1.5 text-stone-800"
            >
              <option value="All">All Crops (सभी फसलें)</option>
              <option value="Cotton">Cotton (कपास)</option>
              <option value="Chilli">Chilli (मिर्च)</option>
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Paddy">Paddy / Rice (धान)</option>
              <option value="Wheat">Wheat (गेंहू)</option>
              <option value="Maize">Maize (मक्का)</option>
              <option value="Potato">Potato (आलू)</option>
              <option value="Mustard">Mustard (सरसों)</option>
            </select>
          </div>

          {/* Symptom Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {symptomOptions.map(opt => {
              const isChecked = selectedSymptoms.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (isChecked) {
                      setSelectedSymptoms(selectedSymptoms.filter(s => s !== opt.id));
                    } else {
                      setSelectedSymptoms([...selectedSymptoms, opt.id]);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition ${
                    isChecked
                      ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <span className="flex-1 leading-tight">{opt.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="accent-agri-600 rounded-sm"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setSelectedSymptoms([])}
              className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleSymptomDiagnosis}
              disabled={selectedSymptoms.length === 0}
              className="bg-agri-700 hover:bg-agri-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.diagnoseBtn} ({selectedSymptoms.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Photo Scanner Simulator */}
      {showCameraScanner && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📸</span>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">{t.scannerBtn}</h3>
                <p className="text-xs text-stone-500">Select an infected plant symptom to simulate AI photo analysis:</p>
              </div>
            </div>
            <button
              onClick={() => setShowCameraScanner(false)}
              className="text-stone-400 hover:text-stone-700 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => handleSimulateScan('Maize', 'Armyworm holes', 'Fall Armyworm in maize what pesticide and 15L tank dosage')}
              className="border border-stone-200 rounded-2xl p-4 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-400 cursor-pointer transition space-y-2 text-center"
            >
              <div className="text-4xl">🌽</div>
              <div className="font-bold text-xs text-stone-900">Maize Leaf Whorl Damage</div>
              <p className="text-[11px] text-stone-500">Ragged holes and frass in central corn whorl</p>
              <span className="inline-block text-[10px] font-extrabold text-agri-700 bg-agri-100 px-2 py-0.5 rounded-md">
                Click to Scan & Diagnose
              </span>
            </div>

            <div
              onClick={() => handleSimulateScan('Chilli', 'Leaf curl', 'Mirch me patti marod rog thrips pesticide dosage')}
              className="border border-stone-200 rounded-2xl p-4 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-400 cursor-pointer transition space-y-2 text-center"
            >
              <div className="text-4xl">🌶️</div>
              <div className="font-bold text-xs text-stone-900">Chilli Boat-Shaped Leaf Curl</div>
              <p className="text-[11px] text-stone-500">Upward curled leaves, bronzing & stunting</p>
              <span className="inline-block text-[10px] font-extrabold text-agri-700 bg-agri-100 px-2 py-0.5 rounded-md">
                Click to Scan & Diagnose
              </span>
            </div>

            <div
              onClick={() => handleSimulateScan('Potato', 'Late blight', 'Potato late blight fungicide spray per 15 liter sprayer')}
              className="border border-stone-200 rounded-2xl p-4 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-400 cursor-pointer transition space-y-2 text-center"
            >
              <div className="text-4xl">🥔</div>
              <div className="font-bold text-xs text-stone-900">Potato Water-Soaked Blight</div>
              <p className="text-[11px] text-stone-500">Black rotting lesions with white down under leaf</p>
              <span className="inline-block text-[10px] font-extrabold text-agri-700 bg-agri-100 px-2 py-0.5 rounded-md">
                Click to Scan & Diagnose
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Inquiry Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          {t.quickQuestions}
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmitQuery(q.query)}
              className="text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-xl shadow-2xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-md min-h-[480px] flex flex-col justify-between overflow-hidden">
        {/* Messages Stream */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 shadow-xs ${
                    isAI
                      ? 'bg-gradient-to-br from-agri-600 to-agri-800 text-white'
                      : 'bg-stone-800 text-white'
                  }`}
                >
                  {isAI ? '👨‍🌾' : '🚜'}
                </div>

                {/* Message Body */}
                <div className={`space-y-3 max-w-3xl ${isAI ? 'w-full' : 'max-w-lg'}`}>
                  {/* Sender Header */}
                  <div className={`flex items-center gap-2 text-xs ${isAI ? 'justify-start' : 'justify-end'}`}>
                    <span className="font-extrabold text-stone-800">
                      {isAI ? 'Dr. Kisan AI' : 'Kisan Bhai'}
                    </span>
                    <span className="text-[11px] text-stone-400">{msg.timestamp}</span>

                    {/* Audio Listen Button for AI */}
                    {isAI && (msg.data?.voiceFriendlyText || msg.text) && (
                      <button
                        onClick={() => handleSpeak(msg.data?.voiceFriendlyText || msg.text)}
                        className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold text-agri-700 hover:text-agri-900 bg-agri-50 hover:bg-agri-100 px-2 py-0.5 rounded-md border border-agri-200 transition cursor-pointer"
                        title="Listen to advice aloud"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-600" />
                            <span>{t.stopListenBtn}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-agri-700" />
                            <span>{t.listenBtn}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Regular Text Bubble */}
                  {msg.text && (
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isAI
                          ? 'bg-stone-50 border border-stone-200 text-stone-800'
                          : 'bg-agri-700 text-white font-medium ml-auto'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Deep Clinical Prescription Card if AI diagnosed a pest/disease */}
                  {msg.data && msg.data.type === 'pest_prescription' && (
                    <div className="bg-white rounded-3xl border-2 border-agri-500 shadow-lg p-5 sm:p-6 space-y-5 animate-fadeIn">
                      {/* Identification Title */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-200">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2 bg-agri-100 rounded-2xl">
                            {msg.data.icon || '🐛'}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-300">
                                {msg.data.severity} Threat
                              </span>
                              <span className="text-xs text-stone-500">
                                Crop: <strong>{msg.data.cropContext}</strong>
                              </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">
                              {msg.data.identifiedIssue}
                            </h3>
                            <p className="text-xs text-stone-500">{msg.data.hindiIssueName}</p>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/70 text-xs text-emerald-900 font-medium">
                        {msg.data.summary}
                      </div>

                      {/* 15-LITER SPRAYER TANK HIGHLIGHT BOX (CRITICAL FOR FARMERS) */}
                      {msg.data.backpackGuide && (
                        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-2xl p-4 text-stone-950 shadow-md border border-amber-300">
                          <div className="flex items-center gap-2 font-extrabold text-sm mb-1">
                            <span className="text-lg">🎯</span>
                            <span>{t.tankDosageTitle}</span>
                          </div>
                          <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 text-xs space-y-1 font-semibold text-stone-900">
                            <div className="text-sm font-extrabold text-stone-950 flex items-center gap-1.5">
                              <span>👉</span>
                              <span>Pesticide in 15L Sprayer: {msg.data.backpackGuide.primaryDosage}</span>
                            </div>
                            {msg.data.backpackGuide.alternativeDosage && (
                              <div className="text-stone-700 text-xs">
                                <span>Or Alternative Medicine: {msg.data.backpackGuide.alternativeDosage}</span>
                              </div>
                            )}
                            <div className="text-[11px] text-stone-600 pt-1 border-t border-stone-200">
                              💡 {msg.data.backpackGuide.waterVolumePerAcre}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 1: Organic & Biological Control */}
                      {msg.data.organicControl && (
                        <div className="space-y-2 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                            <span>🌿</span>
                            <span>{t.organicTitle}</span>
                          </h4>
                          <div className="text-xs font-extrabold text-emerald-950">
                            {msg.data.organicControl.remedy}
                          </div>
                          <div className="text-xs text-emerald-800">
                            <strong>Sprayer Tank Dose:</strong> {msg.data.organicControl.backpackDosage}
                          </div>
                          <p className="text-[11px] text-emerald-700 leading-relaxed">
                            {msg.data.organicControl.instructions}
                          </p>
                        </div>
                      )}

                      {/* Step 2: Registered Chemical Pesticides Table */}
                      {msg.data.chemicalControl && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                            <span>🧪</span>
                            <span>{t.chemicalTitle}</span>
                          </h4>

                          <div className="space-y-2.5">
                            {msg.data.chemicalControl.pesticides.map((pest, pIdx) => (
                              <div
                                key={pIdx}
                                className="bg-stone-50 rounded-2xl p-3 border border-stone-200 hover:border-stone-300 transition text-xs space-y-1.5"
                              >
                                <div className="flex items-start justify-between flex-wrap gap-1">
                                  <div className="font-extrabold text-stone-900 text-sm">
                                    {pest.name}
                                  </div>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                                    {pest.toxicity}
                                  </span>
                                </div>

                                {pest.tradeNames && (
                                  <div className="text-[11px] text-stone-500">
                                    <strong>Popular Brands:</strong> {pest.tradeNames}
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-stone-200/60 text-[11px]">
                                  <div className="bg-white p-1.5 rounded-lg border border-stone-200">
                                    <span className="text-stone-400 block text-[10px] uppercase font-bold">15L Tank Dose</span>
                                    <span className="font-extrabold text-agri-700">{pest.backpackSprayer15L}</span>
                                  </div>
                                  <div className="bg-white p-1.5 rounded-lg border border-stone-200">
                                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Per Acre Dose</span>
                                    <span className="font-semibold text-stone-700">{pest.perAcre}</span>
                                  </div>
                                  <div className="bg-white p-1.5 rounded-lg border border-stone-200">
                                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Waiting Period (PHI)</span>
                                    <span className="font-semibold text-amber-700">{pest.preHarvestWaiting}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Safety Precautions */}
                      {msg.data.chemicalControl?.safetyPrecautions && (
                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-amber-950">
                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                            <span>{t.safetyTitle}</span>
                          </div>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                            {msg.data.chemicalControl.safetyPrecautions.map((sec, sIdx) => (
                              <li key={sIdx}>{sec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sowing Advice Card if user asked about seasonal sowing in chat */}
                  {msg.data && msg.data.type === 'sowing_advice' && (
                    <div className="bg-white rounded-3xl border border-agri-300 p-5 space-y-4 shadow-md">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌾</span>
                        <h4 className="font-extrabold text-stone-900 text-base">
                          Seasonal Sowing Recommendation
                        </h4>
                      </div>
                      <p className="text-xs text-stone-600">{msg.data.summary}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.data.crops.map((c, i) => (
                          <div key={i} className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold text-stone-900">
                              <span>{c.icon} {c.name}</span>
                              <span className="text-[10px] font-bold bg-agri-100 text-agri-800 px-2 py-0.5 rounded-full">
                                {c.profitPotential}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500">
                              Sowing: {c.sowingMonths} • Yield: {c.expectedYield}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General Advisory / Suggestions */}
                  {msg.data && msg.data.type === 'general_advisory' && (
                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-3">
                      <p className="font-semibold text-stone-800">{msg.data.summary}</p>
                      <ul className="list-disc list-inside space-y-1 text-stone-600 text-[11px]">
                        {msg.data.guidance.map((g, gi) => (
                          <li key={gi}>{g}</li>
                        ))}
                      </ul>
                      <div className="pt-2 flex flex-wrap gap-2">
                        {msg.data.quickSuggestions?.map((sug, si) => (
                          <button
                            key={si}
                            onClick={() => handleSubmitQuery(sug.query)}
                            className="bg-white hover:bg-agri-50 text-stone-800 font-bold border border-stone-200 px-3 py-1 rounded-xl text-[11px] transition cursor-pointer"
                          >
                            {sug.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gemini API Direct Generative Response */}
                  {msg.data && msg.data.type === 'gemini_response' && (
                    <div className="bg-white rounded-2xl p-5 border border-agri-300 shadow-md text-xs text-stone-800 whitespace-pre-line leading-relaxed">
                      {msg.data.aiResponseText}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-stone-500 text-xs">
              <div className="w-8 h-8 rounded-xl bg-agri-100 text-agri-700 flex items-center justify-center font-bold animate-pulse">
                🌾
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-agri-600 animate-bounce"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-agri-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-agri-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="font-semibold">Dr. Kisan AI is diagnosing your crop & calculating sprayer dosage...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-3 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-agri-500 focus:border-agri-500 outline-hidden shadow-xs"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="bg-agri-700 hover:bg-agri-800 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>{t.send}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

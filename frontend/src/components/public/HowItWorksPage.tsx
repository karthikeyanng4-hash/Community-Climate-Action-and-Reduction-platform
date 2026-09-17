import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Bike,
  Wind,
  Trash2,
  Trees,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  HelpCircle,
  Database,
  Layers,
  Scale,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { analyzeFootprintInformation } from '../../services/aiSimulations';

export const HowItWorksPage: React.FC = () => {
  const { setActiveTab } = usePlatform();

  // Interactive Footprint Estimator state (Prompt #9 & #10)
  const [commuteMode, setCommuteMode] = useState<'car' | 'bike' | 'public' | 'active'>('bike');
  const [commuteKm, setCommuteKm] = useState<number>(12);
  const [acHours, setAcHours] = useState<number>(5);
  const [dietType, setDietType] = useState<'omnivore' | 'flexitarian' | 'vegetarian' | 'vegan'>('vegetarian');
  const [wasteSegregated, setWasteSegregated] = useState<boolean>(true);

  const footprintAnalysis = analyzeFootprintInformation({
    transportMode: commuteMode,
    dailyCommuteKm: commuteKm,
    dailyAcHours: acHours,
    dietType: dietType,
    wasteSegregated: wasteSegregated,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>The 8-Step Verification & Impact Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            How The Platform Works
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            A scientifically traceable methodology connecting individual daily habits to collective community transformation. No unverified estimates, no hallucinated metrics.
          </p>
        </div>

        {/* STEP 1: Understand Footprint (Interactive Tool) (Prompt #9 & #10) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Step 1</span>
              <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mt-0.5">
                Understand Your Environmental Footprint
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Interactive Estimator
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your lifestyle baseline is analyzed across transportation, thermal cooling, diet, and municipal waste. While AI interprets patterns and recommends practical shifts, the underlying calculations use documented CEA and IPCC emission baselines.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Inputs */}
            <div className="lg:col-span-6 space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Configure Lifestyle Parameters</h3>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Daily Commute Mode</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['active', 'public', 'bike', 'car'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setCommuteMode(mode)}
                      className={`p-2 rounded-xl text-center border capitalize font-medium transition-all cursor-pointer ${
                        commuteMode === mode
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {mode === 'active' ? 'Walk/Cycle' : mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Daily Commute Distance:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{commuteKm} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={commuteKm}
                  onChange={(e) => setCommuteKm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Air Conditioning Runtime:</span>
                  <span className="text-blue-700 dark:text-blue-400 font-bold">{acHours} hours/day</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={16}
                  value={acHours}
                  onChange={(e) => setAcHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Household Waste Segregation</span>
                <button
                  onClick={() => setWasteSegregated(!wasteSegregated)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    wasteSegregated
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {wasteSegregated ? 'Segregated (2-Bin)' : 'Mixed Waste'}
                </button>
              </div>
            </div>

            {/* Right: AI Footprint Intelligence Card (Prompt #10) */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-md space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Footprint Intelligence</span>
                </div>
                <span className="text-xs font-semibold text-emerald-300">
                  Est: {footprintAnalysis.totalBaselineTonsYear} tons CO2e/yr
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {footprintAnalysis.aiSummary}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Your Primary Mitigation Opportunities:
                </span>
                {footprintAnalysis.biggestImpactAreas.map((area, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white">{area.category}</span>
                      <span className="text-emerald-400">{area.scorePercent}% Impact Weight</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{area.description}</p>
                    <p className="text-[11px] text-emerald-300 font-medium">💡 {area.recommendedChange}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2: AI Alternative Methods (Prompt #11) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Step 2</span>
            <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mt-0.5">
              AI-Powered Alternative Methods
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Personalized practical alternatives tailored to your habits and local infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                <Bike className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Private Vehicle Alternatives</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Walking for trips under 2 km</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Pedal & electric cycling</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>City bus & metro transit pass</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Neighborhood carpooling</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-700 dark:text-blue-300">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Cooling & AC Optimization</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>BEE 24°C thermostat lock</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Ceiling fan + cross-ventilation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Scheduled filter cleaning (15% efficiency)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Curtain shading during solar peak</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-300">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Single-Use Elimination</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Traditional cloth Manjapai bag</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Refillable stainless steel flask</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>3-tier terracotta home compost bin</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Certified e-waste metallurgical dropoff</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* STEP 4 & 5: AI Verification & Anomaly Detection (Prompt #14, #15, #16) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">Step 4 & 5</span>
            <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mt-0.5">
              Action Recording & Multi-Layered AI Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Preventing unrealistic, exaggerated, or fraudulent submissions through combined backend rules and AI image analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Likely Valid (&gt;85%)</span>
              </div>
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                Evidence context, geolocation, and visual metadata match the selected action within humanly realistic limits.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold">
                <FileQuestion className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Needs More Evidence</span>
              </div>
              <p className="text-blue-900 dark:text-blue-200 leading-relaxed">
                Missing geotag or blurry image. User is prompted to attach GPS track or clear landmark photo.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-2">
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Manual Admin Review</span>
              </div>
              <p className="text-purple-900 dark:text-purple-200 leading-relaxed">
                High-volume claims (e.g. &gt;25 saplings planted) require vetted Community Administrator inspection.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Suspicious / Flagged</span>
              </div>
              <p className="text-rose-900 dark:text-rose-200 leading-relaxed">
                Physically impossible values (e.g. 200 km cycling in 1 hour or reused identical images) are quarantined.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>The Human-in-the-Loop Safeguard</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We never claim “100% automated AI perfection”. AI acts as a smart classifier and anomaly detector. Whenever confidence is low or volume is significant, the platform routes records to trusted local community administrators for peer confirmation.
            </p>
          </div>
        </div>

        {/* STEP 6: Deterministic Impact Calculation (Prompt #17) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Step 6</span>
            <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mt-0.5">
              Deterministic Impact Calculation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Documented emission factors and transparent arithmetic. AI explains the context, but never fabricates the calculation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Action Category</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Factor Value</th>
                  <th className="p-3">Governing Scientific Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-semibold">Active Transport (Cycling/Walking)</td>
                  <td className="p-3">1 km</td>
                  <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">0.171 kg CO2e</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">DEFRA 2024 / IPCC AR6 Passenger Transport Displacement</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">AC Thermostat at 24°C</td>
                  <td className="p-3">4 hours</td>
                  <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">0.860 kg CO2e</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">CEA India CO2 Baseline Database v19 (0.716 kg CO2e/kWh)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Aerobic Composting (Wet Waste)</td>
                  <td className="p-3">1 kg</td>
                  <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">0.420 kg CO2e</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">CPCB Solid Waste Methane Diversion First Order Decay</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Native Tree Sapling Planted</td>
                  <td className="p-3">1 sapling</td>
                  <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">21.770 kg CO2e/yr</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">Forest Survey of India (FSI) Tropical Broadleaf Model</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* STEP 7 & 8: Personal Impact to Community Contribution (Prompt #18 & #19) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl border border-slate-800 space-y-6 relative overflow-hidden">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 7 & 8</span>
            <h2 className="text-2xl font-bold font-heading text-white mt-0.5">
              Personal Impact to Collective Community Progress
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Every single verified action immediately updates your personal carbon ledger, community scores, district environmental trends, and global counters.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs">
            <div>
              <span className="text-emerald-400 font-bold block text-sm">1 Certified Action</span>
              <span className="text-slate-400">e.g. 8 km bicycle commute</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden md:block" />
            <div>
              <span className="text-teal-300 font-bold block text-sm">+1.37 kg CO2e</span>
              <span className="text-slate-400">Personal Footprint Reduction</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden md:block" />
            <div>
              <span className="text-blue-300 font-bold block text-sm">Coimbatore EcoAlliance</span>
              <span className="text-slate-400">Advances Ward Ranking</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden md:block" />
            <div>
              <span className="text-purple-300 font-bold block text-sm">Climate Map Update</span>
              <span className="text-slate-400">District Action Score +1</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('actions')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Explore Climate Action Library</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

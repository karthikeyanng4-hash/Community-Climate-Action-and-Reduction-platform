import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Users,
  Trees,
  Bike,
  Wind,
  Trash2,
  MapPin,
  TrendingUp,
  Activity,
  Award,
  Zap,
  ChevronRight,
  Info,
  Scale,
  LayoutDashboard,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { calculateDeterministicImpact } from '../../services/emissionFactors';

export const LandingPage: React.FC = () => {
  const { setActiveTab, navigateToDashboardTab, currentCommunity, user, isAuthenticated } = usePlatform();

  // Interactive Live Demonstration Widget state (Prompt #8)
  const [demoAction, setDemoAction] = useState<'cycle_commute' | 'ac_temp_24c' | 'diverted_compost' | 'tree_planted'>('cycle_commute');
  const [demoQty, setDemoQty] = useState<number>(8);

  const demoCalc = calculateDeterministicImpact(demoAction, demoQty);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. HERO SECTION (Prompt #6 & #7) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 -z-10 opacity-35">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-100/60 dark:from-emerald-950/30 via-teal-50/40 dark:via-teal-950/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>AI-Integrated Community Climate Change & Reduction Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              From Individual Climate Action to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                Collective Community Impact
              </span>
            </h1>

            {/* Core Why It Exists Subhead */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Climate awareness alone does not create measurable environmental improvement. We bridge the gap between everyday lifestyle choices, AI-assisted verification, and aggregate community transformation.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="hero-start-journey-btn"
                onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'login')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Continue to Dashboard' : 'Start Your Climate Journey'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-explore-communities-btn"
                onClick={() => setActiveTab('communities')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-base border border-slate-300 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Communities</span>
                <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Visual Transformation Journey (Prompt #7: Person -> AI -> Action -> Verify -> Impact -> Community) */}
            <div className="pt-10">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                The Verified Impact Pipeline
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold">1</div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Person</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Lifestyle Baseline</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">2</div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">AI Guidance</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Personalized Tips</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">3</div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Real Action</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Commute / Trees / AC</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">4</div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Verification</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">AI Vision + Rules</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold">5</div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Impact</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">IPCC/DEFRA Math</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">6</div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Community</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Collective Shift</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 2. INTERACTIVE DEMONSTRATION & PROTOTYPE DISCLAIMER (Prompt #8) */}
      <section className="py-16 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Prominent Mandatory Prototype Disclaimer Banner */}
          <div className="mb-8 p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-200/80 dark:bg-amber-900/60 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-bold text-amber-900 dark:text-amber-200 block sm:inline">Prototype Demonstration — </strong>
              The data shown here is illustrative and used only to demonstrate how the platform works. It does not represent real-world environmental measurements or verified community statistics. Deterministic conversion factors use published IPCC AR6 and DEFRA guidelines.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Sandbox Calculator */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Instant Simulation</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mt-1">
                  How One Real-World Action Translates to Community Impact
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Select an action, adjust the volume, and see how our deterministic calculation engine avoids hallucination while instantly contributing to regional progress.
                </p>
              </div>

              {/* Action Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => { setDemoAction('cycle_commute'); setDemoQty(8); }}
                  className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col gap-1.5 cursor-pointer ${
                    demoAction === 'cycle_commute'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Bike className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Cycle Commute</span>
                </button>
                <button
                  onClick={() => { setDemoAction('ac_temp_24c'); setDemoQty(6); }}
                  className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col gap-1.5 cursor-pointer ${
                    demoAction === 'ac_temp_24c'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Wind className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>AC at 24°C</span>
                </button>
                <button
                  onClick={() => { setDemoAction('diverted_compost'); setDemoQty(5); }}
                  className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col gap-1.5 cursor-pointer ${
                    demoAction === 'diverted_compost'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Trash2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Home Compost</span>
                </button>
                <button
                  onClick={() => { setDemoAction('tree_planted'); setDemoQty(2); }}
                  className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col gap-1.5 cursor-pointer ${
                    demoAction === 'tree_planted'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Trees className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Plant Sapling</span>
                </button>
              </div>

              {/* Interactive Quantity Slider */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Recorded Quantity:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    {demoQty} {demoCalc.inputUnit}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={demoAction === 'tree_planted' ? 10 : 30}
                  value={demoQty}
                  onChange={(e) => setDemoQty(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <span>1 {demoCalc.inputUnit}</span>
                  <span>Max {demoAction === 'tree_planted' ? 10 : 30} {demoCalc.inputUnit}</span>
                </div>
              </div>

              {/* Source-of-truth badge */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 space-y-1 transition-colors">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  <Scale className="w-4 h-4" />
                  <span>Documented Emission Methodology</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  {demoCalc.formula}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Authority: {demoCalc.methodologySource} ({demoCalc.version})
                </p>
              </div>
            </div>

            {/* Right: Live Interactive Card Result - Unified surface */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden transition-colors">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Calculated Verified Impact
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    Deterministic Math
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Averted Emissions</span>
                    <span className="text-3xl sm:text-4xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
                      {demoCalc.calculatedKgCo2e}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">kg CO2e</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                      {demoCalc.secondaryMetric?.label || 'Direct Co-benefit'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold font-heading text-teal-600 dark:text-teal-400">
                      {demoCalc.secondaryMetric?.value || '--'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      {demoCalc.secondaryMetric?.unit || 'Units'}
                    </span>
                  </div>
                </div>

                {/* Community Aggregation Trace */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Contributed to:</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Coimbatore EcoAlliance
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Verification Engine:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">AI Vision + GPS Rule Validated</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">District Score Impact:</span>
                    <span className="text-teal-600 dark:text-teal-400 font-medium">+0.04% Toward Ward Air Quality Target</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'login')}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{isAuthenticated ? 'Go to Action Logger in Dashboard' : 'Log In to Record Actions'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 3. WHY THIS MATTERS & ORIGINAL PHILOSOPHY (Prompt #6) */}
      <section className="py-16 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">The Core Imperative</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white">
              Why Collective Verification Matters
            </h2>
            <blockquote className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 italic border-l-4 border-emerald-500 pl-4 py-1 text-left sm:text-center sm:border-l-0">
              “Climate action becomes powerful when individual effort becomes measurable collective progress.”
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800/60 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Unverified Carbon Claims</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Most platforms accept unverified inputs or guess numbers through conversational AI. We combine strict anomaly detection rules with visual verification and open calculation standards.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800/60 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-700 dark:text-blue-300">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Neighborhood-Level Aggregation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                An isolated individual recycling plastic feels insignificant. When 1,400 members of Coimbatore EcoAlliance aggregate 32,000 kg of diversion, municipal landfill operations visibly shift.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800/60 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Local Environmental Intelligence</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect your personal reductions with actual district environmental conditions. See real-time AQI, water restoration, and active civic remediation across Tamil Nadu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIVE COMMUNITIES SPOTLIGHT (Prompt #32 & #40) */}
      <section className="py-16 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Civic Ecosystem</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mt-1">
                Active Grassroots Communities
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Join verified citizen collectives organizing tree plantations, lake cleanups, and zero-waste wards.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('communities')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
            >
              <span>Explore all communities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Coimbatore */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Featured Community
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">1,420 Members</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Coimbatore EcoAlliance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Coimbatore, Tamil Nadu
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Western Ghats foothills biodiversity stewardship, lake restoration at Singanallur, and urban composting networks.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Avoided Carbon</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">84.3 Tons CO2e</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Saplings Planted</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">5,410 Trees</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab(isAuthenticated ? 'my_community' : 'login')}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-800 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Community Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Chennai */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
                  Coastal Grid
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">2,890 Members</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chennai GreenGrid</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Chennai, Tamil Nadu
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Coastal beach micro-plastic recovery, residential solar transition, and rooftop rainwater percolation wells.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Avoided Carbon</span>
                  <span className="font-bold text-teal-700 dark:text-teal-400">142.5 Tons CO2e</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Water Recharged</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">1.2M Liters</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('communities')}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explore Community</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Nilgiris */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300">
                  Hill Sanctuary
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">680 Members</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nilgiris Watershed Guardians</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  Nilgiris, Tamil Nadu
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Native Shola forest buffer restoration, 100% single-use plastic ban enforcement, and mountain stream cleanups.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Eco Health Score</span>
                  <span className="font-bold text-green-700 dark:text-green-400">84 / 100 (Excellent)</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Actions Verified</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">9,800 Actions</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('communities')}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explore Community</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-20 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden border-t border-slate-800 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-semibold border border-emerald-800/60">
            <Zap className="w-3.5 h-3.5" />
            <span>
              {isAuthenticated
                ? 'Keep your momentum going!'
                : 'Ready to make your climate impact count?'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight text-white">
            {isAuthenticated
              ? `Welcome back${user?.name ? `, ${user.name}` : ''}! Ready to take climate action?`
              : 'Join 8,400+ Citizens in Tamil Nadu Driving Measurable Change'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isAuthenticated
              ? 'Jump back into your dashboard to log sustainable activities, review your carbon savings, and collaborate with your local community.'
              : 'Record your daily sustainable actions, submit evidence for automated AI verification, and watch your local neighborhood rise on the collective impact leaderboard.'}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  id="cta-continue-dashboard-btn"
                  onClick={() => navigateToDashboardTab('my_impact')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Continue to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="cta-log-action-btn"
                  onClick={() => navigateToDashboardTab('actions')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Log Climate Action</span>
                </button>
                <button
                  id="cta-climate-map-btn"
                  onClick={() => navigateToDashboardTab('climate_map')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span>District Map</span>
                </button>
              </>
            ) : (
              <>
                <button
                  id="cta-register-btn"
                  onClick={() => setActiveTab('register')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="cta-login-btn"
                  onClick={() => setActiveTab('login')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In</span>
                </button>
                <button
                  id="cta-communities-btn"
                  onClick={() => setActiveTab('communities')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white font-semibold text-base border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Explore Communities</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};


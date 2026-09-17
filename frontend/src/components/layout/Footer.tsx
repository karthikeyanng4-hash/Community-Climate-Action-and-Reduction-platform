import React from 'react';
import { Leaf, ShieldCheck, Database, Award, ExternalLink, ArrowUpRight } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const Footer: React.FC = () => {
  const { setActiveTab, navigateToDashboardTab } = usePlatform();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800 text-sm transition-colors">
      {/* Prominent Prototype Disclaimer Bar */}
      <div className="bg-emerald-50/90 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800/40 py-3 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-950 dark:text-emerald-200">Prototype Demonstration:</span>
            <span className="text-emerald-800 dark:text-emerald-300/90">The data shown here is illustrative and used only to demonstrate how the platform works. It does not represent real-world environmental measurements or verified community statistics.</span>
          </div>
          <span className="text-emerald-700 dark:text-slate-400 text-[11px] shrink-0 font-medium">
            Methodology: IPCC AR6 WGIII • CEA India Baseline v19 • DEFRA 2024
          </span>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-base text-white">EcoCommunity</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open-source hyper-local collective climate intelligence platform for municipal ward-level ecological action and verifiable mitigation.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pilot Active: Coimbatore Municipal Corporation</span>
            </div>
          </div>

          {/* Column 2: Platform Journey */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform Journey</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('how_it_works')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  1. Footprint Measurement
                </button>
              </li>
              <li>
                <button onClick={() => navigateToDashboardTab('actions')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  2. AI-Recommended Actions
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how_it_works')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  3. Evidence & Anomaly Verification
                </button>
              </li>
              <li>
                <button onClick={() => navigateToDashboardTab('my_impact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  4. Traceable Impact Ledger
                </button>
              </li>
              <li>
                <button onClick={() => navigateToDashboardTab('my_community')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  5. Community Aggregation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Environmental Intelligence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Intelligence & Data</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateToDashboardTab('climate_map')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  District Environmental Map
                </button>
              </li>
              <li>
                <button onClick={() => navigateToDashboardTab('my_community')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Community Challenges
                </button>
              </li>
              <li>
                <button onClick={() => navigateToDashboardTab('leaderboard')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Verified Impact Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => navigateToDashboardTab('local_events')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Singanallur & Local Cleanups
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Standards & Accuracy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Scientific Sources</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic Calculations</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Calculations are strictly derived from published emission factors. AI never hallucinates numerical results or pollution measurements.
              </p>
            </div>
            <div className="text-[11px] text-slate-500">
              Security-first architecture with role validation and human-in-the-loop review for flagged submissions.
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 EcoCommunity Platform. Developed for Sustainable Climate Action & Community Reduction.</p>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Deterministic Math: DEFRA/IPCC</span>
            <span>•</span>
            <span>Tamil Nadu Clean Air Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

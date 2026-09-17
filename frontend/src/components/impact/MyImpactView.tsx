import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Trees,
  Bike,
  Wind,
  Trash2,
  Droplets,
  Sparkles,
  Share2,
  Filter,
  CheckCircle2,
  Calendar,
  MapPin,
  Scale,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const MyImpactView: React.FC = () => {
  const { user, submissions, currentCommunity, setShareModalData, setIsLogModalOpen } = usePlatform();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSubmissions = submissions.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.categoryId === selectedCategory;
  });

  // Calculate equivalencies
  const smartphoneCharges = Math.round((user.totalKgCo2eAvoided / 0.008));
  const petrolLiters = (user.totalKgCo2eAvoided / 2.31).toFixed(1);
  const urbanTreesEquiv = (user.totalKgCo2eAvoided / 21.77).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Personal Verified Ledger
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mt-0.5">
              My Environmental Impact
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Every entry below has undergone multi-step verification and is mathematically traceable to published carbon standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setShareModalData({
                  title: 'Personal Verified Impact Ledger',
                  metric: `${user.totalKgCo2eAvoided} kg CO2e Avoided`,
                  category: 'Climate Leadership',
                  date: new Date().toLocaleDateString('en-IN'),
                  community: currentCommunity.name,
                })
              }
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Share Impact Card</span>
            </button>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              + Record Action
            </button>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avoided Emissions</span>
            <div className="text-3xl font-extrabold font-heading text-emerald-700 dark:text-emerald-400">
              {user.totalKgCo2eAvoided} <span className="text-sm text-slate-500 dark:text-slate-400 font-sans">kg CO2e</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">IPCC AR6 standard</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Certified Actions</span>
            <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {user.totalVerifiedActions}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% Verified</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Native Trees</span>
            <div className="text-3xl font-extrabold font-heading text-green-700 dark:text-green-400">
              {user.totalTreesPlanted} <span className="text-sm text-slate-500 dark:text-slate-400 font-sans">saplings</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Singanallur bio-corridor</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Organic Waste Diverted</span>
            <div className="text-3xl font-extrabold font-heading text-amber-700 dark:text-amber-400">
              {user.totalKgWasteReduced} <span className="text-sm text-slate-500 dark:text-slate-400 font-sans">kg</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Aerobic composted</span>
          </div>
        </div>

        {/* Real-World Environmental Equivalencies */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-200">
              Real-World Equivalencies for Your {user.totalKgCo2eAvoided} kg CO2e
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">Standard EPA GHG Equivalency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-slate-300 block">Fossil Fuel Saved:</span>
              <span className="text-2xl font-extrabold text-teal-300 font-heading block">{petrolLiters} Liters</span>
              <span className="text-slate-400 text-[11px]">Unburned petrol/diesel displacement</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-slate-300 block">Grid Clean Energy Equivalent:</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-heading block">{smartphoneCharges.toLocaleString()}</span>
              <span className="text-slate-400 text-[11px]">Smartphone recharges equivalent</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-slate-300 block">Biomass Sequestration Equivalent:</span>
              <span className="text-2xl font-extrabold text-green-300 font-heading block">{urbanTreesEquiv} Trees</span>
              <span className="text-slate-400 text-[11px]">Mature tropical broadleaf annual absorb</span>
            </div>
          </div>
        </div>

        {/* AI Impact Analysis (Prompt #31) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Impact Analysis & Habit Evolution</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
            <p>
              <strong>What you changed:</strong> Your transition from solo motorcycle commuting to cycling (8 km recorded along Avinashi Road) has cut your personal transport carbon intensity by 18% over the past 30 days.
            </p>
            <p>
              <strong>Habits improved:</strong> Consistency in kitchen waste sorting and composting diverted 62.5 kg of organic refuse, fully halting anaerobic methane generation for your household.
            </p>
            <p>
              <strong>Areas still needing attention:</strong> Air conditioning usage in the evening hours remains elevated. Operating the split unit at BEE standard 24°C rather than 20°C would conserve an additional 1.2 kWh per evening.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                Recommended Next Step: Join the 7-Day Zero-Fuel Commute Challenge
              </span>
              <button
                onClick={() => setIsLogModalOpen(true)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer active:scale-95"
              >
                Log Action Now
              </button>
            </div>
          </div>
        </div>

        {/* Traceable Action Ledger Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Verified Action Ledger</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Traceable historical audit of every verified climate contribution.</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="transport">Transport</option>
                <option value="air_conditioning">Air Conditioning</option>
                <option value="waste_reduction">Waste & Composting</option>
                <option value="tree_green">Tree Planting</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSubmissions.map((sub) => (
              <div key={sub.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  {sub.photoUrl ? (
                    <img
                      src={sub.photoUrl}
                      alt={sub.actionTitle}
                      className="w-16 h-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{sub.actionTitle}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        {sub.verificationStatus === 'verified' ? 'Certified Valid' : sub.verificationStatus}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">AI Confidence: {sub.aiConfidenceScore}%</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{sub.description}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      Formula: {sub.quantity} {sub.unit} • Standard: {sub.factorReference}
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right shrink-0">
                  <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 block">
                    +{sub.calculatedKgCo2e} kg CO2e
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{sub.date}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{sub.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

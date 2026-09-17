import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  ShieldCheck,
  PlusCircle,
  Share2,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const MyCommunityView: React.FC = () => {
  const {
    currentCommunity,
    challenges,
    toggleJoinChallenge,
    setIsLogModalOpen,
    setPreselectedChallengeId,
    user,
    setActiveTab,
    setShareModalData,
  } = usePlatform();

  const [activeTab, setActiveTabLocal] = useState<'overview' | 'plan' | 'challenges'>('overview');

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Community Header Banner */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${currentCommunity.avatarColor} text-white flex items-center justify-center font-extrabold text-2xl shadow-sm`}>
              {currentCommunity.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
                  {currentCommunity.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Rank #{currentCommunity.rank} in State
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{currentCommunity.district}, {currentCommunity.state}</span>
                <span>•</span>
                <span>{currentCommunity.membersCount.toLocaleString()} Active Residents</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setShareModalData({
                  title: `${currentCommunity.name} Climate Rank`,
                  metric: `Rank #${currentCommunity.rank} • ${(currentCommunity.totalKgCo2eAvoided / 1000).toFixed(1)} Tons CO2e`,
                  category: 'Collective Action',
                  date: new Date().toLocaleDateString('en-IN'),
                  community: currentCommunity.name,
                })
              }
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Share Collective Rank</span>
            </button>
            <button
              onClick={() => setActiveTab('climate_map')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Open District Map
            </button>
          </div>
        </div>

        {/* Community Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
          <button
            onClick={() => setActiveTabLocal('overview')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Collective Overview & Stats
          </button>
          <button
            onClick={() => setActiveTabLocal('plan')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'plan'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            AI Community Improvement Plan
          </button>
          <button
            onClick={() => setActiveTabLocal('challenges')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'challenges'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Ward Challenges ({challenges.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* 4 Community Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Avoided Carbon
                </span>
                <div className="text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
                  {(currentCommunity.totalKgCo2eAvoided / 1000).toFixed(1)}
                  <span className="text-sm font-sans text-slate-500 dark:text-slate-400 ml-1">Tons</span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+12.4% over last 30 days</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Verified Ward Actions
                </span>
                <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {currentCommunity.totalVerifiedActions.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Across 100 urban wards</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Singanallur & Lake Trees
                </span>
                <div className="text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
                  {currentCommunity.totalTreesPlanted.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">92% survival audit</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Diverted Solid Waste
                </span>
                <div className="text-3xl font-extrabold font-heading text-amber-600 dark:text-amber-400">
                  {(currentCommunity.totalKgWasteReduced / 1000).toFixed(1)}
                  <span className="text-sm font-sans text-slate-500 dark:text-slate-400 ml-1">Tons</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Vellalore dump avoided</span>
              </div>
            </div>

            {/* AI Community Strengths & Weaknesses */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AI Community Diagnostics & Pattern Analysis
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Updated from real municipal submissions</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Top Category: {currentCommunity.topCategory}</span>
                  </div>
                  <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    Household organic waste segregation in RS Puram, Peelamedu, and Saibaba Colony has reduced wet-waste sent to Vellalore landfill by 24% over the last 30 days.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Weakest Category: {currentCommunity.weakestCategory}</span>
                  </div>
                  <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                    Sustainable transit participation along major corridors (Avinashi Rd, Mettupalayam Rd) remains low compared to similar tier-2 municipal zones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI COMMUNITY IMPROVEMENT PLAN */}
        {activeTab === 'plan' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Municipal Action Blueprint
                </span>
                <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mt-0.5">
                  AI-Generated Community Action Plan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Targeted priority interventions designed to raise Coimbatore EcoAlliance from Rank #1 to state climate excellence.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Priority 1: Avinashi Road Morning Cycle & Carpool Corridor
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Target: 4.2 Tons CO2e Avoided
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Action:</strong> Establish designated citizen carpool check-in points at Hope College and Fun Mall, coupled with a bi-weekly non-motorized commute morning.
                  </p>
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 pt-1 text-[11px]">
                    <span>Timeline: <strong className="text-slate-700 dark:text-slate-300">4 Weeks</strong></span>
                    <span>•</span>
                    <span>Expected Benefit: <strong className="text-slate-700 dark:text-slate-300">+180 New Active Commuters</strong></span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Priority 2: Singanallur Wetland Micro-Forest Planting
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Target: 1,500 Native Saplings
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Action:</strong> Plant native Ficus, Neem, and Jamun varieties along the eastern lake bund to reinforce urban biodiversity and prevent topsoil erosion.
                  </p>
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 pt-1 text-[11px]">
                    <span>Timeline: <strong className="text-slate-700 dark:text-slate-300">Weekend Volunteer Drives</strong></span>
                    <span>•</span>
                    <span>Expected Benefit: <strong className="text-slate-700 dark:text-slate-300">32.6 Tons CO2e Sequestration/yr</strong></span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Priority 3: Commercial Street Single-Use Plastic Audits
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Target: 50 Retailers Swapped
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Action:</strong> Partner with local traders associations in Gandhipuram to replace poly-bags with reusable cotton Manjapai bags and provide cloth bag lending kiosks.
                  </p>
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 pt-1 text-[11px]">
                    <span>Timeline: <strong className="text-slate-700 dark:text-slate-300">2 Weeks</strong></span>
                    <span>•</span>
                    <span>Expected Benefit: <strong className="text-slate-700 dark:text-slate-300">Zero Plastic Inflow to Storm Drains</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WARD CHALLENGES */}
        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
            {challenges.map((ch) => {
              const isJoined = ch.isJoined;
              const percent = Math.min(100, Math.round((ch.currentValue / ch.targetValue) * 100));

              return (
                <div
                  key={ch.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {ch.category.toUpperCase()}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mt-0.5">
                          {ch.title}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                        {ch.participantsCount} Joined
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{ch.objective}</p>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 dark:text-slate-300">Goal Progress ({percent}%)</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {ch.currentValue} / {ch.targetValue} {ch.unit}
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">Reward: <strong className="text-slate-700 dark:text-slate-200">{ch.rewardBadge}</strong></span>
                      <span className="text-slate-500 dark:text-slate-400">Deadline: <strong className="text-slate-700 dark:text-slate-200">{ch.deadline}</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    {isJoined ? (
                      <>
                        <div className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold text-center border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>You Are Participating in This Challenge</span>
                        </div>
                        <button
                          onClick={() => {
                            setPreselectedChallengeId(ch.id);
                            setIsLogModalOpen(true);
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>+ Record Action for this Challenge</span>
                        </button>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => toggleJoinChallenge(ch.id)}
                          className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Join Challenge</span>
                        </button>
                        <button
                          onClick={() => {
                            setPreselectedChallengeId(ch.id);
                            setIsLogModalOpen(true);
                          }}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>Record Action</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

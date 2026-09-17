import React, { useState } from 'react';
import {
  Globe,
  PlusCircle,
  TrendingUp,
  Award,
  Sparkles,
  Share2,
  Users,
  CheckCircle2,
  Calendar,
  ChevronRight,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Target,
  Trees,
  Bike,
  Wind,
  Trash2,
  Flame,
  Trophy,
  Zap,
  Filter,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { DashboardSubTab } from '../../types';
import { LeaderboardPage } from '../leaderboard/LeaderboardPage';
import { ClimateActionsCatalog } from '../actions/ClimateActionsCatalog';
import { LocalEventsPage } from '../events/LocalEventsPage';
import { ClimateMap } from '../map/ClimateMap';

export const UserDashboard: React.FC = () => {
  const {
    user,
    currentCommunity,
    submissions,
    challenges,
    setIsLogModalOpen,
    setPreselectedChallengeId,
    setShareModalData,
    districts,
    dashboardSubTab,
    setDashboardSubTab,
  } = usePlatform();

  const [showAllLedger, setShowAllLedger] = useState(false);
  const [showAllChallenges, setShowAllChallenges] = useState(false);
  const [ledgerCategoryFilter, setLedgerCategoryFilter] = useState<string>('all');

  const verifiedSubmissions = submissions.filter((s) => s.verificationStatus === 'verified');
  const pendingSubmissions = submissions.filter((s) => s.verificationStatus !== 'verified');

  const filteredSubmissions = submissions.filter((s) => {
    if (ledgerCategoryFilter === 'all') return true;
    return s.categoryId === ledgerCategoryFilter;
  });

  const displayedSubmissions = showAllLedger ? filteredSubmissions : filteredSubmissions.slice(0, 4);
  const displayedChallenges = showAllChallenges ? challenges : challenges.slice(0, 2);

  const handleShareCard = (title: string, metric: string, category: string) => {
    setShareModalData({
      title,
      metric,
      category,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      community: currentCommunity.name,
    });
  };

  const navTabs: { id: DashboardSubTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'my_impact',
      label: 'My Impact',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
      badge: `Rank #${user.rank}`,
    },
    {
      id: 'my_community',
      label: 'Community & Challenges',
      icon: <Users className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: 'actions',
      label: 'Climate Actions',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'local_events',
      label: 'Local Events',
      icon: <Calendar className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'climate_map',
      label: 'Climate Map',
      icon: <MapPin className="w-4 h-4 text-teal-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Top Welcome Bar & Action Buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <button
                  onClick={() => setDashboardSubTab('leaderboard')}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="View your standing in Leaderboard"
                >
                  <Trophy className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Rank #{user.rank} in Community</span>
                  <ChevronRight className="w-3 h-3 opacity-60" />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{currentCommunity.name} ({user.district}, Tamil Nadu)</span>
                <span>•</span>
                <span>Member since {user.joinedDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() =>
                handleShareCard(
                  'Community Climate Milestone',
                  `${user.totalKgCo2eAvoided} kg CO2e Avoided`,
                  'Personal Impact'
                )
              }
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer flex-1 md:flex-initial"
            >
              <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Share Milestone</span>
            </button>
            <button
              id="dashboard-record-action-btn"
              onClick={() => setIsLogModalOpen(true)}
              className="flex-1 md:flex-initial px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>+ Record Action</span>
            </button>
          </div>
        </div>

        {/* Unified Dashboard Subsections Navigation Bar */}
        <div className="sticky top-18 z-20 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto scrollbar-none transition-colors">
            <div className="flex items-center gap-1.5 min-w-max">
              {navTabs.map((tab) => {
                const isActive = dashboardSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDashboardSubTab(tab.id)}
                    className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer select-none whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : ''}>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                          isActive
                            ? 'bg-emerald-800/80 text-white'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SUBSECTION 1: MY IMPACT DASHBOARD */}
        {dashboardSubTab === 'my_impact' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 4 Core Personal KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Verified Avoided Carbon
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {user.totalKgCo2eAvoided}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">kg CO2e</span>
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> Deterministic DEFRA/IPCC Math
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Verified Actions Certified
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {user.totalVerifiedActions}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Actions</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {pendingSubmissions.length} pending verification review
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Native Trees Planted
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {user.totalTreesPlanted}
                  </span>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">Saplings</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Singanallur & Lake Bunds</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Municipal Waste Diverted
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {user.totalKgWasteReduced}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">kg Organics</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Composted at Source</span>
              </div>
            </div>

            {/* AI Climate Insight - Harmonized surface */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Personalized Climate Insight</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Derived from {verifiedSubmissions.length} verified submissions
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                “Your sustainable transportation actions have improved significantly this month (8 km bicycle commute logged on Avinashi Road corridor). However, air-conditioning energy consumption remains your largest ongoing reduction opportunity as summer temperatures peak in Coimbatore.”
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors cursor-pointer active:scale-95"
                >
                  Log AC 24°C Discipline
                </button>
                <button
                  onClick={() => setDashboardSubTab('actions')}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                >
                  Explore Energy Alternatives →
                </button>
              </div>
            </div>


            {/* Ongoing Habits & Active Goals */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Ongoing Habits & Active Goals</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Track weekly quotas, active habits, and deadlines with realistic AI-suggested milestones.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  Weekly Goal: {user.weeklyGoalProgress}% Complete
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Bike className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Active Commute (25 km)
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">19 / 25 km</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '76%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Deadline: May 25</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">6 km remaining</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                    💡 <strong>AI Next Step:</strong> One more morning cycle trip to Peelamedu will secure this milestone.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      AC 24°C Runtime (40 hrs)
                    </span>
                    <span className="font-semibold text-blue-700 dark:text-blue-400">28 / 40 hrs</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Deadline: May 28</span>
                    <span className="text-blue-700 dark:text-blue-400 font-medium">12 hrs remaining</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                    💡 <strong>AI Next Step:</strong> Maintain 25°C setting for 2 more evenings to unlock Cool Champion.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Zero Food Waste (10 Days)
                    </span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">3 / 10 days</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: '30%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Deadline: June 05</span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium">7 days remaining</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                    💡 <strong>AI Next Step:</strong> Pre-portion leftover vegetables into designated airtight bins.
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Activity Ledger Section */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Verified Activity Ledger</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time ledger validated through computer vision and deterministic formulas.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAllLedger(!showAllLedger)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                  >
                    <span>{showAllLedger ? 'Show Recent Only' : `View All (${submissions.length})`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {showAllLedger && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Filter:
                  </span>
                  {['all', 'transport', 'energy', 'waste_reduction', 'tree_green'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setLedgerCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                        ledgerCategoryFilter === cat
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/70 dark:hover:bg-slate-800/50 rounded-xl px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {sub.photoUrl ? (
                        <img
                          src={sub.photoUrl}
                          alt={sub.actionTitle}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-2xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">{sub.actionTitle}</span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                            {sub.verificationStatus === 'verified' ? 'Certified' : sub.verificationStatus}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">{sub.description}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 block">
                          Standard: {sub.factorReference}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 block">
                        +{sub.calculatedKgCo2e} kg CO2e
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{sub.date} • {sub.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBSECTION 2: LEADERBOARD DASHBOARD (Directly visible inside dashboard!) */}
        {dashboardSubTab === 'leaderboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <LeaderboardPage isEmbedded={true} />
          </div>
        )}

        {/* SUBSECTION 3: COMMUNITY & CHALLENGES */}
        {dashboardSubTab === 'my_community' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Community Headline Banner */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                    {currentCommunity.name}
                  </h2>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                    Ward Collective
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {currentCommunity.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
                  <span>Location: <strong>{currentCommunity.district}, {currentCommunity.state}</strong></span>
                  <span>•</span>
                  <span>Joined: <strong>{currentCommunity.joinedDate}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setDashboardSubTab('local_events')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-all cursor-pointer flex-1 md:flex-initial text-center"
                >
                  Community Events
                </button>
                <button
                  onClick={() => setDashboardSubTab('climate_map')}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex-1 md:flex-initial text-center"
                >
                  District Map
                </button>
              </div>
            </div>

            {/* Community Aggregate Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Community Avoided Carbon
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {(currentCommunity.totalKgCo2eAvoided / 1000).toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Tons CO2e</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Collective verified total</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active Citizens
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {currentCommunity.membersCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Members</span>
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">+84 joined this week</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Lake & Urban Trees
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {currentCommunity.totalTreesPlanted.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">Trees</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Singanallur Lake buffer</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Landfill Waste Diverted
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {(currentCommunity.totalKgWasteReduced / 1000).toFixed(1)}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Tons</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Municipal ward segregation</span>
              </div>
            </div>

            {/* AI Community Intelligence */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Community Intelligence Synthesis</span>
                </div>
                <span className="text-xs text-slate-300">
                  Analyzed from {currentCommunity.totalVerifiedActions.toLocaleString()} verified actions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                  <span className="text-emerald-400 font-bold block">Strongest Action Category</span>
                  <p className="text-white font-semibold text-sm">{currentCommunity.topCategory}</p>
                  <p className="leading-relaxed">
                    High residential participation in RS Puram and Peelamedu wet-waste sorting has successfully diverted 32.6 tons from Vellalore dumpsite.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                  <span className="text-amber-400 font-bold block">Improvement Opportunity</span>
                  <p className="text-white font-semibold text-sm">{currentCommunity.weakestCategory}</p>
                  <p className="leading-relaxed">
                    Non-motorized transit participation along NH-544 is low. Recommending a community bicycle convoy and carpool hub to bridge last-mile transit.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Community Challenges */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Collective Challenges</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Joint community goals uniting residents across Coimbatore wards.</p>
                </div>
                <button
                  onClick={() => setShowAllChallenges(!showAllChallenges)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
                >
                  {showAllChallenges ? 'Show Fewer Challenges' : `View All Challenges (${challenges.length}) →`}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedChallenges.map((ch) => (
                  <div key={ch.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{ch.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        {ch.participantsCount} Joined
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{ch.objective}</p>
                    <div>
                      <div className="flex justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Progress</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {ch.currentValue} / {ch.targetValue} {ch.unit}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${Math.min(100, (ch.currentValue / ch.targetValue) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPreselectedChallengeId(ch.id);
                        setIsLogModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-98 cursor-pointer"
                    >
                      <span>+ Record Action for this Challenge</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBSECTION 4: CLIMATE ACTIONS */}
        {dashboardSubTab === 'actions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ClimateActionsCatalog isEmbedded={true} />
          </div>
        )}

        {/* SUBSECTION 5: LOCAL EVENTS */}
        {dashboardSubTab === 'local_events' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <LocalEventsPage isEmbedded={true} />
          </div>
        )}

        {/* SUBSECTION 6: CLIMATE MAP */}
        {dashboardSubTab === 'climate_map' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ClimateMap isEmbedded={true} />
          </div>
        )}
      </div>
    </div>
  );
};

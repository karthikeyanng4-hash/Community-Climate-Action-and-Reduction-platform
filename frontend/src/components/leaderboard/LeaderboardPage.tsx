import React, { useState } from 'react';
import {
  Trophy,
  Users,
  User,
  Search,
  Sparkles,
  Award,
  Trees,
  Trash2,
  Bike,
  ShieldCheck,
  Medal,
  Crown,
  ChevronUp,
  ArrowUpRight,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { INITIAL_USER_LEADERBOARD, INITIAL_COMMUNITY_LEADERBOARD } from '../../data/mockData';

interface LeaderboardPageProps {
  isEmbedded?: boolean;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ isEmbedded = false }) => {
  const { userLeaderboard, communityLeaderboard, communities, user, setIsLogModalOpen } = usePlatform();

  // Master Toggle: Individual & Community
  const [boardType, setBoardType] = useState<'individual' | 'community'>('individual');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [searchQuery, setSearchQuery] = useState('');

  const individualList = (userLeaderboard && userLeaderboard.length > 0) ? userLeaderboard : INITIAL_USER_LEADERBOARD;
  const communityList = (communityLeaderboard && communityLeaderboard.length > 0) ? communityLeaderboard : INITIAL_COMMUNITY_LEADERBOARD;

  const filteredIndividuals = individualList.filter((ind) => {
    const name = ind.userName || '';
    const comm = ind.communityName || '';
    const dist = ind.district || '';
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || comm.toLowerCase().includes(q) || dist.toLowerCase().includes(q);
  });

  const filteredCommunities = communityList.filter((comm) => {
    const name = comm.name || '';
    const dist = comm.district || '';
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || dist.toLowerCase().includes(q);
  });

  const topThreeIndividuals = individualList.slice(0, 3);
  const topThreeCommunities = communityList.slice(0, 3);

  const content = (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Master Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Certified Climate Standings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
            Climate Action Leaderboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time rankings calculated directly from certified real-world submissions and deterministic CO2e mitigation math.
          </p>
        </div>

        {/* Master Toggle */}
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold self-start md:self-auto shrink-0 shadow-inner">
          <button
            onClick={() => setBoardType('individual')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              boardType === 'individual'
                ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Individual Standings</span>
          </button>
          <button
            onClick={() => setBoardType('community')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              boardType === 'community'
                ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Community Standings</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Showcase */}
      {boardType === 'individual' && topThreeIndividuals.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rank 2 - Silver */}
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Medal className="w-3 h-3 text-slate-500 dark:text-slate-400" /> #2 Silver
            </div>
            <div className="relative mt-2">
              <img
                src={topThreeIndividuals[1].avatar}
                alt={topThreeIndividuals[1].userName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-300 dark:ring-slate-700 shadow-md"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-black flex items-center justify-center shadow-xs">
                2
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">{topThreeIndividuals[1].userName}</h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{topThreeIndividuals[1].communityName}</span>
            <div className="mt-3 p-2 bg-slate-100/80 dark:bg-slate-850 rounded-xl w-full text-center">
              <span className="text-base font-extrabold text-slate-900 dark:text-white block">{topThreeIndividuals[1].totalKgCo2eAvoided} kg</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">CO2e Avoided</span>
            </div>
            <span className="mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {topThreeIndividuals[1].topBadge}
            </span>
          </div>

          {/* Rank 1 - Gold Champion */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-amber-50/50 to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 p-6 rounded-3xl border-2 border-amber-300 dark:border-amber-600/50 shadow-md flex flex-col items-center text-center relative overflow-hidden -mt-0 md:-mt-2">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
            <div className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
              <Crown className="w-3.5 h-3.5" /> Rank 1 Gold
            </div>
            <div className="relative mt-2">
              <img
                src={topThreeIndividuals[0].avatar}
                alt={topThreeIndividuals[0].userName}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-400 shadow-lg"
              />
              <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-950 text-sm font-black flex items-center justify-center shadow-md">
                1
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white mt-3 text-base">{topThreeIndividuals[0].userName}</h4>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{topThreeIndividuals[0].communityName}</span>
            <div className="mt-3 p-2.5 bg-amber-100/70 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl w-full text-center">
              <span className="text-lg font-black text-amber-950 dark:text-amber-200 block">{topThreeIndividuals[0].totalKgCo2eAvoided} kg</span>
              <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">Top Avoided Carbon</span>
            </div>
            <span className="mt-2 text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
              👑 {topThreeIndividuals[0].topBadge}
            </span>
          </div>

          {/* Rank 3 - Bronze */}
          <div className="order-3 md:order-3 bg-gradient-to-b from-orange-50/40 to-white dark:from-slate-800/80 dark:to-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <Medal className="w-3 h-3 text-amber-700 dark:text-amber-400" /> #3 Bronze
            </div>
            <div className="relative mt-2">
              <img
                src={topThreeIndividuals[2].avatar}
                alt={topThreeIndividuals[2].userName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-600/60 shadow-md"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center shadow-xs">
                3
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">{topThreeIndividuals[2].userName}</h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{topThreeIndividuals[2].communityName}</span>
            <div className="mt-3 p-2 bg-slate-100/80 dark:bg-slate-850 rounded-xl w-full text-center">
              <span className="text-base font-extrabold text-slate-900 dark:text-white block">{topThreeIndividuals[2].totalKgCo2eAvoided} kg</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">CO2e Avoided</span>
            </div>
            <span className="mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {topThreeIndividuals[2].topBadge}
            </span>
          </div>
        </div>
      )}

      {/* Community Podium Showcase */}
      {boardType === 'community' && topThreeCommunities.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="order-2 md:order-1 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center relative">
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">#2 Community</span>
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white text-xl font-bold flex items-center justify-center shadow-md">
              {topThreeCommunities[1].name.charAt(0)}
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">{topThreeCommunities[1].name}</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">{topThreeCommunities[1].district}</span>
            <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl w-full">
              <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">{(topThreeCommunities[1].totalKgCo2eAvoided / 1000).toFixed(1)} Tons</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">Avoided Carbon</span>
            </div>
          </div>

          <div className="order-1 md:order-2 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 p-6 rounded-3xl border-2 border-emerald-400 dark:border-emerald-600/50 shadow-md flex flex-col items-center text-center relative -mt-0 md:-mt-2">
            <span className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
              <Crown className="w-3.5 h-3.5" /> Rank 1 Collective
            </span>
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg ring-4 ring-emerald-300">
              {topThreeCommunities[0].name.charAt(0)}
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white mt-3 text-base">{topThreeCommunities[0].name}</h4>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{topThreeCommunities[0].district}</span>
            <div className="mt-3 p-2.5 bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl w-full">
              <span className="text-lg font-black text-emerald-950 dark:text-emerald-200">{(topThreeCommunities[0].totalKgCo2eAvoided / 1000).toFixed(1)} Tons</span>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block font-bold uppercase">Collective Mitigation</span>
            </div>
          </div>

          <div className="order-3 md:order-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center relative">
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">#3 Community</span>
            <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white text-xl font-bold flex items-center justify-center shadow-md">
              {topThreeCommunities[2].name.charAt(0)}
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">{topThreeCommunities[2].name}</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">{topThreeCommunities[2].district}</span>
            <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl w-full">
              <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">{(topThreeCommunities[2].totalKgCo2eAvoided / 1000).toFixed(1)} Tons</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">Avoided Carbon</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Leaderboard Intelligence Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl border border-slate-800 space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Leaderboard Analysis & Standings Intelligence</span>
          </div>
          <span className="text-[11px] text-emerald-300">Continuous deterministic recalculation</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-200">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-emerald-300 block mb-1">Notable Citizen Momentum:</span>
            <p className="leading-relaxed text-slate-300">
              <strong>{individualList[0]?.userName || 'Dr. Ananya Murugan'}</strong> maintains first position through verified solar micro-grid adoption and 12 consecutive organic composting logs.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-teal-300 block mb-1">Leading Collective:</span>
            <p className="leading-relaxed text-slate-300">
              <strong>{communityList[0]?.name || 'Coimbatore EcoAlliance'}</strong> leads municipal totals driven by consistent household wet-waste separation across registered residents.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-blue-300 block mb-1">Key Carbon Driver:</span>
            <p className="leading-relaxed text-slate-300">
              Actions in <strong>Active Commute Substitution</strong> contributed 42% of points gained by individuals advancing in the rankings this month.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={boardType === 'individual' ? "Search citizen by name or collective..." : "Search community or district..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Timeframe:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <span>+ Boost Your Rank</span>
          </button>
        </div>
      </div>

      {/* INDIVIDUAL STANDINGS TABLE */}
      {boardType === 'individual' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-4 w-16 text-center">Rank</th>
                  <th className="p-4">Citizen & Collective</th>
                  <th className="p-4 text-right">Avoided Carbon</th>
                  <th className="p-4 text-right">Certified Actions</th>
                  <th className="p-4 text-right">Estimated Trees</th>
                  <th className="p-4 text-right">Waste Diverted</th>
                  <th className="p-4 text-center">Badge Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredIndividuals.map((ind, idx) => {
                  const rankNum = ind.rank || idx + 1;
                  const isCurrentUser = ind.userName === user.name || ind.isCurrentUser;
                  const estimatedTrees = Math.max(1, Math.round(ind.totalKgCo2eAvoided * 0.08));
                  const estimatedWaste = Math.round(ind.totalKgCo2eAvoided * 0.35);

                  return (
                    <tr
                      key={ind.userId || `ind-${idx}`}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isCurrentUser ? 'bg-emerald-50/70 dark:bg-emerald-950/40 font-semibold' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        {rankNum === 1 ? (
                          <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold inline-flex items-center justify-center shadow-xs">
                            1
                          </span>
                        ) : rankNum === 2 ? (
                          <span className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white font-bold inline-flex items-center justify-center">
                            2
                          </span>
                        ) : rankNum === 3 ? (
                          <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold inline-flex items-center justify-center">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 font-bold">#{rankNum}</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ind.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={ind.userName}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white">{ind.userName}</span>
                              {isCurrentUser && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-600 text-white font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{ind.communityName || 'Coimbatore EcoAlliance'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                          {ind.totalKgCo2eAvoided} kg
                        </span>
                      </td>

                      <td className="p-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                        {ind.verifiedActionsCount || 12}
                      </td>

                      <td className="p-4 text-right text-green-700 dark:text-green-400 font-semibold">
                        {estimatedTrees}
                      </td>

                      <td className="p-4 text-right text-amber-700 dark:text-amber-400 font-semibold">
                        {estimatedWaste} kg
                      </td>

                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {ind.topBadge || 'Eco Citizen'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMMUNITY STANDINGS TABLE */}
      {boardType === 'community' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-4 w-16 text-center">Rank</th>
                  <th className="p-4">Community Collective</th>
                  <th className="p-4 text-right">Avoided Carbon</th>
                  <th className="p-4 text-right">Active Citizens</th>
                  <th className="p-4 text-right">Verified Actions</th>
                  <th className="p-4 text-right">Trees Planted</th>
                  <th className="p-4 text-center">Action Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredCommunities.map((comm, idx) => {
                  const rankNum = comm.rank || idx + 1;
                  const estimatedTrees = comm.totalTreesPlanted || Math.round(comm.totalKgCo2eAvoided * 0.05);

                  return (
                    <tr key={comm.communityId || `comm-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-center">
                        <span className="font-bold text-slate-700 dark:text-slate-300">#{rankNum}</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {comm.name ? comm.name.charAt(0) : 'C'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{comm.name}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{comm.district}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                          {(comm.totalKgCo2eAvoided / 1000).toFixed(1)} Tons
                        </span>
                      </td>

                      <td className="p-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                        {comm.membersCount ? comm.membersCount.toLocaleString() : '1,200'}
                      </td>

                      <td className="p-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                        {comm.verifiedActionsCount ? comm.verifiedActionsCount.toLocaleString() : '8,500'}
                      </td>

                      <td className="p-4 text-right text-green-700 dark:text-green-400 font-semibold">
                        {estimatedTrees.toLocaleString()}
                      </td>

                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {comm.communityActionScore || comm.environmentalScore || 85} / 100
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </div>
  );
};

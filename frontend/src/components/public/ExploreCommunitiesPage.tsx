import React, { useState } from 'react';
import {
  Users,
  Search,
  MapPin,
  Trees,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Shield,
  Activity,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const ExploreCommunitiesPage: React.FC = () => {
  const { communities, user, joinCommunity, setActiveTab } = usePlatform();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');

  const filteredCommunities = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'all' || c.state.toLowerCase() === selectedState.toLowerCase();
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Civic Collectives</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Explore Grassroots Communities
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Climate change is a collective problem. Join a verified neighborhood collective to aggregate your personal reductions into meaningful municipal transformation.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, district, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All States</option>
              <option value="tamil nadu">Tamil Nadu</option>
              <option value="karnataka">Karnataka</option>
            </select>
          </div>
        </div>

        {/* Community Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((comm) => {
            const isUserCommunity = user.communityId === comm.id;

            return (
              <div
                key={comm.id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-4 ${
                  isUserCommunity
                    ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl ${comm.avatarColor} text-white flex items-center justify-center font-bold text-base shadow-sm`}>
                        {comm.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{comm.name}</h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          {comm.district}, {comm.state}
                        </span>
                      </div>
                    </div>
                    {isUserCommunity && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 shrink-0">
                        Your Community
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {comm.description}
                  </p>

                  {/* Impact Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Members</span>
                      <span className="font-bold text-slate-800 dark:text-white">{comm.membersCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Verified CO2e Saved</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{(comm.totalKgCo2eAvoided / 1000).toFixed(1)} tons</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Actions Certified</span>
                      <span className="font-bold text-slate-800 dark:text-white">{comm.totalVerifiedActions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Saplings Planted</span>
                      <span className="font-bold text-slate-800 dark:text-white">{comm.totalTreesPlanted.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Score Tiers */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 dark:text-slate-400">Eco Health Score:</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {comm.environmentalScore} / 100
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Citizen Action Index:</span>
                    <span className="font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                      {comm.communityActionScore} / 100 ({comm.trend})
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  {isUserCommunity ? (
                    <button
                      onClick={() => setActiveTab('my_community')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Open Community Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => joinCommunity(comm.id)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-800 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Users className="w-4 h-4" />
                      <span>Join This Community</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

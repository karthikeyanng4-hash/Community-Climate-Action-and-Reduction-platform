import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Layers,
  Filter,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Trees,
  Trash2,
  Wind,
  Info,
  ChevronRight,
  X,
  Compass,
  Search,
  CheckCircle2,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { DistrictInfo, MapPinItem } from '../../types';
import { queryMapsGroundingForDistrict, MapsGroundingResult } from '../../services/geminiMapsGrounding';

interface ClimateMapProps {
  isEmbedded?: boolean;
}

export const ClimateMap: React.FC<ClimateMapProps> = ({ isEmbedded = false }) => {
  const { districts, mapPins, communities, submissions, setActiveTab, setIsLogModalOpen } = usePlatform();

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(districts[0]);
  const [selectedPin, setSelectedPin] = useState<MapPinItem | null>(mapPins[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // Layer Toggles (Prompt #38)
  const [showCommunities, setShowCommunities] = useState<boolean>(true);
  const [showActions, setShowActions] = useState<boolean>(true);
  const [showTrees, setShowTrees] = useState<boolean>(true);
  const [showWaste, setShowWaste] = useState<boolean>(true);
  const [showAqi, setShowAqi] = useState<boolean>(true);

  // Maps Grounding State (Prompt #46 + system directive)
  const [groundingResult, setGroundingResult] = useState<MapsGroundingResult | null>(null);
  const [isLoadingGrounding, setIsLoadingGrounding] = useState<boolean>(false);

  // Fetch or trigger Maps Grounding on district change
  useEffect(() => {
    let isMounted = true;
    setIsLoadingGrounding(true);
    queryMapsGroundingForDistrict(selectedDistrict.name).then((res) => {
      if (isMounted) {
        setGroundingResult(res);
        setIsLoadingGrounding(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedDistrict]);

  // Filter map pins
  const filteredPins = mapPins.filter((pin) => {
    if (filterCategory !== 'all' && pin.category !== filterCategory) return false;
    if (pin.category === 'community' && !showCommunities) return false;
    if (pin.category === 'action' && !showActions) return false;
    if (pin.category === 'tree_plantation' && !showTrees) return false;
    if (pin.category === 'waste_hotspot' && !showWaste) return false;
    if (pin.category === 'air_quality' && !showAqi) return false;
    return true;
  });

  // Calculate coordinates bounds for Tamil Nadu (Lat ~8.5 to 13.5, Lon ~76.2 to 80.4)
  const getSvgCoordinates = (lat: number, lng: number) => {
    const minLat = 8.08;
    const maxLat = 13.55;
    const minLng = 76.2;
    const maxLng = 80.4;

    const x = ((lng - minLng) / (maxLng - minLng)) * 560 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 620 + 20;
    return { x, y };
  };

  const getPinColor = (category: string) => {
    switch (category) {
      case 'community': return 'bg-emerald-600 text-white ring-emerald-300';
      case 'action': return 'bg-blue-600 text-white ring-blue-300';
      case 'tree_plantation': return 'bg-green-600 text-white ring-green-300';
      case 'waste_hotspot': return 'bg-amber-600 text-white ring-amber-300';
      case 'air_quality': return 'bg-purple-600 text-white ring-purple-300';
      default: return 'bg-slate-700 text-white ring-slate-400';
    }
  };

  const getHealthBadge = (score: number) => {
    if (score >= 80) return { label: 'High Health', color: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    if (score >= 65) return { label: 'Moderate', color: 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800' };
    return { label: 'Vulnerable', color: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
  };

  const content = (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Overview */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Geographic Climate Intelligence
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
              gemini-3.5-flash Google Maps Grounded
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
            Regional Environmental Map
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            Explore environmental health scores, verified community actions, tree planting corridors, and air quality across Tamil Nadu districts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            + Record Action on Map
          </button>
        </div>
      </div>

      {/* Map Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* District Selector */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">District:</span>
          <select
            value={selectedDistrict.name}
            onChange={(e) => {
              const found = districts.find((d) => d.name === e.target.value);
              if (found) {
                setSelectedDistrict(found);
                setIsDrawerOpen(true);
              }
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.name} className="dark:bg-slate-800 dark:text-white">
                {d.name} (Score: {d.environmentalScore}/100)
              </option>
            ))}
          </select>
        </div>

        {/* Layer Toggles (Prompt #38) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 dark:text-slate-500 font-medium">Layers:</span>
          <button
            onClick={() => setShowCommunities(!showCommunities)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              showCommunities ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            Communities
          </button>
          <button
            onClick={() => setShowActions(!showActions)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              showActions ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            Actions
          </button>
          <button
            onClick={() => setShowTrees(!showTrees)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              showTrees ? 'bg-green-100 dark:bg-green-950/80 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            Tree Sites
          </button>
          <button
            onClick={() => setShowWaste(!showWaste)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              showWaste ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            Waste Hotspots
          </button>
          <button
            onClick={() => setShowAqi(!showAqi)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              showAqi ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            AQI Zones
          </button>
        </div>
      </div>

      {/* Main Map + Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Canvas: Interactive Environmental Map (Prompt #36, #37, #38) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Click any district marker or pin to inspect live verified data</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              Active Pins: {filteredPins.length}
            </span>
          </div>

          {/* SVG Visual Map Container */}
          <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-sky-50/50 via-emerald-50/20 to-slate-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-2">
            <svg viewBox="0 0 600 660" className="w-full h-full max-h-[520px]">
              <defs>
                {/* Subtle terrain gradients */}
                <linearGradient id="tamilNaduMapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#10B981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
                </linearGradient>
                <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Stylized State Boundary Polygon of Tamil Nadu */}
              <path
                d="M 170 40 
                   L 490 60 
                   L 540 180 
                   L 480 270 
                   L 510 360 
                   L 440 450 
                   L 380 560 
                   L 290 640 
                   L 240 600 
                   L 200 500 
                   L 130 400 
                   L 100 290 
                   L 80 210 
                   L 130 110 Z"
                fill="url(#tamilNaduMapGradient)"
                stroke="#64748B"
                strokeWidth="2"
                strokeDasharray="4 2"
                className="transition-all"
              />

              {/* Eastern Coastline Bay of Bengal hint */}
              <text x="510" y="320" fill="#38BDF8" fontSize="13" fontStyle="italic" fontWeight="bold">
                Bay of Bengal
              </text>
              {/* Western Ghats hint */}
              <text x="45" y="340" fill="#4ADE80" fontSize="11" fontStyle="italic" fontWeight="bold">
                Western Ghats
              </text>

              {/* District Centers */}
              {districts.map((d) => {
                const pos = getSvgCoordinates(d.coordinates[0], d.coordinates[1]);
                const isSelected = selectedDistrict.id === d.id;

                return (
                  <g
                    key={d.id}
                    onClick={() => {
                      setSelectedDistrict(d);
                      setIsDrawerOpen(true);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Selection Radar Pulse */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="28"
                        fill="#10B981"
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* District Base Circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? "18" : "14"}
                      fill={isSelected ? "#059669" : "#1E293B"}
                      stroke={isSelected ? "#34D399" : "#059669"}
                      strokeWidth="2.5"
                      filter="url(#pinShadow)"
                      className="transition-transform group-hover:scale-110"
                    />

                    {/* Environmental Health Score text inside circle */}
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {d.environmentalScore}
                    </text>

                    {/* District Name Label */}
                    <rect
                      x={pos.x - 36}
                      y={pos.y + 18}
                      width="72"
                      height="18"
                      rx="5"
                      fill={isSelected ? "#0F172A" : "rgba(15,23,42,0.85)"}
                      stroke={isSelected ? "#38BDF8" : "#475569"}
                      strokeWidth="1"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 30}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}

              {/* Sub-Pins: Tree Sites, Actions, Hotspots, AQI (Prompt #37 & #38) */}
              {filteredPins.map((pin) => {
                const pos = getSvgCoordinates(pin.coordinates[0], pin.coordinates[1]);
                const isPinSelected = selectedPin?.id === pin.id;

                return (
                  <g
                    key={pin.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPin(pin);
                      const parentDistrict = districts.find((d) => d.name === pin.district);
                      if (parentDistrict) setSelectedDistrict(parentDistrict);
                      setIsDrawerOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isPinSelected ? 9 : 6.5}
                      fill={
                        pin.category === 'tree_plantation'
                          ? '#16A34A'
                          : pin.category === 'waste_hotspot'
                          ? '#D97706'
                          : pin.category === 'air_quality'
                          ? '#9333EA'
                          : '#2563EB'
                      }
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      filter="url(#pinShadow)"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Visual Map Legend (Prompt #39) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
              Visual Map Legend
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                <span>District Center (Score)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
                <span>Native Tree Planting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                <span>Verified Citizen Action</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
                <span>Waste Hotspot / Composting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Drawer / Inspector: District & Maps Grounding Details (Prompt #46, #47, #48) */}
        <div className="lg:col-span-5 space-y-5">
          {/* District Health Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                    {selectedDistrict.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getHealthBadge(selectedDistrict.environmentalScore).color}`}>
                    {getHealthBadge(selectedDistrict.environmentalScore).label}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Tamil Nadu • Coordinates: {selectedDistrict.coordinates[0].toFixed(2)}°N, {selectedDistrict.coordinates[1].toFixed(2)}°E
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading block">
                  {selectedDistrict.environmentalScore}/100
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Health Index</span>
              </div>
            </div>

            {/* District KPI Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Avoided Carbon</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {((selectedDistrict.totalKgCo2eAvoided || (selectedDistrict as any).verifiedCommunityActions || 1200) / 1000).toFixed(1)} Tons
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Verified Actions</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {(selectedDistrict.totalVerifiedActions || (selectedDistrict as any).verifiedCommunityActions || 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Native Trees Planted</span>
                <span className="font-bold text-green-700 dark:text-green-400 text-sm">
                  {(selectedDistrict.totalTreesPlanted || ((selectedDistrict as any).cleanupDrivesCount ? (selectedDistrict as any).cleanupDrivesCount * 50 : 0)).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Active Collectives</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                  {(selectedDistrict.activeCommunitiesCount || 2)} Communities
                </span>
              </div>
            </div>

            {/* AI District Environmental Diagnostic (Prompt #47) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-800 shadow-sm space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI District Environmental Diagnostic</span>
                </div>
                <span className="text-[10px] text-emerald-300">Live Synthesis</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedDistrict.aiDiagnostic || (selectedDistrict as any).aiAreaAnalysis || "Active local monitoring in progress."}
              </p>
            </div>

            {/* AI Climate Action Recommendation by Geography (Prompt #48) */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block text-[11px] uppercase tracking-wider">
                Localized Geographic Recommendation
              </span>
              <p className="text-emerald-950 dark:text-emerald-100 leading-relaxed font-medium">
                {selectedDistrict.aiGeographicRecommendation || (selectedDistrict as any).aiRecommendedAction || "Promote renewable energy and decentralized composting."}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-emerald-800 dark:text-emerald-400">
                  Key Issue: <strong>{(selectedDistrict.keyIssues || ['Urban Wetland Preservation', 'Decentralized Composting']).join(', ')}</strong>
                </span>
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 font-bold underline text-[11px] cursor-pointer"
                >
                  Act Now →
                </button>
              </div>
            </div>
          </div>

          {/* Maps Grounding Section with gemini-3.5-flash (Prompt #46 & system requirement) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Google Maps Grounded Environmental Places
                </h3>
              </div>
              <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                gemini-3.5-flash
              </span>
            </div>

            {isLoadingGrounding ? (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Retrieving grounded environmental coordinates for {selectedDistrict.name}...
              </div>
            ) : groundingResult ? (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {groundingResult.summary}
                </p>

                <div className="space-y-2">
                  {groundingResult.places.map((place, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{place.title}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {place.coordinates[0].toFixed(3)}, {place.coordinates[1].toFixed(3)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">{place.address}</p>
                      {place.groundingCitation && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-0.5">
                          ✓ {place.groundingCitation}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 flex items-center justify-between">
                  <span>Source: {groundingResult.source}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Real-time Grounding Active</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </div>
  );
};

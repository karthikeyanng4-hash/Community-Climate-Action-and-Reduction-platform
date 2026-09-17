import React, { useState } from 'react';
import {
  Bike,
  Zap,
  Wind,
  Trash2,
  ShoppingBag,
  Droplets,
  Trees,
  Apple,
  RefreshCw,
  Cpu,
  Users,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Sparkles,
  Scale,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { ACTION_CATEGORIES } from '../../data/mockData';
import { ActionCategoryType, ActionItem } from '../../types';

interface ClimateActionsCatalogProps {
  isEmbedded?: boolean;
}

export const ClimateActionsCatalog: React.FC<ClimateActionsCatalogProps> = ({ isEmbedded = false }) => {
  const { setIsLogModalOpen, setPreselectedActionId } = usePlatform();

  // Prompt #27 Strict Rule:
  // "When one category is opened: Only that category's content should be visible. Other categories must remain collapsed."
  const [openCategoryId, setOpenCategoryId] = useState<ActionCategoryType | null>('transport');

  const handleToggleCategory = (catId: ActionCategoryType) => {
    // If clicking currently open category, close it; otherwise open ONLY the clicked one
    setOpenCategoryId(openCategoryId === catId ? null : catId);
  };

  const handleLogClick = (actionId: string) => {
    setPreselectedActionId(actionId);
    setIsLogModalOpen(true);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bike': return <Bike className="w-5 h-5 text-emerald-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Wind': return <Wind className="w-5 h-5 text-blue-500" />;
      case 'Trash2': return <Trash2 className="w-5 h-5 text-stone-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-teal-600" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-cyan-500" />;
      case 'Trees': return <Trees className="w-5 h-5 text-green-600" />;
      case 'Apple': return <Apple className="w-5 h-5 text-rose-500" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-indigo-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-violet-600" />;
      case 'Users': return <Users className="w-5 h-5 text-purple-600" />;
      default: return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
  };

  // Collect all AI-recommended actions
  const recommendedActions: { categoryName: string; action: ActionItem }[] = [];
  ACTION_CATEGORIES.forEach((cat) => {
    cat.actions.forEach((act) => {
      if (act.isAiRecommended) {
        recommendedActions.push({ categoryName: cat.name, action: act });
      }
    });
  });

  const content = (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Practical Climate Action Catalog</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Select & Record Climate Actions
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Browse verified categories of carbon-mitigating lifestyle actions. Every action adheres to documented emission factors and can be logged with verifiable evidence for community certification.
        </p>
      </div>

      {/* AI Personalized Recommendations Section (Prompt #29) - Harmonized with overall theme */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Recommended for You</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Tailored to your commute habits & Coimbatore seasonal profile
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedActions.map(({ categoryName, action }) => (
            <div
              key={action.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between space-y-3 text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                    {categoryName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                    +{action.factorKgCo2e} kg/unit
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{action.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{action.description}</p>
                {action.recommendedReason && (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
                    💡 <strong>Why Recommended:</strong> {action.recommendedReason}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleLogClick(action.id)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Record This Action</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 11 Accordion Categories (Prompt #27 & #28) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
            All Action Categories (11)
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Strict single-view accordion (opening one collapses others)
          </span>
        </div>

        {ACTION_CATEGORIES.map((cat) => {
          const isOpen = openCategoryId === cat.id;

          return (
            <div
              key={cat.id}
              className={`rounded-2xl border transition-all overflow-hidden bg-white dark:bg-slate-900 ${
                isOpen
                  ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Category Header Bar */}
              <button
                onClick={() => handleToggleCategory(cat.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{cat.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{cat.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                    {cat.actions.length} {cat.actions.length === 1 ? 'Action' : 'Actions'}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Expanded Action List (Visible ONLY when this category is open) */}
              {isOpen && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {cat.actions.map((act) => (
                      <div
                        key={act.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{act.title}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 shrink-0">
                              {act.factorKgCo2e} kg CO2e / {act.unit}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{act.description}</p>

                          {/* Transparent Methodology & Evidence Note */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-[11px]">
                            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                              <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Methodology Standard:</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 leading-snug">{act.methodologyNote}</p>
                            <div className="pt-1 text-slate-700 dark:text-slate-300">
                              <strong>Evidence Requirement:</strong> {act.evidenceRequirement}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">Unit: {act.unit}</span>
                          <button
                            onClick={() => handleLogClick(act.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Record Action</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </div>
  );
};


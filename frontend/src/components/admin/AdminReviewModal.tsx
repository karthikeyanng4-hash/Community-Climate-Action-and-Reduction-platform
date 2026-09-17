import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileQuestion,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  X,
  Scale,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const AdminReviewModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    submissions,
    verifySubmission,
    currentCommunity,
  } = usePlatform();

  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  if (!isAdminModalOpen) return null;

  const pendingSubmissions = submissions.filter(
    (s) => s.verificationStatus === 'pending' || s.verificationStatus === 'needs_more_evidence'
  );

  const activeSub =
    submissions.find((s) => s.id === selectedSubId) || pendingSubmissions[0] || submissions[0];

  const handleApprove = (id: string) => {
    verifySubmission(id, 'verified');
    alert('Submission certified! Impact points added to community and district ledger.');
  };

  const handleReject = (id: string) => {
    verifySubmission(id, 'flagged');
    alert('Submission flagged as unverified.');
  };

  const handleRequestEvidence = (id: string) => {
    verifySubmission(id, 'needs_more_evidence');
    alert('Evidence request notification dispatched to user.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)] md:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-sm text-white">
                Community Administrator Audit Portal
              </h3>
              <span className="text-[10px] text-slate-400">
                Human-in-the-Loop Safety Oversight • {currentCommunity.name}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs overscroll-contain">
          {/* Left Column: List of Submissions */}
          <div className="md:col-span-5 border-r border-slate-100 dark:border-slate-800 pr-0 md:pr-4 space-y-3">
            <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px]">
              Submissions Requiring Oversight ({pendingSubmissions.length})
            </span>

            {pendingSubmissions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <p className="font-semibold">All submissions verified</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">No pending verification bottlenecks.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {pendingSubmissions.map((sub) => {
                  const isSelected = activeSub?.id === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{sub.actionTitle}</span>
                        <span className="text-emerald-700 dark:text-emerald-400">+{sub.calculatedKgCo2e} kg</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{sub.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                        <span>By: {sub.userName}</span>
                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                          AI: {sub.aiConfidenceScore}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Evidence Inspector */}
          {activeSub ? (
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                    Audit Target: {activeSub.actionTitle}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1">
                    Submitted by {activeSub.userName}
                  </h4>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {activeSub.date} • {activeSub.location}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 block">
                    +{activeSub.calculatedKgCo2e} kg CO2e
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Claimed Reduction</span>
                </div>
              </div>

              {/* Photo Evidence Preview */}
              {activeSub.photoUrl ? (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-52 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={activeSub.photoUrl}
                    alt="Evidence"
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl text-center text-slate-500 dark:text-slate-400">
                  No photographic artifact provided
                </div>
              )}

              {/* AI Diagnostic Screening */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    AI Vision & Physical Anomaly Score:
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{activeSub.aiConfidenceScore}% Confidence</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {activeSub.aiAnalysisReasoning}
                </p>
                {activeSub.anomalyFlags && activeSub.anomalyFlags.length > 0 && (
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[10px]">
                    ⚠️ Detected Anomalies: {activeSub.anomalyFlags.join('; ')}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  Factor: {activeSub.factorReference}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleApprove(activeSub.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Certify Action</span>
                </button>
                <button
                  onClick={() => handleRequestEvidence(activeSub.id)}
                  className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <FileQuestion className="w-4 h-4" />
                  <span>Request More Proof</span>
                </button>
                <button
                  onClick={() => handleReject(activeSub.id)}
                  className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Flag Suspicious</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

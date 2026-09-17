import React, { useState } from 'react';
import { X, Share2, Copy, Check, Leaf, ShieldCheck, Download, Award } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const ShareModal: React.FC = () => {
  const { shareModalData, setShareModalData, user } = usePlatform();
  const [isCopied, setIsCopied] = useState(false);

  if (!shareModalData) return null;

  const shareText = `I contributed to my community's climate action! Verified ${shareModalData.metric} on EcoCommunity with ${shareModalData.community}. #ClimateAction #TamilNaduGreen`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-xs">
            <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Share Climate Achievement</span>
          </div>
          <button
            onClick={() => setShareModalData(null)}
            className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Card Visual (Prompt #26) */}
        <div className="p-6 space-y-5">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-800 shadow-xl space-y-4 text-center relative overflow-hidden">
            {/* Background glowing ring */}
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold tracking-tight text-white text-sm">
                EcoCommunity
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                Verified Climate Contribution
              </span>
              <p className="text-base font-extrabold font-heading text-white">
                “I contributed to my community's climate action.”
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border border-white/15 dark:border-slate-700 space-y-1">
              <span className="text-2xl font-extrabold font-heading text-emerald-400 block">
                {shareModalData.metric}
              </span>
              <span className="text-xs text-white font-bold block">{shareModalData.title}</span>
              <span className="text-[10px] text-slate-300 block">
                Achieved by <strong>{user.name}</strong>
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10 dark:border-slate-800">
              <span>{shareModalData.community}</span>
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Certified</span>
              </div>
              <span>{shareModalData.date}</span>
            </div>
          </div>

          {/* Share Action Buttons */}
          <div className="space-y-2 text-xs">
            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Achievement Summary Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Achievement to Clipboard</span>
                </>
              )}
            </button>
            <button
              onClick={() => alert('Card image generated for download.')}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Graphic Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  Camera,
  ArrowRight,
  Trophy,
  Target,
  AlertCircle,
  Loader2,
  XCircle,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { ACTION_CATEGORIES } from '../../data/mockData';
import { ActionItem, Challenge } from '../../types';
import { calculateDeterministicImpact } from '../../services/emissionFactors';
import { api } from '../../services/api';
import {
  simulateAiEvidenceAnalysis,
  verifyChallengeImageRelevance,
  inspectImageVisuals,
  analyzeImageWithGeminiVision,
  ChallengeImageRelevanceResult,
} from '../../services/aiSimulations';

// Preset sample evidence images for testing matching and mismatching cases
const EVIDENCE_SAMPLES = [
  {
    id: 'sample_bike',
    label: '🚴 Bicycle Commute',
    category: 'transport',
    actionId: 'cycle_commute',
    challengeId: 'chall_01',
    fileName: 'cycle_commute_corridor.jpg',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    desc: 'Morning bicycle commute along Avinashi road corridor displacing petrol two-wheeler trip.',
    suggestedQuantity: 8,
  },
  {
    id: 'sample_tree',
    label: '🌱 Tree Sapling',
    category: 'tree_green',
    actionId: 'tree_planted',
    challengeId: 'chall_02',
    fileName: 'neem_sapling_lake.jpg',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    desc: 'Planted native neem sapling with bamboo guard and soil mulching at lake perimeter.',
    suggestedQuantity: 1,
  },
  {
    id: 'sample_bag',
    label: '🛍️ Manjapai Cloth Bag',
    category: 'plastic_reduction',
    actionId: 'plastic_bag_avoided',
    challengeId: 'chall_03',
    fileName: 'manjapai_cloth_carrier.jpg',
    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
    desc: 'Weekly provisions shopping carried inside traditional yellow Manjapai cloth bag.',
    suggestedQuantity: 5,
  },
  {
    id: 'sample_ac',
    label: '❄️ AC Remote 24°C',
    category: 'air_conditioning',
    actionId: 'ac_temp_24c',
    challengeId: 'chall_04',
    fileName: 'ac_remote_25c_display.jpg',
    url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
    desc: 'Thermostat locked at 25°C throughout night operation with ceiling fan circulation.',
    suggestedQuantity: 8,
  },
  {
    id: 'sample_compost',
    label: '🥗 Kitchen Compost',
    category: 'food',
    actionId: 'diverted_compost',
    challengeId: 'chall_05',
    fileName: 'kitchen_compost_batch.jpg',
    url: 'https://images.unsplash.com/photo-1591955506264-3f5a6834570a?w=600&auto=format&fit=crop&q=80',
    desc: 'Decentralized aerobic compost bin with kitchen vegetable scraps and dry leaves.',
    suggestedQuantity: 2,
  },
  {
    id: 'sample_mismatch',
    label: '❌ Mismatch / Couch Photo',
    category: 'unrelated',
    actionId: 'cycle_commute',
    challengeId: 'chall_01',
    fileName: 'living_room_furniture.jpg',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    desc: 'Indoor photo of living room sofa (irrelevant evidence for transport/tree challenges).',
    suggestedQuantity: 1,
  },
];

export const RecordActionModal: React.FC = () => {
  const {
    isLogModalOpen,
    setIsLogModalOpen,
    preselectedActionId,
    setPreselectedActionId,
    preselectedChallengeId,
    setPreselectedChallengeId,
    challenges,
    addSubmission,
    user,
    isAuthenticated,
  } = usePlatform();

  // Find flattened list of all actions
  const allActions: ActionItem[] = useMemo(() => {
    const list: ActionItem[] = [];
    ACTION_CATEGORIES.forEach((c) => list.push(...c.actions));
    return list;
  }, []);

  // Form Fields - All initially empty by default
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');
  const [selectedActionId, setSelectedActionId] = useState<string>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [date, setDate] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [isUserUploaded, setIsUserUploaded] = useState<boolean>(false);

  // AI Vision Analysis Lifecycle states
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [analyzedEvidence, setAnalyzedEvidence] = useState<(ChallengeImageRelevanceResult & { suggestedQuantity?: number; suggestedActionId?: string }) | null>(null);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize modal state on open: clear all fields or respect preselection
  useEffect(() => {
    if (!isLogModalOpen) return;

    setSelectedChallengeId(preselectedChallengeId || '');
    setSelectedActionId(preselectedActionId || '');
    setQuantity('');
    setDate('');
    setLocation('');
    setDescription('');
    setPhotoPreview(null);
    setPhotoBase64(null);
    setIsUserUploaded(false);
    setPhotoFileName('');
    setIsAnalyzingImage(false);
    setAnalyzedEvidence(null);
    setHasAttemptedSubmit(false);
    setSubmitError(null);
  }, [isLogModalOpen, preselectedActionId, preselectedChallengeId]);

  const currentChallenge: Challenge | undefined = useMemo(() => {
    return challenges.find((c) => c.id === selectedChallengeId);
  }, [challenges, selectedChallengeId]);

  const currentAction: ActionItem | undefined = useMemo(() => {
    return allActions.find((a) => a.id === selectedActionId);
  }, [allActions, selectedActionId]);

  // Trigger active AI Vision analysis using local Gemma 3 Vision
  const triggerAiAnalysis = async (
    url: string,
    fileName: string,
    targetChallengeId: string,
    targetActionId: string,
    currentDesc: string,
    b64Data?: string | null,
    mimeType?: string,
    userUploaded: boolean = isUserUploaded
  ) => {
    if (!url) return;
    setIsAnalyzingImage(true);
    setSubmitError(null);

    const ch = challenges.find((c) => c.id === targetChallengeId);
    const act = allActions.find((a) => a.id === targetActionId);
    const activityToVerify = act?.title || ch?.title || 'Cycling';

    let res: (ChallengeImageRelevanceResult & { suggestedQuantity?: number; suggestedActionId?: string }) | null = null;

    // 1. Prepare base64 image data
    let base64ToUse = b64Data ?? photoBase64;
    if (!base64ToUse && url.startsWith('http')) {
      try {
        const fetchRes = await fetch(url);
        const blob = await fetchRes.blob();
        base64ToUse = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            resolve(dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl);
          };
          reader.onerror = () => resolve('');
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn('Sample image fetch error:', err);
      }
    }

    // 2. Call FastAPI backend powered by Ollama Gemma 3 Vision
    if (base64ToUse) {
      try {
        const valRes = await api.validateImageEvidence({
          image: base64ToUse,
          activity: activityToVerify,
          description: currentDesc,
        });

        if (valRes) {
          const isAccepted = Boolean(valRes.accepted && valRes.relevant);
          res = {
            isRelevant: isAccepted,
            relevanceScore: Math.round(valRes.confidence * 100),
            detectedSubject: valRes.relevant
              ? `Gemma 3 Vision Verified: ${valRes.activity}`
              : `Gemma 3 Vision Rejected: Incompatible Evidence`,
            requiredEvidenceDescription: `Clear visual proof of ${activityToVerify}.`,
            reasoning: valRes.reason,
            anomalyWarning: !isAccepted ? valRes.reason : undefined,
          };
        }
      } catch (err) {
        console.warn('Backend Gemma 3 Vision validation error, falling back to local verification:', err);
      }
    }

    // 3. Authoritative local fallback if backend is unreachable
    if (!res) {
      const visualProfile = await inspectImageVisuals(url);
      await new Promise((resolve) => setTimeout(resolve, 300));
      res = verifyChallengeImageRelevance({
        challengeId: targetChallengeId || undefined,
        challengeTitle: ch?.title || (targetChallengeId ? 'Selected Challenge' : 'No Challenge Selected'),
        challengeCategory: ch?.category || 'transport',
        actionId: targetActionId || undefined,
        actionTitle: act?.title || undefined,
        photoName: fileName,
        photoUrl: url,
        description: currentDesc,
        visualProfile,
        isUserUploaded: userUploaded,
      });
    }

    setAnalyzedEvidence(res);
    setIsAnalyzingImage(false);

    // If valid and user hasn't selected an action yet, select suggested action
    if (res.isRelevant && res.suggestedActionId && !targetActionId) {
      setSelectedActionId(res.suggestedActionId);
    }

    // If valid and quantity was empty, offer suggested quantity
    if (res.isRelevant && res.suggestedQuantity && (quantity === '' || quantity === 0)) {
      setQuantity(res.suggestedQuantity);
    }
  };

  // When challenge changes, re-run AI image analysis if a photo is attached
  const handleChallengeChange = (newChallengeId: string) => {
    setSelectedChallengeId(newChallengeId);
    setSubmitError(null);

    if (photoPreview) {
      triggerAiAnalysis(
        photoPreview,
        photoFileName,
        newChallengeId,
        selectedActionId,
        description,
        photoBase64,
        undefined,
        isUserUploaded
      );
    }
  };

  // When user uploads an image from disk/camera
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setPhotoFileName(file.name);
      setIsUserUploaded(true);
      setSubmitError(null);

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const b64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
        setPhotoBase64(b64);
        triggerAiAnalysis(
          url,
          file.name,
          selectedChallengeId,
          selectedActionId,
          description,
          b64,
          file.type,
          true
        );
      };
      reader.onerror = () => {
        triggerAiAnalysis(
          url,
          file.name,
          selectedChallengeId,
          selectedActionId,
          description,
          null,
          undefined,
          true
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // When user clicks one of the test evidence samples
  const handleSelectSample = (sample: typeof EVIDENCE_SAMPLES[0]) => {
    setPhotoPreview(sample.url);
    setPhotoBase64(null);
    setIsUserUploaded(false);
    setPhotoFileName(sample.fileName);
    setDescription(sample.desc);
    setSubmitError(null);

    let actToUse = selectedActionId;
    if (!selectedActionId && sample.actionId) {
      setSelectedActionId(sample.actionId);
      actToUse = sample.actionId;
    }

    triggerAiAnalysis(
      sample.url,
      sample.fileName,
      selectedChallengeId,
      actToUse,
      sample.desc,
      null,
      undefined,
      false
    );
  };

  // Clear or remove current photo
  const handleClearPhoto = () => {
    setPhotoPreview(null);
    setPhotoBase64(null);
    setIsUserUploaded(false);
    setPhotoFileName('');
    setAnalyzedEvidence(null);
    setIsAnalyzingImage(false);
    setSubmitError(null);
  };

  // Real-time image relevance status
  const imageRelevance: ChallengeImageRelevanceResult = useMemo(() => {
    if (analyzedEvidence) {
      return analyzedEvidence;
    }

    if (!photoPreview) {
      return {
        isRelevant: false,
        relevanceScore: 0,
        detectedSubject: 'No Photo Attached',
        requiredEvidenceDescription: currentChallenge
          ? `Visual proof matching "${currentChallenge.title}"`
          : 'Please select a challenge to view required criteria.',
        reasoning: 'Visual photo evidence artifact is strictly mandatory to prevent fraudulent claims.',
      };
    }

    return {
      isRelevant: false,
      relevanceScore: 0,
      detectedSubject: 'Analyzing with AI Vision...',
      requiredEvidenceDescription: 'AI inspection in progress.',
      reasoning: 'Scanning image pixels and challenge relevance...',
    };
  }, [analyzedEvidence, photoPreview, currentChallenge]);

  // Deterministic Impact calculation strictly tied to verified picture & action
  const impactTrace = useMemo(() => {
    const q = typeof quantity === 'number' ? quantity : 0;

    // If no action or invalid quantity or evidence is rejected by AI, no carbon offset is awarded
    if (!currentAction || q <= 0 || (analyzedEvidence && !analyzedEvidence.isRelevant)) {
      return {
        inputQuantity: q,
        inputUnit: currentAction?.unit || 'units',
        factorValue: currentAction?.factorKgCo2e || 0,
        factorUnit: `kg CO2e / ${currentAction?.unit || 'unit'}`,
        calculatedKgCo2e: 0,
        secondaryMetric: undefined,
        methodologySource: 'CEA India CO2 Baseline Database v19 & IPCC AR6',
        version: 'v19.0 / 2024',
        formula: !currentAction
          ? 'Select action to calculate carbon avoidance'
          : analyzedEvidence && !analyzedEvidence.isRelevant
          ? '0.00 kg CO2e (Rejected: Incompatible Evidence)'
          : `0.0 ${currentAction.unit} × ${currentAction.factorKgCo2e} kg CO2e/${currentAction.unit} = 0.00 kg CO2e`,
      };
    }

    return calculateDeterministicImpact(currentAction.id, q);
  }, [currentAction, quantity, analyzedEvidence]);

  // Validation rules for all fields
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!selectedChallengeId) {
      errors.challenge = 'Active challenge is required. Please select the challenge you are undergoing.';
    }
    if (!selectedActionId) {
      errors.action = 'Action type is required.';
    }
    if (quantity === '' || Number.isNaN(quantity) || Number(quantity) <= 0) {
      errors.quantity = 'Recorded quantity must be greater than 0.';
    }
    if (!date || date.trim() === '') {
      errors.date = 'Date of action is required.';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (date > today) {
        errors.date = 'Date cannot be in the future.';
      }
    }
    if (!location || location.trim().length < 4) {
      errors.location = 'Exact location or neighborhood is required (minimum 4 characters).';
    }
    if (!description || description.trim().length < 10) {
      errors.description = 'Action description must be at least 10 characters detailing your activity.';
    }
    if (!photoPreview) {
      errors.photo = 'Visual photo evidence artifact is strictly mandatory. Submissions without photos cannot be accepted.';
    } else if (isAnalyzingImage) {
      errors.analyzing = 'AI is currently analyzing the image. Please wait...';
    } else if (!imageRelevance.isRelevant) {
      errors.relevance = imageRelevance.anomalyWarning || `Uploaded photo does not match "${currentChallenge?.title}".`;
    }

    return errors;
  }, [
    selectedChallengeId,
    selectedActionId,
    quantity,
    date,
    location,
    description,
    photoPreview,
    isAnalyzingImage,
    imageRelevance,
    currentChallenge,
  ]);

  const isFormValid = Object.keys(validationErrors).length === 0 && !isAnalyzingImage && imageRelevance.isRelevant;

  const handleClose = () => {
    setIsLogModalOpen(false);
    setPreselectedActionId(null);
    setPreselectedChallengeId(null);
  };

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLogModalOpen) {
        handleClose();
      }
    };
    if (isLogModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLogModalOpen]);

  if (!isLogModalOpen || !isAuthenticated) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormValid || !currentAction) {
      const firstError = Object.values(validationErrors)[0];
      setSubmitError(firstError || 'Please provide all required details and verify evidence.');
      return;
    }

    const numQty = Number(quantity);

    // Run authoritative verification engine
    const result = simulateAiEvidenceAnalysis(
      currentAction.id,
      numQty,
      description,
      location,
      Boolean(photoPreview),
      photoFileName,
      currentChallenge?.id,
      currentChallenge?.title,
      currentChallenge?.category,
      photoPreview || undefined,
      isUserUploaded
    );

    // Strict block if evidence is irrelevant or wrong
    if (!imageRelevance.isRelevant) {
      setSubmitError(
        `Submission Rejected: Evidence photo does not match "${currentChallenge?.title}". Please provide relevant evidence.`
      );
      return;
    }

    const category =
      ACTION_CATEGORIES.find((c) => c.actions.some((a) => a.id === currentAction.id))?.id ||
      'transport';

    addSubmission({
      userId: user.id,
      userName: user.name,
      actionId: currentAction.id,
      actionTitle: currentAction.title,
      categoryId: category,
      challengeId: currentChallenge?.id,
      date,
      quantity: numQty,
      unit: currentAction.unit,
      location,
      district: user.district,
      description,
      photoUrl: photoPreview || undefined,
      verificationStatus: result.status,
      aiConfidenceScore: result.confidenceScore,
      aiAnalysisReasoning: result.reasoning,
      anomalyFlags: result.anomalyFlags,
      calculatedKgCo2e: impactTrace.calculatedKgCo2e,
      secondaryImpact: impactTrace.secondaryMetric,
      factorReference: `${impactTrace.methodologySource} (${impactTrace.version})`,
      isContributedToCommunity: result.status === 'verified',
    });

    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)] md:max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-modal-title"
      >
        {/* Modal Header */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-slate-50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <span>Verified Climate Action Registry</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
              <h3 id="record-modal-title" className="text-sm sm:text-base md:text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
                Record Action & Verify Evidence
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 text-xs overscroll-contain">
            {/* Incomplete or Mismatched Submission Error Banner */}
            {hasAttemptedSubmit && !isFormValid && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Cannot Accept Record — Incomplete or Mismatched Details:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-800 dark:text-rose-300">
                    {validationErrors.challenge && <li>{validationErrors.challenge}</li>}
                    {validationErrors.action && <li>{validationErrors.action}</li>}
                    {validationErrors.quantity && <li>{validationErrors.quantity}</li>}
                    {validationErrors.date && <li>{validationErrors.date}</li>}
                    {validationErrors.location && <li>{validationErrors.location}</li>}
                    {validationErrors.description && <li>{validationErrors.description}</li>}
                    {validationErrors.photo && <li>{validationErrors.photo}</li>}
                    {validationErrors.analyzing && <li>{validationErrors.analyzing}</li>}
                    {validationErrors.relevance && <li>{validationErrors.relevance}</li>}
                  </ul>
                </div>
              </div>
            )}

            {submitError && !hasAttemptedSubmit && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* SECTION 1: CHALLENGE SELECTION */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                  <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Challenge You Are Undergoing</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                {currentChallenge ? (
                  currentChallenge.isJoined ? (
                    <span className="w-fit px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      Joined Challenge
                    </span>
                  ) : (
                    <span className="w-fit px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Enrolling with Submission
                    </span>
                  )
                ) : (
                  <span className="w-fit px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Select a challenge to link
                  </span>
                )}
              </div>

              <select
                id="record-challenge-select"
                value={selectedChallengeId}
                onChange={(e) => handleChallengeChange(e.target.value)}
                className={`w-full px-3 py-2.5 bg-white dark:bg-slate-900 border rounded-xl font-semibold focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm ${
                  !selectedChallengeId ? 'text-slate-400' : 'text-slate-800 dark:text-white'
                } ${
                  hasAttemptedSubmit && validationErrors.challenge
                    ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/30'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                <option value="">-- Select Challenge You Are Undergoing --</option>
                {challenges.map((ch) => (
                  <option key={ch.id} value={ch.id} className="text-slate-800 dark:text-white dark:bg-slate-900">
                    {ch.title} ({ch.category.toUpperCase()} • Target: {ch.targetValue} {ch.unit})
                    {ch.isJoined ? ' [Joined]' : ''}
                  </option>
                ))}
              </select>

              {currentChallenge && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 animate-in fade-in">
                  <span className="line-clamp-1">{currentChallenge.objective}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                    Goal: {currentChallenge.currentValue} / {currentChallenge.targetValue} {currentChallenge.unit}
                  </span>
                </div>
              )}
            </div>

            {/* SECTION 2: ACTION SELECTOR */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Select Climate Action <span className="text-rose-500">*</span>
                </label>
                {currentAction && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Factor: {currentAction.factorKgCo2e} kg CO2e / {currentAction.unit}
                  </span>
                )}
              </div>
              <select
                id="record-action-select"
                value={selectedActionId}
                onChange={(e) => {
                  const newActId = e.target.value;
                  setSelectedActionId(newActId);
                  setSubmitError(null);
                  if (photoPreview) {
                    triggerAiAnalysis(
                      photoPreview,
                      photoFileName,
                      selectedChallengeId,
                      newActId,
                      description,
                      photoBase64,
                      undefined,
                      isUserUploaded
                    );
                  }
                }}
                className={`w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-semibold focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm ${
                  !selectedActionId ? 'text-slate-400' : 'text-slate-800 dark:text-white'
                } ${
                  hasAttemptedSubmit && validationErrors.action
                    ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <option value="">-- Select Climate Action --</option>
                {allActions.map((a) => (
                  <option key={a.id} value={a.id} className="text-slate-800 dark:text-white dark:bg-slate-900">
                    {a.title} ({a.factorKgCo2e} kg CO2e / {a.unit})
                  </option>
                ))}
              </select>
              {hasAttemptedSubmit && validationErrors.action && (
                <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 block font-medium">
                  {validationErrors.action}
                </span>
              )}
            </div>

            {/* SECTION 3: QUANTITY & DATE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span>
                    Recorded Quantity {currentAction ? `(${currentAction.unit})` : ''} <span className="text-rose-500">*</span>
                  </span>
                  {quantity !== '' && currentAction && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {quantity} {currentAction.unit}
                    </span>
                  )}
                </div>
                <input
                  id="record-quantity-input"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setQuantity('');
                    } else {
                      const parsed = parseFloat(val);
                      setQuantity(Number.isNaN(parsed) ? '' : parsed);
                    }
                    setSubmitError(null);
                  }}
                  placeholder={currentAction ? `e.g. 5 (${currentAction.unit})` : 'e.g. 8'}
                  className={`w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm ${
                    hasAttemptedSubmit && validationErrors.quantity
                      ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {hasAttemptedSubmit && validationErrors.quantity && (
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 block font-medium">
                    {validationErrors.quantity}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <label htmlFor="record-date-input">
                    Date of Action <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setDate(new Date().toISOString().split('T')[0])}
                    className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 underline cursor-pointer"
                  >
                    Set to Today
                  </button>
                </div>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="record-date-input"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSubmitError(null);
                    }}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm ${
                      hasAttemptedSubmit && validationErrors.date
                        ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                </div>
                {hasAttemptedSubmit && validationErrors.date && (
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 block font-medium">
                    {validationErrors.date}
                  </span>
                )}
              </div>
            </div>

            {/* SECTION 4: LOCATION */}
            <div>
              <label htmlFor="record-location-input" className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Exact Location / Neighborhood <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="record-location-input"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setSubmitError(null);
                  }}
                  placeholder="e.g. Avinashi Road, Singanallur Lake Bund, RS Puram, Coimbatore"
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm ${
                    hasAttemptedSubmit && validationErrors.location
                      ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {hasAttemptedSubmit && validationErrors.location && (
                <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 block font-medium">
                  {validationErrors.location}
                </span>
              )}
            </div>

            {/* SECTION 5: DESCRIPTION */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="record-description-input" className="block font-bold text-slate-800 dark:text-slate-200">
                  Action Description & Circumstances <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[10px] ${description.trim().length >= 10 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {description.trim().length}/10 chars min
                </span>
              </div>
              <textarea
                id="record-description-input"
                rows={2}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setSubmitError(null);
                }}
                placeholder="Detail your action: route, sapling species, thermostat settings, or group participants..."
                className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm ${
                  hasAttemptedSubmit && validationErrors.description
                    ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {hasAttemptedSubmit && validationErrors.description && (
                <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 block font-medium">
                  {validationErrors.description}
                </span>
              )}
            </div>

            {/* SECTION 6: PHOTO EVIDENCE UPLOAD & AI ANALYSIS */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Photo / GPS Evidence Artifact</span>
                  <span className="text-rose-500 font-bold">* Required</span>
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Must verify: <strong>{currentChallenge?.title || 'Selected Challenge'}</strong>
                </span>
              </div>

              {/* Upload Dropzone / Preview Area */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all text-center relative overflow-hidden ${
                  !photoPreview && hasAttemptedSubmit
                    ? 'border-rose-400 bg-rose-50/25 dark:bg-rose-950/25'
                    : isAnalyzingImage
                    ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/20'
                    : photoPreview && !imageRelevance.isRelevant
                    ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/30'
                    : photoPreview && imageRelevance.isRelevant
                    ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                {!photoPreview && (
                  <input
                    id="record-photo-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                )}

                {/* AI Analyzing Scanner Overlay */}
                {isAnalyzingImage && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white z-20 animate-in fade-in duration-150">
                    <div className="relative">
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                      <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <div className="text-center px-4">
                      <p className="font-bold text-xs">Gemma 3 Vision Inspecting Evidence...</p>
                      <p className="text-[10px] text-slate-300">
                        Analyzing photo pixels, subject features & climate activity proof
                      </p>
                    </div>
                  </div>
                )}

                {photoPreview ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4.5">
                    <div className="relative shrink-0">
                      <img
                        src={photoPreview}
                        alt="Evidence Preview"
                        className={`w-24 h-20 sm:w-28 sm:h-22 rounded-xl object-cover ring-2 shadow-sm ${
                          imageRelevance.isRelevant ? 'ring-emerald-500' : 'ring-rose-500'
                        }`}
                      />
                      <span
                        className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm font-bold ${
                          imageRelevance.isRelevant ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      >
                        {imageRelevance.isRelevant ? '✓' : '✕'}
                      </span>
                    </div>

                    <div className="text-center sm:text-left space-y-1 min-w-0 max-w-sm">
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                            isUserUploaded
                              ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isUserUploaded ? '👤 Your Uploaded Image' : '🧪 Preset Test Sample'}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            imageRelevance.isRelevant ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {imageRelevance.isRelevant ? 'Verified Proof' : 'Mismatch Detected'}
                        </span>
                      </div>

                      <span className="font-bold text-slate-900 dark:text-white block text-xs truncate max-w-[260px] sm:max-w-xs mx-auto sm:mx-0">
                        {photoFileName || 'Evidence Image'}
                      </span>

                      <div className="flex items-center gap-2 pt-0.5 justify-center sm:justify-start">
                        <label
                          htmlFor="record-photo-replace-input"
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          📁 Change Photo
                        </label>
                        <input
                          id="record-photo-replace-input"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={handleClearPhoto}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-1">
                    <UploadCloud className="w-9 h-9 text-emerald-600/70 dark:text-emerald-400/80 mx-auto" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        Drag & drop your evidence photo, or <span className="text-emerald-600 dark:text-emerald-400 underline cursor-pointer">browse files</span>
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Select any image from your computer or phone (JPG, PNG, WEBP)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Test Evidence Samples Switcher */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>Quick Test Samples (Click to test verification rules):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                    Or upload your own image above
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EVIDENCE_SAMPLES.map((s) => {
                    const isMatchingChallenge = s.challengeId === currentChallenge?.id && s.id !== 'sample_mismatch';
                    const isCurrent = !isUserUploaded && photoFileName === s.fileName;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectSample(s)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                            : isMatchingChallenge
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : s.id === 'sample_mismatch'
                            ? 'bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{s.label}</span>
                        {isMatchingChallenge && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PROMINENT AI VISION ANALYSIS RESULT PANEL */}
              {photoPreview && !isAnalyzingImage && (
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-xs space-y-2 animate-in fade-in duration-150 ${
                    imageRelevance.isRelevant
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                      : 'bg-rose-50/95 dark:bg-rose-950/50 border-rose-400 dark:border-rose-800 text-rose-950 dark:text-rose-100 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 font-bold">
                    <div className="flex items-center gap-2">
                      {imageRelevance.isRelevant ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-bold">
                        {imageRelevance.isRelevant
                          ? `✓ Gemma 3 Vision Verified: Authentic Proof Detected`
                          : `❌ Gemma 3 Vision: Evidence Not Accepted`}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                        imageRelevance.isRelevant
                          ? 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                          : 'bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200'
                      }`}
                    >
                      {imageRelevance.isRelevant
                        ? `Gemma 3 Match: ${imageRelevance.relevanceScore}%`
                        : `Rejected (${imageRelevance.relevanceScore}%)`}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold">
                      Detected Visual Subject:{' '}
                      <span
                        className={`font-bold ${
                          imageRelevance.isRelevant ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {imageRelevance.detectedSubject}
                      </span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      {imageRelevance.reasoning}
                    </p>
                  </div>

                  {!imageRelevance.isRelevant ? (
                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-[11px] text-rose-900 dark:text-rose-200 space-y-1">
                      <p>
                        <strong>Required Evidence for {currentChallenge?.title || 'this challenge'}:</strong>{' '}
                        {imageRelevance.requiredEvidenceDescription}
                      </p>
                      <p className="text-rose-700 dark:text-rose-400 font-bold">
                        ⚠️ The system cannot accept this action record until you upload an image relevant to this challenge.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                      <span>✓ Evidence matches challenge criteria and verified factors.</span>
                      {imageRelevance.suggestedQuantity && quantity === '' && (
                        <button
                          type="button"
                          onClick={() => setQuantity(imageRelevance.suggestedQuantity || '')}
                          className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
                        >
                          Apply Detected Qty: {imageRelevance.suggestedQuantity}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ACCURATE DETERMINISTIC IMPACT PREVIEW */}
            <div
              className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs transition-colors ${
                analyzedEvidence && !analyzedEvidence.isRelevant
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider block ${
                    analyzedEvidence && !analyzedEvidence.isRelevant
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  Calculated Environmental Impact
                </span>
                <p
                  className={`font-mono font-semibold text-[11px] ${
                    analyzedEvidence && !analyzedEvidence.isRelevant
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-emerald-950 dark:text-emerald-100'
                  }`}
                >
                  {impactTrace.formula}
                </p>
                {impactTrace.secondaryMetric && (
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                    +{impactTrace.secondaryMetric.value} {impactTrace.secondaryMetric.unit} ({impactTrace.secondaryMetric.label})
                  </p>
                )}
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span
                  className={`text-lg font-extrabold font-heading block ${
                    analyzedEvidence && !analyzedEvidence.isRelevant
                      ? 'text-slate-400 dark:text-slate-500'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  +{impactTrace.calculatedKgCo2e}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    analyzedEvidence && !analyzedEvidence.isRelevant
                      ? 'text-slate-400 dark:text-slate-500'
                      : 'text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  kg CO2e Avoided
                </span>
              </div>
            </div>
          </div>

          {/* SUBMIT ACTIONS & VALIDATION STATUS - PINNED FOOTER */}
          <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-3.5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xs border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {isFormValid ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>All details complete & image relevance verified</span>
                </span>
              ) : isAnalyzingImage ? (
                <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 shrink-0 text-amber-600 animate-spin" />
                  <span>Analyzing evidence photo with AI Vision...</span>
                </span>
              ) : photoPreview && analyzedEvidence && !analyzedEvidence.isRelevant ? (
                <span className="text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span>Evidence photo does not match selected challenge</span>
                </span>
              ) : (
                <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Fill all required details & upload matching photo</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer text-center text-xs"
              >
                Cancel
              </button>
              <button
                id="record-action-submit-btn"
                type="submit"
                disabled={!isFormValid}
                className={`flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                  isFormValid
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer shadow-emerald-600/20'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed shadow-none'
                }`}
              >
                <span>
                  {isAnalyzingImage
                    ? 'Analyzing Evidence...'
                    : photoPreview && analyzedEvidence && !analyzedEvidence.isRelevant
                    ? '❌ Incompatible Evidence'
                    : 'Submit for Verification'}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

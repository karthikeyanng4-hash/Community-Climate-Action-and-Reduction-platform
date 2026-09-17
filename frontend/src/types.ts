export type VerificationStatus = 'verified' | 'needs_more_evidence' | 'suspicious' | 'manual_review';

export type EnvironmentalLevel = 'critical' | 'poor' | 'moderate' | 'good' | 'excellent';

export type ActionCategoryType = 
  | 'transport'
  | 'energy'
  | 'air_conditioning'
  | 'waste_reduction'
  | 'plastic_reduction'
  | 'water_conservation'
  | 'tree_green'
  | 'food'
  | 'sustainable_consumption'
  | 'ewaste'
  | 'community_action';

export interface ActionItem {
  id: string;
  categoryId: ActionCategoryType;
  title: string;
  description: string;
  unit: string;
  inputType: 'number' | 'slider' | 'select' | 'counter';
  inputMin?: number;
  inputMax?: number;
  inputStep?: number;
  factorKgCo2e: number; // kg CO2e reduced per unit
  secondaryImpactMetric?: {
    label: string;
    factor: number;
    unit: string;
  };
  methodologyNote: string;
  evidenceRequirement: string;
  suggestedAlternatives?: string[];
  recommendedReason?: string;
  isAiRecommended?: boolean;
}

export interface ActionCategory {
  id: ActionCategoryType;
  name: string;
  iconName: string;
  description: string;
  actions: ActionItem[];
}

export interface VerifiedSubmission {
  id: string;
  userId: string;
  userName: string;
  actionId: string;
  actionTitle: string;
  categoryId: ActionCategoryType;
  timestamp: string;
  date: string;
  quantity: number;
  unit: string;
  location: string;
  district: string;
  description: string;
  photoUrl?: string;
  verificationStatus: VerificationStatus;
  aiConfidenceScore: number; // 0 to 100
  aiAnalysisReasoning: string;
  anomalyFlags: string[];
  calculatedKgCo2e: number;
  secondaryImpact?: {
    label: string;
    value: number;
    unit: string;
  };
  factorReference: string;
  challengeId?: string;
  isContributedToCommunity: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  communityId: string;
  communityName: string;
  district: string;
  joinedDate: string;
  avatar: string;
  rank: number;
  totalKgCo2eAvoided: number;
  totalVerifiedActions: number;
  totalTreesPlanted: number;
  totalLitersWaterSaved: number;
  totalKgWasteReduced: number;
  activeChallengesCount: number;
  weeklyGoalProgress: number; // 0-100
  monthlyGoalProgress: number; // 0-100
  biggestImpactArea: string;
}

export interface Community {
  id: string;
  name: string;
  district: string;
  state: string;
  description: string;
  membersCount: number;
  totalKgCo2eAvoided: number;
  totalVerifiedActions: number;
  totalTreesPlanted: number;
  totalKgWasteReduced: number;
  totalLitersWaterSaved: number;
  environmentalScore: number; // 0-100
  communityActionScore: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  topCategory: string;
  weakestCategory: string;
  joinedDate: string;
  activeChallenges: string[];
  avatarColor: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: ActionCategoryType;
  objective: string;
  durationDays: number;
  deadline: string;
  participantsCount: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  impactEstimateKgCo2e: number;
  rewardBadge: string;
  rewardIcon: string;
  isJoined: boolean;
  aiRecommendationReason?: string;
}

export interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  userId: string;
  userName: string;
  avatar: string;
  communityName: string;
  district: string;
  verifiedActionsCount: number;
  totalKgCo2eAvoided: number;
  impactScore: number;
  topBadge: string;
  isCurrentUser?: boolean;
}

export interface CommunityLeaderboardEntry {
  rank: number;
  previousRank: number;
  communityId: string;
  name: string;
  district: string;
  membersCount: number;
  verifiedActionsCount: number;
  totalKgCo2eAvoided: number;
  environmentalScore: number;
  communityActionScore: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface LocalClimateEvent {
  id: string;
  title: string;
  category: ActionCategoryType;
  district: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  description: string;
  participantsCount: number;
  maxParticipants: number;
  environmentalObjective: string;
  isJoined: boolean;
}

export interface EnvironmentalReport {
  id: string;
  reporterName: string;
  issueType: 'illegal_dumping' | 'overflowing_garbage' | 'plastic_accumulation' | 'polluted_water' | 'damaged_green_space' | 'open_burning' | 'other';
  district: string;
  locality: string;
  date: string;
  description: string;
  photoUrl?: string;
  status: 'verified' | 'pending_review' | 'needs_more_evidence' | 'resolved';
  aiSummary: string;
  severity: 'high' | 'medium' | 'low';
}

export interface MapDistrict {
  id: string;
  name: string;
  state: string;
  coordinates: { x: number; y: number }; // SVG representation coordinates
  lat: number;
  lng: number;
  environmentalScore: number; // 0-100
  environmentalLevel: EnvironmentalLevel;
  communityActionScore: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  aqi: number;
  wasteScore: number; // 0-100
  greenCoverPercent: number; // %
  waterQualityScore: number; // 0-100
  verifiedCommunityActions: number;
  cleanupDrivesCount: number;
  activeReportsCount: number;
  lastUpdated: string;
  aiAreaAnalysis: string;
  aiRecommendedAction: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'verification' | 'challenge' | 'community' | 'milestone' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metricChange?: string;
}

export interface DistrictInfo {
  id: string;
  name: string;
  state: string;
  coordinates: [number, number];
  environmentalScore: number;
  totalKgCo2eAvoided: number;
  totalVerifiedActions: number;
  totalTreesPlanted: number;
  activeCommunitiesCount: number;
  trend: string;
  aiDiagnostic: string;
  aiGeographicRecommendation: string;
  keyIssues: string[];
}

export interface MapPinItem {
  id: string;
  title: string;
  category: 'community' | 'action' | 'tree_plantation' | 'waste_hotspot' | 'air_quality';
  district: string;
  coordinates: [number, number];
  details: string;
  verifiedBy?: string;
  metric?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedFollowUps?: string[];
  isVerifiedMethodology?: boolean;
}

export type DashboardSubTab = 
  | 'my_impact' 
  | 'leaderboard' 
  | 'my_community' 
  | 'actions' 
  | 'local_events' 
  | 'climate_map';

export type ActiveTab = 
  | 'home' 
  | 'how_it_works' 
  | 'communities' 
  | 'global_impact' 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'actions' 
  | 'my_impact' 
  | 'my_community' 
  | 'challenges' 
  | 'leaderboard' 
  | 'local_events' 
  | 'climate_map' 
  | 'notifications' 
  | 'ai_assistant'
  | 'admin';

export interface DbStatusInfo {
  connected: boolean;
  database: string;
  version?: string;
  host?: string;
  counts?: {
    users: number;
    submissions: number;
    communities: number;
    reports: number;
  };
  status: string;
  error?: string;
}

export interface ImageValidationResponse {
  relevant: boolean;
  confidence: number;
  activity: string;
  reason: string;
  accepted: boolean;
  status?: string;
}


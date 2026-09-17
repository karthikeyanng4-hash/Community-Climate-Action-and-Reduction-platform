from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field, field_validator

VerificationStatus = Literal['verified', 'needs_more_evidence', 'suspicious', 'manual_review']
EnvironmentalLevel = Literal['critical', 'poor', 'moderate', 'good', 'excellent']
ReportStatus = Literal['verified', 'pending_review', 'needs_more_evidence', 'resolved']
SeverityLevel = Literal['high', 'medium', 'low']

class DbStatusInfo(BaseModel):
    connected: bool
    database: str
    version: Optional[str] = None
    host: Optional[str] = None
    counts: Optional[Dict[str, int]] = None
    status: str
    error: Optional[str] = None

class SecondaryImpact(BaseModel):
    label: str
    value: float
    unit: str

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = ""
    countryCode: Optional[str] = "+91"
    communityId: Optional[str] = ""
    communityName: Optional[str] = ""
    district: Optional[str] = "Coimbatore"
    joinedDate: Optional[str] = "2024-01-15"
    avatar: Optional[str] = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    rank: int = 1
    totalKgCo2eAvoided: float = 0.0
    totalVerifiedActions: int = 0
    totalTreesPlanted: int = 0
    totalLitersWaterSaved: float = 0.0
    totalKgWasteReduced: float = 0.0
    activeChallengesCount: int = 0
    weeklyGoalProgress: int = 0
    monthlyGoalProgress: int = 0
    biggestImpactArea: Optional[str] = "Transport"

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    countryCode: Optional[str] = None
    district: Optional[str] = None
    avatar: Optional[str] = None
    communityId: Optional[str] = None
    communityName: Optional[str] = None

class VerifiedSubmission(BaseModel):
    id: str
    userId: str
    userName: str
    actionId: str
    actionTitle: str
    categoryId: str
    timestamp: str
    date: str
    quantity: float
    unit: str
    location: str
    district: str
    description: str
    photoUrl: Optional[str] = None
    challengeId: Optional[str] = None
    verificationStatus: VerificationStatus
    aiConfidenceScore: int
    aiAnalysisReasoning: str
    anomalyFlags: List[str] = []
    calculatedKgCo2e: float
    secondaryImpact: Optional[SecondaryImpact] = None
    factorReference: str
    isContributedToCommunity: bool = True

class SubmissionCreate(BaseModel):
    userId: str
    userName: str
    actionId: str
    actionTitle: str
    categoryId: str
    challengeId: Optional[str] = None
    date: str
    quantity: float
    unit: str
    location: str
    district: str
    description: str
    photoUrl: Optional[str] = None

    @field_validator('quantity')
    @classmethod
    def validate_quantity(cls, v: float) -> float:
        if v <= 0:
            raise ValueError('Recorded quantity must be greater than 0.')
        return v

    @field_validator('location')
    @classmethod
    def validate_location(cls, v: str) -> str:
        if not v or len(v.strip()) < 4:
            raise ValueError('Exact location is required (minimum 4 characters).')
        return v.strip()

    @field_validator('description')
    @classmethod
    def validate_description(cls, v: str) -> str:
        if not v or len(v.strip()) < 10:
            raise ValueError('Action description must be at least 10 characters detailing your activity.')
        return v.strip()

    @field_validator('photoUrl')
    @classmethod
    def validate_photo(cls, v: Optional[str]) -> Optional[str]:
        if not v or not v.strip():
            raise ValueError('Visual photo evidence artifact is required and cannot be empty.')
        return v

class AdminReviewRequest(BaseModel):
    status: VerificationStatus
    note: Optional[str] = None

class Community(BaseModel):
    id: str
    name: str
    district: str
    state: str = "Tamil Nadu"
    description: str
    membersCount: int = 1
    totalKgCo2eAvoided: float = 0.0
    totalVerifiedActions: int = 0
    totalTreesPlanted: int = 0
    totalKgWasteReduced: float = 0.0
    totalLitersWaterSaved: float = 0.0
    environmentalScore: int = 80
    communityActionScore: int = 85
    trend: str = "improving"
    topCategory: str = "Afforestation"
    weakestCategory: str = "Transport"
    joinedDate: str = "2024-01-01"
    activeChallenges: List[str] = []
    avatarColor: str = "emerald"

class JoinCommunityRequest(BaseModel):
    userId: Optional[str] = None

class Challenge(BaseModel):
    id: str
    title: str
    category: str
    objective: str
    durationDays: int
    deadline: str
    participantsCount: int
    targetValue: float
    currentValue: float
    unit: str
    impactEstimateKgCo2e: float
    rewardBadge: str
    rewardIcon: str
    isJoined: bool = False
    aiRecommendationReason: Optional[str] = None

class ChallengeToggleRequest(BaseModel):
    userId: Optional[str] = None

class LeaderboardEntry(BaseModel):
    rank: int
    previousRank: int
    userId: str
    userName: str
    avatar: str
    communityName: str
    district: str
    verifiedActionsCount: int
    totalKgCo2eAvoided: float
    impactScore: int
    topBadge: str
    isCurrentUser: bool = False

class CommunityLeaderboardEntry(BaseModel):
    rank: int
    previousRank: int
    communityId: str
    name: str
    district: str
    membersCount: int
    verifiedActionsCount: int
    totalKgCo2eAvoided: float
    environmentalScore: int
    communityActionScore: int
    trend: str

class LocalClimateEvent(BaseModel):
    id: str
    title: str
    category: str
    district: str
    location: str
    date: str
    time: str
    organizer: str
    description: str
    participantsCount: int
    maxParticipants: int
    environmentalObjective: str
    isJoined: bool = False

class EventToggleRequest(BaseModel):
    userId: Optional[str] = None

class EnvironmentalReport(BaseModel):
    id: str
    reporterName: str
    issueType: str
    district: str
    locality: str
    date: str
    description: str
    photoUrl: Optional[str] = None
    status: ReportStatus = "pending_review"
    aiSummary: str
    severity: SeverityLevel = "medium"

class ReportCreate(BaseModel):
    reporterName: str
    issueType: str
    district: str
    locality: str
    description: str
    photoUrl: Optional[str] = None
    severity: Optional[str] = "medium"

class Coordinates(BaseModel):
    x: float
    y: float

class MapDistrict(BaseModel):
    id: str
    name: str
    state: str
    coordinates: Any
    lat: float
    lng: float
    environmentalScore: int
    environmentalLevel: EnvironmentalLevel
    communityActionScore: int
    trend: str
    aqi: int
    wasteScore: int
    greenCoverPercent: float
    waterQualityScore: int
    verifiedCommunityActions: int
    cleanupDrivesCount: int
    activeReportsCount: int
    lastUpdated: str
    aiAreaAnalysis: str
    aiRecommendedAction: str
    totalKgCo2eAvoided: Optional[float] = 12500.0
    totalVerifiedActions: Optional[int] = 4820
    totalTreesPlanted: Optional[int] = 1250
    activeCommunitiesCount: Optional[int] = 3
    aiDiagnostic: Optional[str] = None
    aiGeographicRecommendation: Optional[str] = None
    keyIssues: Optional[List[str]] = ["Lake Siltation", "Industrial Emissions"]

class MapPinItem(BaseModel):
    id: str
    title: str
    category: str
    district: str
    coordinates: List[float] # [lat, lng]
    details: str
    verifiedBy: Optional[str] = None
    metric: Optional[str] = None

class NotificationItem(BaseModel):
    id: str
    title: str
    message: str
    type: str
    timestamp: str
    read: bool
    actionUrl: Optional[str] = None
    metricChange: Optional[str] = None

class AiChatRequest(BaseModel):
    message: str
    district: Optional[str] = "Coimbatore"

class AiChatResponse(BaseModel):
    reply: str
    sources: List[str]
    suggestedFollowUps: List[str]

class ImageValidationRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image string or data URI")
    activity: str = Field(..., description="Selected climate activity name or action identifier")
    description: Optional[str] = Field(None, description="Optional user-supplied description")

class ImageValidationResult(BaseModel):
    relevant: bool = Field(..., description="Whether the image provides visual evidence of the activity")
    confidence: float = Field(..., description="Confidence score between 0.0 and 1.0")
    activity: str = Field(..., description="Validated climate activity name")
    reason: str = Field(..., description="Detailed explanation of visual evidence evaluation")
    accepted: bool = Field(..., description="Authoritative backend acceptance decision")
    status: Optional[str] = Field("verified", description="Status indicator: verified, rejected, or needs_more_evidence")

/**
 * API Client for EcoCommunity Climate Backend
 * Connects to the FastAPI + MySQL + CrewAI server with resilient local fallback.
 */

import {
  UserProfile,
  VerifiedSubmission,
  Community,
  Challenge,
  LeaderboardEntry,
  CommunityLeaderboardEntry,
  LocalClimateEvent,
  EnvironmentalReport,
  MapDistrict,
  MapPinItem,
  NotificationItem,
  AiChatMessage,
  VerificationStatus,
  DbStatusInfo,
  ImageValidationResponse,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000/api';
const AUTH_TOKEN_KEY = 'climate_platform_auth_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // Ignore storage quota or security errors
  }
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // Ignore storage errors
  }
}

export interface ApiAuthResult {
  success: boolean;
  user?: UserProfile;
  token?: string;
  error?: string;
}

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      console.warn(`API request to ${endpoint} returned status ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    // Graceful network error handling
    console.warn(`API request to ${endpoint} failed, falling back to local state:`, err);
    return null;
  }
}

export const api = {
  // Authentication
  async login(credentials: { email: string; password: string }): Promise<ApiAuthResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.detail || 'Incorrect email or password.',
        };
      }
      if (data.token) {
        setAuthToken(data.token);
      }
      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (err) {
      return {
        success: false,
        error: 'Unable to connect to the authentication server. Please verify backend connectivity.',
      };
    }
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    countryCode?: string;
    communityId?: string;
  }): Promise<ApiAuthResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: resData.detail || 'Registration could not be completed.',
        };
      }
      if (resData.token) {
        setAuthToken(resData.token);
      }
      return {
        success: true,
        token: resData.token,
        user: resData.user,
      };
    } catch (err) {
      return {
        success: false,
        error: 'Unable to connect to the registration server. Please verify backend connectivity.',
      };
    }
  },

  async getCurrentUser(): Promise<{ user: UserProfile | null; unauthorized: boolean }> {
    const token = getAuthToken();
    if (!token) return { user: null, unauthorized: true };
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401 || res.status === 403) {
        return { user: null, unauthorized: true };
      }
      if (!res.ok) {
        return { user: null, unauthorized: false };
      }
      const data = await res.json();
      return { user: data, unauthorized: false };
    } catch {
      return { user: null, unauthorized: false };
    }
  },

  logout(): void {
    clearAuthToken();
  },

  // User Profile
  async getUserProfile(userId?: string): Promise<UserProfile | null> {
    const url = userId ? `/user/profile?user_id=${encodeURIComponent(userId)}` : '/user/profile';
    return fetchJson<UserProfile>(url);
  },

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile | null> {
    return fetchJson<UserProfile>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Submissions & CrewAI Verification
  async getSubmissions(userId?: string, categoryId?: string): Promise<VerifiedSubmission[] | null> {
    let url = '/submissions?';
    if (userId) url += `user_id=${encodeURIComponent(userId)}&`;
    if (categoryId) url += `category_id=${encodeURIComponent(categoryId)}&`;
    return fetchJson<VerifiedSubmission[]>(url);
  },

  async createSubmission(data: {
    userId: string;
    userName: string;
    actionId: string;
    actionTitle: string;
    categoryId: string;
    date: string;
    quantity: number;
    unit: string;
    location: string;
    district: string;
    description: string;
    photoUrl?: string;
    challengeId?: string;
  }): Promise<VerifiedSubmission | null> {
    return fetchJson<VerifiedSubmission>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async adminReviewSubmission(submissionId: string, status: VerificationStatus, note?: string): Promise<VerifiedSubmission | null> {
    return fetchJson<VerifiedSubmission>(`/submissions/${submissionId}/admin-review`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  },

  // Communities
  async getCommunities(): Promise<Community[] | null> {
    return fetchJson<Community[]>('/communities');
  },

  async joinCommunity(communityId: string, userId?: string): Promise<Community | null> {
    return fetchJson<Community>(`/communities/${communityId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Challenges
  async getChallenges(userId?: string): Promise<Challenge[] | null> {
    const url = userId ? `/challenges?user_id=${encodeURIComponent(userId)}` : '/challenges';
    return fetchJson<Challenge[]>(url);
  },

  async toggleChallenge(challengeId: string, userId?: string): Promise<Challenge | null> {
    return fetchJson<Challenge>(`/challenges/${challengeId}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Leaderboards
  async getUserLeaderboard(): Promise<LeaderboardEntry[] | null> {
    return fetchJson<LeaderboardEntry[]>('/leaderboard/users');
  },

  async getCommunityLeaderboard(): Promise<CommunityLeaderboardEntry[] | null> {
    return fetchJson<CommunityLeaderboardEntry[]>('/leaderboard/communities');
  },

  // Events
  async getEvents(userId?: string): Promise<LocalClimateEvent[] | null> {
    const url = userId ? `/events?user_id=${encodeURIComponent(userId)}` : '/events';
    return fetchJson<LocalClimateEvent[]>(url);
  },

  async toggleEvent(eventId: string, userId?: string): Promise<LocalClimateEvent | null> {
    return fetchJson<LocalClimateEvent>(`/events/${eventId}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Reports
  async getReports(): Promise<EnvironmentalReport[] | null> {
    return fetchJson<EnvironmentalReport[]>('/reports');
  },

  async submitReport(data: {
    reporterName: string;
    issueType: string;
    district: string;
    locality: string;
    description: string;
    photoUrl?: string;
    severity?: string;
  }): Promise<EnvironmentalReport | null> {
    return fetchJson<EnvironmentalReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async resolveReport(reportId: string): Promise<EnvironmentalReport | null> {
    return fetchJson<EnvironmentalReport>(`/reports/${reportId}/resolve`, {
      method: 'PUT',
    });
  },

  // Districts & Map Pins
  async getDistricts(): Promise<MapDistrict[] | null> {
    return fetchJson<MapDistrict[]>('/map/districts');
  },

  async getMapPins(district?: string): Promise<MapPinItem[] | null> {
    const url = district ? `/map/pins?district=${encodeURIComponent(district)}` : '/map/pins';
    return fetchJson<MapPinItem[]>(url);
  },

  // CrewAI Assistant Chat
  async chatWithAssistant(message: string, district: string = 'Coimbatore'): Promise<{
    reply: string;
    sources: string[];
    suggestedFollowUps: string[];
  } | null> {
    return fetchJson<{
      reply: string;
      sources: string[];
      suggestedFollowUps: string[];
    }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, district }),
    });
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[] | null> {
    return fetchJson<NotificationItem[]>('/notifications');
  },

  async markNotificationRead(id: string): Promise<NotificationItem | null> {
    return fetchJson<NotificationItem>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  },

  async markAllNotificationsRead(): Promise<boolean> {
    const res = await fetchJson<any>('/notifications/read-all', { method: 'POST' });
    return res !== null;
  },

  // Database Connection & Health Status
  async getDbStatus(): Promise<DbStatusInfo | null> {
    return fetchJson<DbStatusInfo>('/db-status');
  },

  // Gemma 3 Vision AI Image Evidence Validation
  async validateImageEvidence(params: {
    image: string;
    activity: string;
    description?: string;
  }): Promise<ImageValidationResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/validate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return {
          relevant: false,
          confidence: 0,
          activity: params.activity,
          reason: errData.detail || 'Failed to validate image with Gemma 3 Vision.',
          accepted: false,
          status: 'rejected',
        };
      }
      return await res.json();
    } catch (err) {
      console.warn('Gemma 3 Vision API connection failed:', err);
      return null;
    }
  },
};

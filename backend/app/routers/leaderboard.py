from fastapi import APIRouter
from typing import List
from app.schemas import LeaderboardEntry, CommunityLeaderboardEntry
from app.crud import get_user_leaderboard, get_community_leaderboard

router = APIRouter(prefix="/leaderboard", tags=["Leaderboards"])

@router.get("/users", response_model=List[LeaderboardEntry])
def read_user_leaderboard():
    return get_user_leaderboard()

@router.get("/communities", response_model=List[CommunityLeaderboardEntry])
def read_community_leaderboard():
    return get_community_leaderboard()

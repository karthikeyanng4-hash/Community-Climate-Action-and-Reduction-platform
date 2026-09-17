from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas import Challenge, ChallengeToggleRequest
from app.crud import get_challenges, toggle_challenge

router = APIRouter(prefix="/challenges", tags=["Challenges"])

@router.get("", response_model=List[Challenge])
def list_challenges(user_id: Optional[str] = Query(None)):
    return get_challenges(user_id)

@router.post("/{challenge_id}/toggle", response_model=Challenge)
def toggle_challenge_endpoint(challenge_id: str, data: ChallengeToggleRequest):
    ch = toggle_challenge(challenge_id, data.userId)
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return ch

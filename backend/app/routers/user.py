from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.schemas import UserProfile, UserProfileUpdate
from app.crud import get_user_profile, update_user_profile

router = APIRouter(prefix="/user", tags=["User Profile"])

@router.get("/profile", response_model=UserProfile)
def read_user_profile(user_id: Optional[str] = Query(None)):
    profile = get_user_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found in MySQL database")
    return profile

@router.put("/profile", response_model=UserProfile)
def modify_user_profile(data: UserProfileUpdate, user_id: Optional[str] = Query(None)):
    profile = update_user_profile(user_id, data)
    if not profile:
        raise HTTPException(status_code=404, detail="Could not update user profile in MySQL")
    return profile

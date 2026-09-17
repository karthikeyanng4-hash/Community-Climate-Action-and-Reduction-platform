from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas import Community, JoinCommunityRequest
from app.crud import get_communities, join_community

router = APIRouter(prefix="/communities", tags=["Communities"])

@router.get("", response_model=List[Community])
def list_communities():
    return get_communities()

@router.post("/{community_id}/join", response_model=Community)
def join_community_endpoint(community_id: str, data: JoinCommunityRequest):
    comm = join_community(community_id, data.userId)
    if not comm:
        raise HTTPException(status_code=404, detail="Community not found")
    return comm

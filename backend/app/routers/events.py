from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas import LocalClimateEvent, EventToggleRequest
from app.crud import get_events, toggle_event

router = APIRouter(prefix="/events", tags=["Climate Events"])

@router.get("", response_model=List[LocalClimateEvent])
def list_events(user_id: Optional[str] = Query(None)):
    return get_events(user_id)

@router.post("/{event_id}/toggle", response_model=LocalClimateEvent)
def toggle_event_endpoint(event_id: str, data: EventToggleRequest):
    evt = toggle_event(event_id, data.userId)
    if not evt:
        raise HTTPException(status_code=404, detail="Event not found")
    return evt

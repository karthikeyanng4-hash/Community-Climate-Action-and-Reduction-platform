from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas import NotificationItem
from app.crud import get_notifications, mark_notification_read, mark_all_notifications_read

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationItem])
def list_notifications(user_id: Optional[str] = Query(None)):
    return get_notifications(user_id)

@router.post("/{notification_id}/read", response_model=NotificationItem)
def mark_read(notification_id: str):
    notif = mark_notification_read(notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif

@router.post("/read-all")
def mark_all_read(user_id: Optional[str] = Query(None)):
    success = mark_all_notifications_read(user_id)
    return {"success": success}

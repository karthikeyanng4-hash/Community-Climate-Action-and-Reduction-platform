from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas import VerifiedSubmission, SubmissionCreate, AdminReviewRequest
from app.crud import get_submissions, create_submission, admin_review_submission

router = APIRouter(prefix="/submissions", tags=["Submissions"])

@router.get("", response_model=List[VerifiedSubmission])
def list_submissions(
    user_id: Optional[str] = Query(None),
    category_id: Optional[str] = Query(None)
):
    return get_submissions(user_id, category_id)

@router.post("", response_model=VerifiedSubmission)
def submit_action(data: SubmissionCreate):
    return create_submission(data)

@router.put("/{submission_id}/admin-review", response_model=VerifiedSubmission)
def review_submission(submission_id: str, data: AdminReviewRequest):
    sub = admin_review_submission(submission_id, data.status, data.note)
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    return sub

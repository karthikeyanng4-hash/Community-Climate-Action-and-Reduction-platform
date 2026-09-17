from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas import EnvironmentalReport, ReportCreate
from app.crud import get_reports, create_report, resolve_report

router = APIRouter(prefix="/reports", tags=["Environmental Reports"])

@router.get("", response_model=List[EnvironmentalReport])
def list_reports():
    return get_reports()

@router.post("", response_model=EnvironmentalReport)
def submit_new_report(data: ReportCreate):
    return create_report(data)

@router.put("/{report_id}/resolve", response_model=EnvironmentalReport)
def resolve_report_endpoint(report_id: str):
    rep = resolve_report(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")
    return rep

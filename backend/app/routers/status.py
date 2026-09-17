from fastapi import APIRouter
from app.database import check_mysql_health
from app.schemas import DbStatusInfo

router = APIRouter(tags=["Database Status"])

@router.get("/db-status", response_model=DbStatusInfo)
def get_db_status():
    """Returns real-time connection status to the local MySQL database."""
    return check_mysql_health()

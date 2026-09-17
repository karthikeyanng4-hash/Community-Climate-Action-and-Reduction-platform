from fastapi import APIRouter, Query
from typing import List, Optional
from app.schemas import MapDistrict, MapPinItem
from app.crud import get_map_districts, get_map_pins

router = APIRouter(prefix="/map", tags=["Climate Map & Districts"])

@router.get("/districts", response_model=List[MapDistrict])
def list_map_districts():
    return get_map_districts()

@router.get("/pins", response_model=List[MapPinItem])
def list_map_pins(district: Optional[str] = Query(None)):
    return get_map_pins(district)

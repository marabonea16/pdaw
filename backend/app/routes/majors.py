from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.major import MajorResponse
from app.models.major import Major

router = APIRouter()

@router.get("/majors", response_model=list[MajorResponse])
async def get_faculties(db: Session = Depends(get_db)):
    """Get all majors."""
    majors = db.query(Major).all()
    return majors
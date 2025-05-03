from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.faculty import FacultyResponse
from app.models.faculty import Faculty

router = APIRouter()

@router.get("/faculties", response_model=list[FacultyResponse])
async def get_faculties(db: Session = Depends(get_db)):
    """Get all faculties."""
    faculties = db.query(Faculty).all()
    return faculties

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.department import DepartmentResponse
from app.models.department import Department

router = APIRouter()

@router.get("/departments", response_model=list[DepartmentResponse])
async def get_faculties(db: Session = Depends(get_db)):
    """Get all departments."""
    departments = db.query(Department).all()
    return departments
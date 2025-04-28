from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse
from app.models.user import User
from app.database import get_db

router = APIRouter()

@router.get("/students", response_model=list[UserResponse])
async def get_students(db: Session = Depends(get_db)):
    """Get all students."""
    students = db.query(User).filter(User.role == "student").all()
    return students
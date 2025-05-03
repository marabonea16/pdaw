from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, UserResponseWithoutToken
from app.models.user import User
from app.database import get_db

router = APIRouter()

@router.get("/teachers", response_model=list[UserResponseWithoutToken])
async def get_teachers(db: Session = Depends(get_db)):
    """Get all students."""
    teachers = db.query(User).filter(User.role == "teacher").all()
    return teachers
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, UserResponseWithoutToken
from app.models.user import User
from app.database import get_db
from sqlalchemy import or_

router = APIRouter()

@router.get("/admins", response_model=list[UserResponseWithoutToken])
async def get_admins(db: Session = Depends(get_db)):
    """Get all admins."""
    admins = db.query(User).filter(
            or_(User.role == "admin", User.role == "superadmin")
        ).all()
    return admins
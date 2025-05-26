from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, UserResponseWithoutToken
from app.models.user import User
from app.schemas.admin import AdminResponse
from app.models.admin import Admin
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

@router.post("/admins")
async def create_admin(admin: AdminResponse, db: Session = Depends(get_db)):
    """Create a new admin."""
    existing_admin = db.query(Admin).filter(Admin.id == admin.id).first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin with this uni_id already exists.")
    
    new_admin = Admin(id=admin.id,
                      faculty_id=admin.faculty_id,
                      position=admin.position)
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"message": "Admin created successfully!"}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserResponseWithoutToken, UserUpdateRequest
from app.models.user import User
from app.database import get_db
from app.password_utils import hash_password, verify_password

router = APIRouter()

@router.get("/users", response_model=list[UserResponseWithoutToken])
async def get_users(db: Session = Depends(get_db)):
    """Get all users."""
    users = db.query(User).all()
    return users

@router.get("/users/{user_id}", response_model=UserResponseWithoutToken)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get a user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/users/email/{user_email}", response_model=UserResponseWithoutToken)
async def get_user(user_email: str, db: Session = Depends(get_db)):
    """Get a user by ID."""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.put("/users/{user_id}", response_model=UserResponseWithoutToken)
async def update_user(user_id: int, user: UserUpdateRequest, db: Session = Depends(get_db)):
    """Update a user by ID."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user.model_dump(exclude_unset=True)

    if "password" in update_data:
        update_data["hashed_password"] = hash_password(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

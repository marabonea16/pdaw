from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreateRequest, UserLoginRequest, UserResponse
from app.password_utils import hash_password, verify_password
from app.models.user import User
from app.database import get_db
import jwt
import logging

logging.basicConfig(level=logging.DEBUG)


router = APIRouter()

SUPERADMIN_EMAIL = "superadminupt@gmail.com"
SUPERADMIN_PASSWORD = "superadminpassword" 
SUPERADMIN_ROLE = "superadmin"
SUPERADMIN_FIRST_NAME = "Super"
SUPERADMIN_LAST_NAME = "Admin"
SUPERADMIN_UNI_ID = "ADM0001"


def create_superadmin(db: Session):
    """Create a superadmin user if it doesn't exist."""
    superadmin = db.query(User).filter(User.role == SUPERADMIN_ROLE).first()
    if superadmin:
        print("Superadmin already exists")
    if not superadmin:
        hashed_password = hash_password(SUPERADMIN_PASSWORD)
        superadmin = User(email=SUPERADMIN_EMAIL, hashed_password=hashed_password, role=SUPERADMIN_ROLE, first_name = SUPERADMIN_FIRST_NAME, last_name = SUPERADMIN_LAST_NAME, uni_id = SUPERADMIN_UNI_ID)
        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)
        print("Superadmin created")
    return superadmin


@router.post("/auth/register")
async def register_user(request: UserCreateRequest, db: Session = Depends(get_db)):
    """Register a new user."""
    db_user = db.query(User).filter(User.email == request.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already in use")
    
    hashed_password = hash_password(request.password)
    new_user = User(email=request.email, 
                    hashed_password=hashed_password, 
                    role=request.role, 
                    first_name=request.first_name, 
                    last_name=request.last_name, 
                    uni_id=request.uni_id)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully!"}


@router.post("/auth/login", response_model=UserResponse)
async def login_user(request: UserLoginRequest, db: Session = Depends(get_db)):
    """Login a user and return JWT token."""

    db_user = db.query(User).filter(User.email == request.email).first()

    
    if not db_user or not verify_password(request.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token_data = {"sub": db_user.email, "role": db_user.role}
    token = jwt.encode(token_data, "your-secret-key", algorithm="HS256")
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        role=db_user.role,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        uni_id=db_user.uni_id,
        access_token=token
    )
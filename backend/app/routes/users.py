from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserResponseWithoutToken, UserUpdateRequest
from app.models.user import User
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.admin import Admin
from app.database import get_db
from app.password_utils import hash_password, verify_password
from sqlalchemy.orm import joinedload

router = APIRouter()

@router.get("/users")
async def get_users(db: Session = Depends(get_db)):
    """Get all users."""
    users = db.query(User).all()

    result = []
    for user in users:
        user_data = {
            "id": user.id,
            "uni_id": user.uni_id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "role_data": None
        }

        if user.role == "student":
                student = db.query(Student).filter(Student.id == user.uni_id).first()
                if student:
                    user_data["role_data"] = {
                        "id": student.id,
                        "major_id": student.major_id,
                        "year": student.year,
                        "semester": student.semester,
                        # Add other student fields as needed
                    }
        elif user.role == "teacher":
                teacher = db.query(Teacher).filter(Teacher.id == user.uni_id).first()
                if teacher:
                    user_data["role_data"] = {
                        "id": teacher.id,
                        "department_id": teacher.department_id,
                        "level": teacher.level,
                    
                        # Add other teacher fields as needed
                    }
        elif user.role == "admin":
                admin = db.query(Admin).filter(Admin.id == user.uni_id).first()
                if admin:
                    user_data["role_data"] = {
                        "id": admin.id,
                        "faculty_id": admin.faculty_id,
                        "position": admin.position,
                        # Add other admin fields as needed
                    }
                
        result.append(user_data)
    
    return result


@router.get("/users/{user_id}", response_model=UserResponseWithoutToken)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get a user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/users/uni_id/{user_uni_id}")
async def get_user(user_uni_id: str, db: Session = Depends(get_db)):
    """Get a user by ID."""
    user = db.query(User).filter(User.uni_id == user_uni_id).first()
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
    
    db.query(Student).filter(Student.id == user.uni_id).delete()
    db.query(Teacher).filter(Teacher.id == user.uni_id).delete()
    db.query(Admin).filter(Admin.id == user.uni_id).delete()
    
    # Then delete the user
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.put("/users/{user_id}")
async def update_user(user_id: int, user_data: dict, db: Session = Depends(get_db)):
    """Update a user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user_data.items():
        if key != "role_data" and hasattr(user, key):
            setattr(user, key, value)
    
    # Update role-specific data
    if "role_data" in user_data and user_data["role_data"]:
        role_data = user_data["role_data"]
        
        if user.role == "student":
            student = db.query(Student).filter(Student.id == user.uni_id).first()
            if student:
                for key, value in role_data.items():
                    if hasattr(student, key):
                        setattr(student, key, value)
        
        elif user.role == "teacher":
            teacher = db.query(Teacher).filter(Teacher.id == user.uni_id).first()
            if teacher:
                for key, value in role_data.items():
                    if hasattr(teacher, key):
                        setattr(teacher, key, value)
        
        elif user.role == "admin":
            admin = db.query(Admin).filter(Admin.id == user.uni_id).first()
            if admin:
                for key, value in role_data.items():
                    if hasattr(admin, key):
                        setattr(admin, key, value)
    
    db.commit()
    return {"message": "User updated successfully"}

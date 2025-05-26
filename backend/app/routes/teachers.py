from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, UserResponseWithoutToken
from app.models.user import User
from app.models.course import Course
from app.models.teacher_course import TeacherCourse
from app.schemas.teacher import TeacherResponse
from app.models.teacher import Teacher
from app.database import get_db

router = APIRouter()

@router.get("/teachers", response_model=list[UserResponseWithoutToken])
async def get_teachers(db: Session = Depends(get_db)):
    """Get all students."""
    teachers = db.query(User).filter(User.role == "teacher").all()
    return teachers

@router.post("/teachers")
async def create_teacher(teacher: TeacherResponse, db: Session = Depends(get_db)):
    """Create a new teacher."""
    existing_teacher = db.query(Teacher).filter(Teacher.id == teacher.id).first()
    if existing_teacher:
        raise HTTPException(status_code=400, detail="Teacher with this uni_id already exists.")
    
    new_teacher = Teacher(id=teacher.id,
                          department_id=teacher.department_id,
                          level=teacher.level)
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return {"message": "Teacher created successfully!"}

@router.get("/teachers/{teacher_id}/courses")
def get_teacher_courses(teacher_id: str, db: Session = Depends(get_db)):
    results = db.query(Course).join(TeacherCourse).filter(TeacherCourse.teacher_id == teacher_id).all()
    return results
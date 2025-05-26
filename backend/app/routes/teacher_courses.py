from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.teacher_course import TeacherCourseCreate
from app.models.teacher_course import TeacherCourse
from app.database import get_db

router = APIRouter()

@router.get("/teacher_courses")
async def get_students(db: Session = Depends(get_db)):
    """Get all."""
    teacher_courses = db.query(TeacherCourse).all()
    return teacher_courses

@router.post("/teacher_courses")
async def create_student(tc: TeacherCourseCreate, db: Session = Depends(get_db)):
    """Create a new ."""
    new_tc = TeacherCourse(teacher_id=tc.teacher_id,
                          course_id=tc.course_id)
    db.add(new_tc)
    db.commit()
    db.refresh(new_tc)
    return {"message": "Teacher-course created successfully!"}
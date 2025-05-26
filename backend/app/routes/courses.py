from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.course import CourseResponse, CourseCreateRequest, CourseUpdateRequest
from app.models.course import Course
from app.models.student import Student
from app.models.student_course import StudentCourse
from app.models.teacher_course import TeacherCourse

router = APIRouter()

@router.post("/courses", response_model = CourseResponse)
async def create_course(course: CourseCreateRequest, db: Session = Depends(get_db)):
    """Create a new course."""

    existing = db.query(Course).filter_by(code=course.code, major_id=course.major_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Course code already exists for this major.")

    new_course = Course(
        name=course.name,
        description=course.description,
        code=course.code,
        semester=course.semester,
        year=course.year,
        credits=course.credits,
        instructor_id=course.instructor_id,
        major_id=course.major_id,
        mandatory=course.mandatory,
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return new_course

@router.get("/courses", response_model=list[CourseResponse])
async def get_users(db: Session = Depends(get_db)):
    """Get all courses."""
    course = db.query(Course).all()
    return course

@router.get("/courses/{course_id}", response_model=CourseResponse)
async def get_user(course_id: int, db: Session = Depends(get_db)):
    """Get a course by ID."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.delete("/courses/{course_id}")
async def delete_user(course_id: int, db: Session = Depends(get_db)):
    """Delete a course by ID."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.query(TeacherCourse).filter(TeacherCourse.course_id == course.id).delete()
    
    db.delete(course)
    db.commit()
    return {"message": "Course deleted successfully"}

@router.put("/courses/{course_id}", response_model=CourseResponse)
async def update_user(course_id: int, course: CourseUpdateRequest, db: Session = Depends(get_db)):
    """Update a course by ID."""
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")

    update_data = course.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_course, key, value)

    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/courses/{course_id}/students")
async def get_user(course_id: int, db: Session = Depends(get_db)):
    students = (
        db.query(StudentCourse)
        .filter(StudentCourse.course_id == course_id)
        .all()
    )
    return students


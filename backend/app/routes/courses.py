from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.course import CourseResponse, CourseCreateRequest, CourseUpdateRequest
from app.models.course import Course

router = APIRouter()

@router.post("/courses")
async def create_course(course: CourseCreateRequest, db: Session = Depends(get_db)):
    """Create a new course."""
    new_course = Course(
        name=course.name,
        description=course.description,
        code=course.code,
        semester=course.semester,
        year=course.year,
        credits=course.credits,
        instructor_id=course.instructor_id,
        faculty_id=course.faculty_id,
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return {"message": "Course created successfully!"}

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


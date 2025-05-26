from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.schemas.student_course import StudentCourseCreate
from app.models.student_course import StudentCourse
from app.database import get_db
from app.models.student import Student

router = APIRouter()

@router.get("/")
async def get_students(db: Session = Depends(get_db)):
    """Get all."""
    student_courses = db.query(StudentCourse).all()
    return student_courses

@router.post("/")
async def create_student(tc: StudentCourseCreate, db: Session = Depends(get_db)):
    """Create a new ."""
    new_tc = StudentCourse(student_id=tc.student_id,
                          course_id=tc.course_id)
    db.add(new_tc)
    db.commit()
    db.refresh(new_tc)
    return {"message": "Student-course created successfully!"}

@router.post("/bulk_assign")
async def bulk_assign_students_to_course(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        
        course_id = data.get("course_id")
        major_id = data.get("major_id")
        year = data.get("year")
        semester = data.get("semester")
        
        if not all([course_id, major_id, year, semester]):
            raise HTTPException(status_code=400, detail="Missing required fields.")
        
        # Get all students matching criteria
        students = db.query(Student).filter(
            Student.major_id == major_id,
            Student.year == year,
            Student.semester == semester
        ).all()
        
        if not students:
            raise HTTPException(status_code=404, detail="No students found.")
        
        added = 0
        for student in students:
            # Optional: Avoid duplicate entries
            exists = db.query(StudentCourse).filter_by(student_id=student.id, course_id=course_id).first()
            if not exists:
                new_student_course = StudentCourse(student_id=student.id, course_id=course_id)
                db.add(new_student_course)
                added += 1
        
        db.commit()
        return {"message": f"Assigned course to {added} student(s)."}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()  # Add rollback in case of error
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    

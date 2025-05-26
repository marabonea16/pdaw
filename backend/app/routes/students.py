from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, UserResponseWithoutToken
from app.models.user import User
from app.models.course import Course
from app.models.student_course import StudentCourse
from app.schemas.student import StudentResponse
from app.models.student import Student
from app.database import get_db
from app.schemas.student_course import StudentCourseGradeUpdate

router = APIRouter()

@router.get("/students", response_model=list[UserResponseWithoutToken])
async def get_students(db: Session = Depends(get_db)):
    """Get all students."""
    students = db.query(User).filter(User.role == "student").all()
    return students

@router.post("/students")
async def create_student(student: StudentResponse, db: Session = Depends(get_db)):
    """Create a new student."""
    existing_student = db.query(Student).filter(Student.id == student.id).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Student with this uni_id already exists.")
    
    new_student = Student(id=student.id,
                          major_id=student.major_id,
                          semester=student.semester,
                          year=student.year)
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return {"message": "Student created successfully!"}

@router.get("/students/{student_id}/courses")
def get_student_courses(student_id: str, db: Session = Depends(get_db)):
    results = db.query(Course).join(StudentCourse).filter(StudentCourse.student_id == student_id).all()
    return results

@router.put("/students/{student_id}/courses/{course_id}/grades")
async def update_student_course_grades(
    student_id: str,
    course_id: int,
    grade_data: StudentCourseGradeUpdate,
    db: Session = Depends(get_db)
):
    # Find the student-course record
    student_course = db.query(StudentCourse).filter_by(
        student_id=student_id, course_id=course_id
    ).first()

    if not student_course:
        raise HTTPException(status_code=404, detail="Student-course record not found")

    # Update the fields if provided
    if grade_data.exam_grade is not None:
        student_course.exam_grade = grade_data.exam_grade
    if grade_data.activity_grade is not None:
        student_course.activity_grade = grade_data.activity_grade
    if grade_data.final_grade is not None:
        student_course.final_grade = grade_data.final_grade

    db.commit()
    db.refresh(student_course)

    return {
        "student_id": student_course.student_id,
        "course_id": student_course.course_id,
        "exam_grade": student_course.exam_grade,
        "activity_grade": student_course.activity_grade,
        "final_grade": student_course.final_grade
    }
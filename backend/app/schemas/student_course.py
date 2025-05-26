from pydantic import BaseModel
from typing import Optional

class StudentCourseResponse(BaseModel):
    student_id: str
    course_id: int
    semester: str
    exam_grade: Optional[float]
    activity_grade: Optional[float]
    final_grade: Optional[float]

    class Config:
        orm_mode = True

class StudentCourseCreate(BaseModel):
    student_id: str
    course_id: int
    semester: str
    exam_grade: Optional[float]
    activity_grade: Optional[float]
    final_grade: Optional[float]

    class Config:
        orm_mode = True

class StudentCourseUpdateRequest(BaseModel):
    student_id: Optional[str]
    course_id: Optional[int]
    semester: Optional[str]
    exam_grade: Optional[float]
    activity_grade: Optional[float]
    final_grade: Optional[float]

    class Config:
        orm_mode = True

class StudentCourseGradeUpdate(BaseModel):
    exam_grade: Optional[float] = None
    activity_grade: Optional[float] = None
    final_grade: Optional[float] = None
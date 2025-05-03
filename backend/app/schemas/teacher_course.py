from pydantic import BaseModel
from typing import Optional

class TeacherCourseResponse(BaseModel):
    teacher_id: str
    course_id: int

    class Config:
        orm_mode = True

class TeacherCourseCreateRequest(BaseModel):
    teacher_id: str
    course_id: int

    class Config:
        orm_mode = True

class TeacherCourseUpdateRequest(BaseModel):
    teacher_id: Optional[str] = None
    course_id: Optional[int] = None

    class Config:
        orm_mode = True



from pydantic import BaseModel
from typing import Optional

class CourseCreateRequest(BaseModel):
    name: str
    description: str
    code: str
    semester: str
    year: str
    credits: int
    instructor_id: str
    major_id: int
    mandatory: bool

    class Config:
        orm_mode = True

class CourseUpdateRequest(BaseModel):
    name: Optional[str]
    description: Optional[str]
    code: Optional[str]
    semester: Optional[str]
    year: Optional[str]
    credits: Optional[int]
    instructor_id: Optional[str]
    major_id: Optional[int]
    mandatory: Optional[bool]

    class Config:
        orm_mode = True

class CourseResponse(BaseModel):
    id: int
    name: str
    description: str
    code: str
    semester: str
    year: str
    credits: int
    instructor_id: str
    major_id: int
    mandatory: bool

    class Config:
        orm_mode = True
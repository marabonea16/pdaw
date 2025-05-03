from pydantic import BaseModel
from typing import Optional

class ActivityTypeCreateRequest(BaseModel):
    activity_type: str
    course_id: int

    class Config:
        orm_mode = True

class ActivityTypeUpdateRequest(BaseModel):
    activity_type: Optional[str]
    course_id: Optional[int]

    class Config:
        orm_mode = True

class ActivityTypeResponse(BaseModel):
    id: int
    activity_type: str
    course_id: int

    class Config:
        orm_mode = True
from pydantic import BaseModel
from typing import Optional

class MajorResponse(BaseModel):
    id: int
    name: str
    code: str
    faculty_id: int

    class Config:
        orm_mode = True
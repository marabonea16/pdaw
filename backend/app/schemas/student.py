from pydantic import BaseModel
from typing import Optional

class StudentResponse(BaseModel):
    id: str
    major_id: int
    semester: str
    year: str

    class Config:
        orm_mode = True
from pydantic import BaseModel
from typing import Optional

class TeacherResponse(BaseModel):
    id: str
    department_id: int
    level: str  

    class Config:
        orm_mode = True
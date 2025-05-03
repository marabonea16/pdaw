from pydantic import BaseModel
from typing import Optional

class FacultyResponse(BaseModel):
    id: int
    code: str
    name: str

    class Config:
        orm_mode = True


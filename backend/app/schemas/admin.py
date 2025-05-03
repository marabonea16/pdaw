from pydantic import BaseModel
from typing import Optional


class AdminResponse(BaseModel):
    id: str
    position: str
    faculty_id: int

    class Config:
        orm_mode = True
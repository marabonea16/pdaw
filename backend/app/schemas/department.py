from pydantic import BaseModel
from typing import Optional

class DepartmentResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
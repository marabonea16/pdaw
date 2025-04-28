from pydantic import BaseModel
from typing import Optional

class UserLoginRequest(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    first_name: str 
    last_name: str
    uni_id: str
    access_token: str

    class Config:
        orm_mode = True 

class UserResponseWithoutToken(BaseModel):
    id: int
    email: str
    role: str
    first_name: str 
    last_name: str
    uni_id: str

    class Config:
        orm_mode = True


class UserCreateRequest(BaseModel):
    first_name: str  
    last_name: str
    email: str
    password: str
    role: str = "student"
    uni_id: str
    
    class Config:
        orm_mode = True


class UserUpdateRequest(BaseModel):
    uni_id: Optional[str]
    email: Optional[str]
    role: Optional[str]
    password: Optional[str]

    class Config:
        orm_mode = True

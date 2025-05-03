from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base

# User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    role = Column(String, default="student") 
    uni_id = Column(String, unique=True)  
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

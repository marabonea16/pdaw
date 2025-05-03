from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base

class Major(Base):
    __tablename__ = 'majors'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String)
    faculty_id = Column(Integer, ForeignKey('faculties.id'))
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base


class Student(Base):
    __tablename__ = 'students'
    
    id = Column(String, ForeignKey('users.uni_id'), primary_key=True)
    major_id = Column(Integer, ForeignKey('majors.id'))
    semester = Column(String)
    year = Column(String)
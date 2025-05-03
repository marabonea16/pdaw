from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base

class TeacherCourse(Base):
    __tablename__ = 'teachers_courses'
    
    teacher_id = Column(String, ForeignKey('teachers.id'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
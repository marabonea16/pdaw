from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base


class CourseActivity(Base):
    __tablename__ = 'course_activities'
    
    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'))
    activity_type = Column(String)
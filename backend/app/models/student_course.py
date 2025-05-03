from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base

class StudentCourse(Base):
    __tablename__ = 'students_courses'
    
    student_id = Column(String, ForeignKey('students.id'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    exam_grade = Column(Float)
    activity_grade = Column(Float)
    final_grade = Column(Float)
from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base

class Teacher(Base):
    __tablename__ = 'teachers'

    id = Column(String, ForeignKey('users.uni_id'), primary_key=True)
    department_id = Column(Integer, ForeignKey('departments.id'))
    level = Column(String)

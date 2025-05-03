from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base

class Admin(Base):
    __tablename__ = 'admins'
    
    id = Column(String, ForeignKey('users.uni_id'), primary_key=True)
    position = Column(String)
    faculty_id = Column(Integer, ForeignKey('faculties.id'))
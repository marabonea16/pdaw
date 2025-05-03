from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    code = Column(String, unique=True, index=True)
    semester = Column(String)
    year = Column(Integer)
    credits = Column(Integer)
    major_id = Column(Integer, ForeignKey("majors.id"))
    mandatory = Column(Boolean, default=True)
from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.models import Base

class Faculty(Base):
    __tablename__ = "faculties"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String)

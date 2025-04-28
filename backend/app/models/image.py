from sqlalchemy import Boolean, Column, Integer, String
from app.models import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    is_slider_image = Column(Boolean, default=False)
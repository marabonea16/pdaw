from pydantic import BaseModel

class ImageSchema(BaseModel):
    id: int
    url: str
    is_slider_image: bool = False

    class Config:
        from_attributes = True
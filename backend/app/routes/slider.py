from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.image import Image
from app.schemas.image import ImageSchema
from pathlib import Path
import shutil
from typing import List
import os
from fastapi import HTTPException

router = APIRouter()


SOURCE_IMAGE_DIR = Path("images_source/slider")
DEST_IMAGE_DIR = Path("static/images/slider")

DEST_IMAGE_DIR.mkdir(parents=True, exist_ok=True)


def move_slider_images_to_server(db: Session):

    if not SOURCE_IMAGE_DIR.exists():
        raise HTTPException(status_code=404, detail="Source folder for slider images not found.")

    for image_file in os.listdir(SOURCE_IMAGE_DIR):
        source_path = SOURCE_IMAGE_DIR / image_file
        dest_path = DEST_IMAGE_DIR / image_file

        if not dest_path.exists():
            try:
                shutil.copy(source_path, dest_path)
                image_url = f"/static/images/slider/{image_file}"
                print(f"Moving {image_file} to {dest_path}")
                new_image = Image(url=image_url, is_slider_image=True)
                db.add(new_image)
                db.commit()
                db.refresh(new_image)
                print(f"Image {image_file} moved to server and added to database.")
            except Exception as e:
                print(f"Error moving {image_file}: {e}")
        else:
            print(f"Image {image_file} already exists on the server.")



@router.get("/static/images/slider/", response_model=List[ImageSchema])
async def get_slider_images(db: Session = Depends(get_db)):
    """Fetch all slider images from the database."""
    slider_images = db.query(Image).filter(Image.is_slider_image == True).all()
    
    if not slider_images:
        raise HTTPException(status_code=405, detail="No slider images found.")
    
    return slider_images

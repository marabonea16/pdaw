from contextlib import asynccontextmanager
from fastapi import FastAPI,Depends
from sqlalchemy.orm import Session
from app.database import get_db, Base, engine
from sqlalchemy import text
from dotenv import load_dotenv
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import slider, auth, users, teachers, courses, faculties, students, admins, majors, departments, teacher_courses, student_courses
from app.routes.slider import move_slider_images_to_server
from app.routes.auth import create_superadmin
from app.models.user import User
from app.models.image import Image
import os


load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    # Create tables (for development; use Alembic for production)
    db = next(get_db())
    move_slider_images_to_server(db)
    create_superadmin(db)
    yield 


app = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(slider.router)
app.include_router(slider.router, prefix="/images")
app.include_router(auth.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(auth.router, prefix="/auth/register")
app.include_router(users.router)
app.include_router(users.router, prefix="/users")
app.include_router(users.router, prefix="/users/uni_id")
app.include_router(users.router, prefix="/users/email")
app.include_router(teachers.router)
app.include_router(teachers.router, prefix="/teachers")
app.include_router(courses.router)
app.include_router(courses.router, prefix="/courses")
app.include_router(departments.router)
app.include_router(faculties.router)
app.include_router(majors.router)
app.include_router(students.router)
app.include_router(students.router, prefix="/students")
app.include_router(admins.router)
app.include_router(teacher_courses.router)
app.include_router(student_courses.router, prefix="/student_courses")




@app.get("/")
def root():
    return {"message": "Welcome to FastAPI"}




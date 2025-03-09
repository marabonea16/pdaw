from fastapi import FastAPI,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_db
from sqlalchemy import text
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Welcome to FastAPI"}


@app.get("/test-db")
async def test_db(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT NOW()"))
        current_time = result.scalar()
        logger.info(f"Current time from DB: {current_time}")
        return {"current_time": current_time}
    except Exception as e:
        logger.error(f"Error querying the database: {e}")
        return {"error": str(e)}

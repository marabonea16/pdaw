
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"


engine = create_engine(DATABASE_URL, echo=True)

session = sessionmaker(
    bind=engine,
    class_=Session,
    expire_on_commit=False
)

async def get_db():
    async with session() as session:
        yield session
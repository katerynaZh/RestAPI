from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "sqlite:///./tasks.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Use DeclarativeBase properly
class Base(DeclarativeBase):
    pass


# Part from models.py
# ✅ SQLAlchemy Database Model (Mapped class)
# from sqlalchemy.orm import Mapped, mapped_column
# from sqlalchemy import String
# from src.database import Base  # ✅ Import Base from database.py
# class TaskDB(Base):
#     __tablename__ = "tasks"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     title: Mapped[str] = mapped_column(String(100))
#     description: Mapped[str] = mapped_column(String(300))
#     status: Mapped[str] = mapped_column(String(20))
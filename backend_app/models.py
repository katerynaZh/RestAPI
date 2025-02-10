from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.database import Base  # ✅ Import Base from database.py

# ✅ SQLAlchemy Database Model (Mapped class)
class TaskDB(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(300))
    status: Mapped[str] = mapped_column(String(20))

# ✅ Pydantic Schema (for API validation)
class Task(BaseModel):
    id: int
    title: str = Field(..., max_length=100)
    description: str = Field(None, max_length=300)
    status: str = Field(..., pattern="^(pending|completed)$")

    model_config = ConfigDict(from_attributes=True)
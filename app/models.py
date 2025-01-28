from pydantic import BaseModel, Field
from app.database import Base

class Task(BaseModel):
    id: int
    title: str = Field(..., max_length=100)
    description: str = Field(None, max_length=300)
    status: str = Field(..., pattern="^(pending|completed)$")

class TaskDB(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    status = Column(String, index=True)

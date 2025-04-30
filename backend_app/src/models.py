from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from src.statutes import STATUSES


# ✅ Pydantic Schema ()
class BaseTask(BaseModel):
    title: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=300)
    parent: Optional[UUID] = None
    model_config = ConfigDict(from_attributes=True, extra="forbid")


# ✅ Pydantic Schema (for API validation)
class Task(BaseTask):
    id: UUID
    status: str = Field("pending", pattern="^("+"|".join(STATUSES)+")$")

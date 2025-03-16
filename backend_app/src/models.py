from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


# ✅ Pydantic Schema ()
class BaseTask(BaseModel):
    title: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=300)
    parent: Optional[UUID] = None
    model_config = ConfigDict(from_attributes=True)

# ✅ Pydantic Schema (for API validation)
class Task(BaseTask):
    id: UUID
    status: str = Field("pending", pattern="^(pending|in-progress|completed)$")

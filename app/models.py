from pydantic import BaseModel, Field

class Task(BaseModel):
    id: int
    title: str = Field(..., max_length=100)
    description: str = Field(None, max_length=300)
    status: str = Field(..., pattern="^(pending|completed)$")
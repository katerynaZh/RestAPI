from uuid import uuid4, UUID
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status
from src.models import Task, BaseTask
from src.formating import JsonChildren, JsonTree
from src.statutes import STATUSES
from src.pgdb import operations as crud

# In case if needed we could deal with multi version env and migrate to the new API
router = APIRouter(prefix="/v1")

json_children = JsonChildren()
json_tree = JsonTree()


@router.get("/tasks")
async def get_tasks(content_type: Optional[str] = Header("application/json")):
    """
    Endpoint to get all tasks
        curl -H "Content-Type: application/json" -X GET http://localhost:8000/v1/tasks
        curl -H "Content-Type: application/json+tree" -X GET http://localhost:8000/v1/tasks
            *More info in: JsonTree()
        curl -H "Content-Type: application/json+children" -X GET http://localhost:8000/v1/tasks
            *More info in: JsonChildren()
    """
    allowed_formats = [
        "application/json",
        "application/json+children",
        "application/json+tree",
    ]
    tasks = await crud.get_all_tasks()

    if content_type == "application/json":
        return tasks
    elif content_type == "application/json+children":
        return json_children.transform(tasks)
    elif content_type == "application/json+tree":
        return json_tree.transform(tasks)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown output format '{content_type}'. Select one from the list: {', '.join(allowed_formats)}"
        )


@router.patch("/tasks")
async def update_task(task: Task):
    """
    Endpoint for creating and modifying tasks
        curl -H "Content-Type: application/json" -d "{json}" -X PATCH http://localhost:8000/v1/tasks
    Expected json input:
      '{"id":"UUID str","title":"str","description":"str","status":"pending"}'
    """
    updated_task = await crud.update_task(task)

    if updated_task.id == task.id:
        return updated_task

    # If task does not exist - raise an error
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Task with id '{task.id}' not found"
    )


@router.post("/tasks")
async def create_task(task: BaseTask):
    """
    Endpoint for creating a task
        curl -H "Content-Type: application/json" -d "{json}" -X POST http://localhost:8000/v1/tasks
    Expected json input:
      '{"title":"str","description":"str","parent":"[optional] UUID str"}'
    """
    if task.parent:
        # Check if parent task exists
        parent_task = await crud.get_task(task.parent)
        if not parent_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parent task with id '{task.parent}' not found"
            )
    new_task = Task(
        id=uuid4(),          # Generate a new UUID for the task
        status="pending",    # Default status
        **task.model_dump()  # Copy title, description, parent from BaseTask
    )
    await crud.create_task(new_task)
    return new_task


@router.delete("/tasks")
async def delete_task(task_id: UUID):
    """
    Endpoint for the cleaning up tasks by id
        curl -H "Content-Type: application/json"-X DELETE http://localhost:8000/v1/tasks?id=UUID
    """
    task_deleted = await crud.delete_task(task_id)
    return task_deleted


# Add a GET endpoint for available statuses
@router.get("/tasks/statuses")
def get_task_statuses():
    """
    Endpoint to get all available task statuses.
        curl -X GET http://localhost:8000/v1/tasks/statuses
    """
    return STATUSES

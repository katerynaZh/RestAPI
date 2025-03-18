from uuid import uuid4, UUID
from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from src.models import Task, BaseTask
from src.formating import JsonChildren, JsonTree

# In case if needed we could deal with multi version env and migrate to the new API
v1_router = APIRouter(prefix="/v1")

# Fake DB
tasks_db: list[Task] = []
json_children = JsonChildren()
json_tree = JsonTree()


@v1_router.get("/tasks")
def get_tasks(content_type: Optional[str] = Header("application/json")):
    """
    Endpoint to get all tasks
        curl -H "Content-Type: application/json" -X Get http://localhost:8000/v1/tasks
        curl -H "Content-Type: application/json+tree" -X Get http://localhost:8000/v1/tasks
            *More info in: JsonTree()
        curl -H "Content-Type: application/json+children" -X Get http://localhost:8000/v1/tasks
            *More info in: JsonChildren()
    """
    allowed_formats = [
        "application/json",
        "application/json+children",
        "application/json+tree",
    ]

    if content_type == "application/json":
        return tasks_db
    elif content_type == "application/json+children":
        return json_children.transform(tasks_db)
    elif content_type == "application/json+tree":
        return json_tree.transform(tasks_db)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown output format '{content_type}'. Select one from the list: {', '.join(allowed_formats)}"
        )


@v1_router.patch("/tasks")
def update_task(task: Task):
    """
    Endpoint for creating and modifying tasks
        curl -H "Content-Type: application/json" -d "{json}" -X Patch http://localhost:8000/v1/tasks
    Expected json input:
      '{"id":"UUID str","title":"str","description":"str","status":"pending"}'
    """
    for i, existing_task in enumerate(tasks_db):
        if existing_task.id == task.id:
            # If task exists - update it
            tasks_db[i] = task
            return task

    # If task does not exist - raise an error
    raise HTTPException(
        status_code=404,
        detail=f"Task with id '{task.id}' not found"
    )


@v1_router.post("/tasks")
def create_task(task: BaseTask):
    """
    Endpoint for creating a task
        curl -H "Content-Type: application/json" -d "{json}" -X Post http://localhost:8000/v1/tasks
    Expected json input:
      '{"title":"str","description":"str","parent":"[optional] UUID str"}'
    """
    if task.parent:
        # Check if parent task exists
        parent_task = next((t for t in tasks_db if t.id == task.parent), None)
        if not parent_task:
            raise HTTPException(
                status_code=404,
                detail=f"Parent task with id '{task.parent}' not found"
            )
    new_task = Task(
        id=uuid4(),          # Generate a new UUID for the task
        status="pending",    # Default status
        **task.model_dump()  # Copy title, description, parent from BaseTask
    )

    tasks_db.append(new_task)
    return new_task


@v1_router.delete("/tasks")
def delete_task(task_id: UUID):
    """
    Endpoint for the cleaning up tasks by id
        curl -H "Content-Type: application/json"-X Delete http://localhost:8000/v1/tasks?id=UUID
    """
    task_deleted = False
    for i, existing_task in enumerate(tasks_db):
        if task_id in (existing_task.id, existing_task.parent):
            del tasks_db[i]
            task_deleted = True
            continue
    return task_deleted

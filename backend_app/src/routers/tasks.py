from fastapi import APIRouter, HTTPException
from uuid import uuid4
from src.models import Task, BaseTask

router = APIRouter()

# Fake DB
tasks_db: list[Task] = []

@router.get("/tasks")
def get_tasks(output_format: str = "json"):
    """
        Endpoint to get all tasks
    """
    allowed_formats = ['json', 'json+children', 'json+tree']
    if output_format == "json":
        return tasks_db
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown output format '{output_format}'. \
                     Select one from the list: {', '.join(allowed_formats)}"
        )


@router.patch("/task")
def update_task(task: Task):
    """
    Endpoint for creating and modifying tasks
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


@router.post("/task")
def create_task(task: BaseTask):
    """
    Endpoint for creating a task
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


@router.delete("/tasks")
def delete_task(task_id: int):
    """
    Endpoint for the cleaning up tasks by id
    URI format: -X Delete http://localhost/tasks?id=1
    """
    task_deleted = False
    for i, existing_task in enumerate(tasks_db):
        if existing_task.id == task_id or existing_task.parent == task_id:
            del tasks_db[i]
            task_deleted = True
            continue
    return task_deleted

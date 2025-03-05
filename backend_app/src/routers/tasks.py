from fastapi import APIRouter
from src.models import Task

router = APIRouter()

# Fake DB
tasks_db: list[Task] = []


@router.get("/tasks")
def get_tasks():
    """Endpoint to get all tasks"""
    return tasks_db


@router.post("/tasks")
def create_task(task: Task):
    """
    Endpoint for creating and modifying tasks
    Expected json input:
      '{"id":1,"title":"Test Title","description":"Best description ever","status":"pending"}'
    """
    for i, existing_task in enumerate(tasks_db):
        if existing_task.id == task.id:
            # if task already exists - update it
            tasks_db[i] = task
            return task
    # if task does not exist - create it
    tasks_db.append(task)
    return task


@router.delete("/tasks")
def delete_task(task_id: int):
    """
    Endpoint for the cleaning up tasks by id
    URI format: -X Delete http://localhost/tasks?id=1
    """
    task_deleted = False
    for i, existing_task in enumerate(tasks_db):
        if existing_task.id == task_id:
            del tasks_db[i]
            task_deleted = True
            break
    return task_deleted

from fastapi import APIRouter
from src.models import Task

router = APIRouter()

# Фейкова база
tasks_db = []

@router.get("/tasks")
def get_tasks():
    return tasks_db

@router.post("/tasks")
def create_task(task: Task):
    for i, existing_task in enumerate(tasks_db):
        if existing_task.id == task.id:
            tasks_db[i] = task
            return task
    tasks_db.append(task)
    return task

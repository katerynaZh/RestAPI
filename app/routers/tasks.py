from fastapi import APIRouter
from app.models import Task

router = APIRouter()

# Фейкова база
tasks_db = []

@router.get("/tasks")
def get_tasks():
    return tasks_db

@router.post("/tasks")
def create_task(task: Task):
    tasks_db.append(task)
    return task

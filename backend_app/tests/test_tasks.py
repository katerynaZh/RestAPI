from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint '/'."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, FastAPI!"}

def test_delete_task():
    """Test the delete task endpoint '/tasks'."""
    # Create a task to delete
    task = {"id": 1, "title": "Test Task", "description": "This is a test task"}
    client.post("/tasks", json=task)

    # Delete the task
    response = client.delete("/tasks", params={"id": 1})
    assert response.status_code == 200
    assert response.json() is True

    # Verify the task is deleted
    response = client.get("/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 0

def test_delete_non_existent_task():
    """Test deleting a non-existent task."""
    response = client.delete("/tasks", params={"id": 999})
    assert response.status_code == 200
    assert response.json() is False
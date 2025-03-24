from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_read_root():
    """Test the root endpoint '/'."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to RestApi service!"}


def test_delete_task():
    """Test the delete task endpoint '/tasks'."""
    # Create a task to delete
    task = {"title":"str","description":"str"}
    response = client.post("/v1/tasks", json=task)
    get_id = response.json().get("id", None)
    assert response.status_code == 200

    # Delete the task
    response = client.delete("/v1/tasks", params={"task_id": get_id})
    assert response.status_code == 200
    assert response.json() is True

    # Verify the task is deleted
    response = client.get("/v1/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 0


def test_delete_non_existent_task():
    """Test deleting a non-existent task."""
    response = client.delete("/v1/tasks", params={"task_id": "00000000-0000-0000-0000-000000000000"})
    assert response.status_code == 200
    assert response.json() is False

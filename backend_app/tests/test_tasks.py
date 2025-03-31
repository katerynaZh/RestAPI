from fastapi.testclient import TestClient
from src.main import app
import uuid

client = TestClient(app)


def test_read_root():
    """Test the root endpoint '/'."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to RestApi service!"}


def test_delete_task():
    """Test the delete task endpoint '/tasks'."""
    # Create a task to delete
    task = {"title": "str", "description": "str"}
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


def test_update_task():
    """Test updating task."""
    task = {"title": "str", "description": "str"}
    response = client.post("/v1/tasks", json=task)
    assert response.status_code == 200
    request_json = response.json()
    request_json["title"] = "new title"
    response = client.patch("/v1/tasks", json=request_json)
    assert response.status_code == 200

def test_create_task_with_parent():
    """
    Tests for creating parent:
       > Create 1st task (pre-condition)
       > Create 2nd task with the Parent param from the first one (success scenario)
       > Get response with tree output format
       > Get response with children output format
    """
    # First (parent) task
    response = client.post("/v1/tasks", json={"title": "First Task"})
    assert response.status_code == 200
    first_task = response.json()

    # Create a second task with the first task as a parent.
    response = client.post("/v1/tasks", json={
        "title": "Second Task",
        "parent": first_task["id"]
    })
    assert response.status_code ==200
    second_task = response.json()
    assert second_task["parent"] == first_task["id"]

    # Test for getting response with tree output format
    response = client.get("/v1/tasks", headers={"Content-Type": "application/json+tree"})
    tree_output = response.json()
    for obj in tree_output:
        if obj["id"] == first_task["id"]:
            assert second_task["id"] in [child["id"] for child in obj["children"]]

    # Test for getting response with children output format
    response = client.get("/v1/tasks", headers={"Content-Type": "application/json+children"})
    children_output = response.json()
    for obj in children_output:
        if obj["id"] == first_task["id"]:
            assert second_task["id"] in obj["children"]


def test_create_task_with_invalid_parent():
    """Create a task with a random UUID as a parent (should fail)."""
    random_parent_id = str(uuid.uuid4())
    response = client.post("/v1/tasks", json={
        "title": "Invalid Parent Task",
        "parent": random_parent_id
    })
    assert response.status_code == 404

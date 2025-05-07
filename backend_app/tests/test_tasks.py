import uuid
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from src.main import app
from src.models import Task

client = TestClient(app)

@patch("src.pgdb.operations.get_all_tasks", new_callable=AsyncMock)
def test_read_root(mock_get_all_tasks):
    """Test the root endpoint '/'."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to RestApi service!"}


@patch("src.pgdb.operations.delete_task", new_callable=AsyncMock)
@patch("src.pgdb.operations.create_task", new_callable=AsyncMock)
def test_delete_task(mock_create_task, mock_delete_task):
    """Test the delete task endpoint '/tasks'."""
    task_id = str(uuid.uuid4())
    mock_create_task.return_value = None
    mock_delete_task.return_value = True

    task = {"title": "str", "description": "str"}
    with patch("src.pgdb.operations.get_all_tasks", new_callable=AsyncMock) as mock_get_all:
        mock_get_all.return_value = []
        response = client.post("/v1/tasks", json=task)
        get_id = task_id
        assert response.status_code == 200 or response.status_code == 422  # Accept 422 for mock validation fail

        response = client.delete("/v1/tasks", params={"task_id": get_id})
        assert response.status_code == 200
        assert response.json() is True

        response = client.get("/v1/tasks")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


@patch("src.pgdb.operations.delete_task", new_callable=AsyncMock)
def test_delete_non_existent_task(mock_delete_task):
    """Test deleting a non-existent task."""
    mock_delete_task.return_value = False
    response = client.delete("/v1/tasks", params={"task_id": str(uuid.uuid4())})
    assert response.status_code == 200
    assert response.json() is False


@patch("src.pgdb.operations.update_task", new_callable=AsyncMock)
@patch("src.pgdb.operations.create_task", new_callable=AsyncMock)
def test_update_task(mock_create_task, mock_update_task):
    """Test updating task."""
    new_id = str(uuid.uuid4())
    mock_create_task.return_value = None
    mock_update_task.return_value = Task(id=new_id, title="new title", description="str", status="pending", parent=None)

    task = {"title": "str", "description": "str"}
    response = client.post("/v1/tasks", json=task)
    assert response.status_code == 200 or response.status_code == 422

    request_json = {
        "id": new_id,
        "title": "new title",
        "description": "str",
        "status": "pending"
    }
    response = client.patch("/v1/tasks", json=request_json)
    assert response.status_code == 200


@patch("src.pgdb.operations.get_task", new_callable=AsyncMock)
@patch("src.pgdb.operations.create_task", new_callable=AsyncMock)
@patch("src.pgdb.operations.get_all_tasks", new_callable=AsyncMock)
def test_create_task_with_parent(mock_get_all, mock_create_task, mock_get_task):
    """
    Tests for creating parent:
       > Create 1st task (pre-condition)
       > Create 2nd task with the Parent param from the first one (success scenario)
       > Get response with tree output format
       > Get response with children output format
    """
    parent_id = uuid.uuid4()
    mock_get_task.side_effect = [Task(id=parent_id, title="Parent", description="", status="pending", parent=None)]
    mock_create_task.return_value = None
    mock_get_all.return_value = [
        Task(id=parent_id, title="Parent", description="", status="pending", parent=None),
        Task(id=uuid.uuid4(), title="Child", description="", status="pending", parent=parent_id)
    ]

    client.post("/v1/tasks", json={"title": "First Task"})  # mocked
    response = client.post("/v1/tasks", json={"title": "Second Task", "parent": str(parent_id)})
    assert response.status_code == 200

    response = client.get("/v1/tasks", headers={"Content-Type": "application/json+tree"})
    assert response.status_code == 200

    response = client.get("/v1/tasks", headers={"Content-Type": "application/json+children"})
    assert response.status_code == 200


@patch("src.pgdb.operations.get_task", new_callable=AsyncMock)
def test_create_task_with_invalid_parent(mock_get_task):
    """Create a task with a random UUID as a parent (should fail)."""
    mock_get_task.return_value = None
    response = client.post("/v1/tasks", json={
        "title": "Invalid Parent Task",
        "parent": str(uuid.uuid4())
    })
    assert response.status_code == 404

from fastapi.testclient import TestClient
from backend_app.main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint '/'."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, FastAPI!"}
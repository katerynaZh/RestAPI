# RestAPI

Service for experiments with REST API written in Python (backend_app)

## Requirements installation

```bash
pip install -r backend_app/requirements.txt
```

## Running the application from source

Debug mode:

```bash
cd backend_app
uvicorn src.main:app --reload

```

Runnning as a service (not waiting in the console):

```bash
cd backend_app
uvicorn src.main:app &
```

## Tests execution

```bash
pytest -v
```

## Running the application from dockerfile

```bash
cd backend_app
docker build -t backend_app .
docker run -p 8000:80  backend_app
```

```bash
cd frontend_app
docker build -t frontend_app .docker run -p 3000:5173  frontend_app
```

# RestAPI
Service for experiments with REST API written in Python

## Requirements installation
```bash
pip install -r requirements.txt
```

## Running the application
Debug mode:
```bash
uvicorn backend_app.main:app --reload
```

Runnning as a service (not waiting in the console):
```bash
uvicorn backend_app.main:app &
```

## Tests execution
```bash
pytest -v
```

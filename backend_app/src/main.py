"""
main.py
This module initializes and configures the FastAPI application for the Tasks Management API.
It includes:
- Database connection management using an asynchronous context manager.
- Middleware setup for handling Cross-Origin Resource Sharing (CORS).
- Routing configuration for API endpoints.
- A root endpoint for basic service information.

Endpoints:
- `/`: A root endpoint that returns a welcome message.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.pgdb.operations import db
from src.routers.v1 import tasks as v1_tasks

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await db.connect()
        yield
    finally:
        await db.close()


app = FastAPI(
    lifespan=lifespan,
    description="Tasks management API APP",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to ["http://localhost:5173"] for better security
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# In case of migration to newer API version it should be updated here
app.include_router(v1_tasks.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to RestApi service!"}

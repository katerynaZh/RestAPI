from fastapi import FastAPI
from backend_app.routers import tasks
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to ["http://localhost:5173"] for better security
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


app.include_router(tasks.router)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

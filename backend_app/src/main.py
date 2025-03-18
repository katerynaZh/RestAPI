from fastapi import FastAPI
from src.routers import tasks
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to ["http://localhost:5173"] for better security
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# In case of migration to newer API version it should be updated here
app.include_router(tasks.v1_router)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

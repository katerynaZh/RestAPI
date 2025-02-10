from backend_app.database import Base, engine
from backend_app.models import TaskDB

Base.metadata.create_all(bind=engine)

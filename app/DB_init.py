from app.database import Base, engine
from app.models import TaskDB

Base.metadata.create_all(bind=engine)

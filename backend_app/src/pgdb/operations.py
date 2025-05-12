"""
This module define Postgres Database operations for the application.
It contains functions to create, read, update, and delete (CRUD) records in the database.
"""


# **Best Practices**:
#    - Always ensure that a `commit()` is called after a successful transaction to persist changes.
#    - Use `await conn.rollback()` in case of an error to undo any changes made during the transaction.
#    - Wrap database operations in a `try-except` block to handle exceptions gracefully.

from os import getenv
from uuid import UUID

from psycopg_pool import AsyncConnectionPool
from psycopg import DatabaseError
from src.models import Task


class PostgresDB:
    """
    This class defines the Postgres Database operations for the application.
    It contains functions to create, read, update, and delete (CRUD) records in the database.
    """

    def __init__(
            self,
            db_host: str = "localhost",
            db_port: int = 5432,
            db_name: str = "postgres",
            db_user: str = "postgres",
            db_password: str = "password",
        ):
        self._tasks_tb_name = "tasks"

        self._dbhost = db_host
        self._dbport = db_port
        self._dbname = db_name
        self._dbuser = db_user
        self._dbpassword = db_password

        self._dbconstr = f"host={self._dbhost} port={self._dbport} dbname={self._dbname} user={self._dbuser} password={self._dbpassword}"
        self._conn_pool = None

    @property
    def tasks_tb_name(self) -> str:
        """Returns the name of the tasks table."""
        return self._tasks_tb_name

    @property
    def async_pool(self) -> AsyncConnectionPool | None:
        """Returns the connection pool for async operations."""
        return self._conn_pool

    async def connect(self) -> None:
        """
        Connect to the database using the connection pool.
        """
        try:
            self._conn_pool = AsyncConnectionPool(
                conninfo=self._dbconstr,
                min_size=1,  # Minimum number of connections in the pool
                max_size=10,  # Maximum number of connections in the pool
                open=False,
            )
            await self._conn_pool.open()
        except Exception as e:
            raise DatabaseError("Could not connect to Postgres") from e
        await self.create_tables()

    async def close(self) -> None:
        """Closes the connection pool."""
        if self._conn_pool:
            await self._conn_pool.close()

    async def create_tables(self) -> None:
        """
        Create the tasks table if it does not exist.
        """
        async with self.async_pool.connection() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute(
                    f"""
                    CREATE TABLE IF NOT EXISTS {self.tasks_tb_name} (
                        id UUID PRIMARY KEY,
                        title VARCHAR(100) NOT NULL,
                        description VARCHAR(300),
                        status VARCHAR(50) NOT NULL DEFAULT 'pending',
                        parent UUID
                    );
                    """
                )

db = PostgresDB(
    db_host=getenv("POSTGRES_HOST", "localhost"),
    db_port=getenv("POSTGRES_PORT", "5432"),
    db_name=getenv("POSTGRES_DB", "tasks_db"),
    db_user=getenv("POSTGRES_USER", "pguser"),
    db_password=getenv("POSTGRES_PASSWORD", "password"),
)


async def create_task(
    task: Task,
) -> dict:
    """
    Create a new task in the database.
    """
    async with db.async_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                f"""
                INSERT INTO {db.tasks_tb_name} (id, title, description, status, parent)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (task.id, task.title, task.description, task.status, task.parent),
            )
            result = await cursor.fetchone()
            if result:
                return task
            else:
                raise DatabaseError("Failed to create task")


async def get_task(
    task_id: UUID,
) -> Task | None:
    """
    Get a task by its ID from the database.
    """
    async with db.async_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                f"""
                SELECT 
                    id, title, description, status, parent
                FROM {db.tasks_tb_name} WHERE id = %s
                """,
                (task_id,),
            )
            result = await cursor.fetchone()
            if result:
                return Task(
                    id=result[0],
                    title=result[1],
                    description=result[2],
                    status=result[3],
                    parent=result[4],
                )
            else:
                return None


async def get_all_tasks() -> list[Task]:
    """
    Get all tasks from the database.
    """
    async with db.async_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                f"""
                SELECT 
                    id, title, description, status, parent
                FROM {db.tasks_tb_name}
                """
            )
            result = await cursor.fetchall()
            if not result:
                return []
            else:
                return [
                    Task(
                        id=row[0],
                        title=row[1],
                        description=row[2],
                        status=row[3],
                        parent=row[4],
                    )
                    for row in result
                ]


async def update_task(
    task: Task,
) -> Task | None:
    """
    Update a task in the database.
    """
    async with db.async_pool.connection() as conn:
        async with conn.cursor() as cursor:
            # Check if task exists
            existing_task = await get_task(task.id)
            if not existing_task:
                raise DatabaseError(f"Task with id '{task.id}' not found")

            # Update task if it exists
            await cursor.execute(
                f"""
                UPDATE {db.tasks_tb_name}
                SET title = %s, description = %s, status = %s, parent = %s
                WHERE id = %s
                RETURNING id
                """,
                (task.title, task.description, task.status, task.parent, task.id),
            )
            result = await cursor.fetchone()
            if result:
                return task
            else:
                return None


async def delete_task(
    task_id: UUID,
) -> bool:
    """
    Delete a task from the database.
    """
    async with db.async_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                f"""
                DELETE FROM {db.tasks_tb_name} WHERE id = %s
                """,
                (task_id,),
            )
            if cursor.rowcount > 0:
                return True
            else:
                return False

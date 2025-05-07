'''
This module contains unit tests for the operations performed on tasks in a PostgreSQL database.
The tests use the `pytest` framework and mock the database interactions using `unittest.mock.AsyncMock`.
'''
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from uuid import uuid4
from psycopg import DatabaseError
from src.pgdb.operations import PostgresDB, create_task, get_task, get_all_tasks, update_task, delete_task
from src.models import Task


@pytest.fixture
def mock_db():
    db = PostgresDB()
    mock_pool = MagicMock()
    # Patch internal attribute directly (bypass property)
    object.__setattr__(db, "_async_pool", mock_pool)

    # Patch connect() to skip real init
    with patch.object(db, "connect", new_callable=AsyncMock), patch.object(db, "close", new_callable=AsyncMock):
        yield db

@pytest.fixture
def sample_task():
    return Task(
        id=uuid4(),
        title="Sample Task",
        description="This is a sample task",
        status="pending",
        parent=None,
    )


@pytest.mark.asyncio
async def test_create_task(mock_db, sample_task):
    """
    Test that a task can be successfully created in the database.
    """
    with patch("src.pgdb.operations.db", mock_db):
        mock_db.async_pool.connection().__aenter__().cursor().__aenter__().fetchone.return_value = (sample_task.id,)
        result = await create_task(sample_task)
        assert result == sample_task


@pytest.mark.asyncio
async def test_get_task(mock_db, sample_task):
    """
    Test that a task can be retrieved from the database by its ID.
    """
    with patch("src.pgdb.operations.db", mock_db):
        mock_db.async_pool.connection().__aenter__().cursor().__aenter__().fetchone.return_value = (
            sample_task.id,
            sample_task.title,
            sample_task.description,
            sample_task.status,
            sample_task.parent,
        )
        result = await get_task(sample_task.id)
        assert result == sample_task


@pytest.mark.asyncio
async def test_get_task_not_found(mock_db):
    """
    Test that None is returned when a task with the given ID does not exist.
    """
    with patch("src.pgdb.operations.db", mock_db):
        mock_db.async_pool.connection().__aenter__().cursor().__aenter__().fetchone.return_value = None
        result = await get_task(uuid4())
        assert result is None


@pytest.mark.asyncio
async def test_get_all_tasks(mock_db, sample_task):
    """
    Test that all tasks can be retrieved from the database.
    """
    with patch("src.pgdb.operations.db", mock_db):
        mock_db.async_pool.connection().__aenter__().cursor().__aenter__().fetchall.return_value = [
            (sample_task.id, sample_task.title, sample_task.description, sample_task.status, sample_task.parent)
        ]
        result = await get_all_tasks()
        assert len(result) == 1
        assert result[0] == sample_task


@pytest.mark.asyncio
async def test_update_task(mock_db, sample_task):
    """
    Test that an existing task can be updated in the database.
    """
    with patch("src.pgdb.operations.db", mock_db):
        mock_db.async_pool.connection().__aenter__().cursor().__aenter__().fetchone.side_effect = [
            (sample_task.id, sample_task.title, sample_task.description, sample_task.status, sample_task.parent),
            (sample_task.id,),
        ]
        result = await update_task(sample_task)
        assert result == sample_task


@pytest.mark.asyncio
async def test_update_task_not_found(mock_db, sample_task):
    """
    Test that updating a non-existent task raises a DatabaseError.
    """
    with patch("src.pgdb.operations.db", mock_db):
        mock_db.async_pool.connection().__aenter__().cursor().__aenter__().fetchone.return_value = None
        with pytest.raises(DatabaseError, match=f"Task with id '{sample_task.id}' not found"):
            await update_task(sample_task)


@pytest.mark.asyncio
async def test_delete_task(mock_db, sample_task):
    """
    Test that a task can be successfully deleted from the database.
    """
    with patch("src.pgdb.operations.db", mock_db):
        mock_db.async_pool.connection().__aenter__().cursor().__aenter__().rowcount = 1
        result = await delete_task(sample_task.id)
        assert result is True


@pytest.mark.asyncio
async def test_delete_task_not_found(mock_db):
    """
    Test that deleting a non-existent task returns False.
    """
    with patch("src.pgdb.operations.db", mock_db):
        mock_db.async_pool.connection().__aenter__().cursor().__aenter__().rowcount = 0
        result = await delete_task(uuid4())
        assert result is False
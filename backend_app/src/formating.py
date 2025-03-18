"""
    Module for formatting inputs and outputs
"""

from typing import List, Dict, Optional
from src.models import Task

class JsonChildren():
    """
    Input:
        [
            {"id": 1, "parent": null, "title": "Task 1"},
            {"id": 2, "parent": 1, "title": "Task 2"},
            {"id": 3, "parent": 1, "title": "Task 3"},
            {"id": 4, "parent": 3, "title": "Task 4"}
        ]
    Output:
        [
            {"id": 1, "parent": null, "title": "Task 1", "children": [2,3]},
            {"id": 2, "parent": 1, "title": "Task 2", "children": []},
            {"id": 3, "parent": 1, "title": "Task 3", "children": [4]},
            {"id": 4, "parent": 3, "title": "Task 4", "children": []}
        ]
    """
    def __init__(self):
        self.cached_data = None
        self.last_cache_update = None  # Track last state

    def transform(self, tasks: List[Task]) -> List[Dict]:
        """Transforms task list into `json+children` format."""
        # Return cached data if tasks haven't changed
        if self.last_cache_update == tasks:
            return self.cached_data
        task_map = {task.id: task.model_dump() for task in tasks}

        # Initialize children field
        for task in task_map.values():
            task["children"] = []

        # Populate children lists
        for task in tasks:
            if task.parent and task.parent in task_map:
                task_map[task.parent]["children"].append(task.id)

        self.cached_data = list(task_map.values())  # Update cache
        self.last_cache_update = list(tasks)  # Track state

        return self.cached_data

class JsonTree():
    """
    Input:
        [
            {"id": 1, "parent": null, "title": "Task 1"},
            {"id": 2, "parent": 1, "title": "Task 2"},
            {"id": 3, "parent": 1, "title": "Task 3"},
            {"id": 4, "parent": 3, "title": "Task 4"}
        ]

    Output:
        [
            {
                "id": 1,
                "parent": null,
                "title": "Task 1",
                "children": [
                    {"id": 2, "parent": 1, "title": "Task 2", "children": []},
                    {
                        "id": 3,
                        "parent": 1,
                        "title": "Task 3",
                        "children": [
                            {"id": 4, "parent": 3, "title": "Task 4", "children": []}
                        ]
                    }
                ]
            }
        ]
    """
    def __init__(self):
        self.cached_data = None
        self.last_cache_update = None  # Track last state

    def transform(self, tasks: List[Task]) -> List[Dict]:
        """Transforms task list into `json+tree` format."""
        # Return cached data if tasks haven't changed
        if self.last_cache_update == tasks:
            return self.cached_data

        task_map = {task.id: task.model_dump() for task in tasks}

        # Initialize children field
        for task in task_map.values():
            task["children"] = []

        # Populate children lists
        root_tasks = []
        for task in tasks:
            if task.parent and task.parent in task_map:
                task_map[task.parent]["children"].append(task_map[task.id])
            else:
                root_tasks.append(task_map[task.id])  # Top-level tasks

        self.cached_data = root_tasks  # Update cache
        self.last_cache_update = list(tasks)  # Track state

        return self.cached_data

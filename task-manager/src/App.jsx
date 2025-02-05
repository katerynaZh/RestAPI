import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    axios.get("http://localhost:8000/tasks")
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // Handle adding or updating a task
  const saveTask = () => {
    if (!taskTitle.trim()) return;

    const newTask = {
      id: editingTask ? editingTask.id : tasks.length + 1, // Use existing ID for updates
      title: taskTitle,
      description: taskDescription,
      status: "pending", // Default status
    };

    axios.post("http://localhost:8000/tasks", newTask)
      .then(response => {
        const updatedTasks = tasks.some(task => task.id === newTask.id)
          ? tasks.map(task => (task.id === newTask.id ? response.data : task)) // Update task
          : [...tasks, response.data]; // Add new task

        setTasks(updatedTasks);
        resetForm();
      })
      .catch(error => console.error("Error saving task:", error));
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
  };

  // Reset form fields
  const resetForm = () => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Task List</h2>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.description} ({task.status})
            <button onClick={() => startEditing(task)}>Edit</button>
          </li>
        ))}
      </ul>

      <h3>{editingTask ? "Edit Task" : "Add Task"}</h3>
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Task title..."
      />
      <br />
      <input
        type="text"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Task description..."
      />
      <br />
      <button onClick={saveTask}>{editingTask ? "Update Task" : "Add Task"}</button>
      {editingTask && <button onClick={resetForm}>Cancel</button>}
    </div>
  );
}

export default App;

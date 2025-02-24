import { useState, useEffect } from "react";
import axios from "axios";

export type CustomTask ={
    id: number,
    title: string,
    description: string,
    status: string,
}

const useTasks = () => {
  const [tasks, setTasks] = useState<CustomTask[]>([] as CustomTask[]);

    // Fetch tasks from backend
  useEffect(() => {
    if (tasks.length === 0) {
    axios.get("http://localhost:8000/tasks")
      .then(response => { setTasks(response.data); console.log("render");})
      .catch(error => console.error("Error fetching tasks:", error));
    }
  }, [tasks]);

  // Handle adding or updating a task
  const addOrUpdateTask = (newTask: CustomTask) => {
    return axios.post("http://localhost:8000/tasks", newTask)
      .then(response => {
        const updatedTasks = tasks.some(task => task.id === newTask.id)
          ? tasks.map(task => (task.id === newTask.id ? response.data : task)) // Update task
          : [...tasks, response.data]; // Add new task

        setTasks(updatedTasks);
        // onSave();
        return response.data;
      })
      .catch(error => {
        console.error("Error saving task:", error);
        // onError();
      });
  };

  return { tasks, addOrUpdateTask };
};

export default useTasks;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { notification, Button } from 'antd';

export type CustomTask = {
  id: number;
  title: string;
  description: string;
  status: string;
};

const useTasks = () => {
  const [tasks, setTasks] = useState<CustomTask[]>([] as CustomTask[]);

  // Fetch tasks from backend
  useEffect(() => {
    axios
      .get('http://localhost:8000/tasks')
      .then((response) => {
        setTasks(response.data);
        console.log('render');
      })
      .catch((error) => {
        notification.error({
          message: 'Error fetching tasks',
          description: `Tasks loading failed with error: ${error.message}`,
          duration: 3, // Auto-dismiss in 3 seconds
        });
      });
  }, []);

  // Handle adding or updating a task
  const addOrUpdateTask = (newTask: CustomTask) => {
    return axios
      .post('http://localhost:8000/tasks', newTask)
      .then((response) => {
        const updatedTasks = tasks.some((task) => task.id === newTask.id)
          ? tasks.map((task) => (task.id === newTask.id ? response.data : task)) // Update task
          : [...tasks, response.data]; // Add new task

        setTasks(updatedTasks);
        return response.data;
      })
      .catch((error) => {
        notification.error({
          message: 'Error saving task',
          description: `Saving task failed with error: ${error.message}`,
          duration: 3, // Auto-dismiss in 3 seconds
        });
      });
  };
  const deleteTask = (taskId: number) => {
    return axios
      .delete('http://localhost:8000/tasks?task_id=' + taskId)
      .then((response) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        return response.data;
      })
      .catch((error) => {
        notification.error({
          message: 'Error saving task',
          description: `Saving task failed with error: ${error.message}`,
          duration: 3, // Auto-dismiss in 3 seconds
        });
      });
  };
  return { tasks, addOrUpdateTask, deleteTask };
};

export default useTasks;

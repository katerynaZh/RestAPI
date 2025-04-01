import { useState, useEffect } from 'react';
import axios from 'axios';
import { notification } from 'antd';
import { CustomTask, CustomBaseTask } from '../types';


const useTasks = () => {
  const [tasks, setTasks] = useState<CustomTask[]>([] as CustomTask[]);

  // Fetch tasks from backend
  useEffect(() => {
    axios
      .get('http://localhost:8000/v1/tasks')
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
 const addTask = (newTask: CustomBaseTask) => {
  return axios
    .post('http://localhost:8000/v1/tasks', newTask)
    .then((response) => {
      setTasks([...tasks, response.data]); // Add new task to state
      return response.data;
    })
    .catch((error) => {
      notification.error({
        message: 'Error adding task',
        description: `Adding task failed with error: ${error.message}`,
        duration: 3,
      });
    });
};

const updateTask = (updatedTask: CustomTask) => {
  return axios
    .patch(`http://localhost:8000/v1/tasks`, updatedTask)
    .then((response) => {
      setTasks(tasks.map((task) => (task.id === updatedTask.id ? response.data : task))); // Update task in state
      return response.data;
    })
    .catch((error) => {
      notification.error({
        message: 'Error updating task',
        description: `Updating task failed with error: ${error.message}`,
        duration: 3,
      });
    });
};

  const deleteTask = (taskId: string) => {
    return axios
      .delete('http://localhost:8000/v1/tasks?task_id=' + taskId)
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
  return { tasks, addTask, updateTask, deleteTask };
};

export default useTasks;

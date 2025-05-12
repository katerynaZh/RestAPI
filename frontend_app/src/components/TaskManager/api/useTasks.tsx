import { useState, useEffect } from 'react';
import axios from 'axios';
import { notification } from 'antd';
import { CustomTask, CustomBaseTask } from '../types';


const useTasks = () => {
  const [tasks, setTasks] = useState<CustomTask[]>([] as CustomTask[]);
  const [statuses, setStatuses] = useState<string[]>([]);

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
      return () => {
        console.log('Unmounting useTasks');
        setTasks([]); // Clear tasks when component unmounts
      }
  }, []);

  // Fetch task statuses from backend
    useEffect(() => {
      axios.get('http://localhost:8000/v1/tasks/statuses')
        .then((res) => {
          console.log('render statuses');
          setStatuses(res.data); // Make sure res.data is the array of statuses
        })
        .catch((error) => {
          console.error('Failed to load statuses:', error);
        });

      return () => {
        console.log('Unmounting statuses');
        setStatuses([]); // Clear statuses when component unmounts
      }
    }, []);
  
  // Handle adding or updating a task
 const addTask = (newTask: CustomBaseTask) => {
  axios
    .post('http://localhost:8000/v1/tasks', newTask)
    .then((response) => {
      setTasks([...tasks, response.data]); // Add new task to state
    })
    .catch((error) => {
      notification.error({
        message: 'Error adding task',
        description: `Adding task failed with error: ${error.message}`,
        duration: 3,
      });
    });
    return () => {
      setTasks([]); // Clear tasks when component unmounts
    }
};

const updateTask = (updatedTask: CustomTask) => {
  axios
    .patch(`http://localhost:8000/v1/tasks`, updatedTask)
    .then((response) => {
      setTasks(tasks.map((task) => (task.id === updatedTask.id ? response.data : task))); // Update task in state
    })
    .catch((error) => {
      notification.error({
        message: 'Error updating task',
        description: `Updating task failed with error: ${error.message}`,
        duration: 3,
      });
    });
    return () => {
      setTasks([]); // Clear tasks when component unmounts
    }
};

  const deleteTask = (taskId: string) => {
    axios
      .delete('http://localhost:8000/v1/tasks?task_id=' + taskId)
      .then((response) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        notification.error({
          message: 'Error deleting task',
          description: `Deleting task failed with error: ${error.message}`,
          duration: 3, // Auto-dismiss in 3 seconds
        });
      });
      return () => {
        setTasks([]); // Clear tasks when component unmounts
      }
  };
  return { tasks, statuses, addTask, updateTask, deleteTask };
};

export default useTasks;

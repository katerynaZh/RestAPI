import { useState, useEffect } from 'react';
import { CustomTask, CustomBaseTask } from '../types';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

// Mock data
const MOCK_TASKS: CustomTask[] = [
  {
    id: 'a5afa4d4-26df-43d4-9325-7571703b0f57',
    title: 'Cook dinner for the family',
    description: '',
    status: 'pending',
    parent: '',
  },
  {
    id: 'b5afa4d4-26df-43d4-9325-7571703b0f57',
    title: 'Buy Groceries',
    description:
      'Pick up milk, eggs, and fresh vegetables from the local market.',
    status: 'pending',
    parent: 'a5afa4d4-26df-43d4-9325-7571703b0f57',
  },
  {
    id: '74e993cd-0e1d-4c39-ba7d-cfd54b0a7b02',
    title: 'Prepare Presentation',
    description:
      'Draft slides and review key points for the upcoming client meeting.',
    status: 'completed',
    parent: '',
  },
  {
    id: '82204d4e-e9e9-45fb-9f02-d7cf3f71c2ce',
    title: 'Milk and eggs',
    description: '1 liter of milk and eggs',
    status: 'completed',
    parent: 'a5afa4d4-26df-43d4-9325-7571703b0f57',
  },
  {
    id: '3494f4e4-4b93-4c60-a8c6-bd1a16ea4d73',
    title: 'Fresh vegetables from the local market',
    description: 'Onions, tomatoes, and bell peppers',
    status: 'completed',
    parent: 'a5afa4d4-26df-43d4-9325-7571703b0f57',
  },
  {
    id: '6446dfc5-ba14-41dd-8974-654b3cfff231',
    title: 'Review key points for the upcoming client meeting.',
    description: 'theme: building a new website',
    status: 'completed',
    parent: 'b5afa4d4-26df-43d4-9325-7571703b0f57',
  },
  {
    id: 'f177511a-6fce-4600-93d6-77d7e786b6e3',
    title: 'Create draft slides',
    description: 'Create draft slides for the upcoming client meeting.',
    status: 'completed',
    parent: 'b5afa4d4-26df-43d4-9325-7571703b0f57',
  },
  {
    id: '610ba640-8473-4337-947c-ff41ed95af29',
    title: 'Make test slides demo to the team',
    description:
      'Make test slides demo to the team before meeting, to make sure everything is working fine',
    status: 'completed',
    parent: 'b5afa4d4-26df-43d4-9325-7571703b0f57',
  },
  {
    id: '78b56e79-fffe-4408-a498-85f63712c9d6',
    title: 'Find recipe for dinner',
    description: 'YouTube video',
    status: 'completed',
    parent: 'a5afa4d4-26df-43d4-9325-7571703b0f57',
  },
  {
    id: 'af87632e-ecaa-4f06-831a-2988736f2256',
    title: 'Make dinner',
    description: 'Use bought groceries to make dinner',
    status: 'completed',
    parent: 'a5afa4d4-26df-43d4-9325-7571703b0f57',
  },
];

const useTasks = () => {
  const [tasks, setTasks] = useState<CustomTask[]>([]);

  // Simulate fetching tasks from backend
  useEffect(() => {
    setTimeout(() => {
      setTasks(MOCK_TASKS);
      console.log('Mock data loaded');
    }, 500); // Simulating network delay
  }, []);

  const addTask = (newTask: CustomBaseTask) => {
    return new Promise<CustomTask>((resolve) => {
      setTimeout(() => {
        const newTaskWithId = { ...newTask, status: 'pending', id: uuidv4() }; // Generate a UUID

        setTasks((prevTasks) => [...prevTasks, newTaskWithId]); // Add new task

        resolve(newTaskWithId); // Resolve with new task including UUID
      }, 300); // Simulating API delay
    });
  };

  const updateTask = (updatedTask: CustomTask) => {
    return new Promise<CustomTask>((resolve) => {
      setTimeout(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );

        resolve(updatedTask); // Resolve with updated task
      }, 300); // Simulating API delay
    });
  };

  const deleteTask = (taskId: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTasks((prevTasks) => {
          return prevTasks.filter((task) => task.id !== taskId) || [];
        });
      }, 300); // Simulating API call delay
    });
  };

  return { tasks, addTask, updateTask, deleteTask };
};

export default useTasks;

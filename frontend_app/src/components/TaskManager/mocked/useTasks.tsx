import { useState, useEffect } from "react";
import {CustomTask} from "../types";

// Mock data
const MOCK_TASKS: CustomTask[] = [
    {
      id: 1,
      title: 'Cook dinner for the family',
      description: '',
      status: 'pending',
    },
    {
      id: 1,
      title: 'Buy Groceries',
      description:
        'Pick up milk, eggs, and fresh vegetables from the local market.',
      status: 'pending',
      parentId: 1,
    },
    {
      id: 2,
      title: 'Prepare Presentation',
      description:
        'Draft slides and review key points for the upcoming client meeting.',
      status: 'completed',      
    },
    {
      id: 3,
      title: 'Milk and eggs',
      description:
        '1 liter of milk and eggs',
      status: 'completed',
      parentId: 1,
    },
    {
      id: 4,
      title: 'Fresh vegetables from the local market',
      description:
        'Onions, tomatoes, and bell peppers',
      status: 'completed',
      parentId: 1,
    },
    {
      id: 5,
      title: 'Review key points for the upcoming client meeting.',
      description:
        'theme: building a new website',
      status: 'completed',
      parentId: 2,
    },
    {
      id: 6,
      title: 'Create draft slides',
      description:
        'Create draft slides for the upcoming client meeting.',
      status: 'completed',
      parentId: 2,
    },
    {
      id: 7,
      title: 'Make test slides demo to the team',
      description:
        'Make test slides demo to the team before meeting, to make sure everything is working fine',
      status: 'completed',
      parentId: 2,
    },
    {
      id: 8,
      title: 'Find receipe for dinner',
      description:
        'YouTube video',
      status: 'completed',
      parentId: 1,
    },
    {
      id: 9,
      title: 'Make dinner',
      description:
        'Use bought groceries to make dinner',
      status: 'completed',
      parentId: 1,
    },
  ];
  
const useTasks = () => {
  const [tasks, setTasks] = useState<CustomTask[]>([]);

  // Simulate fetching tasks from backend
  useEffect(() => {
    setTimeout(() => {
      setTasks(MOCK_TASKS);
      console.log("Mock data loaded");
    }, 500); // Simulating network delay
  }, []);

  // Mock function for adding/updating a task
  const addOrUpdateTask = (newTask: CustomTask) => {
    return new Promise<CustomTask>((resolve) => {
      setTimeout(() => {
        setTasks((prevTasks) => {
          const exists = prevTasks.some((task) => task.id === newTask.id);
          const updatedTasks = exists
            ? prevTasks.map((task) => (task.id === newTask.id ? newTask : task))
            : [...prevTasks, { ...newTask, id: prevTasks.length + 1 }];

          return updatedTasks;
        });

        resolve(newTask);
      }, 300); // Simulating API call delay
    });
  };

  const deleteTask = (taskId: number) => {
    return new Promise(() => {
      setTimeout(() => {
        setTasks((prevTasks) => {          
          return prevTasks.filter((task) => task.id !== taskId) || [];
        });
      }, 300); // Simulating API call delay
    });
  }

  return { tasks, addOrUpdateTask, deleteTask };
};

export default useTasks;

import { useState, useEffect } from "react";

export type CustomTask = {
  id: number;
  title: string;
  description: string;
  status: string;
};

// Mock data
// Mock data
const MOCK_TASKS: CustomTask[] = [
    {
      id: 1,
      title: 'Buy Groceries',
      description:
        'Pick up milk, eggs, and fresh vegetables from the local market.',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Prepare Presentation',
      description:
        'Draft slides and review key points for the upcoming client meeting.',
      status: 'completed',
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

  return { tasks, addOrUpdateTask };
};

export default useTasks;

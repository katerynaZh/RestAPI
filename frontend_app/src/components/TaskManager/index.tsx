// React library and necessary hooks
import React, { useState } from 'react';


// Importing UI components from Ant Design library
import { Button, Layout, notification } from 'antd';

// Hook for fetching and updating tasks list
import useTasks from './api/useTasks'; // uncomment this line if you're using the real BE API
// uncomment the line below if you want to use mocked data (doesn't require a BE API)
// import useTasks from './mocked/useTasks';

// Task type definition (title, id, status, etc.)
import { CustomTask } from './types';

// Components for rendering the task list and the modal dialog
import TasksList from './TasksList';
import AddOrEditDialog from './AddOrEditDialog';

// Styled-components — library for styling React components
import styled from 'styled-components';

// Hook for using global confirmation dialog
import { useConfirmationDialog } from '../../contexts/ConfirmationDialogContext';

// Main component that manages the task list
const TaskManager = () => {
  const { tasks, statuses, addTask, updateTask, deleteTask} = useTasks();

  const [taskInEditId, setTaskInEditId] = useState<string | undefined>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { openConfirmation, closeConfirmation } = useConfirmationDialog();

  const onEditStart = (taskId: string) => {
    setTaskInEditId(taskId);
    setIsDialogOpen(true);
  };

  const onEditStop = () => {
    setTaskInEditId(undefined);
    setIsDialogOpen(false);
  };

  const onSave = (updatedTask: CustomTask) => {
    if (!updatedTask?.title.trim()) return;
    
    try {
      handleSaveTask(updatedTask); // Add new task
    }
    catch (error) {
      console.error('Error saving task:', error);
    }
    finally {
      onEditStop();
    }
  };

  // Check if an identical task already exists
  const taskInEdit = tasks?.find((task) => task.id === taskInEditId);
  
  // Handle duplicate task case
  
  
  const onDelete = (taskId: string) => {
    const delTitle = tasks?.find((task) => task.id === taskId)?.title;

    openConfirmation({
      title: 'Delete Task',
      confirmLabel: 'Delete',
      text: `Are you sure you want to delete ${delTitle} task?`,
      onConfirm: () => handleDeleteTask(taskId),
      onCancel: closeConfirmation,
    });
  };

  const handleSaveTask = (newTask: CustomTask) => {
    const normalize = (str?: string) => (str ?? '').trim().toLowerCase();
    const isDuplicate = tasks.some((task) =>
      normalize(task.title) === normalize(newTask.title) &&
      normalize(task.description) === normalize(newTask.description) &&
      (task.status === newTask.status || newTask.status === undefined)
    );
    if (isDuplicate) {
      notification.warning({
        message: 'Duplicate task',
        description: 'This task already exists and was not added.',
        duration: 5,
      });
      return;
    }

    if (newTask.id) {
      updateTask(newTask); // Edit existing task
    } else {
      addTask(newTask); // Add new task
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    closeConfirmation();
  };

  return (
    <StyledLayout>
      <StyledContent>
        <h1 data-testid="taskmanager-title">Task Manager</h1>
        
        <TasksList tasks={tasks} onEdit={onEditStart} onDelete={onDelete}  />

        <StyledButton type="primary" data-testid="addTaskBtn" onClick={() => setIsDialogOpen(true)}>
          Add Task
        </StyledButton>

        <AddOrEditDialog
          key={taskInEdit?.id} // when pass key, the dialog will be treated as a new one, so no need to reset fields inside dialog
          open={isDialogOpen}
          task={taskInEdit}
          statuses={taskInEdit && statuses?.length ? statuses : undefined}
          onSave={onSave}
          onCancel={onEditStop}
        />
      </StyledContent>
    </StyledLayout>
  );
};

//
// STYLED COMPONENTS (styled-components)
//

// Main container
const StyledLayout = styled(Layout)`
  min-height: 100vh;
  padding: 20px;
  background: #fff;
`;

// Centered content container
const StyledContent = styled(Layout.Content)`
  max-width: 800px;
  width: 100%;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// "Add Task" button
const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
`;

export default TaskManager;

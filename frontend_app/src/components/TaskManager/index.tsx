// React library and necessary hooks
import React, { useEffect, useState } from 'react';

// Importing UI components from Ant Design library
import { Button, Layout } from 'antd';

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
  // Getting the task list and methods for adding/updating/deleting tasks
  const { tasks, addOrUpdateTask, deleteTask } = useTasks();

  // ID of the task being edited (undefined means we're creating a new one)
  const [taskInEditId, setTaskInEditId] = useState<number | undefined>();

  // Whether the Add/Edit dialog is open
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Getting the open/close functions for the confirmation dialog
  const { openConfirmation, closeConfirmation } = useConfirmationDialog();

  // When the task list changes — reset the form (close the modal)
  useEffect(() => {
    if (tasks.length === 0) return;

    resetForm();
  }, [tasks]);

  // Start editing a task (open the dialog)
  const startEditing = (taskId: number) => {
    setTaskInEditId(taskId);
    setIsDialogOpen(true);
  };

  // Reset the form — close the dialog and clear taskInEditId
  const resetForm = () => {
    setTaskInEditId(undefined);
    setIsDialogOpen(false);
  };

  // Save a new or updated task
  const onSave = (updatedTask: CustomTask) => {
    // Do nothing if the title is empty
    if (!updatedTask?.title.trim()) return;

    // Create a new task (or update the existing one)
    const newTask = {
      ...updatedTask,
      id: updatedTask.id ?? tasks.length + 1, // if no id — generate a new one
      status: 'pending', // default status
    };

    // Add or update the task, then reset the form
    addOrUpdateTask(newTask).then(resetForm);
  };

  // Handle delete button click
  const onDelete = (taskId: number) => {
    const delTitle = tasks?.find((task) => task.id === taskId)?.title;

    // Open confirmation dialog before deleting
    openConfirmation({
      title: 'Delete Task',
      confirmLabel: 'Delete',
      text: `Are you sure you want to delete ${delTitle} task?`,
      onConfirm: () => handleDeleteTask(taskId), // Delete after confirmation
      onCancel: closeConfirmation, // If canceled — just close the dialog
    });
  };

  // Delete task and close confirmation
  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId);
    closeConfirmation();
  };

  // The task currently being edited (passed to the dialog)
  const taskInEdit = tasks?.find((task) => task.id === taskInEditId);

  // Render the UI
  return (
    <StyledLayout>
      <StyledContent>
        {/* Task list with edit and delete options */}
        <TasksList tasks={tasks} onEdit={startEditing} onDelete={onDelete} />

        {/* "Add Task" button */}
        <StyledButton type="primary" onClick={() => setIsDialogOpen(true)}>
          Add Task
        </StyledButton>

        {/* Modal dialog for adding or editing a task */}
        <AddOrEditDialog
          open={isDialogOpen}
          task={taskInEdit}
          onSave={onSave}
          onCancel={resetForm}
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

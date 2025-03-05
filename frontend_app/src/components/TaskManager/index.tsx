import React, { useEffect, useState } from 'react';
import { Button, Layout } from 'antd';
import useTasks, { CustomTask } from './useTasks';
import TasksList from './TasksList';
import AddOrEditDialog from './AddOrEditDialog';
import styled from 'styled-components';

const TaskManager = () => {
  const { tasks, addOrUpdateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<CustomTask | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (tasks.length === 0) return;

    resetForm();
  }, [tasks]);

  const startEditing = (task: CustomTask) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTask(undefined);
    setIsDialogOpen(false);
  };

  const onSave = (updatedTask: CustomTask) => {
    if (!updatedTask?.title.trim()) return;

    const newTask = {
      ...updatedTask,
      id: updatedTask.id ?? tasks.length + 1,
      status: 'pending',
    };

    addOrUpdateTask(newTask).then(resetForm);
  };

  const onDelete = (taskId: number) => {
    deleteTask(taskId);
  };


  return (
    <StyledLayout>
      <StyledContent>
        <TasksList tasks={tasks} onEdit={startEditing} onDelete={onDelete} />
        <StyledButton type="primary" onClick={() => setIsDialogOpen(true)}>
          Add Task
        </StyledButton>
        <AddOrEditDialog
          open={isDialogOpen}
          task={editingTask}
          onSave={onSave}
          onCancel={resetForm}
        />
      </StyledContent>
    </StyledLayout>
  );
};

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
  padding: 20px;
  background: #fff;
`;

const StyledContent = styled(Layout.Content)`
  max-width: 800px;
  width: 100%;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
`;

export default TaskManager;
